"use client";

import { useCallback, useState } from "react";
import {
  FormErrors,
  INITIAL_VALUE,
  ManageNotificationType,
  ManageNotificationTypeSchema,
  NotificationType,
} from "./definitions";
import { saveNotificationType } from "./form-actions";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/custom/label";
import { Button } from "@/components/ui/button";

type FormProps = {
  data: NotificationType | null;
};

export function NotificationTypeForm({ data }: FormProps) {
  const parsedNotification = data && {
    name: data.name,
    color: data.color,
    priority: data.priority,
  };

  const [formData, setFormData] = useState<ManageNotificationType>(parsedNotification ?? INITIAL_VALUE);
  const [errors, setErrors] = useState<FormErrors>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");

  const handleSubmit = async () => {
    setLoading(true);
    setErrors(null);
    const validation = ManageNotificationTypeSchema.safeParse(formData);

    if (!validation.success) {
      setErrors(validation.error.flatten().fieldErrors);
      setLoading(false);
      return;
    }

    const payload = {
      id: data?.id ?? undefined,
      ...formData,
    };

    const response = await saveNotificationType(payload);

    if (response) {
      setFormError(response);
    }
    setLoading(false);
  };

  const handleCancel = useCallback(() => {
    redirect("/admin/notificacoes");
  }, []);

  return (
    <div className="w-full py-4 md:pt-4 md:pb-24">
      <div className="w-full md:w-[30rem]">
        <div className="pb-3">
          <Label htmlFor="name">Título</Label>
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
        <div className="flex flex-row gap-3">
          <div className="pb-3 w-full">
            <Label htmlFor="color">Prioridade</Label>
            <Input
              id="priority"
              name="priority"
              type="number"
              inputMode="numeric"
              pattern="\d*"
              value={formData.priority}
              onChange={(e) => {
                const raw = e.target.value;

                // Aceita apenas números inteiros (positivos ou negativos, se quiser)
                if (/^-?\d*$/.test(raw)) {
                  setFormData((current) => ({ ...current, priority: Number(e.target.value) }));
                }
              }}
            />
            {!!errors?.color && <span className="text-sm text-error-500">{errors.color}</span>}
          </div>
          <div className="pb-3 w-40">
            <Label htmlFor="color">Cor</Label>
            <Input
              id="color"
              name="color"
              type="color"
              value={formData.color}
              onChange={(e) => {
                setFormData((current) => ({ ...current, color: e.target.value }));
              }}
            />
            {!!errors?.color && <span className="text-sm text-error-500">{errors.color}</span>}
          </div>
        </div>
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
