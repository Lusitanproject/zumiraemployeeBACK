"use client";

import { Fragment, useEffect, useRef } from "react";
import { ChatMessage } from "../definitions";

interface MessagesProps {
    messages: ChatMessage[];
    loadingResponse?: boolean;
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
        <div ref={divRef} className="flex flex-col size-full py-[1.375rem] gap-[1.375rem] overflow-scroll px-5">
            {messages.map((m, i) => (
                <Fragment key={i}>
                    {m.role === "assistant" && <hr className="text-gray-200 -mx-5" />}
                    <div
                        className={`flex flex-col w-full ${m.role === "user" ? "items-end" : "items-start"}`}
                        style={{ overflowWrap: "anywhere" }}
                    >
                        <span
                            className={`flex w-auto max-w-[80%] rounded-xl px-[1.375rem] py-4 ${
                                m.role === "user" ? "bg-gray-200 rounded-br-none" : "bg-gray-100 rounded-bl-none"
                            }`}
                        >
                            {m.content}
                        </span>
                        {m.error && <span className="text-md text-red-400">{m.error}</span>}
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
                                    className="size-1.5 rounded-full bg-black"
                                    style={{
                                        animation: "jump 1.5s ease-in-out infinite",
                                        animationDelay: `${i * 0.34}s`,
                                    }}
                                >
                                    <style>
                                        {`
                                            @keyframes jump {
                                                0%, 100% { transform: translateY(0); }
                                                50% { transform: translateY(-3px); }
                                            }
                                        `}
                                    </style>
                                </div>
                            ))}
                        </span>
                    </div>
                </>
            )}
        </div>
    );
}
