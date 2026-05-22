declare namespace Express {
  export interface Request {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      permissions: string[];
      currentChatbotId: string | null;
      companyId: string | null;
    };
  }
}
