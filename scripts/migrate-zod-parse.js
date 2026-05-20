#!/usr/bin/env node
// Script de migração: converte safeParse + parseZodError → parse() nativo
// O ZodError é capturado pelo errorHandler com status 422.
//
// Uso:
//   node scripts/migrate-zod-parse.js            # aplica as mudanças
//   node scripts/migrate-zod-parse.js --dry-run  # mostra o que mudaria sem alterar

const fs = require("fs");
const path = require("path");

const DRY_RUN = process.argv.includes("--dry-run");
const CONTROLLERS_DIR = path.join(__dirname, "../src/controllers");

function findTsFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findTsFiles(full));
    } else if (entry.isFile() && entry.name.endsWith(".ts") && !entry.name.includes(" ")) {
      results.push(full);
    }
  }
  return results;
}

// Tenta extrair informações de uma linha de safeParse com destructuring padrão
// Retorna null se não for esse padrão
function parseSafeParseDestructuring(line) {
  // Padrão: const { ...qualquer ordem de success/data/error... } = Schema.safeParse(src);
  const match = line.match(/^([ \t]*)const \{([^}]+)\} = (.+?)\.safeParse\((.+?)\);$/);
  if (!match) return null;

  const [, indent, destructured, schema, src] = match;

  // Deve conter success E (error ou success renomeado)
  if (!destructured.includes("success")) return null;

  // Detecta destructuring renomeado: { success: xSuccess, data: xData, error: xError }
  const aliasedMatch = destructured.match(
    /success:\s*(\w+),.*?data:\s*(\w+),.*?error:\s*(\w+)/
  ) || destructured.match(
    /data:\s*(\w+),.*?success:\s*(\w+),.*?error:\s*(\w+)/
  );

  if (aliasedMatch && destructured.includes(":")) {
    // Determina qual grupo é success, data, error
    const entries = destructured.split(",").map((e) => e.trim());
    let successVar, dataVar;
    for (const entry of entries) {
      const m = entry.match(/(\w+)\s*:\s*(\w+)/);
      if (!m) continue;
      if (m[1] === "success") successVar = m[2];
      if (m[1] === "data") dataVar = m[2];
    }
    if (successVar && dataVar) {
      return { indent, schema, src, dataVar, successVar, isAliased: true };
    }
  }

  // Padrão silencioso: const { data: query } — sem success → não converter
  if (!destructured.includes("success")) return null;
  // Padrão data: query (renomeia data mas sem success check) — sem error handling → skip
  if (destructured.includes("data:") && !destructured.includes("success")) return null;

  // Padrão padrão: success, data, error em qualquer ordem
  if (destructured.includes("error")) {
    return { indent, schema, src, dataVar: "data", successVar: "success", isAliased: false };
  }

  return null;
}

// Verifica se a próxima linha não-vazia é um error check sobre a var de success
function findErrorCheckEnd(lines, startIdx, successVar, indent) {
  // Procura a próxima linha não-vazia a partir de startIdx
  let i = startIdx;
  while (i < lines.length && lines[i].trim() === "") i++;

  if (i >= lines.length) return null;

  const line = lines[i];

  // Padrão throw: if (!successVar) throw [new] Error(parseZodError(errorVar));
  if (line.match(new RegExp(`^[ \\t]*if \\(!${successVar}(?:\\.success)?\\) throw (?:new )?Error\\(parseZodError\\(`))) {
    return { endIdx: i, lines: [i] };
  }

  // Padrão return res.status(400) inline: if (!successVar) { return ... }; }
  if (line.match(new RegExp(`^[ \\t]*if \\(!${successVar}(?:\\.success)?\\) \\{`))) {
    // Usa a indentação do próprio if para encontrar o } de fechamento
    const ifIndent = line.match(/^([ \t]*)/)[1];
    let j = i + 1;
    while (j < lines.length) {
      if (lines[j].match(new RegExp(`^${ifIndent}\\}\\s*$`))) {
        return { endIdx: j, lines: [i, ...Array.from({ length: j - i - 1 }, (_, k) => i + 1 + k), j] };
      }
      j++;
    }
  }

  // Padrão return res.status(400) inline (sem bloco): if (!successVar) return res...;
  if (line.match(new RegExp(`^[ \\t]*if \\(!${successVar}(?:\\.success)?\\) return res\\.status`))) {
    return { endIdx: i, lines: [i] };
  }

  return null;
}

