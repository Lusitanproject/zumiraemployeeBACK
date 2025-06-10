"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface MeatballsMenuProps {
  email: string;
  username: string;
}

export function MeatballsMenu({ username, email }: MeatballsMenuProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isModalOpen && modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsModalOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  return (
    <div className="relative">
      <button
        className={cn(
          "flex flex-row gap-0.5 border-1 p-1 size-5 justify-center items-center rounded-md border-gray-300 shadow-sm cursor-pointer hover:bg-gray-50 flex-none"
        )}
        onClick={() => setIsModalOpen(true)}
      >
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-none size-0.5 bg-gray-700 rounded-full" />
        ))}
      </button>
      <div
        ref={modalRef}
        className={cn(
          isModalOpen
            ? "opacity-100 pointer-events-auto -translate-y-5"
            : "opacity-0 pointer-events-none translate-y-0",
          "fixed px-4 py-3 flex text-nowrap duration-300 -translate-x-[103%] bg-white shadow-md border-1 border-gray-300 z-50 rounded-lg flex-col items-start gap-1"
        )}
      >
        <span>
          <strong>Usuário: </strong>
          {username}
        </span>
        <span>
          <strong>Contato: </strong>
          {email}
        </span>
      </div>
    </div>
  );
}
