"use client";

import equal from "fast-deep-equal";
import { startHolyLoader } from "holy-loader";
import { Bookmark, Check, ChevronLeft, Redo, RefreshCcw, Undo } from "lucide-react";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { MouseEvent } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

import { compileActChapter, updateActChapter, UpdateActChapterRequest } from "@/api/acts";
import { cn } from "@/lib/utils";
import { ActChapter } from "@/types/acts";
import { isMacOS } from "@/utils/is-macos";

import { moveToNext } from "../actions";

interface BookProps {
  actChapter: ActChapter;
  onClose: () => void;
  onChangeChapter?: (chapter: ActChapter) => void;
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
    console.log(payload.compilation);

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
    "p-2 rounded-lg duration-200 focus:bg-white/40 outline-0 ring-black/15 ring-0 focus:ring-2"
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
    <div ref={divRef} className={cn("relative flex h-full left-0 top-0 duration-500 overflow-clip w-full")}>
      <div className={cn("absolute flex flex-col gap-4 size-full items-center justify-center p-4 z-10 bg-white")}>
        <div className="flex flex-row w-full justify-between">
          <ChevronLeft className={cn("flex flex-none size-6 text-500 cursor-pointer")} onClick={onClose} />
          <div className="flex flex-row gap-2 items-center">
            <Bookmark className="text-green-500 size-6" />
            <h2 className="font-semibold text-xl">Sua história</h2>
            <div className="size-6" />
          </div>
          <div className="size-6" />
        </div>

        <div className="flex bg-amber-50 flex-col items-start justify-start gap-2 text-start max-w-[27rem] size-full max-h-[36rem] rounded-lg shadow-lg p-2">
          <input
            className={cn("font-semibold text-xl field-sizing-content max-w-full", textInputClass)}
            disabled={finishing}
            value={chapter.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
          {recompiling ? (
            <span className="flex size-full text-center justify-center items-center">Recompilando...</span>
          ) : (
            <textarea
              className={cn("flex size-full font-normal text-base resize-none scrollbar-hide", textInputClass)}
              disabled={finishing}
              value={chapter.compilation ?? ""}
              onChange={(e) => handleChange("compilation", e.target.value)}
            />
          )}
        </div>

        <div className="flex p-2 rounded-md bg-white shadow-lg gap-5 px-6 py-4 text-sm">
          {buttons.map((b, i) => (
            <button
              key={i}
              className={cn("flex flex-row gap-2 p-2 rounded-lg duration-50 font-medium", {
                "opacity-30": b.disabled,
                "hover:bg-primary-200 hover:text-white cursor-pointer": !b.disabled,
              })}
              disabled={b.disabled}
              onClick={b.func}
            >
              {b.icon && <b.icon className="size-6" />}
              {b.label && <span>{b.label}</span>}
            </button>
          ))}
        </div>

        <button
          className="absolute right-5 text-xs top-1/2 -translate-y-1/2 rounded-full p-2 bg-green-200 cursor-pointer hover:bg-green-300 duration-200"
          title="Finalizar capítulo"
          onClick={finishAct}
        >
          <Check className="size-8 text-gray-700" />
        </button>
      </div>
    </div>
  );
});
