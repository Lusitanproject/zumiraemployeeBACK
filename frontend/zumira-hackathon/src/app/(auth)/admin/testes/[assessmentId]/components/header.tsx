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
        <h3 className="font-bold text-2xl text-gray-700">{title}</h3>
      </div>
      {addItemButtonText && (
        <button
          onClick={onAddItem}
          className="bg-white hover:bg-gray-50 border border-transparent hover:border-gray-100 flex items-center gap-x-3 px-3 py-2 rounded-xl"
        >
          <CirclePlus className="text-gray-300 size-6" />
          <span className="text-sm text-gray-500 font-medium">{addItemButtonText}</span>
        </button>
      )}
    </div>
  );
}
