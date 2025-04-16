import { ReactNode } from "react";
import { verifyUserRole } from "./actions";

type LayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: LayoutProps) {
  await verifyUserRole();

  return children;
}
