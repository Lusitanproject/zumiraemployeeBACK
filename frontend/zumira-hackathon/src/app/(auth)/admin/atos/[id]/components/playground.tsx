"use client";

import { diff } from "just-diff";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { getActChapter, newActChapter } from "@/api/acts";
import { ActChapter, ActChatbot } from "@/types/act";

import { ManageActChatbot } from "../definitions";
import { ActChatbotForm } from "../form";
import { ActChat } from "@/components/ui/act-chat/act-chat";

interface PlaygroundProps {
  data: ActChatbot | null;
}

export function Playground({ data }: PlaygroundProps) {
  const [saveWarning, setSaveWarning] = useState<string | undefined>();
  const [chapter, setChapter] = useState<ActChapter>();

  const newChapter = useCallback(async () => {
    if (!data) return;
    try {
      const response = await newActChapter(data.id, "ADMIN_TEST");
      const chapter = await getActChapter(response.id);
      setChapter(chapter);
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
    }
  }, [data]);

  useEffect(() => {
    newChapter();
  }, [newChapter]);

  function handleFormChange(formData: ManageActChatbot, storedData: ActChatbot | null) {
    if (storedData) {
      const differences = diff(formData, storedData);
      if (differences.some((d) => d.path.some((p) => p === "messageInstructions"))) {
        setSaveWarning("Salve as alterações para atualizar as instruções do chatbot");
        return;
      }
    }

    setSaveWarning(undefined);
  }

  return (
    <div className="flex md:flex-row flex-col size-full gap-4 overflow-y-scroll px-2">
      <div className="flex size-full">
        <ActChatbotForm data={data} onChange={handleFormChange} />
      </div>
      <div className="flex size-full py-4">
        {data ? (
          <div className="flex flex-col size-full">
            <div className="flex flex-col border-1 border-border-200 rounded-xl w-full md:h-full h-[30rem]">
              <ActChat actChapter={chapter} inputWarning={saveWarning} />
            </div>
            <div className="flex w-full justify-center p-2 font-medium text-text-400">
              <button
                className="flex flex-row items-center gap-1 rounded-lg hover:bg-black/5 px-2.5 py-1 cursor-pointer"
                onClick={newChapter}
              >
                <Plus className="size-4" />
                <span className="text-sm">Nova conversa</span>
              </button>
            </div>
          </div>
        ) : (
          <span className="flex size-full text-center items-center text-text-500 justify-center">
            Preencha e salve as informações para começar a testar
          </span>
        )}
      </div>
    </div>
  );
}
