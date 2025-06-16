import { cookies } from "next/headers";
import { ReactNode } from "react";

import { decrypt } from "@/app/_lib/session";

import { verifyUserRole } from "./actions";
import { getCompanyFeedbacks } from "./components/assistant/actions";
import { Assistant } from "./components/assistant/assistant";

type LayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: LayoutProps) {
  await verifyUserRole();
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);
  const feedbacks = await getCompanyFeedbacks();
  const chatbotId = process.env.CHATBASE_ADMIN_CHATBOT_ID;

  if (!chatbotId) return null;

  return (
    <>
      <div className="flex size-full">{children}</div>
      <Assistant chatbotId={chatbotId} companyFeedbacks={feedbacks.data} username={session?.name ?? ""} />
    </>
  );
}
