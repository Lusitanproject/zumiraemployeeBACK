"use client";

import { useCallback, useState } from "react";
import {
  NotificationType,
  FormErrors,
  INITIAL_VALUE,
  ManageNotification,
  ManageNotificationSchema,
} from "./definitions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/custom/label";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { saveNotification } from "./form-actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Notification } from "../definitions";
import { RichTextArea } from "@/components/ui/rich-text-area";

type FormProps = {
  data: Notification | null;
  types: NotificationType[];
};

export function NotificationForm({ data, types }: FormProps) {
  const parsedNotification = data && {
    title: data.title,
    summary: data.summary,
    content: data.content,
    notificationTypeId: data.notificationType.id,
  };

  const [formData, setFormData] = useState<ManageNotification>(parsedNotification ?? INITIAL_VALUE);
  const [errors, setErrors] = useState<FormErrors>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");

  const handleSubmit = async () => {
    setLoading(true);
    setErrors(null);
    const validation = ManageNotificationSchema.safeParse(formData);

    if (!validation.success) {
      setErrors(validation.error.flatten().fieldErrors);
    }

    const payload = {
      id: data?.id ?? undefined,
      ...formData,
    };

    const response = await saveNotification(payload);

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
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={(e) => {
              setFormData((current) => ({ ...current, title: e.target.value }));
            }}
          />
          {!!errors?.title && <span className="text-sm text-error-500">{errors.title}</span>}
        </div>
        <div className="pb-3">
          <Label htmlFor="summary">Resumo</Label>
          <Input
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={(e) => {
              setFormData((current) => ({ ...current, summary: e.target.value }));
            }}
          />
          {!!errors?.summary && <span className="text-sm text-error-500">{errors.summary}</span>}
        </div>
        <div className="pb-3">
          <Label htmlFor="content">Conteúdo</Label>
          <RichTextArea
            id="content"
            value={formData.content ?? ""}
            onChange={(value) => {
              setFormData((current) => ({ ...current, content: value }));
            }}
          />
          {!!errors?.content && <span className="text-sm text-error-500">{errors.content}</span>}
        </div>
        <div className="pb-3">
          <Label htmlFor="notificationTypeId">Tipo de Notificação</Label>
          <Select
            name="notificationTypeId"
            defaultValue={formData.notificationTypeId}
            onValueChange={(value) =>
              setFormData((current) => ({
                ...current,
                notificationTypeId: value,
              }))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {types?.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!!errors?.notificationTypeId && <span className="text-sm text-error-500">{errors.notificationTypeId}</span>}
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
