"use client";

import equal from "fast-deep-equal";
import { IconName } from "lucide-react/dynamic";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { saveActChatbot } from "@/api/acts";
import { Label } from "@/components/custom/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ActChatbot } from "@/types/acts";

import { IconField } from "../../components/icons";
import { FormErrors, INITIAL_VALUE, ManageActChatbot, ManageActChatbotSchema } from "./definitions";

type FormProps = {
  data: ActChatbot | null;
  onChange?: (formData: ManageActChatbot, storedData: ActChatbot | null) => void;
};

export function ActChatbotForm({ data, onChange }: FormProps) {
  const router = useRouter();
  const [storedData, setStoredData] = useState(data);
  const [formData, setFormData] = useState<ManageActChatbot>(data ?? INITIAL_VALUE);
  const [errors, setErrors] = useState<FormErrors>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");

  async function handleSubmit() {
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

    try {
      const response = await saveActChatbot(payload);
      setStoredData((prev) => {
        if (prev) {
          return {
            ...prev,
            name: payload.name,
            description: payload.description,
            icon: payload.icon,
            instructions: payload.instructions,
          };
        } else {
          return payload as ActChatbot;
        }
      });

      if (!data) {
        router.replace(`/admin/atos/${response.id}`);
      }
    } catch (err) {
      if (err instanceof Error && !isRedirectError(err)) setFormError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleGoBack() {
    router.push("/admin/atos");
  }

  useEffect(() => {
    onChange?.(formData, storedData);
  }, [formData, storedData, onChange]);

  return (
    <div className="flex flex-col w-full py-4 md:pt-4 md:pb-24">
      <div className="flex flex-col w-full">
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
            className="h-28"
            id="description"
            name="description"
            value={formData.description ?? ""}
            onChange={(e) => {
              setFormData((current) => ({ ...current, description: e.target.value }));
            }}
          />
          {!!errors?.description && <span className="text-sm text-error-500">{errors.description}</span>}
        </div>
        <div className="pb-3">
          <Label htmlFor="instructions">Instruções</Label>
          <Textarea
            className="h-28"
            id="instructions"
            name="instructions"
            value={formData.instructions ?? ""}
            onChange={(e) => {
              setFormData((current) => ({ ...current, instructions: e.target.value }));
            }}
          />
          {!!errors?.instructions && <span className="text-sm text-error-500">{errors.instructions}</span>}
        </div>
        <IconField
          icons={["leaf", "star", "file-heart", "drama", "loader"]}
          value={formData.icon as IconName}
          onChange={(e) => {
            setFormData((current) => ({ ...current, icon: e }));
          }}
        />
      </div>
      {!!formError && <span className="text-sm text-error-500">{formError}</span>}
      <div className="border-gray-100 py-4 flex items-center md:justify-start gap-x-3">
        <Button size="xl" variant="outline" onClick={handleGoBack}>
          Voltar
        </Button>
        <Button
          disabled={loading || equal(formData, storedData)}
          loading={loading}
          size="xl"
          variant="primary"
          onClick={handleSubmit}
        >
          Salvar
        </Button>
      </div>
    </div>
  );
}
