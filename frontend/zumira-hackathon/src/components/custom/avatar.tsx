import { decrypt } from "@/app/_lib/session";
import { cookies } from "next/headers";
import { AvatarThumb } from "./avatar-thumb";

export async function Avatar() {
  const cookie = await cookies()
  const session = decrypt(cookie.get('session')?.value)

  if (!session) {
    return <></>
  }

  return (
    <div className="w-12 h-12">
      <AvatarThumb user={session.name} />
    </div>
  )
}
