import { CircleMinus, CirclePlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

export interface MultiSelectItem {
  label: string;
  value: string;
}

export interface CreateMultiSelectItem extends MultiSelectItem {
  selected?: boolean;
}

interface MultiSelectProps {
  items: CreateMultiSelectItem[];
  onChangeSelection?: (items: MultiSelectItem[]) => void;
}

export function MultiSelect({ items, onChangeSelection }: MultiSelectProps) {
  const [selectedItems, setSelectedItems] = useState<MultiSelectItem[]>(items.filter((item) => item.selected));
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalInput, setModalInput] = useState<string>("");

  const modalRef = useRef<HTMLDivElement>(null);
  const selectedListRef = useRef<HTMLDivElement>(null);

  const addeableItems = items
    .filter((item) => !selectedItems.find((selected) => selected.value === item.value))
    .sort((a, b) => a.label.localeCompare(b.label));

  function scrollToBottom() {
    if (selectedListRef.current) {
      selectedListRef.current.scrollTo({
        top: selectedListRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }

  useEffect(() => {
    if (!showModal) return;
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowModal(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  function addItem(value: string) {
    setSelectedItems((prev) => {
      const updated = [...prev];
      const selectedItem = items.find((item) => item.value === value);
      if (selectedItem && !prev.find((item) => item.value === value)) updated.push(selectedItem);
      return updated;
    });
    setTimeout(scrollToBottom, 0);
  }

  function removeItem(value: string) {
    setSelectedItems((prev) => prev.filter((item) => item.value !== value));
  }

  useEffect(() => {
    onChangeSelection?.(selectedItems);
  }, [selectedItems, onChangeSelection]);

  return (
    <div className={cn("flex flex-col relative gap-1 max-h-72")}>
      <div ref={selectedListRef} className="flex flex-col gap-1 overflow-y-scroll rounded-xl">
        {selectedItems.map((item) => (
          <div
            key={item.value}
            className="w-full px-4 py-3 flex flex-row justify-between items-center text-text-600 bg-background-100 rounded-lg"
          >
            <span>{item.label}</span>
            <CircleMinus
              className="size-5 flex-none hover:cursor-pointer opacity-70"
              onClick={() => removeItem(item.value)}
            >
              Remover
            </CircleMinus>
          </div>
        ))}
      </div>
      <Button
        disabled={addeableItems.length === 0}
        size="sm"
        variant="outline"
        onClick={() => {
          if (addeableItems.length > 0) setShowModal(true);
        }}
      >
        <div className="flex flex-row gap-1 items-center">
          <CirclePlus />
          <span>{addeableItems.length === 0 ? "Todos os itens já foram adicionados" : "Adicionar"}</span>
        </div>
      </Button>

      {/* Modal */}
      {showModal && addeableItems.length > 0 && (
        <div
          ref={modalRef}
          className="absolute flex flex-col left-full translate-x-2 top-0 w-full max-h-72 items-center bg-background-100 rounded-xl shadow-lg"
        >
          <Input
            className="bg-background-50"
            placeholder="Procurar..."
            value={modalInput}
            onChange={(e) => setModalInput(e.target.value)}
          />
          <div className="flex flex-col rounded-xl border-1 border-t-0 rounded-t-none border-border-300 overflow-y-scroll w-full -mt-2 pt-2">
            {addeableItems
              .filter((item) =>
                modalInput.length ? item.label.toLowerCase().includes(modalInput.toLowerCase()) : true
              )
              .map((item) => (
                <div
                  key={item.value}
                  className="[&:not(:last-child)]:border-b border-border-200 p-2 text-text-500 hover:bg-background-100 hover:cursor-pointer"
                  onClick={() => addItem(item.value)}
                >
                  {item.label}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
