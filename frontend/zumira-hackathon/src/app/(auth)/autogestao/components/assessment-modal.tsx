import { ReactNode, useCallback } from "react";
import { ChevronRight, SquareX, User } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { isAfter, subYears } from "date-fns";
import { redirect } from "next/navigation";

export type AssessmentModalProps = {
  id: string;
  title: string;
  summary: string;
  lastCompleted: Date | null;
  children: ReactNode;
};

export function AssessmentModal({ id, title, summary, lastCompleted, children }: AssessmentModalProps) {
  const unavailable = lastCompleted !== null && isAfter(new Date(lastCompleted), subYears(new Date(), 1));

  const handleOpenAssessment = useCallback(() => {
    redirect(`/autogestao/teste/${id}`);
  }, [id]);

  if (unavailable) {
    <AlertDialog>
      {children}
      <AlertDialogContent>
        <AlertDialogHeader className="relative pt-16">
          <div className="absolute -top-[84px] w-[8.25rem] h-[8.25rem] bg-primary-50 left-1/2 -translate-x-1/2 shadow-xl rounded-4xl flex items-center justify-center">
            <User className="size-16" />
          </div>
          <AlertDialogCancel className="w-8 h-8 absolute flex items-center justify-center border-0">
            <SquareX className="size-6 text-gray-400" />
          </AlertDialogCancel>
          <AlertDialogTitle className="text-4xl font-semibold text-gray-700 text-center mb-2">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-sm leading-5 text-center text-gray-700 mb-8">
            {summary}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="!justify-center">
          <Button variant="primary" size="lg" className="w-full" onClick={handleOpenAssessment}>
            <span>Iniciar</span>
            <ChevronRight className="size-5" />
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>;
  }

  return (
    <AlertDialog>
      {children}
      <AlertDialogContent>
        <AlertDialogHeader className="relative pt-16">
          <div className="absolute -top-[84px] w-[8.25rem] h-[8.25rem] bg-primary-50 left-1/2 -translate-x-1/2 shadow-xl rounded-4xl flex items-center justify-center">
            <User className="size-16" />
          </div>
          <div className="flex flex-row">
            <AlertDialogCancel className="w-8 h-8 flex items-center justify-center border-0">
              <SquareX className="size-6 text-gray-400" />
            </AlertDialogCancel>
            <AlertDialogTitle className="text-4xl font-semibold text-gray-700 text-center mb-2">
              {title}
            </AlertDialogTitle>
            <div className="size-8 flex-none" />
          </div>
          <AlertDialogDescription className="text-sm leading-5 text-center text-gray-700 mb-8">
            {summary}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="!justify-center">
          <Button variant="primary" size="lg" className="w-full" onClick={handleOpenAssessment}>
            <span>Iniciar</span>
            <ChevronRight className="size-5" />
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
