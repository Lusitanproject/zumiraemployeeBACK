"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

import { readAlert } from "../actions";
import { Alert } from "../definitions";

interface AlertCardProps {
  alert: Alert;
  selected?: boolean;
  onClose?: () => void;
}

export function AlertCard({ alert, selected, onClose }: AlertCardProps) {
  function formatDate(dateInput: Date | string | number): string {
    const date = new Date(dateInput);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} às ${hours}:${minutes}`;
  }

  return (
    <Link
      href={`/autoconhecimento/teste/${alert.assessmentResultRating.assessment.id}/devolutiva`}
      onClick={() => {
        readAlert(alert.id);
        onClose?.();
      }}
    >
      <section
        className={cn(
          "relative flex flex-col gap-1 p-3 rounded-md  border-border-100 border-1",
          selected ? "bg-[#E7F8EA]" : "hover:bg-[#E7F8EA]"
        )}
      >
        <h1 className="text-text-500 text-xs leading-[1.125rem] text-start">Alerta de risco</h1>
        <hr className="text-text-200" />
        <p className="text-text-700 text-sm leading-5 text-start">
          O resultado de uma das suas avaliações gerou um alerta: <strong>{alert.assessmentResultRating.risk}</strong>
        </p>
        <span className="flex w-full text-[10px] leading-[18px] text-right text-text-400 justify-end">
          {formatDate(alert.createdAt)}
        </span>
        <span className="w-full text-xs leading-[18px] underline text-text-400 text-star">Ver mais</span>

        {!alert.read && (
          <div
            className="absolute right-0 top-0 -translate-y-1/3 rounded-full size-2 border-1 border-border-200"
            style={{ backgroundColor: alert.assessmentResultRating.color }}
          />
        )}
      </section>
    </Link>
  );
}
