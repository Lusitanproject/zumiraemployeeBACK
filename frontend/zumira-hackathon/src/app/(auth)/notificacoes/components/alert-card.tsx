"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { Alert } from "../definitions";

interface AlertCardProps {
  alert: Alert;
  id?: string;
  open?: boolean;
  onClose?: (id: string) => void;
  onOpen?: (id: string) => void;
}

export function AlertCard({ alert, id, open, onOpen, onClose }: AlertCardProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>();

  function formatDate(dateInput: Date | string | number): string {
    const date = new Date(dateInput);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} às ${hours}:${minutes}`;
  }

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.offsetHeight);
    }
  }, [contentRef]);

  return (
    <section
      className={cn(
        "relative flex flex-col gap-1 p-3 rounded-md border-1 duration-200",
        open ? "border-primary-300" : "border-gray-100 hover:bg-[#E7F8EA]"
      )}
      id={id}
    >
      <h1 className="text-gray-500 text-xs leading-[1.125rem] text-start">Alerta de risco</h1>
      <hr className="text-gray-200" />
      <p className="text-gray-700 text-sm leading-5 text-start">
        O resultado de uma das suas avaliações gerou um alerta: <strong>{alert.assessmentResultRating.risk}</strong>
      </p>

      <div className="relative flex duration-300 overflow-clip" style={{ height: open ? contentHeight : 0 }}>
        <div ref={contentRef} className={cn("absolute flex w-full justify-center")}>
          <Link href={`/autoconhecimento/teste/${alert.assessmentResultRating.assessment.id}/devolutiva`}>
            <Button className="mt-4" size="lg" variant="secondary">
              Ir para detalhes
            </Button>
          </Link>
        </div>
      </div>

      <span className="flex w-full text-[10px] leading-[18px] text-right text-gray-400 justify-end">
        {formatDate(alert.createdAt)}
      </span>

      <button
        className="w-fit text-xs leading-[18px] text-gray-400 text-start cursor-pointer underline"
        onClick={() => (open ? onClose?.(alert.id) : onOpen?.(alert.id))}
      >
        Ver {open ? "menos" : "mais"}
      </button>

      {!alert.read && (
        <div
          className="absolute right-0 top-0 -translate-y-1/3 rounded-full size-2"
          style={{ backgroundColor: alert.assessmentResultRating.color }}
        />
      )}
    </section>
  );
}
