"use client";

import { ChangeEvent, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { startHolyLoader } from "holy-loader";

export function SearchBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [search, setSearch] = useState(searchParams.get("busca"));

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);

    const params = new URLSearchParams(searchParams);
    if (e.target.value.trim()) {
      params.set("busca", e.target.value);
    } else {
      params.delete("busca");
    }

    debouncedSearch(`${pathname}?${params.toString()}`);
  };

  const debouncedSearch = useDebouncedCallback((href) => {
    startHolyLoader();
    replace(href);
  }, 500);

  return (
    <div className="pt-4 mb-8">
      <div className="w-full relative">
        <Input
          id="search"
          name="search"
          value={search ?? ""}
          hasIcon
          placeholder="Busque por testes"
          onChange={handleSearch}
        />
        <div className="absolute pointer-events-none top-3 left-3">
          <Search className="text-gray-500 size-5" />
        </div>
      </div>
    </div>
  );
}
