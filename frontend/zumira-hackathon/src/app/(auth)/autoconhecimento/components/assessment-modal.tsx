"use client";

import { ChevronRight, SquareX, User } from "lucide-react";
import { redirect, RedirectType } from "next/navigation";
import { useCallback } from "react";

import { Button } from "@/components/ui/button";
import { startHolyLoader } from "holy-loader";

export type AssessmentModalProps = {
  id: string;
  title: string;
  summary: string;
  open: boolean;
  onClose?: () => void;
};

export function AssessmentModal({ id, title, summary, open, onClose }: AssessmentModalProps) {
  const handleOpenAssessment = useCallback(() => {
    startHolyLoader();
    redirect(`/autoconhecimento/teste/${id}`, RedirectType.push);
  }, [id]);

  return (
    <div
      className={`fixed flex justify-center items-center inset-0 z-50 p-4 bg-black/50 duration-200 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <section
        className={`flex flex-col bg-white sm:max-w-lg w-full rounded-lg p-6 gap-4 duration-200 ${
          open ? "scale-100" : "scale-95"
        }`}
      >
        <header className="relative flex flex-col pt-16 gap-2">
          <button
            className="absolute top-0 left-0 size-8 flex items-center justify-center border-0 cursor-pointer"
            onClick={onClose}
          >
            <SquareX className="size-6 text-gray-400" />
          </button>
          <div className="absolute -top-[84px] w-[8.25rem] h-[8.25rem] bg-primary-50 left-1/2 -translate-x-1/2 shadow-xl rounded-4xl flex flex-col items-center justify-center">
            <User className="size-16" />
          </div>
          <h1 className="text-4xl w-full font-semibold text-gray-700 text-center mb-2">{title}</h1>
          <p className="text-sm leading-5 text-center text-gray-700 mb-8">{summary}</p>
        </header>
        <footer className="!justify-center flex">
          <Button className="w-full" size="lg" variant="primary" onClick={handleOpenAssessment}>
            <span>Iniciar</span>
            <ChevronRight className="size-5" />
          </Button>
        </footer>
      </section>
    </div>
  );
}