function transformFile(filePath, content) {
  const lines = content.split("\n");
  let changed = false;

  // Índices de linhas a remover e substituições a fazer
  const removals = new Set(); // índices de linhas a remover
  const replacements = new Map(); // índice → novo conteúdo

  // Variáveis parsedX que precisam ter .data. removido
  const parsedVarsToFix = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // -----------------------------------------------------------------------
    // Padrão C: const parsedX / params / body / etc = Schema.safeParse(src);
    // -----------------------------------------------------------------------
    const parsedMatch = line.match(/^([ \t]*)const (\w+) = (.+?)\.safeParse\((.+?)\);$/);
    if (parsedMatch) {
      const [, indent, varName, schema, src] = parsedMatch;
      const errorCheck = findErrorCheckEnd(lines, i + 1, `${varName}`, indent);
      if (errorCheck && errorCheck.lines.some(idx => lines[idx].includes("parseZodError"))) {
        replacements.set(i, `${indent}const ${varName} = ${schema}.parse(${src});`);
        for (const idx of errorCheck.lines) removals.add(idx);
        // Remove linhas vazias entre safeParse e if
        for (let k = i + 1; k < errorCheck.lines[0]; k++) {
          if (lines[k].trim() === "") removals.add(k);
        }
        parsedVarsToFix.push(varName);
        changed = true;
        continue;
      }
    }

    // -----------------------------------------------------------------------
    // Padrão A/B/D: const { ... } = Schema.safeParse(src);
    // -----------------------------------------------------------------------
    const info = parseSafeParseDestructuring(line);
    if (!info) continue;

    // Verifica se é silent safeParse (sem success check subsequente)
    const nextMeaningfulIdx = (() => {
      let j = i + 1;
      while (j < lines.length && lines[j].trim() === "") j++;
      return j;
    })();

    const nextLine = lines[nextMeaningfulIdx] || "";
    const hasSuccessCheck =
      nextLine.includes(`!${info.successVar}`) ||
      nextLine.includes(`${info.successVar}.success`);

    if (!hasSuccessCheck) continue; // silent safeParse — não converter

    const errorCheck = findErrorCheckEnd(lines, i + 1, info.successVar, info.indent);
    if (!errorCheck) continue;

    // Verifica que o bloco de erro usa parseZodError
    const errorBlockLines = errorCheck.lines.map((idx) => lines[idx]).join("\n");
    if (!errorBlockLines.includes("parseZodError")) continue;

    // Substitui a linha de safeParse
    replacements.set(i, `${info.indent}const ${info.dataVar} = ${info.schema}.parse(${info.src});`);

    // Remove as linhas do bloco de erro e linhas em branco entre elas
    for (const idx of errorCheck.lines) removals.add(idx);
    for (let k = i + 1; k < errorCheck.lines[0]; k++) {
      if (lines[k].trim() === "") removals.add(k);
    }

    changed = true;
  }

  if (!changed) return { result: content, changed: false };

  // Aplica substituições e remoções
  let result = lines
    .map((line, i) => {
      if (removals.has(i)) return null;
      if (replacements.has(i)) return replacements.get(i);
      return line;
    })
    .filter((line) => line !== null)
    .join("\n");

  // Substitui parsedX.data. → parsedX. no corpo da função
  for (const varName of parsedVarsToFix) {
    result = result.replace(new RegExp(`\\b${varName}\\.data\\.`, "g"), `${varName}.`);
    result = result.replace(new RegExp(`\\b${varName}\\.data\\b`, "g"), varName);
  }

  // Remove import de parseZodError
  result = result.replace(/^import \{ parseZodError \} from ["'][^"']+["'];\n/gm, "");

  return { result, changed: true };
}

function main() {
  const files = findTsFiles(CONTROLLERS_DIR);
  let totalChanged = 0;
  const skipped = [];
  const manualReview = [];

  for (const filePath of files) {
    const original = fs.readFileSync(filePath, "utf8");

    if (!original.includes("safeParse") && !original.includes("parseZodError")) {
      continue;
    }

    const { result, changed } = transformFile(filePath, original);

    // Verifica se sobrou safeParse que não é silent (sem success check)
    if (changed || original.includes("safeParse")) {
      const checkContent = changed ? result : original;
      const remainingSafeParse = (checkContent.match(/\.safeParse\(/g) || []).length;
      // Silent safeParse: linhas com safeParse mas sem success na mesma linha ou próxima
      const silentCount = (checkContent.match(/const \{ data[^}]*\} = \w+\.safeParse/g) || []).length;
      if (remainingSafeParse > silentCount) {
        manualReview.push(filePath);
      }
    }

    if (!changed) {
      skipped.push(filePath);
      continue;
    }

    const relPath = path.relative(process.cwd(), filePath);

    if (DRY_RUN) {
      console.log(`\n=== ${relPath} ===`);
      const origLines = original.split("\n");
      const newLines = result.split("\n");
      let hasChanges = false;
      const maxLen = Math.max(origLines.length, newLines.length);
      for (let i = 0; i < maxLen; i++) {
        if (origLines[i] !== newLines[i]) {
          hasChanges = true;
          if (origLines[i] !== undefined) console.log(`- ${origLines[i]}`);
          if (newLines[i] !== undefined) console.log(`+ ${newLines[i]}`);
        }
      }
      if (!hasChanges) console.log("(sem mudanças visíveis)");
    } else {
      fs.writeFileSync(filePath, result, "utf8");
      console.log(`✓ ${relPath}`);
    }

    totalChanged++;
  }

  console.log(`\n--- Resumo ---`);
  console.log(`Arquivos modificados: ${totalChanged}`);
  console.log(`Arquivos sem alteração: ${skipped.length}`);

  if (manualReview.length > 0) {
    console.log(`\n⚠ Revisão manual necessária (safeParse residual):`);
    for (const f of manualReview) {
      console.log(`  ${path.relative(process.cwd(), f)}`);
    }
  }

  if (DRY_RUN) {
    console.log("\n(Modo DRY RUN — nenhum arquivo foi alterado)");
  }
}

main();
