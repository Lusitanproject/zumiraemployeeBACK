"use client";

import { redirect } from "next/navigation";
import { useCallback, useState } from "react";

import { Label } from "@/components/custom/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Company, FormErrors, INITIAL_VALUE, ManageCompany, ManageCompanySchema } from "./definitions";
import { saveCompany } from "./form-actions";

type FormProps = {
  data: Company | null;
};

export function CompanyForm({ data }: FormProps) {
  const parsedUser = data && {
    name: data.name,
    email: data.email,
  };

  const [formData, setFormData] = useState<ManageCompany>(parsedUser ?? INITIAL_VALUE);
  const [errors, setErrors] = useState<FormErrors>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");

  const handleSubmit = async () => {
    setLoading(true);
    setErrors(null);
    const validation = ManageCompanySchema.safeParse(formData);

    if (!validation.success) {
      setErrors(validation.error.flatten().fieldErrors);
    }

    const payload = {
      id: data?.id ?? undefined,
      ...formData,
    };

    const response = await saveCompany(payload);

    if (response) {
      setFormError(response);
    }

    setLoading(false);
  };

  const handleCancel = useCallback(() => {
    redirect("/admin/empresas");
  }, []);

  return (
    <div className="w-full py-4 md:pt-4 md:pb-24">
      <div className="w-full md:w-[30rem]">
        <div className="pb-3">
          <Label className="text-text-700" htmlFor="name">
            Nome da empresa
          </Label>
          <Input
            className="text-text-700"
            id="name"
            name="name"
            value={formData.name}
            onChange={(e) => {
              setFormData((current) => ({ ...current, name: e.target.value }));
            }}
          />
          {!!errors?.name && <span className="text-sm text-error-500">{errors.name}</span>}
        </div>
        <div className="pb-3">
          <Label className="text-text-700" htmlFor="email">
            E-mail
          </Label>
          <Input
            className="text-text-700"
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => {
              setFormData((current) => ({ ...current, email: e.target.value }));
            }}
          />
          {!!errors?.email && <span className="text-sm text-error-500">{errors.email}</span>}
        </div>
      </div>
      {!!formError && <span className="text-sm text-error-500">{formError}</span>}
      <div className="md:border-t border-border-100 md:absolute md:left-0 md:right-0 md:bottom-0 py-4 md:px-16 md:bg-background-50 flex items-center md:justify-start gap-x-3">
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
