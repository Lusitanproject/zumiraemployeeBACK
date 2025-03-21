"use client";

import { HeadImage } from "@/components/custom/head-image";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { redirect } from "next/navigation";

interface NoDataProps {
  selfMonitoringBlockId: string;
}

export function NoData({ selfMonitoringBlockId }: NoDataProps) {
  return (
    <div className="flex size-full justify-center items-center">
      <div className="flex flex-col h-full w-96 sm:justify-center justify-between items-center">
        <HeadImage size="small" />
        <div className="flex flex-col size-fit">
          <h1 className="sm:text-4xl text-3xl font-bold text-center sm:leading-11 leading-9 text-gray-800">
            Ainda não possui informação disponivel
          </h1>
          <p className="text-lg leading-7 text-center text-gray-600">
            Realize a autoavaliação dessa área para receber a devolutiva
          </p>
        </div>
        <Button
          variant="primary"
          size="xxl"
          className="w-full mt-8"
          onClick={() => redirect(`/autogestao?avaliacao=${selfMonitoringBlockId}`)}
        >
          <span>Fazer Autoavaliação</span>
          <ChevronRight className="size-6" />
        </Button>
      </div>
    </div>
  );
}
