"use client";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { useEffect } from "react";
import { toast } from "sonner";

import { DottedSpinner } from "@/components/custom/dotted-spinner";

import { generateFeedback } from "../actions";

interface ConcludedProps {
  assessmentId: string;
}

export function Concluded({ assessmentId }: ConcludedProps) {
  useEffect(() => {
    try {
      generateFeedback(assessmentId);
    } catch (err) {
      if (err instanceof Error && !isRedirectError(err)) toast.error(err.message);
    }
  }, [assessmentId]);

  return (
    <div className="flex size-full justify-center items-center">
      <div className="flex flex-col h-full w-96 sm:justify-center justify-between items-center">
        {/* <HeadImage size="small" /> */}
        <DottedSpinner />
        <div className="flex flex-col size-fit">
          <h1 className="sm:text-4xl text-3xl font-bold text-center sm:leading-11 leading-9 text-gray-800">
            Estamos processando seus resultados
          </h1>
          <p className="text-lg leading-7 text-center text-gray-600">
            Em alguns instantes você será redirecionado para visualizar a sua devolutiva
          </p>
        </div>
      </div>
    </div>
  );
}
