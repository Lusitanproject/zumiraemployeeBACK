"use client";
import { useCallback, useEffect, useReducer, useState } from "react";
import { ArrowDown, ArrowUp, Copy, Trash2 } from "lucide-react";

import { AssessmentQuestion, ManageQuestionSchema } from "./definitions";
import { Dimension } from "../../../dimensoes/definitions";
import { translateQuestions } from "./methods";
import { Header } from "./header";
import { Description } from "./components/description";
import { reducer } from "./context/reducer";
import { AssessmentSummary } from "../definitions";
import { ButtonIcon } from "./components/button-icon";
import { DimensionField } from "./components/dimension";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { ChoiceField } from "./components/choice";
import { updateAssessmentQuestions } from "./actions";

type ManageQuestionsFormProps = {
  questions: AssessmentQuestion[];
  dimensions: Dimension[];
  data: AssessmentSummary;
};

export function ManageQuestionsForm({ data, questions, dimensions }: ManageQuestionsFormProps) {
  const translated = translateQuestions(questions);
  const [state, dispatch] = useReducer(reducer, { questions: translated });
  const [invalidQuestions, setInvalidQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const sorted = state.questions.sort((a, b) => a.index - b.index);

  const handleCancel = useCallback(() => {
    redirect(`/admin/testes/${data.id}`);
  }, []);

  const handleUpdateQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);

    const invalid = [] as string[];
    for (const question of state.questions) {
      const { success } = ManageQuestionSchema.safeParse(question);

      if (!success) {
        if (!invalid.length) {
          document.getElementById(question.key)?.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        invalid.push(question.key);
      }
    }

    setInvalidQuestions(invalid);

    if (!invalid.length) {
      const response = await updateAssessmentQuestions(data.id, state.questions);
      if (response.status === "ERROR") setError(response.message);
    }

    setLoading(false);
  }, [state]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div className="flex flex-col w-full">
      <Header dispatch={dispatch} title={data.title} />
      <div className="w-full flex flex-col gap-3 overflow-y-auto flex-1 pt-4 pb-20">
        {sorted.map((item, idx) => (
          <div
            id={item.key}
            key={item.key}
            className={`w-full p-4 rounded-xl border bg-gray-25 duration-500 ${
              invalidQuestions.includes(item.key) ? "border-error-500" : "border-gray-100"
            }`}
          >
            <div className="flex justify-between items-start">
              <span className="flex w-fit font-bold text-xs mb-3">Pergunta {idx + 1}</span>
              <div className="flex gap-x-2">
                <ButtonIcon tooltip="Duplicar" onClick={() => dispatch({ type: "DUPLICATE", payload: item.key })}>
                  <Copy className="size-5 text-gray-600" />
                </ButtonIcon>
                <ButtonIcon
                  tooltip="Mover para cima"
                  onClick={() => dispatch({ type: "MOVE-QUESTION-UP", payload: item.key })}
                  disabled={item.index === 0}
                >
                  <ArrowUp className="size-5" />
                </ButtonIcon>
                <ButtonIcon
                  tooltip="Mover para baixo"
                  onClick={() => dispatch({ type: "MOVE-QUESTION-DOWN", payload: item.key })}
                  disabled={item.index === sorted.length - 1}
                >
                  <ArrowDown className="size-5" />
                </ButtonIcon>
                <ButtonIcon tooltip="Excluir" onClick={() => dispatch({ type: "REMOVE-QUESTION", payload: item.key })}>
                  <Trash2 className="size-5 text-error-600" />
                </ButtonIcon>
              </div>
            </div>
            <div className="flex flex-col gap-y-3">
              <Description
                value={item.description}
                onChange={(e) => {
                  dispatch({
                    type: "SET-DESCRIPTION",
                    payload: { key: item.key, value: e.target.value },
                  });
                }}
              />
              <DimensionField
                value={item.psychologicalDimensionId}
                onChange={(e) => {
                  dispatch({
                    type: "SET-DIMENSION",
                    payload: { key: item.key, value: e },
                  });
                }}
                options={dimensions}
              />
              <ChoiceField dispatch={dispatch} question={item} />
            </div>
          </div>
        ))}
      </div>
      <div className="md:border-t border-gray-100 md:absolute md:left-0 md:right-0 md:bottom-0 py-4 md:px-16 md:bg-gray-50 flex items-center md:justify-end gap-x-3">
        <Button size="xl" variant="outline" onClick={handleCancel}>
          Cancelar
        </Button>
        <Button size="xl" variant="primary" onClick={handleUpdateQuestions} disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </div>
  );
}
