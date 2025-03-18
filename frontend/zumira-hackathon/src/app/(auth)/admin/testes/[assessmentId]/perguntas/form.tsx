"use client"
import { useReducer } from "react";
import { ArrowDown, ArrowUp, Copy, Trash2 } from "lucide-react";

import { AssessmentQuestion } from "./definitions";
import { Dimension } from "../../../dimensoes/definitions";
import { translateQuestions } from "./methods";
import { Header } from "./header";
import { Description } from "./components/description";
import { reducer } from "./context/reducer";
import { AssessmentSummary } from "../definitions";
import { ButtonIcon } from "./components/button-icon";
import { DimensionField } from "./components/dimension";

type ManageQuestionsFormProps = {
  questions: AssessmentQuestion[]
  dimensions: Dimension[]
  data: AssessmentSummary
}

export function ManageQuestionsForm({ data, questions, dimensions }: ManageQuestionsFormProps) {
  const translated = translateQuestions(questions)
  const [state, dispatch] = useReducer(reducer, { questions: translated })

  const sorted = state.questions.sort((a, b) => a.index - b.index)

  return (
    <div className="flex flex-col w-full">
      <Header dispatch={dispatch} title={data.title} />
      <div className="w-full flex flex-col gap-3 overflow-y-auto flex-1 py-4">
        {sorted.map((item, idx) => (
          <div key={item.key} className="w-full p-4 rounded-xl border border-gray-100 bg-gray-25">
            <div className="flex justify-between items-start">
              <span className="flex w-fit font-bold text-xs mb-3">Pergunta {idx + 1}</span>
              <div className="flex gap-x-2">
                <ButtonIcon
                  tooltip="Duplicar"
                  onClick={() => dispatch({ type: "DUPLICATE", payload: item.key })}>
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
                <ButtonIcon
                  tooltip="Excluir"
                  onClick={() => dispatch({ type: "REMOVE-QUESTION", payload: item.key })}
                >
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
                    payload: { key: item.key, value: e.target.value }
                  })
                }}
              />
              <DimensionField
                value={item.psychologicalDimensionId}
                onChange={e => {
                  dispatch({
                    type: "SET-DIMENSION",
                    payload: { key: item.key, value: e }
                  })
                }}
                options={dimensions}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
