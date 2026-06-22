import { ChapterType, Prisma, PsychosocialFactor } from "@prisma/client";

import { PublicError } from "../../error";
import { ChatbaseApi } from "../../external/chatbase";
import { CreateOpenAiBatchRequest, GenerateOpenAiResponseRequest, OpenAiApi } from "../../external/openai";
import prismaClient from "../../prisma";
import {
  CreateActChatbotRequest,
  ImportChatbaseChaptersRequest,
  TestMessageActChatbotRequest,
  UpdateActChatbotRequest,
  UpdateManyActChatbotsRequest,
} from "../../schemas/admin/act-chatbot";
import { buildFullMessages } from "../../utils/chat";
import { tryParsePhone } from "../../utils/phone";

class ActAdminService {
  private readonly actListSelect = {
    id: true,
    name: true,
    description: true,
    icon: true,
    createdAt: true,
  } satisfies Prisma.ActChatbotSelect;

  async findAll() {
    const bots = await prismaClient.actChatbot.findMany({
      where: { companyId: null },
      select: this.actListSelect,
    });

    return { items: bots };
  }

  async findById(id: string) {
    const bot = await prismaClient.actChatbot.findUnique({
      where: { id, companyId: null },
      select: {
        id: true,
        name: true,
        description: true,
        icon: true,
        initialMessage: true,
        messageInstructions: true,
        compilationInstructions: true,
        reportGenerationInstructions: true,
        reportLookupInstructions: true,
        createdAt: true,
      },
    });

    if (!bot) throw new PublicError("Act chatbot does not exist");

    return bot;
  }

  async findByTrail(trailId: string) {
    const rows = await prismaClient.trailActChatbot.findMany({
      where: { trailId },
      orderBy: { index: "asc" },
      select: {
        index: true,
        actChatbot: { select: this.actListSelect },
      },
    });

    return { items: rows.map((r) => ({ ...r.actChatbot, index: r.index })) };
  }

  async create(data: CreateActChatbotRequest) {
    const bot = await prismaClient.actChatbot.create({ data });
    return bot;
  }

  async update({ id, ...data }: UpdateActChatbotRequest) {
    const existing = await prismaClient.actChatbot.findUnique({
      where: { id, companyId: null },
      select: { id: true },
    });
    if (!existing) throw new PublicError("Act chatbot does not exist");
    const bot = await prismaClient.actChatbot.update({ where: { id }, data });
    return bot;
  }

  async updateMany({ chatbots }: UpdateManyActChatbotsRequest) {
    await Promise.all(
      chatbots.map((bot) =>
        prismaClient.actChatbot.update({
          where: { id: bot.id },
          data: { ...bot },
        }),
      ),
    );
  }

