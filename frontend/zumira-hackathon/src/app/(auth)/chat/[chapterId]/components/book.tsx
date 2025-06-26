"use client";

import { Bookmark, Edit, LogOut, Redo, RefreshCcw, Save, Undo, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MouseEvent } from "react";
import { toast } from "sonner";

import { compileActChapter, updateActChapter, UpdateActChapterRequest } from "@/api/acts";
import { cn } from "@/lib/utils";
import { ActChapter } from "@/types/acts";
import { isMacOS } from "@/utils/is-macos";
import { useDebounce, useDebouncedCallback } from "use-debounce";

interface BookProps {
  actChapter: ActChapter;
  state: "closed" | "open" | "expanded";
  onExpand: () => void;
}

interface BookButton {
  disabled?: boolean;
  icon?: React.ElementType;
  label?: string;
  func?: (e: MouseEvent<HTMLButtonElement>) => void;
}

export function Book({ actChapter, state, onExpand }: BookProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [chapter, setChapter] = useState<ActChapter>(actChapter);
  const [recompiling, setRecompiling] = useState<boolean>(false);

  const undoStack = useRef<ActChapter[]>([]);
  const redoStack = useRef<ActChapter[]>([]);

  const debouncedUpdate = useDebouncedCallback(update, 3000);

  async function update() {
    const payload = { actChapterId: chapter.id, ...chapter } as UpdateActChapterRequest;
    console.log(payload.compilation);

    try {
      const result = await updateActChapter(payload);
      setChapter(result);
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

  function undo() {
    if (undoStack.current.length === 0) return;
    const prev = undoStack.current.pop()!;
    redoStack.current.push(chapter);
    setChapter(prev);
  }

  function redo() {
    if (redoStack.current.length === 0) return;
    const next = redoStack.current.pop()!;
    undoStack.current.push(chapter);
    setChapter(next);
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

  const buttons = [
    {
      icon: Undo,
      func: undo,
      disabled: !undoStack.current.length,
    },
    {
      icon: Redo,
      func: redo,
      disabled: !redoStack.current.length,
    },
    {
      label: "Recompilar",
      icon: RefreshCcw,
      func: recompile,
    },
  ] as BookButton[];

  const textInputClass = cn(
    "p-2 rounded-lg duration-200 focus:bg-white/40 outline-0 ring-black/15 ring-0 focus:ring-2"
  );

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
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
        if (redoStack.current.length) {
          update();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [chapter]);

  useEffect(() => {
    return () => {
      update();
    };
  }, []);

  return (
    <div
      ref={divRef}
      className={cn("relative flex h-full left-0 top-0 duration-500 overflow-clip w-full", {
        "w-0": state === "closed",
      })}
    >
      <div
        className={cn(
          "absolute flex flex-col gap-4 size-full items-center justify-center border-l-5 border-gray-200 p-4 duration-500 z-10 bg-white",
          { "border-0": state === "expanded" }
        )}
      >
        <div className="flex flex-row w-full justify-between">
          <LogOut
            className={cn(
              "flex flex-none size-6 text-500 cursor-pointer",
              state === "open" ? "rotate-180" : "rotate-0"
            )}
            onClick={onExpand}
          />
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
            value={chapter.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
          {recompiling ? (
            <span className="flex size-full text-center justify-center items-center">Recompilando...</span>
          ) : (
            <textarea
              className={cn("flex size-full font-normal text-base resize-none", textInputClass)}
              value={chapter.compilation}
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
      </div>
    </div>
  );
}
