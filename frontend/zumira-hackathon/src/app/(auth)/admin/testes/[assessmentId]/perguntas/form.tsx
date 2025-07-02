"use client";
import { ArrowDown, ArrowUp, Copy, Trash2 } from "lucide-react";
import { useCallback, useEffect, useReducer, useState } from "react";

import { Button } from "@/components/ui/button";

import { Dimension } from "../../../dimensoes/definitions";
import { Header } from "../components/header";
import { AssessmentSummary } from "../definitions";
import { updateAssessmentQuestions } from "./actions";
import { ButtonIcon } from "./components/button-icon";
import { ChoiceField } from "./components/choice";
import { Description } from "./components/description";
import { DimensionField } from "./components/dimension";
import { reducer } from "./context/reducer";
import { AssessmentQuestion, ManageQuestionSchema } from "./definitions";
import { translateQuestions } from "./methods";

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
  }, [state, data]);

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
      <Header
        addItemButtonText="Cadastrar nova pergunta"
        title="Editar perguntas"
        onAddItem={() => dispatch({ type: "ADD-QUESTION" })}
      />
      <div className="w-full flex flex-col gap-3 overflow-y-auto flex-1 py-4">
        {sorted.map((item, idx) => (
          <div
            key={item.key}
            className={`w-full p-4 rounded-xl border bg-background-25 duration-500 ${
              invalidQuestions.includes(item.key) ? "border-error-500" : "border-border-100"
            }`}
            id={item.key}
          >
            <div className="flex justify-between items-start">
              <span className="flex w-fit font-bold text-xs mb-3 text-text-700">Pergunta {idx + 1}</span>
              <div className="flex gap-x-2">
                <ButtonIcon tooltip="Duplicar" onClick={() => dispatch({ type: "DUPLICATE", payload: item.key })}>
                  <Copy className="size-5 text-text-600" />
                </ButtonIcon>
                <ButtonIcon
                  disabled={item.index === 0}
                  tooltip="Mover para cima"
                  onClick={() => dispatch({ type: "MOVE-QUESTION-UP", payload: item.key })}
                >
                  <ArrowUp className="size-5" />
                </ButtonIcon>
                <ButtonIcon
                  disabled={item.index === sorted.length - 1}
                  tooltip="Mover para baixo"
                  onClick={() => dispatch({ type: "MOVE-QUESTION-DOWN", payload: item.key })}
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
                options={dimensions}
                value={item.psychologicalDimensionId}
                onChange={(e) => {
                  dispatch({
                    type: "SET-DIMENSION",
                    payload: { key: item.key, value: e },
                  });
                }}
              />
              <ChoiceField dispatch={dispatch} question={item} />
            </div>
          </div>
        ))}
      </div>
      <div className="border-border-100 py-4 flex items-center gap-x-3">
        <span className="text-error-500">{error}</span>
        <Button disabled={loading} loading={loading} size="xl" variant="primary" onClick={handleUpdateQuestions}>
          Salvar perguntas
        </Button>
      </div>
    </div>
  );
}
