"use client";

import { Fragment, useEffect, useRef } from "react";
import Markdown from "react-markdown";

import { cn } from "@/lib/utils";

import { Message } from "../definitions";

interface MessagesProps {
  messages: Message[];
  loadingResponse?: boolean;
  onScroll?: (isScrolled: boolean) => void;
}

export function Messages({ messages, loadingResponse, onScroll }: MessagesProps) {
  const divRef = useRef<HTMLDivElement | null>(null);

  function handleScroll() {
    if (!divRef.current) return;
    onScroll?.(!(divRef.current.scrollTop <= 0));
  }

  useEffect(() => {
    if (!divRef.current) return;

    divRef.current.scrollTo({
      top: divRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loadingResponse]);

  return (
    <div
      ref={divRef}
      className="flex flex-col size-full py-[1.375rem] gap-[1.375rem] overflow-y-scroll overflow-x-hidden px-5"
      onScroll={handleScroll}
    >
      {messages.map((m, i) => (
        <Fragment key={i}>
          {m.role === "assistant" && <hr className="text-gray-200 -mx-5" />}
          <div
            className={`flex flex-col w-full ${m.role === "user" ? "items-end" : "items-start"}`}
            style={{ overflowWrap: "anywhere" }}
          >
            <div
              className={cn(
                `flex flex-col w-auto max-w-4xl rounded-xl px-[1.375rem] py-4 markdown prose ${
                  m.role === "user" ? "bg-gray-200 rounded-br-none ml-10" : "bg-gray-100 rounded-bl-none mr-10"
                }`
              )}
            >
              {m.role === "assistant" ? (
                <Markdown>{m.content}</Markdown>
              ) : (
                <span className="text-base">{m.content}</span>
              )}
            </div>

            {/* {m.error && <span className="text-md text-red-400">{m.error}</span>} */}
          </div>
        </Fragment>
      ))}

      {/* Chat bubble com 3 pontos flutuando */}
      {loadingResponse && (
        <>
          <hr className="text-gray-200 -mx-5" />
          <div className="flex flex-col w-full items-start">
            <span className="relative flex flex-row rounded-xl px-[1.375rem] py-4 bg-gray-100 rounded-bl-none gap-1">
              {Array.from({ length: 3 }, (_, i) => (
                <div
                  key={i}
                  className="size-1.5 rounded-full bg-black animate-jump"
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
