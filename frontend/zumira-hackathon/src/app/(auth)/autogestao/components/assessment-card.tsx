"use client";

import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { AssessmentModal } from "./assessment-modal";
import { useState } from "react";
import { redirect, RedirectType } from "next/navigation";

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
    redirect(`/autogestao/teste/${id}/devolutiva`, RedirectType.push);
  }

  return (
    <div
      onClick={completed ? goToFeedback : toggleModal}
      className={cn("rounded-xl bg-gray-100 p-[1.375rem] flex flex-col h-[12.375rem] text-left cursor-pointer", {
        "bg-primary-25/50": completed,
      })}
    >
      <div className="flex w-full mb-3">
        <div className="flex items-center justify-center bg-primary-50 rounded-xl w-[50px] h-[50px]">
          <User className="size-6" />
        </div>
      </div>
      <span className="w-full overflow-hidden whitespace-nowrap text-ellipsis text-base font-medium mb-3">{title}</span>
      <p className="w-full h-14 text-xs leading-[18px] text-ellipsis overflow-hidden">{summary}</p>
      <AssessmentModal key={id} id={id} title={title} summary={summary} onClose={toggleModal} open={isModalOpen} />
    </div>
  );
}
