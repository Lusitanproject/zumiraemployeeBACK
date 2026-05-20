interface SendMessageInput {
  to: string;
  message: string;
}

export interface ReceiveMessage {
  from: string;
  message: string;
  raw: unknown;
}

export type OnMessageReceived = (message: ReceiveMessage, api: WhatsappApi) => Promise<void>;

interface WhatsappWebhookMessage {
  from: string;
  text?: { body?: string };
}

interface WhatsappWebhookPayload {
  entry?: {
    changes?: {
      value?: {
        messages?: WhatsappWebhookMessage[];
      };
    }[];
  }[];
}

export class WhatsappApi {
  private baseUrl = "https://graph.facebook.com/v22.0";
  private token: string;
  private phoneNumberId: string;

  constructor() {
    const token = process.env.WHATSAPP_TOKEN;
    const phoneNumberId = process.env.PHONE_NUMBER_ID;

    if (!token) {
      throw new Error("Environment variable WHATSAPP_TOKEN is not set");
    }
    if (!phoneNumberId) {
      throw new Error("Environment variable PHONE_NUMBER_ID is not set");
    }

    this.token = token;
    this.phoneNumberId = phoneNumberId;
  }

  async send({ to, message }: SendMessageInput): Promise<unknown> {
    console.log(`[WhatsApp] sending message to ${to}:`, message);
    try {
      const response = await fetch(`${this.baseUrl}/${this.phoneNumberId}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type: "text",
          text: { body: message },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`WhatsApp API error: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      console.log(`[WhatsApp] message sent successfully:`, data);
      return data;
    } catch (error) {
      console.error("[WhatsApp] failed to send message:", error);
      throw error;
    }
  }

  async receive(payload: unknown, onMessage: OnMessageReceived): Promise<void> {
    console.log("[WhatsApp] received webhook payload:", JSON.stringify(payload, null, 2));

    const p = payload as WhatsappWebhookPayload;
    const message = p?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message) {
      console.log("[WhatsApp] no message found in payload, ignoring");
      return;
    }

    console.log(`[WhatsApp] message from ${message.from}:`, message.text?.body);

    await onMessage(
      {
        from: message.from,
        message: message.text?.body || "",
        raw: message,
      },
      this,
    );
  }
}
