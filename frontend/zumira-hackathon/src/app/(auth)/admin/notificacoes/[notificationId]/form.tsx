"use client";

import { redirect } from "next/navigation";
import { useCallback, useState } from "react";

import { Label } from "@/components/custom/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RichTextArea } from "@/components/ui/rich-text-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Notification } from "../definitions";
import {
  FormErrors,
  INITIAL_VALUE,
  ManageNotification,
  ManageNotificationSchema,
  NotificationType,
  User,
} from "./definitions";
import { saveNotification } from "./form-actions";

type FormProps = {
  data: Notification | null;
  types: NotificationType[];
  users: User[];
};

export function NotificationForm({ data, types, users }: FormProps) {
  const parsedNotification = data && {
    title: data.title,
    summary: data.summary,
    content: data.content,
    notificationTypeId: data.notificationType.id,
    actionUrl: data.actionUrl,
  };

  const [formData, setFormData] = useState<ManageNotification>(parsedNotification ?? INITIAL_VALUE);
  const [errors, setErrors] = useState<FormErrors>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");
  const [contentType, setContentType] = useState<"call-to-action" | "text">(
    data ? (data.content ? "text" : "call-to-action") : "text"
  );

  const handleSubmit = async () => {
    setLoading(true);
    setErrors(null);

    const processedFormData = { ...formData };
    if (contentType === "text") {
      processedFormData.actionUrl = null;
    } else {
      processedFormData.content = null;
    }

    const validation = ManageNotificationSchema.safeParse(processedFormData);

    if (!validation.success) {
      setErrors(validation.error.flatten().fieldErrors);
      setLoading(false);
      return;
    }

    const payload = {
      id: data?.id ?? undefined,
      ...processedFormData,
    };

    const response = await saveNotification(
      payload,
      users.map((u) => u.id)
    );

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
        <div>
          <Label htmlFor="content">Tipo de notificação</Label>
          <RadioGroup
            className="flex flex-row text-sm my-2"
            value={contentType}
            onValueChange={(value) => {
              if (value === "text" || value === "call-to-action") {
                setContentType(value);
              }
            }}
          >
            <div className="flex flex-row gap-2 items-center">
              <RadioGroupItem id="content-text" value="text" />
              <label htmlFor="content-text">Conteúdo</label>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <RadioGroupItem id="content-call-to-action" value="call-to-action" />
              <label htmlFor="content-call-to-action">Call to action</label>
            </div>
          </RadioGroup>
        </div>
        <div className="pb-3">
          {contentType === "text" ? (
            <>
              <Label htmlFor="content">Conteúdo</Label>
              <RichTextArea
                id="content"
                value={formData.content ?? ""}
                onChange={(value) => {
                  setFormData((current) => ({ ...current, content: value }));
                }}
              />
            </>
          ) : (
            <>
              <Label htmlFor="link">Link de redirecionamento</Label>
              <Input
                id="link"
                value={formData.actionUrl ?? ""}
                onChange={(e) => {
                  setFormData((current) => ({ ...current, actionUrl: e.target.value }));
                }}
              />
            </>
          )}
          {!!errors?.contentOrActionUrl && <span className="text-sm text-error-500">{errors.contentOrActionUrl}</span>}
        </div>
        <div className="pb-3">
          <Label htmlFor="notificationTypeId">Categoria</Label>
          <Select
            defaultValue={formData.notificationTypeId}
            name="notificationTypeId"
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
        <Button disabled={loading} loading={loading} size="xl" variant="primary" onClick={handleSubmit}>
          Salvar
        </Button>
      </div>
    </div>
  );
}
