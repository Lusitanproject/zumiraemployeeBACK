"use client";

import { ArrowUp } from "lucide-react";
import { useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface MessageInputProps {
  disabled?: boolean;
  expandOnFocus?: boolean;
  placeholder?: string;
  warning?: string;
  onSend?: (text: string) => void;
}

export function MessageInput({ placeholder, expandOnFocus, disabled, warning, onSend }: MessageInputProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showWaring, setShowWarning] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Enter: Envia a mensagem
    // Shift + Enter: Quebra uma linha

    if (event.key === "Enter") {
      event.preventDefault();
      if (event.shiftKey) {
        const textarea = event.currentTarget;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        const newValue = value.substring(0, start) + "\n" + value.substring(end);
        setValue(newValue);

        // Ajustar cursor após o state update
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 1;
          textarea.scrollTop = textarea.scrollHeight;
        }, 0);
      } else if (!disabled) {
        handleSubmit();
      }
    }
  }

  function handleSubmit() {
    if (value?.trim()) {
      onSend?.(value);
      setValue("");
    } else {
      textareaRef.current?.focus();
    }
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className={cn(
        "relative flex flex-row w-full min-h-[3.125rem] max-h-36 border-border-100 border-1 rounded-xl duration-200",
        { "focus-within:border-primary-300": !disabled, "focus-within:min-h-24": expandOnFocus }
      )}
    >
      <div className="flex size-full py-2.5">
        <textarea
          ref={textareaRef}
          className="flex w-full focus:outline-none focus:ring-transparent px-3.5 field-sizing-content resize-none text-text-800"
          name="message"
          placeholder={placeholder}
          style={{ overflowWrap: "anywhere" }}
          value={value}
          onBlur={() => setShowWarning(false)}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setShowWarning(true)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <button
        className="flex flex-none justify-center items-center w-[3.125rem] h-full bg-primary-300 cursor-pointer rounded-r-xl disabled:bg-border-100 duration-200 disabled:cursor-default"
        disabled={disabled}
        type="button"
        onClick={handleSubmit}
      >
        <ArrowUp className={cn(disabled || !value.length ? "text-gray-300" : "text-white", "duration-200")} />
      </button>
      {showWaring && <span className="absolute text-error-500 bottom-[105%] left-1 text-sm">{warning}</span>}
    </form>
  );
}
