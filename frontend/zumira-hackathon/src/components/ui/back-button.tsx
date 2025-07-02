"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        router.back();
      }}
    >
      <ChevronLeft className="size-6 text-text-400" />
    </button>
  );
}
