"use client";

import { redirect } from "next/navigation";
import { useCallback, useState } from "react";

import { Label } from "@/components/custom/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { FormErrors, INITIAL_VALUE, ManageTrail, ManageTrailSchema } from "./definitions";
import { Trail } from "@/types/trail";
import { saveTrail } from "./form-actions";
import { RichTextArea } from "@/components/ui/rich-text-area";

type FormProps = {
  data: Trail | null;
};

export function TrailForm({ data }: FormProps) {
  const [formData, setFormData] = useState<ManageTrail>(data ?? INITIAL_VALUE);
  const [errors, setErrors] = useState<FormErrors>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");

  const handleSubmit = async () => {
    setLoading(true);
    setErrors(null);
    const validation = ManageTrailSchema.safeParse(formData);

    if (!validation.success) {
      setErrors(validation.error.flatten().fieldErrors);
    }

    const payload = {
      id: data?.id ?? undefined,
      ...formData,
    };

    const response = await saveTrail(payload);

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
          <Label className="text-text-700" htmlFor="title">
            Título
          </Label>
          <Input
            className="text-text-700"
            id="acronym"
            name="acronym"
            value={formData.title}
            onChange={(e) => {
              setFormData((current) => ({ ...current, title: e.target.value }));
            }}
          />
          {!!errors?.title && <span className="text-sm text-error-500">{errors.title}</span>}
        </div>
        <div className="pb-3">
          <Label className="text-text-700" htmlFor="title">
            Subtítulo
          </Label>
          <Input
            className="text-text-700"
            id="name"
            name="name"
            value={formData.subtitle}
            onChange={(e) => {
              setFormData((current) => ({ ...current, subtitle: e.target.value }));
            }}
          />
          {!!errors?.subtitle && <span className="text-sm text-error-500">{errors.subtitle}</span>}
        </div>
        <div className="pb-3">
          <Label className="text-text-700" htmlFor="title">
            Descrição
          </Label>
          <RichTextArea
            id="description"
            value={formData.description}
            onChange={(value) => {
              setFormData((current) => ({ ...current, description: value }));
            }}
          />
          {!!errors?.description && <span className="text-sm text-error-500">{errors.description}</span>}
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
