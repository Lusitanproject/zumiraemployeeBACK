"use client";

import { redirect, RedirectType } from "next/navigation";
import { useActionState, useState } from "react";
import ReactMarkdown from "react-markdown";

import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { saveAnswersAction } from "./actions/form-handler";
import { getFormAnswersData } from "./actions/util";
import { AssessmentDetail } from "./definitions";

type AssessmentFormProps = {
  data: AssessmentDetail;
  assessmentId: string;
};

export function AssessmentForm({ assessmentId, data }: AssessmentFormProps) {
  const [, action, pending] = useActionState(saveAnswersAction, undefined);
  const [unanswered, setUnanswered] = useState<string[]>([]);

  async function handleSumbit(formData: FormData) {
    const { answers } = getFormAnswersData(formData);

    const unanswered = data.assessmensQuestions
      .filter((q) => !answers.some((a) => a.assessmentQuestionId === q.id))
      .map((q) => q.id);

    setUnanswered(unanswered);
    if (unanswered.length) {
      document.getElementById(unanswered[0])?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    action(formData);
  }

  return (
    <div className="w-full flex flex-col overflow-scroll">
      <div className="flex flex-col pt-4 pb-8 border-b border-border-200">
        <h2 className="text-2xl text-text-700 font-medium mb-8">{data.title}</h2>
        {!!data.description && (
          <div className="text-base leading-6 text-text-600 prose lg:prose-xl markdown">
            <ReactMarkdown>{data.description}</ReactMarkdown>
          </div>
        )}
      </div>

      <form action={handleSumbit} className="w-full flex flex-col flex-1 md:pb-24">
        <input name="assessmentId" type="hidden" value={assessmentId} />
        {data.assessmensQuestions.map((item, index) => (
          <div key={item.id} className="w-full mb-4 border-b border-border-100 pt-6 pb-8" id={item.id}>
            <p className="font-medium text-text-700 mb-6">
              <span
                className={`font-bold duration-500 ${
                  unanswered.includes(item.id) ? "text-error-500" : "text-text-700"
                }`}
              >
                {index + 1}.
              </span>
              {" " + item.description}
            </p>
            <div className="flex flex-col pl-4">
              <RadioGroup name={item.id}>
                {item.assessmentQuestionChoices
                  ?.sort((a, b) => a.index - b.index)
                  .map((choice) => (
                    <div key={choice.id} className="flex items-center gap-x-3">
                      <RadioGroupItem id={choice.id} value={`${choice.id}`} />
                      <label className="text-text-700" htmlFor={choice.id}>
                        {choice.label}
                      </label>
                    </div>
                  ))}
              </RadioGroup>
            </div>
          </div>
        ))}
        <div className="md:border-t border-border-100 md:absolute md:left-0 md:right-0 md:bottom-0 py-4 md:px-16 md:bg-background-50 flex items-center md:justify-start gap-x-3">
          <Button
            size="xl"
            type="button"
            variant="outline"
            onClick={() => redirect("/autoconhecimento", RedirectType.replace)}
          >
            Cancelar
          </Button>
          <Button disabled={pending} size="xl" type="submit" variant="primary">
            Enviar respostas
          </Button>
        </div>
      </form>
    </div>
  );
}
