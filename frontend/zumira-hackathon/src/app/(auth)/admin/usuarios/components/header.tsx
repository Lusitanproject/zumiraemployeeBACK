import { CirclePlus } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <div className="flex items-center justify-between py-4 border-b border-border-100">
      <h3 className="font-bold text-2xl text-text-700">Usuários</h3>
      <Link
        className="bg-background-0 hover:bg-background-50 border border-transparent hover:border-border-100 flex items-center gap-x-3 px-3 py-2 rounded-xl"
        href="/admin/usuarios/novo"
      >
        <CirclePlus className="text-text-300 size-6" />
        <span className="text-sm text-text-500 font-medium">Criar novo usuário</span>
      </Link>
    </div>
  );
}
