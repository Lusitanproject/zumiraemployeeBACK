"use client";

import equal from "fast-deep-equal";
import { startHolyLoader } from "holy-loader";
import { Check, ChevronLeft, Redo, RefreshCcw, Undo } from "lucide-react";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { MouseEvent } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

import { compileActChapter, updateActChapter, UpdateActChapterRequest } from "@/api/acts";
import { cn } from "@/lib/utils";
import { ActChapter } from "@/types/act";
import { isMacOS } from "@/utils/is-macos";

import { moveToNext } from "../actions";

interface BookProps {
  actChapter: ActChapter;
  onClose?: () => void;
}

interface BookButton {
  disabled?: boolean;
  icon?: React.ElementType;
  label?: string;
  func?: (e: MouseEvent<HTMLButtonElement>) => void;
}

export type BookRef = {
  recompile: () => Promise<void>;
};

export const Book = forwardRef(function Book({ actChapter, onClose }: BookProps, ref) {
  const divRef = useRef<HTMLDivElement>(null);
  const savedChapter = useRef<ActChapter>(actChapter);
  const [chapter, setChapter] = useState<ActChapter>(actChapter);
  const [recompiling, setRecompiling] = useState<boolean>(false);
  const [finishing, setFinishing] = useState<boolean>(false);

  const undoStack = useRef<ActChapter[]>([]);
  const redoStack = useRef<ActChapter[]>([]);

  const debouncedUpdate = useDebouncedCallback(update, 3000);

  async function update() {
    if (equal(chapter, savedChapter.current)) return;

    const payload = { actChapterId: chapter.id, ...chapter } as UpdateActChapterRequest;

    try {
      const result = await updateActChapter(payload);
      setChapter(result);
      savedChapter.current = result;
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
    }
  }

  async function recompile() {
    setRecompiling(true);

    try {
      const result = await compileActChapter(actChapter.id);
      setChapter(result);
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
    } finally {
      setRecompiling(false);
    }
  }

  useImperativeHandle(ref, () => ({
    recompile,
  }));

  function undo() {
    if (undoStack.current.length === 0) return;
    const prev = undoStack.current.pop()!;
    redoStack.current.push(chapter);
    setChapter(prev);
    debouncedUpdate();
  }

  function redo() {
    if (redoStack.current.length === 0) return;
    const next = redoStack.current.pop()!;
    undoStack.current.push(chapter);
    setChapter(next);
    debouncedUpdate();
  }

  function handleChange(key: "compilation" | "title", value: string) {
    const lastChar = value.at(-1) ?? "";

    const isSeparator = [" ", "\n"].includes(lastChar);
    const isSameAsLast = lastChar === chapter[key]?.at(-1);

    if ((isSeparator && !isSameAsLast) || !undoStack.current.length) {
      undoStack.current.push(chapter);
    }

    redoStack.current = [];
    setChapter((prev) => ({ ...prev, [key]: value }));
    debouncedUpdate();
  }

  async function finishAct() {
    setFinishing(true);

    try {
      startHolyLoader();
      await moveToNext(actChapter.actChatbot.id);
    } catch (err) {
      if (err instanceof Error && !isRedirectError(err)) toast.error(err.message);
    } finally {
      setFinishing(false);
    }
  }

  const buttons = [
    {
      icon: Undo,
      func: undo,
      disabled: !undoStack.current.length || finishing,
    },
    {
      icon: Redo,
      func: redo,
      disabled: !redoStack.current.length || finishing,
    },
    {
      label: "Recompilar",
      icon: RefreshCcw,
      func: recompile,
      disabled: recompiling || finishing,
    },
  ] as BookButton[];

  const textInputClass = cn(
    "p-2 rounded-lg duration-200 focus:bg-background-0/40 outline-0 ring-black/15 ring-0 focus:ring-2"
  );

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isMac = isMacOS();
      const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

      const target = e.target as HTMLElement;
      const tag = target.tagName;
      const isEditable = tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable;

      if (!isEditable) return;

      if (ctrlOrCmd && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (ctrlOrCmd && e.key.toLowerCase() === "z" && e.shiftKey) {
        e.preventDefault();
        redo();
      } else if (ctrlOrCmd && e.key.toLowerCase() === "s") {
        e.preventDefault();
        update();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  useEffect(() => {
    return () => {
      update();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={divRef} className={cn("relative flex h-full left-0 top-0 duration-500 w-full")}>
      <div
        className={cn(
          "absolute flex flex-col gap-2 size-full items-center justify-start p-4 z-10 bg-background-0 overflow-scroll"
        )}
      >
        <div className="flex gap-2 text-sm">
          {buttons.map((b, i) => (
            <button
              key={i}
              className={cn(
                "flex flex-row gap-1.5 p-1 rounded-lg duration-150 font-medium items-center text-text-700",
                {
                  "opacity-30": b.disabled,
                  "hover:bg-primary-200 hover:text-white cursor-pointer": !b.disabled,
                }
              )}
              disabled={b.disabled}
              onClick={b.func}
            >
              {b.icon && <b.icon className="size-4.5" />}
              {b.label && <span>{b.label}</span>}
            </button>
          ))}
        </div>

        <div className="flex bg-[#f5f5eb] flex-col items-center justify-start gap-2 text-start w-full max-w-[40rem] rounded-xs shadow-xl py-10 px-14">
          <input
            className={cn("font-semibold text-xl field-sizing-content max-w-full", textInputClass)}
            disabled={finishing}
            value={chapter.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
          {recompiling ? (
            <span className="flex size-full text-center justify-center min-h-[60rem]">
              <span className="mt-32">Recompilando...</span>
            </span>
          ) : (
            <textarea
              className={cn(
                "flex size-full min-h-[60rem] font-normal text-base resize-y field-sizing-content text-justify",
                textInputClass
              )}
              disabled={finishing}
              value={chapter.compilation ?? ""}
              onChange={(e) => handleChange("compilation", e.target.value)}
            />
          )}
        </div>
      </div>

      {onClose && (
        <button className="absolute flex left-4 top-4 z-20">
          <ChevronLeft
            className={cn("flex flex-none size-6 text-500 cursor-pointer text-text-700")}
            onClick={onClose}
          />
        </button>
      )}

      <button
        className="absolute z-20 right-5 text-xs top-1/2 -translate-y-1/2 rounded-full p-2 bg-primary-200 cursor-pointer hover:bg-primary-300 duration-200"
        title="Finalizar capítulo"
        onClick={finishAct}
      >
        <Check className="size-8 text-text-700" />
      </button>
    </div>
  );
});
