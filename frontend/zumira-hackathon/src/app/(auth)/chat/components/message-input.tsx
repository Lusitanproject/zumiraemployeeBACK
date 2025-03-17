"use client";

import { Send } from "lucide-react";
import { useRef } from "react";

interface MessageInputProps {
    disabled?: boolean;
    action?: (formData: FormData) => void;
}

export function MessageInput({ disabled, action }: MessageInputProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
        // Enter: Envia a mensagem
        // Shift + Enter: Quebra uma linha

        if (event.key === "Enter") {
            event.preventDefault();
            if (event.shiftKey) {
                const textarea = event.currentTarget;
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;

                textarea.value = textarea.value.substring(0, start) + "\n" + textarea.value.substring(end);
                textarea.selectionStart = textarea.selectionEnd = start + 1;
                textarea.scrollTop = textarea.scrollHeight;
            } else if (!disabled) {
                formRef.current?.requestSubmit();
            }
        }
    }

    function innerAction(formData: FormData) {
        action?.(formData);
        if (textareaRef.current && !disabled) {
            textareaRef.current.value = "";
        }
    }

    return (
        <form
            ref={formRef}
            className="flex flex-row w-full min-h-[3.125rem] max-h-32 border-gray-300 border-1 rounded-xl overflow-clip mb-4"
            action={innerAction}
        >
            <div className="flex size-full py-2.5">
                <textarea
                    ref={textareaRef}
                    className="flex w-full focus:outline-none focus:ring-transparent px-3.5 field-sizing-content resize-none"
                    style={{ overflowWrap: "anywhere" }}
                    placeholder="Digite como você está se sentindo"
                    name="message"
                    onKeyDown={handleKeyDown}
                />
            </div>
            <button
                className="flex flex-none justify-center items-center w-[3.125rem] h-full bg-primary-300 cursor-pointer"
                disabled={disabled}
            >
                <Send className="text-white" type="submit" />
            </button>
        </form>
    );
}
