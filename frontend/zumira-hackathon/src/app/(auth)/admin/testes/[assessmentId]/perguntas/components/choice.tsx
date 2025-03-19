"use client";

import { ActionDispatch } from "react";
import { ManageQuestionAction } from "../context/types";
import { ManageQuestion } from "../definitions";
import { Label } from "@/components/custom/label";
import { CirclePlus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ButtonIcon } from "./button-icon";

interface ChoiceFieldProps {
  question: ManageQuestion;
  dispatch: ActionDispatch<[action: ManageQuestionAction]>;
}

export function ChoiceField({ question, dispatch }: ChoiceFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row w-full justify-between items-center">
        <Label htmlFor="choices">Opções</Label>
        <ButtonIcon
          tooltip="Nova opção"
          onClick={() => {
            dispatch({
              type: "ADD-CHOICE",
              payload: {
                questionKey: question.key,
              },
            });
          }}
        >
          <CirclePlus className="size-5 text-gray-300" />
        </ButtonIcon>
      </div>
      <div id="choices" className="flex flex-col gap-2 items-center">
        {question.assessmentQuestionChoices.map((c, i) => (
          <div key={c.key} className="flex flex-col items-start gap-1 w-full">
            <span className="flex w-fit font-bold text-xs text-gray-700">Opção {i + 1}</span>
            <div className="flex flex-row gap-2 w-full items-center">
              <Input
                type="text"
                defaultValue={c.label}
                placeholder="Texto"
                onChange={(e) =>
                  dispatch({
                    type: "SET-CHOICE-LABEL",
                    payload: {
                      questionKey: question.key,
                      choiceKey: c.key,
                      value: e.target.value,
                    },
                  })
                }
              />
              <div className="flex w-24">
                <Input
                  type="number"
                  defaultValue={c.value}
                  placeholder="Valor"
                  onChange={(e) =>
                    dispatch({
                      type: "SET-CHOICE-VALUE",
                      payload: {
                        questionKey: question.key,
                        choiceKey: c.key,
                        value: Number(e.target.value),
                      },
                    })
                  }
                />
              </div>
              <div>
                <ButtonIcon
                  tooltip="Excluir opção"
                  onClick={() =>
                    dispatch({
                      type: "REMOVE-CHOICE",
                      payload: {
                        questionKey: question.key,
                        choiceKey: c.key,
                      },
                    })
                  }
                >
                  <Trash2 className="size-5 text-error-600" />
                </ButtonIcon>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
