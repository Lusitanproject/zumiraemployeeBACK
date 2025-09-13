"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trail } from "@/types/trail";
import { CirclePlus, Footprints } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

interface ActsHeaderProps {
  trails: Trail[];
}

export function ActsHeader({ trails }: ActsHeaderProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  function handleChangeTrail(id: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("trailId", id);
    router.replace(`?${params.toString()}`);
  }

  // Pega o valor do parâmetro trailId
  const selectedTrailId = searchParams.get("trailId") ?? trails[0].id;

  return (
    <div className="flex items-center justify-between py-4 border-b border-border-100">
      <div className="flex flex-row gap-2">
        <h3 className="font-bold text-2xl text-text-700">Atos da trilha:</h3>
        <Select name="company" value={selectedTrailId} onValueChange={(value) => handleChangeTrail(value)}>
          <SelectTrigger className="w-64 bg-background-0 text-text-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="text-text-700">
            {trails.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Link
        className="bg-background-0 hover:bg-background-50 border border-transparent hover:border-border-100 flex items-center gap-x-3 px-3 py-2 rounded-xl"
        href={`/admin/atos/novo?trailId=${selectedTrailId}`}
      >
        <CirclePlus className="text-text-300 size-6" />
        <span className="text-sm text-text-500 font-medium">Novo ato</span>
      </Link>
    </div>
  );
}
