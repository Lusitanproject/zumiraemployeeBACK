import { CreateSessionProps } from "@/app/_lib/session";

import { AvatarThumb } from "./avatar-thumb";

interface AvatarProps {
  session: CreateSessionProps | null;
}

export function Avatar({ session }: AvatarProps) {
  if (!session) {
    return <></>;
  }

  return (
    <div className="w-12 h-12">
      <AvatarThumb role={session.role} user={session.name} />
    </div>
  );
}
