"use client";

import { User } from "lucide-react";
import { redirect, RedirectType } from "next/navigation";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { AssessmentModal } from "./assessment-modal";

type AssessmentCardProps = {
  id: string;
  title: string;
  summary: string;
  completed: boolean;
};

export function AssessmentCard({ id, title, summary, completed }: AssessmentCardProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  function toggleModal() {
    setIsModalOpen((prev) => !prev);
  }

  function goToFeedback() {
    redirect(`/autoconhecimento/teste/${id}/devolutiva`, RedirectType.push);
  }

  return (
    <div
      className={cn(
        "rounded-xl bg-gray-100 hover:bg-gray-200 p-[1.375rem] flex flex-col h-[12.375rem] text-left cursor-pointer",
        {
          "bg-primary-25/50 hover:bg-primary-25/70": completed,
        }
      )}
      onClick={completed ? goToFeedback : toggleModal}
    >
      <div className="flex w-full mb-3">
        <div className="flex items-center justify-center bg-primary-50 rounded-xl w-[50px] h-[50px]">
          <User className="size-6" />
        </div>
      </div>
      <span className="w-full overflow-hidden whitespace-nowrap text-ellipsis text-base font-medium mb-3">{title}</span>
      <p className="w-full h-14 text-xs leading-[18px] text-ellipsis overflow-hidden">{summary}</p>
      <AssessmentModal key={id} id={id} open={isModalOpen} summary={summary} title={title} onClose={toggleModal} />
    </div>
  );
}
