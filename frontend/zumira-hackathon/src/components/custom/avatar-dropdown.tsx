"use client";
import { CircleCheck, Ellipsis } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { logout } from "@/app/_lib/auth";
import { startHolyLoader } from "holy-loader";

type AvatarDropdownProps = {
  open: boolean;
  userRole: string;
  onClose: () => void;
};

interface DropdownNavItemProps {
  label: string;
  url: string;
  isCurrent?: boolean;
  onClose: () => void;
}

function DropdownNavItem({ url, label, isCurrent, onClose }: DropdownNavItemProps) {
  const router = useRouter();

  function handleRedirect(url: string) {
    startHolyLoader();
    router.push(url);
    router.refresh();
    onClose();
  }

  return (
    <button
      className="cursor-pointer w-full px-3 py-2 text-center bg-white hover:bg-black/5 text-sm font-medium flex flex-row items-center justify-between text-gray-400 hover:text-blue-950 disabled:text-blue-950"
      disabled={isCurrent}
      onClick={() => handleRedirect(url)}
    >
      <span className="flex flex-row gap-2 items-center">
        <label>{label}</label>
        {isCurrent && <CircleCheck className="size-3" />}
      </span>
      {!isCurrent && <Ellipsis className="size-3" />}
    </button>
  );
}

export function AvatarDropdown({ open, userRole, onClose }: AvatarDropdownProps) {
  const pathname = usePathname();
  const [isAdminPath, setIsAdminPath] = useState<boolean>();

  useEffect(() => {
    setIsAdminPath(pathname.includes("/admin"));
  }, [pathname]);

  if (!open) {
    return <></>;
  }

  return (
    <>
      <div className="inset-0 fixed bg-gray-500/60 z-40" onClick={onClose} />
      <div className="absolute right-0 top-14 shadow-2xl bg-white border border-gray-200 w-[20.5rem] py-1 z-40 rounded-lg overflow-hidden">
        {userRole === "admin" && (
          <>
            <DropdownNavItem isCurrent={isAdminPath} label="Gestão" url="/admin/testes" onClose={onClose} />
            <DropdownNavItem isCurrent={!isAdminPath} label="Conta pessoal" url="/chat" onClose={onClose} />
            <hr className="text-gray-300 mx-2" />
          </>
        )}
        <button
          className="cursor-pointer w-full px-3 py-2 text-center bg-white hover:bg-error-100 text-sm font-medium text-error-600 flex items-center"
          onClick={async () => {
            await logout();
          }}
        >
          <span>Sair</span>
        </button>
      </div>
    </>
  );
}
