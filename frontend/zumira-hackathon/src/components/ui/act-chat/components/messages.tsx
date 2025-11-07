"use client";

import { useEffect, useRef } from "react";
import Markdown from "react-markdown";

import { ActMessage } from "@/types/act";

interface MessagesProps {
  messages: ActMessage[];
  loadingResponse?: boolean;
  onScroll?: (isScrolled: boolean) => void;
}

export function Messages({ messages, loadingResponse, onScroll }: MessagesProps) {
  const lastDivRef = useRef<HTMLDivElement | null>(null);

  function handleScroll() {
    if (lastDivRef.current) onScroll?.(!(lastDivRef.current.scrollTop <= 0));
  }

  useEffect(() => {
    lastDivRef.current?.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
  }, [messages, loadingResponse]);

  return (
    <div
      className="flex flex-col size-full py-[1.375rem] sm:px-5 gap-[1.375rem] scrollbar-hide overflow-y-scroll overflow-x-clip"
      onScroll={handleScroll}
    >
      {messages.map((m, i) => (
        <div key={i} ref={i == messages.length - 1 && !loadingResponse ? lastDivRef : null} className="w-full">
          {m.role === "user" ? (
            <>
              <div className="flex flex-col w-full items-end" style={{ overflowWrap: "anywhere" }}>
                <div className="flex flex-col w-auto max-w-4xl rounded-xl px-[1.375rem] py-4 markdown prose bg-background-200 rounded-br-none ml-10">
                  <span className="text-base">{m.content}</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <hr className="text-text-200 w-full" />
              <div className="flex flex-col w-full items-start markdown sm:px-5" style={{ overflowWrap: "anywhere" }}>
                <Markdown>{m.content}</Markdown>
              </div>
              {m.error && <span className="text-md text-red-400">Erro ao processar uma resposta</span>}
            </>
          )}
        </div>
      ))}

      {/* Chat bubble com 3 pontos flutuando */}
      {loadingResponse && (
        <>
          <hr className="text-text-200 -mx-5" />
          <div ref={lastDivRef} className="flex flex-col w-full items-start">
            <span className="relative flex flex-row rounded-xl px-[1.375rem] py-4 bg-background-50 gap-1">
              {Array.from({ length: 3 }, (_, i) => (
                <div
                  key={i}
                  className="size-1.5 rounded-full bg-text-900 animate-jump"
                  style={{
                    animationDelay: `${i * 0.34}s`,
                  }}
                />
              ))}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
