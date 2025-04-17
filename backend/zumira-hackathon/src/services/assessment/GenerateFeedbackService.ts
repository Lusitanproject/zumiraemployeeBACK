import axios from "axios";
import prismaClient from "../../prisma";

interface GenerateFeedbackRequest {
  userId: string;
  assessmentId: string;
}

async function messageAssistant(message: string, assistantId: string) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    throw new Error("Invalid configuration: OPENAI_API_KEY was not defined.");
  }

  const headers = {
    Authorization: `Bearer ${OPENAI_API_KEY}`,
    "Content-Type": "application/json",
    "OpenAI-Beta": "assistants=v2",
  };

  try {
    // Criar um novo thread
    const threadResponse = await axios.post("https://api.openai.com/v1/threads", {}, { headers });
    const threadId = threadResponse.data.id;

    // Enviar mensagem ao thread
    await axios.post(
      `https://api.openai.com/v1/threads/${threadId}/messages`,
      { role: "user", content: `${message}` },
      { headers }
    );

    // Iniciar execução do assistente
    const runResponse = await axios.post(
      `https://api.openai.com/v1/threads/${threadId}/runs`,
      { assistant_id: assistantId, response_format: "auto" },
      { headers }
    );
    const runId = runResponse.data.id;

    // Aguardar finalização da execução
    let status = "in_progress";
    while (status === "in_progress" || status === "queued") {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const runCheck = await axios.get(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
        headers,
      });

      status = runCheck.data.status;
      if (status === "failed") {
        throw new Error();
      }
    }

    // Obter resposta do assistente
    const messagesResponse = await axios.get(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      headers,
    });

    const responseText = messagesResponse.data.data.find(
      (msg: { role: string; content: { text: { value: string } }[] }) => msg.role === "assistant"
    )?.content[0]?.text.value;
    if (!responseText) {
      throw new Error();
    } else {
      return { text: responseText };
    }
  } catch {
    throw new Error("Something went wrong");
  }
}

class GenerateFeedbackService {
  async execute({ userId, assessmentId }: GenerateFeedbackRequest) {
    const latestResult = await prismaClient.assessmentResult.findFirst({
      where: {
        assessmentId,
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!latestResult) throw new Error("No results for this assessment");

    const assessment = await prismaClient.assessment.findFirst({
      where: {
        id: assessmentId,
      },
      select: {
        feedbackInstructions: true,
        operationType: true,
        assessmentQuestions: {
          select: {
            psychologicalDimension: {
              select: {
                id: true,
                name: true,
              },
            },
            assessmentQuestionAnswers: {
              where: {
                userId: userId,
                assessmentResultId: latestResult.id,
              },
              include: {
                assessmentQuestionChoice: true,
              },
            },
          },
        },
      },
    });
    if (!assessment?.feedbackInstructions) throw new Error("No assistant registered for this assessment");

    const dimensions = [] as { data: { id: string; name: string }; values: number[] }[];
    assessment.assessmentQuestions.map((q) => {
      if (!dimensions.find((d) => d.data.id === q.psychologicalDimension.id)) {
        dimensions.push({ data: q.psychologicalDimension, values: [] });
      }
    });

    for (const question of assessment.assessmentQuestions) {
      const answer = question.assessmentQuestionAnswers[0];
      if (!answer) continue;

      const dimension = dimensions.find((d) => d.data.id === question.psychologicalDimension.id);
      dimension?.values.push(answer.assessmentQuestionChoice.value);
    }

    const message = dimensions
      .filter((d) => d.values.length)
      .map((d) => {
        const sum = d.values.reduce((sum, v) => sum + v, 0);
        const average = sum / d.values.length;

        switch (assessment.operationType) {
          case "SUM":
            return `${d.data.name}: ${sum.toFixed(2)}`;
          case "AVERAGE":
            return `${d.data.name}: ${average.toFixed(2)}`;
        }
      })
      .join(", ");
    if (!message) throw new Error("No values to send");

    console.log(`Generating feedback for assessment ${assessmentId} with assistant ${assessment.feedbackInstructions}`);

    const response = await messageAssistant(message, assessment.feedbackInstructions);

    const assessmentFeeedback = await prismaClient.assessmentFeedback.create({
      data: {
        text: response.text,
        userId,
        assessmentId,
      },
      select: {
        id: true,
        text: true,
        userId: true,
        assessmentId: true,
      },
    });

    return assessmentFeeedback;
  }
}

export { GenerateFeedbackService };
