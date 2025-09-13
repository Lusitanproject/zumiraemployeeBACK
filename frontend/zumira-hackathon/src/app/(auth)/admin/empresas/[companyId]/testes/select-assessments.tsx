"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

import { setCompanyAvailableAssessments } from "@/api/companies";
import { Divider } from "@/components/custom/divider";
import { Input } from "@/components/ui/input";
import { Assessment } from "@/types/assessment";
import { Company } from "@/types/company";

import { AssessmentList } from "./components/assessment-list";

interface SelectAssessentsProps {
  assessments: Assessment[];
  company: Company;
}

export function SelectAssessments({ assessments, company }: SelectAssessentsProps) {
  const [search, setSearch] = useState<string>("");
  const [selected, setSelected] = useState<Assessment[]>(
    assessments.filter((a) => company.companyAvailableAssessments.some((b) => a.id === b.assessmentId))
  );

  const debouncedSave = useDebouncedCallback(async (assessments: Assessment[]) => {
    try {
      await setCompanyAvailableAssessments(
        company.id,
        assessments.map((a) => a.id)
      );
    } catch {
      toast.error("Erro ao salvar testes da empresa.");
    }
  }, 1000);

  function handleToggleAssessment(assessment: Assessment, selected: boolean) {
    setSelected((prev) => {
      let updated;

      if (selected) {
        updated = [...prev, assessment];
      } else {
        updated = prev.filter((a) => a.id !== assessment.id);
      }

      debouncedSave(updated);

      return updated;
    });
  }

  return (
    <div className="flex flex-col gap-2 h-full w-full">
      <Input
        hasIcon
        className="w-full"
        icon={Search}
        placeholder="Pesquise por um teste"
        value={search}
        onChange={(e) => setSearch(e.target.value.toLowerCase())}
      />
      <div className="flex flex-row gap-3 size-full min-h-0">
        <AssessmentList
          selected
          assessments={selected}
          search={search}
          title="Selecionados"
          onToggleAssessment={handleToggleAssessment}
        />

        <Divider />

        <AssessmentList
          assessments={assessments.filter((a) => !selected.some((b) => a.id === b.id))}
          search={search}
          title="Não Selecionados"
          onToggleAssessment={handleToggleAssessment}
        />
      </div>
    </div>
  );
}
