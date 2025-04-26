import Link from "next/link";
import { CirclePlus } from "lucide-react";

export function Header() {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100">
      <h3 className="font-bold text-2xl text-gray-700">Testes</h3>
      <Link
        href="/admin/testes/novo"
        className="bg-white hover:bg-gray-50 border border-transparent hover:border-gray-100 flex items-center gap-x-3 px-3 py-2 rounded-xl"
      >
        <CirclePlus className="text-gray-300 size-6" />
        <span className="text-sm text-gray-500 font-medium">Novo teste</span>
      </Link>
    </div>
  );
}
