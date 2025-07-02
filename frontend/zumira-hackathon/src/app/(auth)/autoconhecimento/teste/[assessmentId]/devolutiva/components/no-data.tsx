"use client";

import { ChevronRight } from "lucide-react";
import { redirect } from "next/navigation";

import { HeadImage } from "@/components/custom/head-image";
import { Button } from "@/components/ui/button";

interface NoDataProps {
  assessmentId: string;
}

export function NoData({ assessmentId }: NoDataProps) {
  return (
    <div className="flex size-full justify-center items-center">
      <div className="flex flex-col h-full w-96 sm:justify-center justify-between items-center">
        <HeadImage size="small" />
        <div className="flex flex-col size-fit">
          <h1 className="sm:text-4xl text-3xl font-bold text-center sm:leading-11 leading-9 text-text-800">
            Ainda não possuimos informações disponíveis
          </h1>
          <p className="text-lg leading-7 text-center text-text-600">
            Realize essa avaliação para receber a devolutiva
          </p>
        </div>
        <Button
          className="w-full mt-8"
          size="xxl"
          variant="primary"
          onClick={() => redirect(`/autoconhecimento/teste/${assessmentId}`)}
        >
          <span>Fazer Avaliação</span>
          <ChevronRight className="size-6" />
        </Button>
      </div>
    </div>
  );
}
