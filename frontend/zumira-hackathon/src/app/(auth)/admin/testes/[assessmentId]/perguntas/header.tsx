import { CirclePlus } from "lucide-react";
import { ActionDispatch } from "react";
import { ManageQuestionAction } from "./context/types";

type HeaderProps = {
  title: string;
  dispatch: ActionDispatch<[action: ManageQuestionAction]>;
};

export function Header({ dispatch, title }: HeaderProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100">
      <div className="flex flex-col">
        <span className="texgt-xs text-gray-400">{title}</span>
        <h3 className="font-bold text-2xl text-gray-700">Editar Perguntas</h3>
      </div>
      <button
        onClick={() => dispatch({ type: "ADD-QUESTION" })}
        className="bg-white hover:bg-gray-50 border border-transparent hover:border-gray-100 flex items-center gap-x-3 px-3 py-2 rounded-xl"
      >
        <CirclePlus className="text-gray-300 size-6" />
        <span className="text-sm text-gray-500 font-medium">Cadastrar nova pergunta</span>
      </button>
    </div>
  );
}
