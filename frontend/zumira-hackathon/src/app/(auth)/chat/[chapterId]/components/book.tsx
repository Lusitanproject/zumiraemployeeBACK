"use client";

import { Bookmark, Edit, LogOut, RefreshCcw, Save, X } from "lucide-react";
import { useRef, useState } from "react";
import { MouseEvent } from "react";
import { toast } from "sonner";

import { compileActChapter, updateActChapter, UpdateActChapterRequest } from "@/api/acts";
import { cn } from "@/lib/utils";
import { ActChapter } from "@/types/acts";

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
  const [editMode, setEditMode] = useState<boolean>(false);

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

  const buttons = [
    {
      label: "Recompilar",
      icon: RefreshCcw,
      func: recompile,
    },
    {
      disabled: recompiling,
      label: "Editar",
      icon: Edit,
      func: () => setEditMode(true),
    },
  ] as BookButton[];

  const editModeButtons = [
    {
      label: "Cancelar",
      icon: X,
      func: () => setEditMode(false),
    },
    {
      label: "Salvar",
      icon: Save,
      func: async () => {
        await update();
        setEditMode(false);
      },
    },
  ] as BookButton[];

  const textInputClass = cn(
    "p-2 rounded-lg duration-200 focus:bg-white/40 outline-0 ring-black/15",
    editMode ? "ring-2" : "ring-0"
  );

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
            disabled={!editMode}
            value={chapter.title}
            onChange={(e) => setChapter((prev) => ({ ...prev, title: e.target.value }))}
          />
          {recompiling ? (
            <span className="flex size-full text-center justify-center items-center">Recompilando...</span>
          ) : (
            <textarea
              className={cn("flex size-full font-normal text-base resize-none", textInputClass)}
              disabled={!editMode}
              value={chapter.compilation}
              onChange={(e) =>
                setChapter((prev) => {
                  return { ...prev, compilation: e.target.value };
                })
              }
            />
          )}
        </div>

        <div className="flex p-2 rounded-md bg-white shadow-lg gap-5 px-6 py-4 text-sm">
          {(editMode ? editModeButtons : buttons).map((b, i) => (
            <button
              key={i}
              className={cn("flex flex-row gap-2 p-2 rounded-lg duration-50 font-medium", {
                "opacity-20": b.disabled,
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
