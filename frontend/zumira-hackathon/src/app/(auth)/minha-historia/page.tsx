import { BookOpenText } from "lucide-react";

export default function MinhaHistoria() {
  return (
    <div className="flex flex-col w-full h-2/3 justify-center items-center gap-3 text-text-600 text-center">
      <div className="flex flex-col h-full justify-center text-center max-w-[28rem] gap-8">
        <h1 className="text-3xl font-bold">MINHA HISTÓRIA</h1>
        <div className="flex flex-col gap-2 text-lg">
          <p>
            Ao final da sua jornada, você receberá um livro autobiográfico completo, incluindo a sua bioanálise feita
            pela Zumira.
          </p>
        </div>
        <div className="flex flex-row gap-10 justify-between text-text-400 mt-10 w-full">
          <div className="flex flex-col items-center text-xs gap-2 font-semibold flex-1">
            <BookOpenText className="w-10 h-10 text-text-300" />
            <span>AUTOBIOGRAFIA COMPLETA</span>
          </div>
        </div>
      </div>
    </div>
  );
}
