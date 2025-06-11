"use client";

import { redirect } from "next/navigation";
import { useCallback, useState } from "react";

import { Label } from "@/components/custom/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Nationality } from "@/types/nationality";

import { FormErrors, INITIAL_VALUE, ManageNationality, ManageNationalitySchema } from "./definitions";
import { saveNationality } from "./form-actions";

type FormProps = {
  data: Nationality | null;
};

export function NationalityForm({ data }: FormProps) {
  const parsedUser = data && {
    acronym: data.acronym,
    name: data.name,
  };

  const [formData, setFormData] = useState<ManageNationality>(parsedUser ?? INITIAL_VALUE);
  const [errors, setErrors] = useState<FormErrors>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");

  const handleSubmit = async () => {
    setLoading(true);
    setErrors(null);
    const validation = ManageNationalitySchema.safeParse(formData);

    if (!validation.success) {
      setErrors(validation.error.flatten().fieldErrors);
    }

    const payload = {
      id: data?.id ?? undefined,
      ...formData,
    };

    const response = await saveNationality(payload);

    if (response) {
      setFormError(response);
    }
    setLoading(false);
  };

  const handleCancel = useCallback(() => {
    redirect("/admin/nacionalidades");
  }, []);

  return (
    <div className="w-full py-4 md:pt-4 md:pb-24">
      <div className="w-full md:w-[30rem]">
        <div className="pb-3">
          <Label htmlFor="title">Sigla</Label>
          <Input
            id="acronym"
            name="acronym"
            value={formData.acronym}
            onChange={(e) => {
              setFormData((current) => ({ ...current, acronym: e.target.value }));
            }}
          />
          {!!errors?.acronym && <span className="text-sm text-error-500">{errors.acronym}</span>}
        </div>
        <div className="pb-3">
          <Label htmlFor="title">Nome</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={(e) => {
              setFormData((current) => ({ ...current, name: e.target.value }));
            }}
          />
          {!!errors?.name && <span className="text-sm text-error-500">{errors.name}</span>}
        </div>
      </div>
      {!!formError && <span className="text-sm text-error-500">{formError}</span>}
      <div className="md:border-t border-gray-100 md:absolute md:left-0 md:right-0 md:bottom-0 py-4 md:px-16 md:bg-gray-50 flex items-center md:justify-start gap-x-3">
        <Button size="xl" variant="outline" onClick={handleCancel}>
          Cancelar
        </Button>
        <Button disabled={loading} loading={loading} size="xl" variant="primary" onClick={handleSubmit}>
          Salvar
        </Button>
      </div>
    </div>
  );
}
