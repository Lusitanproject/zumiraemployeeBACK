"use client";

import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { redirect, RedirectType } from "next/navigation";

export default function AssessmentComplete() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex flex-col text-center">
        <div className="mx-auto mb-8 w-[8.25rem] h-[8.25rem] bg-primary-50 shadow-xl rounded-4xl flex items-center justify-center">
          <User className="size-16" />
        </div>
        <h3 className="text-4xl font-semibold text-gray-700 text-center mb-4">Teste concluído</h3>
        <p className="text-base leading-6 text-center text-gray-700 mb-8">
          Recebemos suas respostas e vamos analisá-las e, em breve, <br />
          atualizaremos suas devolutivas na área de <strong>autoconhecimento</strong>.
        </p>

        <Button variant="primary" size="lg" onClick={() => redirect("/autogestao", RedirectType.replace)}>
          <span>Voltar para Autogestão</span>
        </Button>
      </div>
    </div>
  );
}