  async importChatbaseChapters({ id, chatbaseChatbotId }: ImportChatbaseChaptersRequest & { id: string }) {
    const actChatbot = await prismaClient.actChatbot.findFirst({ where: { id } });

    if (!actChatbot) {
      throw new PublicError("Act chatbot does not exist");
    }

    const chatbase = new ChatbaseApi();

    const conversations = await chatbase.getConversationsFromChatbot({
      chatbotId: chatbaseChatbotId,
      filteredSources: "WhatsApp",
    });

    console.log(`${conversations.length} conversas encontradas no chatbase`);
    for (const conv of conversations) {
      console.log(`${conv.form_submission?.name} (${conv.form_submission?.phone}) - ${conv.messages.length} mensagens`);
    }

    // Remove previously imported chapters/messages for these conversations and import again.
    const existingChapters = await prismaClient.actChapter.findMany({
      where: {
        actChatbotId: id,
        externalId: {
          in: conversations.map((c) => c.id),
        },
      },
      select: {
        id: true,
      },
    });

    const existingChapterIds = existingChapters.map((c) => c.id);
    if (existingChapterIds.length > 0) {
      await prismaClient.actChapterMessage.deleteMany({
        where: {
          actChapterId: {
            in: existingChapterIds,
          },
        },
      });

      await prismaClient.actChapter.deleteMany({
        where: {
          id: {
            in: existingChapterIds,
          },
        },
      });
    }

    function normalizePhone(p?: string | null): string {
      if (!p) return "";
      return (tryParsePhone(p) ?? tryParsePhone(`+${p.replace(/\D/g, "")}`))?.format("E.164") ?? "";
    }

    const conversationUsersPhoneNumbers = conversations
      .map((c) => normalizePhone(c.form_submission?.phone))
      .filter(Boolean) as string[];

    const storedUsers = await prismaClient.user.findMany({
      where: {
        phoneNumber: {
          in: conversationUsersPhoneNumbers,
        },
      },
    });

    // Map normalized phone number -> user id for quick lookup.
    const phoneToUserId = new Map(storedUsers.map((u) => [normalizePhone(u.phoneNumber), u.id]));

    const chaptersFromConversations = await prismaClient.actChapter.createManyAndReturn({
      data: conversations
        .map((conv) => {
          const phone = normalizePhone(conv.form_submission?.phone);
          const userId = phoneToUserId.get(phone);

          if (!userId) {
            return null;
          }

          return {
            actChatbotId: id,
            userId,
            type: ChapterType.CHATBASE,
            externalId: conv.id,
            createdAt: conv.created_at,
          };
        })
        .filter((v) => v !== null),
    });

    const createdMessages = await prismaClient.actChapterMessage.createMany({
      // Attach imported messages to their created chapter by external conversation id.
      data: chaptersFromConversations.flatMap((chapter) => {
        const conv = conversations.find((conv) => conv.id === chapter.externalId);

        if (!conv) {
          return [];
        }

        const messages = conv.messages.map((m) => ({
          actChapterId: chapter.id,
          content: m.content,
          role: m.role,
          createdAt: m.created_at,
        }));

        return messages;
      }),
    });

    const importedUserIds = new Set(chaptersFromConversations.map((chapter) => chapter.userId));
    const usersFound = storedUsers.filter((u) => importedUserIds.has(u.id));

    const conversationsWithoutUser = conversations
      .filter((conv) => {
        const phone = normalizePhone(conv.form_submission?.phone);
        return !phoneToUserId.has(phone);
      })
      .map((conv) => ({
        conversationId: conv.id,
        phone: normalizePhone(conv.form_submission?.phone) || null,
        name: conv.form_submission?.name || null,
      }));

    const usersFoundStructured = usersFound.map((u) => ({
      userId: u.id,
      name: u.name,
      phone: u.phoneNumber,
    }));

    return {
      chaptersCreated: chaptersFromConversations.length,
      messagesCreated: createdMessages.count,
      usersFound: usersFoundStructured,
      conversationsWithoutUser,
    };
  }

  async testMessage(actChatbotId: string, content: string, messages: TestMessageActChatbotRequest["messages"]) {
    const bot = await prismaClient.actChatbot.findUnique({
      where: { id: actChatbotId },
      select: { messageInstructions: true, initialMessage: true },
    });

    if (!bot) throw new PublicError("Act chatbot does not exist");

    const history = buildFullMessages(messages, content) as GenerateOpenAiResponseRequest["messages"];

    if (bot.initialMessage) history.unshift({ role: "assistant", content: bot.initialMessage });

    const openai = new OpenAiApi();
    const response = await openai.generateResponse({
      instructions: bot.messageInstructions,
      messages: history,
    });

    return response.output_text;
  }

