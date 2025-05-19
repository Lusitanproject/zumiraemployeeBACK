"use client";

import { DottedSpinner } from "@/components/custom/dotted-spinner";
import { useEffect } from "react";
import { generateFeedback } from "../actions";

interface ConcludedProps {
  assessmentId: string;
}

export function Concluded({ assessmentId }: ConcludedProps) {
  useEffect(() => {
    generateFeedback(assessmentId);
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
