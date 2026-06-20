import { ChapterType } from "@prisma/client";

import { PublicError } from "../../error";
import { GenerateOpenAiResponseRequest, OpenAiApi } from "../../external/openai";
import { ReceiveMessage, WhatsappApi } from "../../external/whatsapp";
import prismaClient from "../../prisma";
import {
  CompileActChapterRequest,
  CreateActChapterRequest,
  CreateActRequest,
  GetActChapterRequest,
  MessageActChatbotRequest,
  TestActRequest,
  UpdateActChapterRequest,
  UpdateActRequest,
} from "../../schemas/actChatbot";
import { buildFullMessages } from "../../utils/chat";
import { tryParsePhone } from "../../utils/phone";
import { capitalize } from "../../utils/string";
import { TrailAdminService } from "../admin/TrailAdminService";
import { TrailService } from "../trail/TrailService";

class ActService {
  async compileChapter({ actChapterId, userId }: CompileActChapterRequest) {
    const chapter = await prismaClient.actChapter.findFirst({
      where: { userId, id: actChapterId },
      include: {
        messages: { orderBy: { createdAt: "asc" } },
        actChatbot: true,
      },
    });
    if (!chapter) throw new Error("Chapter not found");

    const messages = chapter.messages.map((m) => ({
      content: m.content,
      role: "user",
    })) as GenerateOpenAiResponseRequest["messages"];

    const openai = new OpenAiApi();
    const response = await openai.generateResponse({
      messages,
      instructions: chapter.actChatbot.compilationInstructions,
    });

    const data = await prismaClient.actChapter.update({
      where: { id: actChapterId },
      data: { compilation: response.output_text },
    });

    return data;
  }

  async createChapter(data: CreateActChapterRequest) {
    await prismaClient.actChapter.deleteMany({
      where: { userId: data.userId, messages: { none: {} } },
    });

    const chapter = await prismaClient.actChapter.create({
      data,
      select: {
        id: true,
        actChatbot: {
          select: { name: true, icon: true, description: true },
        },
      },
    });

    return chapter;
  }