  async generateAnalysis(companyId: string, actChatbotId: string) {
    console.log(`[act/generateAnalysis] iniciando para company=${companyId} act=${actChatbotId}`);

    // Reutilizamos sempre a mesma CompanyActAnalysis para acumular batches incrementais.
    // Nunca criamos uma análise nova do zero — o report agrega todos os batches da análise.
    const existingAnalysis = await prismaClient.companyActAnalysis.findFirst({
      orderBy: { createdAt: "desc" },
      where: { companyId, actChatbotId },
      include: { companyActAnalysisBatches: true },
    });

    console.log(
      `[act/generateAnalysis] análise existente: ${existingAnalysis?.id ?? "nenhuma"}, batches: ${JSON.stringify(existingAnalysis?.companyActAnalysisBatches.map((b) => ({ id: b.id, status: b.status })) ?? [])}`,
    );

    // Evita sobreposição: um batch in_progress ainda está classificando mensagens.
    // Criar outro batch em paralelo causaria contagem duplicada ao salvar os resultados.
    const hasPendingBatch = existingAnalysis?.companyActAnalysisBatches.some((b) => b.status === "in_progress");
    if (hasPendingBatch) {
      throw new PublicError(
        "Já existe uma análise em andamento para este ato. Aguarde a conclusão antes de gerar novamente.",
      );
    }

    const processedAnalysisId = existingAnalysis?.id;

    // Seleciona apenas capítulos que têm ≥1 mensagem de usuário ainda não processada nesta análise.
    // O capítulo inteiro é reenviado à IA como contexto (necessário para a conversa fazer sentido),
    // mas ao salvar os resultados só contamos as mensagens realmente novas.
    const chapters = await prismaClient.actChapter.findMany({
      where: {
        actChatbotId,
        user: { companyId },
        messages: {
          some: {
            role: "user",
            // Se já há uma análise, filtramos mensagens sem linha em ActMessagesPsychosocialFactors
            // vinculada a ela — tanto positivas (com fator) quanto marcadores null (sem fator).
            ...(processedAnalysisId && {
              actMessagesPsychosocialFactors: {
                none: { analysisBatch: { companyActAnalysisId: processedAnalysisId } },
              },
            }),
          },
        },
      },
      include: {
        messages: { select: { id: true, role: true, content: true } },
      },
    });

    console.log(`[act/generateAnalysis] capítulos com mensagens novas: ${chapters.length}`);

    if (chapters.length === 0) {
      throw new PublicError("Não há novas mensagens para analisar.");
    }

    const factors = await prismaClient.psychosocialFactor.findMany({
      select: { id: true, name: true, description: true },
    });

    // Cada item do batch corresponde a um capítulo (conversa completa).
    // O customId é o id do capítulo — usado ao salvar os resultados para mapear
    // resultado → capítulo → mensagens e saber quais mensagens marcar como processadas.
    const instructions = await this.buildPsychosocialPrompt(factors);
    const batchItems: CreateOpenAiBatchRequest["batchItems"] = chapters.map((chapter) => ({
      customId: chapter.id,
      messages: [{ content: JSON.stringify(chapter.messages), role: "user" }],
    }));

    const openai = new OpenAiApi({ model: "gpt-5.4" });
    const batchResult = await openai.createBatch({ instructions, batchItems });

    console.log(`[act/generateAnalysis] lote OpenAI criado: batchId=${batchResult.batchId} itens=${batchItems.length}`);

    // Cria a CompanyActAnalysis apenas na primeira vez; nas seguintes reutiliza a existente.
    const analysis =
      existingAnalysis ??
      (await prismaClient.companyActAnalysis.create({
        data: { actChatbotId, companyId },
      }));

    console.log(`[act/generateAnalysis] análise canônica: ${analysis.id} (nova=${!existingAnalysis})`);

    await prismaClient.companyActAnalysisBatch.create({
      data: { batchId: batchResult.batchId, companyActAnalysisId: analysis.id },
    });
  }

  private async buildPsychosocialPrompt(factors: Partial<PsychosocialFactor>[]) {
    const factorsJson = JSON.stringify(factors);
    return `
Você é um classificador técnico especializado em fatores psicossociais em comunicações corporativas.

Sua tarefa é analisar mensagens de uma conversa e identificar somente os fatores psicossociais que realmente se aplicam às mensagens enviadas por usuários.

Os fatores disponíveis são:

${factorsJson}

Você receberá um JSON contendo:

- messages: lista de mensagens da conversa, onde cada item possui:
  - id
  - role
  - content

Objetivo:

Avaliar somente mensagens cujo role seja "user" e retornar apenas as combinações positivas (mensagem x fator) em que exista aderência real.

Regras obrigatórias:

1. Analise apenas mensagens com role igual a "user".
2. Ignore mensagens com qualquer outro role no resultado final.
3. Considere todas as mensagens da conversa como contexto para interpretação.
4. Avalie todos os fatores listados acima para cada mensagem elegível.
5. O campo factor_id é string.
6. Retorne somente fatores com aderência positiva.
7. Não retorne fatores negativos, inconclusivos ou nulos.
8. Se o factor_id for nulo, indefinido ou não aplicável, não inclua item em results.
9. Utilize somente os fatores fornecidos.
10. Nunca invente fatores.
11. Considere significado semântico, tom, intenção e sinais indiretos.
12. Seja criterioso e conservador. Só classifique quando houver evidência razoável.
13. Se nenhuma mensagem de role "user" possuir aderência a qualquer fator, retorne results vazio.
14. Retorne apenas JSON válido.
15. Não inclua explicações, comentários ou texto adicional.

Formato obrigatório de resposta:

{
  "associations": [
    {
      "message_id": "string",
      "factor_id": "string"
    }
  ]
}
`.trim();
  }
}

export { ActAdminService as ActChatbotAdminService };
