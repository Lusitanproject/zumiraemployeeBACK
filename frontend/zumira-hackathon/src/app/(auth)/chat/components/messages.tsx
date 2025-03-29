"use client";

import { useEffect, useRef } from "react";
import { ChatMessage } from "../definitions";
import Markdown from "react-markdown";

interface MessagesProps {
  messages: ChatMessage[];
  loadingResponse?: boolean;
}

function SingleMessage({ role, content, error }: ChatMessage) {
  return (
    <>
      {role === "assistant" && <hr className="text-gray-200 -mx-5" />}
      <div
        className={`flex flex-col w-full ${role === "user" ? "items-end" : "items-start"}`}
        style={{ overflowWrap: "anywhere" }}
      >
        <div
          className={`flex flex-col w-auto max-w-[80%] rounded-xl px-[1.375rem] py-4 whitespace-pre-line markdown prose lg:prose-xl ${
            role === "user" ? "bg-gray-200 rounded-br-none" : "bg-gray-100 rounded-bl-none"
          }`}
        >
          {role === "assistant" ? <Markdown>{content}</Markdown> : <span className="text-base">{content}</span>}
        </div>

        {error && <span className="text-md text-red-400">{error}</span>}
      </div>
    </>
  );
}

export function Messages({ messages, loadingResponse }: MessagesProps) {
  const divRef = useRef<HTMLDivElement | null>(null);

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
    >
      {messages.map((m, i) => (
        <SingleMessage key={i} content={m.content} role={m.role} error={m.error} />
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
