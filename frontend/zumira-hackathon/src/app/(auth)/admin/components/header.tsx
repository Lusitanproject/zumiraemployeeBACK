import Link from "next/link";
import { CirclePlus } from "lucide-react";

interface HeaderProps {
  title: string;
  create?: {
    text: string;
    href: string;
  };
}

export function Header({ title, create }: HeaderProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100">
      <h3 className="font-bold text-2xl text-gray-700">{title}</h3>
      {create && (
        <Link
          href={create.href}
          className="bg-white hover:bg-gray-50 border border-transparent hover:border-gray-100 flex items-center gap-x-3 px-3 py-2 rounded-xl"
        >
          <CirclePlus className="text-gray-300 size-6" />
          <span className="text-sm text-gray-500 font-medium">{create.text}</span>
        </Link>
      )}
    </div>
  );
}