  async getChapter({ userId, actChapterId }: GetActChapterRequest) {
    const [chapter, messages] = await Promise.all([
      prismaClient.actChapter.findFirst({
        where: { id: actChapterId },
        select: {
          id: true,
          title: true,
          compilation: true,
          actChatbot: {
            select: { id: true, description: true, icon: true, name: true, initialMessage: true },
          },
        },
      }),
      prismaClient.actChapterMessage.findMany({
        where: { actChapterId, actChapter: { userId } },
        select: { content: true, role: true, createdAt: true, updatedAt: true },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    if (!chapter) throw new Error("Chapter not found");

    return { ...chapter, messages };
  }

  private async prepareMessageContext(
    { content, actChapterId, userId }: MessageActChatbotRequest,
    opts?: { externalId?: string; instructionsComplement?: string },
  ) {
    const conv = await prismaClient.actChapter.findFirst({
      where: { id: actChapterId, userId },
      include: { actChatbot: true, user: true },
    });

    if (!conv) throw new PublicError("Conversa não existe");

    await prismaClient.actChapterMessage.create({
      data: { actChapterId, role: "user", content, externalId: opts?.externalId },
    });

    const messages = await prismaClient.actChapterMessage.findMany({
      where: { actChapterId },
      orderBy: { createdAt: "asc" },
    });

    const historyAndInput = messages.map((m) => ({
      role: m.role,
      content: m.content,
    })) as GenerateOpenAiResponseRequest["messages"];

    if (conv.actChatbot.initialMessage)
      historyAndInput.unshift({ role: "assistant", content: conv.actChatbot.initialMessage });

    const instructions = this.buildMessageInstructions(
      conv.actChatbot.messageInstructions,
      conv.user.name,
      opts?.instructionsComplement,
    );

    return { actChapterId, historyAndInput, instructions };
  }

  private async persistAssistantMessage(actChapterId: string, content: string) {
    await Promise.all([
      prismaClient.actChapterMessage.create({
        data: { actChapterId, role: "assistant", content },
      }),
      prismaClient.actChapter.update({
        where: { id: actChapterId },
        data: { updatedAt: new Date() },
      }),
    ]);
  }

  async message(req: MessageActChatbotRequest, opts?: { externalId?: string; instructionsComplement?: string }) {
    const { actChapterId, historyAndInput, instructions } = await this.prepareMessageContext(req, opts);
    const openai = new OpenAiApi();
    const response = await openai.generateResponse({ instructions, messages: historyAndInput });
    await this.persistAssistantMessage(actChapterId, response.output_text);
    return response.output_text;
  }

  async messageStream(req: MessageActChatbotRequest, opts?: { instructionsComplement?: string }) {
    const { actChapterId, historyAndInput, instructions } = await this.prepareMessageContext(req, opts);
    const openai = new OpenAiApi();
    const stream = await openai.generateResponse({ instructions, messages: historyAndInput, stream: true });
    const persist = (responseText: string) => this.persistAssistantMessage(actChapterId, responseText);
    return { stream, persist };
  }

  async updateChapter({ userId, actChapterId, compilation, title }: UpdateActChapterRequest) {
    const chapter = await prismaClient.actChapter.findFirst({ where: { id: actChapterId, userId } });

    if (!chapter) throw new Error("Chapter not found");

    const result = await prismaClient.actChapter.update({
      where: { id: actChapterId, userId },
      data: { compilation, title },
    });

    return result;
  }

  // ── ActChatbot methods ────────────────────────────────────────────────────

  async findById(id: string) {
    const bot = await prismaClient.actChatbot.findFirst({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        icon: true,
        initialMessage: true,
        messageInstructions: true,
        compilationInstructions: true,
      },
    });
    return bot;
  }

  async findByCompany(companyId: string) {
    const company = await prismaClient.company.findFirst({
      where: { id: companyId },
      select: { trailId: true },
    });

    if (!company) throw new PublicError("Company not found");

    const rows = await prismaClient.trailActChatbot.findMany({
      where: { trailId: company.trailId },
      orderBy: { index: "asc" },
      select: {
        index: true,
        actChatbot: {
          select: { id: true, name: true, description: true, icon: true, createdAt: true },
        },
      },
    });

    return { items: rows.map((r) => ({ ...r.actChatbot, index: r.index })) };
  }

  async findByIdConfig({ id, companyId }: { id: string; companyId: string }) {
    const bot = await prismaClient.actChatbot.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        icon: true,
        published: true,
        initialMessage: true,
        messageInstructions: true,
        compilationInstructions: true,
        reportGenerationInstructions: true,
        reportLookupInstructions: true,
        individualAnalysisInstructions: true,
        companyId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!bot || bot.companyId !== companyId) {
      throw new PublicError("Ato não encontrado ou sem permissão de acesso");
    }

    return bot;
  }

  async create(data: CreateActRequest & { companyId: string }) {
    return prismaClient.actChatbot.create({ data });
  }

  async update({ id, companyId, ...data }: UpdateActRequest & { id: string; companyId: string }) {
    const act = await prismaClient.actChatbot.findUnique({ where: { id } });
    if (!act || act.companyId !== companyId) {
      throw new PublicError("Ato não encontrado ou sem permissão para alteração");
    }
    return prismaClient.actChatbot.update({ where: { id }, data });
  }

  async deleteAct({ id, companyId }: { id: string; companyId: string }) {
    const act = await prismaClient.actChatbot.findUnique({ where: { id } });
    if (!act || act.companyId !== companyId) {
      throw new PublicError("Ato não encontrado ou sem permissão para exclusão");
    }

    await new TrailAdminService().removeActFromTrails(id);

    return prismaClient.actChatbot.delete({ where: { id } });
  }

  async findOwned(companyId: string) {
    return prismaClient.actChatbot.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
    });
  }

  async testMessage({ instructions, content, messages, userName }: TestActRequest & { userName: string }) {
    const openai = new OpenAiApi();
    return openai.generateResponse({
      instructions: this.buildMessageInstructions(instructions, userName),
      messages: buildFullMessages(messages, content),
      stream: true,
    });
  }

  async findAvailable(companyId: string) {
    return prismaClient.actChatbot.findMany({
      where: {
        OR: [{ companyId }, { trails: { some: { trail: { companies: { some: { id: companyId } } } } } }],
      },
      orderBy: { createdAt: "desc" },
    });
  }

  private buildMessageInstructions(
    messageInstructions: string | null | undefined,
    userName: string,
    complement?: string,
  ): string {
    return [messageInstructions, `O nome do usuário é: ${capitalize(userName.split(" ")[0])}`, complement]
      .filter(Boolean)
      .join("\n");
  }

