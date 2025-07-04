import { CirclePlus } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  title: string;
  create?: {
    text: string;
    href: string;
  };
}

export function Header({ title, create }: HeaderProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-border-100">
      <h3 className="font-bold text-2xl text-text-700">{title}</h3>
      {create && (
        <Link
          className="bg-background-0 hover:bg-background-50 border border-transparent hover:border-border-100 flex items-center gap-x-3 px-3 py-2 rounded-xl"
          href={create.href}
        >
          <CirclePlus className="text-text-300 size-6" />
          <span className="text-sm text-text-500 font-medium">{create.text}</span>
        </Link>
      )}
    </div>
  );
}
