"use client";

import { startHolyLoader } from "holy-loader";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import { Input } from "@/components/ui/input";

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

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const search = params.get("busca");
    setSearch(search);
  }, [searchParams]);

  return (
    <div className="pt-4 mb-8">
      <div className="w-full relative">
        <Input
          hasIcon
          id="search"
          name="search"
          placeholder="Busque por testes"
          value={search ?? ""}
          onChange={handleSearch}
        />
        <div className="absolute pointer-events-none top-3 left-3">
          <Search className="text-gray-500 size-5" />
        </div>
      </div>
    </div>
  );
}
