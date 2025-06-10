"use client";

import { useCallback, useState } from "react";
import { FormErrors, INITIAL_VALUE, ManageActChatbot, ManageActChatbotSchema } from "./definitions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/custom/label";
import { Textarea } from "@/components/ui/textarea";
import { IconField } from "./components/icons";
import { IconName } from "@/components/custom/icon";
import { Button } from "@/components/ui/button";
import { saveActChatbot } from "./form-actions";
import { redirect } from "next/navigation";
import { ActChatbot } from "../definitions";

type FormProps = {
  data: ActChatbot | null;
};

export function ActChatbotForm({ data }: FormProps) {
  const [formData, setFormData] = useState<ManageActChatbot>(data ?? INITIAL_VALUE);
  const [errors, setErrors] = useState<FormErrors>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");

  const handleSubmit = async () => {
    setLoading(true);
    setErrors(null);
    const validation = ManageActChatbotSchema.safeParse(formData);

    if (!validation.success) {
      setErrors(validation.error.flatten().fieldErrors);
    }

    const payload = {
      id: data?.id ?? undefined,
      ...formData,
    };

    const response = await saveActChatbot(payload);

    if (response) {
      setFormError(response);
    }

    setLoading(false);
  };

  const handleCancel = useCallback(() => {
    redirect("/admin/atos");
  }, []);

  return (
    <div className="w-full py-4 md:pt-4 md:pb-24">
      <div className="w-full md:w-[30rem]">
        <div className="pb-3">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            name="title"
            value={formData.name}
            onChange={(e) => {
              setFormData((current) => ({ ...current, name: e.target.value }));
            }}
          />
          {!!errors?.name && <span className="text-sm text-error-500">{errors.name}</span>}
        </div>
        <div className="pb-3">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description ?? ""}
            onChange={(e) => {
              setFormData((current) => ({ ...current, description: e.target.value }));
            }}
            className="h-28"
          />
          {!!errors?.description && <span className="text-sm text-error-500">{errors.description}</span>}
        </div>
        <div className="pb-3">
          <Label htmlFor="instructions">Instruções</Label>
          <Textarea
            id="instructions"
            name="instructions"
            value={formData.instructions ?? ""}
            onChange={(e) => {
              setFormData((current) => ({ ...current, instructions: e.target.value }));
            }}
            className="h-28"
          />
          {!!errors?.instructions && <span className="text-sm text-error-500">{errors.instructions}</span>}
        </div>
        <IconField
          value={formData.icon as IconName}
          onChange={(e) => {
            setFormData((current) => ({ ...current, icon: e }));
          }}
        />
      </div>
      {!!formError && <span className="text-sm text-error-500">{formError}</span>}
      <div className="md:border-t border-gray-100 md:absolute md:left-0 md:right-0 md:bottom-0 py-4 md:px-16 md:bg-gray-50 flex items-center md:justify-start gap-x-3">
        <Button size="xl" variant="outline" onClick={handleCancel}>
          Cancelar
        </Button>
        <Button size="xl" variant="primary" onClick={handleSubmit} disabled={loading} loading={loading}>
          Salvar
        </Button>
      </div>
    </div>
  );
}
