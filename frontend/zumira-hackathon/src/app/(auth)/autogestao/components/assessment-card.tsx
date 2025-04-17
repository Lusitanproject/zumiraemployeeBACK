import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";

type AssessmentCardProps = {
  id: string;
  title: string;
  summary: string;
  completed: boolean;
};

export function AssessmentCard({ title, summary, completed }: AssessmentCardProps) {
  return (
    <AlertDialogTrigger
      className={cn("rounded-xl bg-gray-100 p-[1.375rem] flex flex-col h-[12.375rem] text-left", {
        "bg-primary-25/50 pointer-events-none": completed,
      })}
    >
      <div className="flex w-full mb-3">
        <div className="flex items-center justify-center bg-primary-50 rounded-xl w-[50px] h-[50px]">
          <User className="size-6" />
        </div>
      </div>
      <span className="w-full overflow-hidden whitespace-nowrap text-ellipsis text-base font-medium mb-3">{title}</span>
      <p className="w-full h-14 text-xs leading-[18px] text-ellipsis overflow-hidden">{summary}</p>
    </AlertDialogTrigger>
  );
}
