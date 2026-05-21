interface SendMessageInput {
  message: string;
  to: string;
}

export interface ReceiveMessage {
  from: string;
  message: string;
  raw: unknown;
}

export type OnMessageReceived = (message: ReceiveMessage, api: WhatsappApi) => Promise<void>;

export enum WhatsappWebhookField {
  ACCOUNT_ALERTS = "account_alerts",
  ACCOUNT_REVIEW_UPDATE = "account_review_update",
  ACCOUNT_UPDATE = "account_update",
  AUTOMATIC_EVENTS = "automatic_events",
  BUSINESS_CAPABILITY_UPDATE = "business_capability_update",
  HISTORY = "history",
  MESSAGE_TEMPLATE_COMPONENTS_UPDATE = "message_template_components_update",
  MESSAGE_TEMPLATE_QUALITY_UPDATE = "message_template_quality_update",
  MESSAGE_TEMPLATE_STATUS_UPDATE = "message_template_status_update",
  MESSAGES = "messages",
  PARTNER_SOLUTIONS = "partner_solutions",
  PAYMENT_CONFIGURATION_UPDATE = "payment_configuration_update",
  PHONE_NUMBER_NAME_UPDATE = "phone_number_name_update",
  PHONE_NUMBER_QUALITY_UPDATE = "phone_number_quality_update",
  SECURITY = "security",
  SMB_APP_STATE_SYNC = "smb_app_state_sync",
  SMB_MESSAGE_ECHOES = "smb_message_echoes",
  TEMPLATE_CATEGORY_UPDATE = "template_category_update",
  USER_PREFERENCES = "user_preferences",
}

interface WhatsappWebhookMessage {
  from: string;
  text?: { body?: string };
}

interface WhatsappMessagesValue {
  contacts?: unknown[];
  messages?: WhatsappWebhookMessage[];
  messaging_product?: string;
  metadata?: unknown;
  statuses?: unknown[];
}

type WhatsappChange =
  | { field: WhatsappWebhookField.MESSAGES; value: WhatsappMessagesValue }
  | { field: string; value: unknown };

interface WhatsappWebhookPayload {
  entry?: {
    id?: string;
    changes?: WhatsappChange[];
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

  getField(payload: unknown): string | null {
    const p = payload as WhatsappWebhookPayload;
    return p?.entry?.[0]?.changes?.[0]?.field ?? null;
  }

  async receive(payload: unknown, onMessage: OnMessageReceived): Promise<void> {
    console.log("[WhatsApp] received webhook payload:", JSON.stringify(payload, null, 2));

    const p = payload as WhatsappWebhookPayload;
    const change = p?.entry?.[0]?.changes?.[0];

    if (!change || change.field !== WhatsappWebhookField.MESSAGES) {
      console.log("[WhatsApp] receive called with non-messages field, ignoring");
      return;
    }

    // field verified as MESSAGES — cast is safe and intentional
    const value = change.value as WhatsappMessagesValue;
    const message = value?.messages?.[0];

    if (!message) {
      if (value?.statuses?.length) {
        console.log("[WhatsApp] status event received, ignoring");
      } else {
        console.log("[WhatsApp] no message found in payload, ignoring");
      }
      return;
    }

    console.log(`[WhatsApp] incoming message from ${message.from}:`, message.text?.body);

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