  async handleWhatsappMessage(message: ReceiveMessage, api: WhatsappApi): Promise<void> {
    const from = message.from.startsWith("+") ? message.from : `+${message.from}`;
    const phoneE164 = tryParsePhone(from)?.format("E.164") ?? message.from;

    const user = await prismaClient.user.findFirst({
      where: { phoneNumber: phoneE164 },
    });

    if (!user) {
      console.log(`[WhatsApp] no user found for phone ${phoneE164}, sending registration message`);
      await api.send({
        to: message.from,
        message:
          "Olá! Não identifiquei seu cadastro. Pode ser que seu número ainda não esteja em nossos registros ou esteja desatualizado. Para continuar, entre em contato com a sua empresa. Obrigada",
      });
      return;
    }

    // WhatsApp não tem trailId no request — resolve da empresa do usuário
    const company = user.companyId
      ? await prismaClient.company.findUnique({
          where: { id: user.companyId },
          select: { trailId: true },
        })
      : null;

    const trailId = company?.trailId;
    const trailService = new TrailService();
    const progress = trailId ? await trailService.ensureProgress(user.id, trailId) : null;
    const currentActChatbotId = progress?.currentActChatbotId;

    if (!currentActChatbotId) {
      console.log(`[WhatsApp] no act available to assign to user ${user.email} (${user.id})`);
      await api.send({
        to: message.from,
        message:
          "Olá! Não identifiquei nenhum Ato ou Pesquisa atribuída ao seu cadastro. Pode ser que a pesquisa já tenha sido finalizada ou ainda não foi iniciada. Entre em contato com a sua empresa para mais informações. Obrigada",
      });
      return;
    }

    // rollback: trocar condição por `message.messageType !== "text"` e restaurar mensagem "Não é possível enviar mensagens de voz. Por favor, envie uma mensagem de texto."
    if (message.messageType !== "text" && message.messageType !== "audio") {
      await api.send({
        to: message.from,
        message: "Não é possível enviar este tipo de mensagem. Por favor, envie uma mensagem de texto ou áudio de voz.",
      });
      return;
    }

    const actChatbotId = currentActChatbotId;

    console.log(`Identified user: ${user.email} (${user.id})`);

    const existingChapter = await prismaClient.actChapter.findFirst({
      where: { userId: user.id, actChatbotId, type: ChapterType.WHATSAPP },
      orderBy: { updatedAt: "desc" },
      select: { id: true },
    });

    const chapterId =
      existingChapter?.id ??
      (
        await this.createChapter({
          actChatbotId,
          type: ChapterType.WHATSAPP,
          userId: user.id,
        })
      ).id;

    console.log(`Resolved chapter: ${chapterId}`);

    if (message.externalId !== "ABGGFlA5Fpa") {
      const alreadyProcessed = await prismaClient.actChapterMessage.findFirst({
        where: { actChapterId: chapterId, externalId: message.externalId },
        select: { id: true },
      });

      if (alreadyProcessed) {
        console.log(`[WhatsApp] message ${message.externalId} already processed, skipping`);
        return;
      }
    } else {
      console.log("Test webhook message id detected. Skipping duplicate verification.");
    }

    await Promise.all([api.markAsRead(message.externalId), api.sendTyping(message.from)]);

    // rollback: remover este bloco inteiro (let messageContent + if "audio") e trocar messageContent por message.message na chamada this.message() abaixo
    let messageContent = message.message;

    if (message.messageType === "audio") {
      if (!message.audioId) {
        console.log(`[WhatsApp] audio message without audioId from ${message.from}`);
        await api.send({
          to: message.from,
          message: "Não foi possível processar o áudio. Por favor, tente novamente.",
        });
        return;
      }

      try {
        const mediaUrl = await api.getMediaUrl(message.audioId);
        const audioBuffer = await api.downloadAudio(mediaUrl);
        const tempFilePath = await api.saveTempAudio(audioBuffer);

        const openai = new OpenAiApi();
        messageContent = await openai.transcribeAudio(tempFilePath);

        if (!messageContent.trim()) {
          await api.send({
            to: message.from,
            message: "Não consegui entender o áudio. Por favor, tente novamente ou envie uma mensagem de texto.",
          });
          return;
        }

        // rollback: remover esta linha
        messageContent = `__audio__: ${messageContent}`;
        console.log(`[WhatsApp] audio transcribed for ${message.from}: "${messageContent}"`);
      } catch (error) {
        console.error(`[WhatsApp] failed to process audio from ${message.from}:`, error);
        await api.send({
          to: message.from,
          message: "Ocorreu um erro ao processar o áudio. Por favor, tente novamente ou envie uma mensagem de texto.",
        });
        return;
      }
    }

    const responseText = await this.message(
      { content: messageContent, actChapterId: chapterId, userId: user.id },
      {
        externalId: message.externalId,
        instructionsComplement: [
          "Você está respondendo via WhatsApp. Use apenas formatação compatível com WhatsApp.",
          // rollback: remover esta linha
          "Quando a mensagem do usuário começar com __audio__: significa que o conteúdo foi transcrito de um áudio de voz. Considere isso ao interpretar a mensagem.",
          "Não use markdown complexo, tabelas, headings (#), HTML ou blocos incompatíveis.",
          "Formatações permitidas:",
          "*negrito* com um asterisco,",
          "_itálico_ com underscores,",
          "~tachado~ com tils,",
          "`código inline` com um backtick,",
          "```monospace``` com três backticks.",
          "Para listas, use '- item', '* item' ou '1. item'.",
          "Para citações, use '> texto'.",
          "Nunca use **negrito duplo**.",
        ].join("\n"),
      },
    );
    await api.send({ to: message.from, message: responseText });
  }
}

export { ActService };
