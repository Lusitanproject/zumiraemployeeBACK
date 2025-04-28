import { ReactNode } from "react";
import { verifyUserRole } from "./actions";
import { getCompanyFeedbacks } from "./components/assistant/actions";
import { Assistant } from "./components/assistant/assistant";
import { decrypt } from "@/app/_lib/session";
import { cookies } from "next/headers";

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
      <div>{children}</div>
      <Assistant companyFeedbacks={feedbacks.data} chatbotId={chatbotId} username={session?.name ?? ""} />
    </>
  );
}
