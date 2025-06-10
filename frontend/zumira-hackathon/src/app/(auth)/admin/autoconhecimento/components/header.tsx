import { CirclePlus } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100">
      <h3 className="font-bold text-2xl text-gray-700">Blocos de Autoconhecimento</h3>
      <Link
        className="bg-white hover:bg-gray-50 border border-transparent hover:border-gray-100 flex items-center gap-x-3 px-3 py-2 rounded-xl"
        href="/admin/autoconhecimento/novo"
      >
        <CirclePlus className="text-gray-300 size-6" />
        <span className="text-sm text-gray-500 font-medium">Criar novo bloco</span>
      </Link>
    </div>
  );
}
