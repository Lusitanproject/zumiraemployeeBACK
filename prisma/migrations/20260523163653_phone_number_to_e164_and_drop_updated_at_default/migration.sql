-- Passo 1: números nacionais brasileiros (sem código de país, sem +)
-- Cobre dígitos armazenados como: 10 (fixo), 11 (celular), 12 (formato não-padrão)
-- A condição `!~ '^55'` exclui quem já tem o código de país (55) embutido — tratado no Passo 2
UPDATE "users"
SET   phone_number = '+55' || phone_number  -- adiciona +55 (Brasil) na frente
WHERE phone_number IS NOT NULL              -- ignora usuários sem telefone cadastrado
  AND phone_number ~ '^\d+$'               -- garante que são só dígitos (sem +, espaço, traço)
  AND phone_number !~ '^55';               -- exclui números que já começam com código de país

-- Passo 2: números com código de país 55 mas sem o + (ex: "5511987654321")
-- São exatamente 12 dígitos (55 + área 2 + fixo 8) ou 13 dígitos (55 + área 2 + celular 9)
-- O Passo 1 não os tocou porque começam com "55"
UPDATE "users"
SET   phone_number = '+' || phone_number    -- só insere o + que faltava
WHERE phone_number IS NOT NULL              -- ignora usuários sem telefone cadastrado
  AND phone_number ~ '^55\d{10,11}$';      -- começa com 55 e tem 12 ou 13 dígitos no total

-- Passo 3: remover o DEFAULT now() da coluna updated_at em psychosocial_factors
-- @updatedAt do Prisma já cuida disso; o DEFAULT no banco era redundante
-- AlterTable
ALTER TABLE "psychosocial_factors" ALTER COLUMN "updated_at" DROP DEFAULT;
