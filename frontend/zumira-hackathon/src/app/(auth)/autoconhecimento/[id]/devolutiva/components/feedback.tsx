"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import React, { useState } from "react";
import Markdown from "react-markdown";

interface FeedbackProps {
  title: string;
  subtitle: string;
  text: string;
  answeredAt: Date;
}

export function Feedback({ title, subtitle, text, answeredAt }: FeedbackProps) {
  const [showAll, setShowAll] = useState<boolean>(false);

  function formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Mês é baseado em zero
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  return (
    <div
      className={`relative flex flex-col size-full justify-between ${showAll ? "overflow-visible" : "overflow-hidden"}`}
    >
      <div className="flex flex-col justify-start">
        <h1 className="text-lg text-gray-600 leading-7 font-bold">{title}</h1>
        <h2 className="text-base text-gray-600 leading-6 font-semibold">{subtitle}</h2>
        <div className="markdown prose lg:prose-xl">
          <Markdown>{text}</Markdown>
        </div>
        <hr className="text-gray-300 my-3" />
        <footer className="text-base text-gray-600 leading-4 font-semibold">
          Teste realizado em {formatDate(new Date(answeredAt))}
        </footer>
      </div>
      <div
        className={`absolute w-full bottom-0 bg-gradient-to-t from-white via-white via-70% to-transparent duration-500 ${
          showAll ? "translate-y-full pointer-events-none opacity-0" : "translate-y-0 pointer-events-auto opacity-100"
        }`}
      >
        <Button variant="primary" size="xxl" className={`w-full mt-8`} onClick={() => setShowAll(true)}>
          <span>Quero a devolutiva completa</span>
          <ChevronRight className="size-6" />
        </Button>
      </div>
    </div>
  );
}
