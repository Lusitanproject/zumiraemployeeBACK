"use client";

import { useActionState, useState } from "react";

import { AssessmentDetail } from "./definitions";
import { saveAnswersAction } from "./actions/form-handler";
import { getFormAnswersData } from "./actions/util";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { redirect, RedirectType } from "next/navigation";
import ReactMarkdown from "react-markdown";

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
      <div className="flex flex-col pt-4 pb-8 border-b border-gray-200">
        <h2 className="text-2xl text-gray-700 font-medium mb-8">{data.title}</h2>
        {!!data.description && (
          <div className="text-base leading-6 text-gray-600 prose lg:prose-xl markdown">
            <ReactMarkdown>{data.description}</ReactMarkdown>
          </div>
        )}
      </div>

      <form className="w-full flex flex-col flex-1 md:pb-24" action={handleSumbit}>
        <input type="hidden" value={assessmentId} name="assessmentId" />
        {data.assessmensQuestions.map((item, index) => (
          <div id={item.id} key={item.id} className="w-full mb-4 border-b border-gray-100 pt-6 pb-8">
            <p className="font-medium text-gray-700 mb-6">
              <span
                className={`font-bold duration-500 ${
                  unanswered.includes(item.id) ? "text-error-500" : "text-gray-700"
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
                    <div className="flex items-center gap-x-3" key={choice.id}>
                      <RadioGroupItem value={`${choice.id}`} id={choice.id} />
                      <label htmlFor={choice.id}>{choice.label}</label>
                    </div>
                  ))}
              </RadioGroup>
            </div>
          </div>
        ))}
        <div className="md:border-t border-gray-100 md:absolute md:left-0 md:right-0 md:bottom-0 py-4 md:px-16 md:bg-gray-50 flex items-center md:justify-start gap-x-3">
          <Button
            size="xl"
            variant="outline"
            type="button"
            onClick={() => redirect("/autoconhecimento", RedirectType.replace)}
          >
            Cancelar
          </Button>
          <Button size="xl" variant="primary" type="submit" disabled={pending}>
            Enviar respostas
          </Button>
        </div>
      </form>
    </div>
  );
}
