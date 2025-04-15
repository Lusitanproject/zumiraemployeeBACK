"use client";

import React, { ReactNode, useEffect, useRef, useState } from "react";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import { Bold, Italic, List, ListOrdered, Minus, Type, UnderlineIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Underline from "@tiptap/extension-underline";
import { Divider } from "../custom/divider";
import TurndownService from "turndown";
import { useDebouncedCallback } from "use-debounce";
import { marked } from "marked";

interface RichTextAreaProps {
  id?: string;
  value?: string;
  onChange: (value: string) => void;
}

interface OverflowButton {
  editor: Editor | null;
  icon: React.ElementType;
  children?: ReactNode;
}

interface EditorButtonProps {
  highlight?: boolean;
  icon: React.ElementType;
  onClick?: () => void;
}

function EditorButton({ highlight, icon: Icon, onClick }: EditorButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(highlight ? "text-gray-700" : "text-gray-400", "cursor-pointer hover:text-gray-500")}
    >
      <Icon className="size-4.5" />
    </button>
  );
}

function CollapsedContent({ editor, icon: Icon, children }: OverflowButton) {
  const [open, setOpen] = useState<boolean>(false);
  const divRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isTitle = editor?.isActive("heading");

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        divRef.current &&
        buttonRef.current &&
        !divRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [divRef]);

  return (
    <div className={`flex flex-row h-full duration-200 ${open ? "gap-2" : "gap-0"}`}>
      <button
        ref={buttonRef}
        className={cn(open || isTitle ? "text-gray-700" : "text-gray-400", "cursor-pointer")}
        onClick={() => setOpen((prev) => !prev)}
      >
        <Icon className="size-4.5" />
      </button>
      <div
        className="relative h-full overflow-clip duration-200 bg-black/5 rounded-md"
        style={{ width: open && divRef.current ? divRef.current.offsetWidth : 0 }}
      >
        <div
          ref={divRef}
          className="absolute -translate-y-1/2 top-1/2 left-0 flex gap-2 flex-row justify-center items-center px-2"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function RichTextArea({ id, value, onChange }: RichTextAreaProps) {
  const debounced = useDebouncedCallback((html) => {
    const turndownService = new TurndownService();
    onChange(turndownService.turndown(html));
  }, 500);

  const editor = useEditor({
    extensions: [StarterKit, Highlight, Typography, Underline, HorizontalRule],
    content: marked(value ?? ""),
    onUpdate({ editor }) {
      const html = editor.getHTML();
      debounced(html);
    },
    immediatelyRender: false,
  });

  return (
    <div
      id={id}
      className="relative overflow-clip w-full flex flex-col rounded-xl border border-gray-300 bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground focus-within:border-primary-300 focus-within:shadow-focus-ring aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
    >
      <div className="flex flex-row items-center p-2 gap-2 bg-gray-100 h-10 border-b border-gray-300">
        <EditorButton
          onClick={() => editor?.chain().focus().toggleBold().run()}
          highlight={editor?.isActive("bold")}
          icon={Bold}
        />
        <EditorButton
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          highlight={editor?.isActive("italic")}
          icon={Italic}
        />
        <EditorButton
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          highlight={editor?.isActive("underline")}
          icon={UnderlineIcon}
        />
        <Divider />
        <EditorButton
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          highlight={editor?.isActive("bulletList")}
          icon={List}
        />
        <EditorButton
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          highlight={editor?.isActive("orderedList")}
          icon={ListOrdered}
        />
        <Divider />
        <CollapsedContent editor={editor} icon={Type}>
          <EditorButton
            onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
            highlight={editor?.isActive("heading", { level: 1 })}
            icon={() => <span className="font-semibold text-center size-4.5">H1</span>}
          />
          <EditorButton
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            highlight={editor?.isActive("heading", { level: 2 })}
            icon={() => <span className="font-semibold text-center size-4.5">H2</span>}
          />
          <EditorButton
            onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
            highlight={editor?.isActive("heading", { level: 3 })}
            icon={() => <span className="font-semibold text-center size-4.5">H3</span>}
          />
        </CollapsedContent>
        <Divider />
        <EditorButton onClick={() => editor?.chain().focus().setHorizontalRule().run()} icon={Minus} />
      </div>
      <EditorContent editor={editor} className="prose markdown w-full focus:outline-none min-h-40" />
    </div>
  );
}
