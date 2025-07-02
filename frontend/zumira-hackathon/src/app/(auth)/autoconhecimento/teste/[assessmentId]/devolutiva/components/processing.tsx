"use client";

import { HeadImage } from "@/components/custom/head-image";

export function Processing() {
  return (
    <div className="flex size-full justify-center items-center">
      <div className="flex flex-col h-full w-96 sm:justify-center justify-between items-center">
        <HeadImage size="small" />
        <div className="flex flex-col size-fit">
          <h1 className="sm:text-4xl text-3xl font-bold text-center sm:leading-11 leading-9 text-text-800">
            Estamos processando seus resultados
          </h1>
          <p className="text-lg leading-7 text-center text-text-600">
            Volte em alguns instantes para receber sua devolutiva
          </p>
        </div>
      </div>
    </div>
  );
}
