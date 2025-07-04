import { CirclePlus } from "lucide-react";

type HeaderProps = {
  title: string;
  addItemButtonText?: string;
  onAddItem?: () => void;
};

export function Header({ title, addItemButtonText, onAddItem }: HeaderProps) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex flex-col">
        <h3 className="font-bold text-2xl text-text-700">{title}</h3>
      </div>
      {addItemButtonText && (
        <button
          className="bg-background-0 hover:bg-background-50 border border-transparent hover:border-border-100 flex items-center gap-x-3 px-3 py-2 rounded-xl"
          onClick={onAddItem}
        >
          <CirclePlus className="text-text-300 size-6" />
          <span className="text-sm text-text-500 font-medium">{addItemButtonText}</span>
        </button>
      )}
    </div>
  );
}
