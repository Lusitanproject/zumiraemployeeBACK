"use client";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { Label } from "@/components/custom/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { deleteUser } from "./actions";
import { Company, FormErrors, INITIAL_VALUE, ManageUser, ManageUserSchema, Role, User } from "./definitions";
import { saveUser } from "./form-actions";

type FormProps = {
  data: User | null;
  companies: Company[];
  roles: Role[];
};

export function UserForm({ data, companies, roles }: FormProps) {
  const parsedUser = data && {
    email: data.email,
    name: data.name,
    roleId: data.role.id,
    companyId: data.company?.id ?? undefined,
  };

  const [formData, setFormData] = useState<ManageUser>(parsedUser ?? INITIAL_VALUE);
  const [errors, setErrors] = useState<FormErrors>(null);
  const [loadingSave, setLoadingSave] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");
  const [waitingDeleteConfirmation, setWaitingDeleteConfirmation] = useState<boolean>(false);

  const handleSubmit = async () => {
    setLoadingSave(true);
    setErrors(null);
    const validation = ManageUserSchema.safeParse(formData);

    if (!validation.success) {
      setErrors(validation.error.flatten().fieldErrors);
    }

    const payload = {
      id: data?.id ?? undefined,
      ...formData,
    };

    const response = await saveUser(payload);

    if (response) {
      setFormError(response);
    }
    setLoadingSave(false);
  };

  const handleCancel = useCallback(() => {
    redirect("/admin/testes");
  }, []);

  async function handleDelete() {
    const id = data?.id;
    if (!id) return;

    if (!waitingDeleteConfirmation) {
      setWaitingDeleteConfirmation(true);
    } else {
      setLoadingDelete(true);
      try {
        await deleteUser(id);
      } catch (err) {
        if (!isRedirectError(err) && err instanceof Error) toast.error(err.message);
      } finally {
        setWaitingDeleteConfirmation(false);
        setLoadingDelete(false);
      }
    }
  }

  useEffect(() => {
    if (waitingDeleteConfirmation) {
      const timeoutId = setTimeout(() => setWaitingDeleteConfirmation(false), 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [waitingDeleteConfirmation]);

  return (
    <div className="w-full py-4 md:pt-4 md:pb-24">
      <div className="w-full md:w-[30rem]">
        <div className="pb-3">
          <Label className="text-text-700" htmlFor="title">
            Nome
          </Label>
          <Input
            className="text-text-700"
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
          <Label className="text-text-700" htmlFor="title">
            Email
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
        <div className="pb-3">
          <Label className="text-text-700" htmlFor="companyId">
            Empresa
          </Label>
          <Select
            defaultValue={formData.companyId}
            name="companyId"
            onValueChange={(value) =>
              setFormData((current) => ({
                ...current,
                companyId: value,
              }))
            }
          >
            <SelectTrigger className="w-[180px] text-text-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {companies?.map((item) => (
                <SelectItem key={item.id} className="text-text-700" value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!!errors?.email && <span className="text-sm text-error-500">{errors.email}</span>}
        </div>
        <div className="pb-3">
          <Label className="text-text-700" htmlFor="roleId">
            Perfil
          </Label>
          <Select
            defaultValue={formData.roleId}
            name="roleId"
            onValueChange={(value) =>
              setFormData((current) => ({
                ...current,
                roleId: value,
              }))
            }
          >
            <SelectTrigger className="w-[180px] text-text-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roles?.map((item) => (
                <SelectItem key={item.id} className="text-text-700" value={item.id}>
                  {item.slug}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!!errors?.email && <span className="text-sm text-error-500">{errors.email}</span>}
        </div>
      </div>
      {!!formError && <span className="text-sm text-error-500">{formError}</span>}
      <div className="md:border-t border-border-100 md:absolute md:left-0 md:right-0 md:bottom-0 py-4 md:px-16 md:bg-background-50 flex items-center md:justify-start gap-x-3">
        <Button size="xl" variant="outline" onClick={handleCancel}>
          Cancelar
        </Button>
        <Button disabled={loadingSave} loading={loadingSave} size="xl" variant="primary" onClick={handleSubmit}>
          Salvar
        </Button>
        {data?.id && (
          <Button disabled={loadingDelete} loading={loadingDelete} size="xl" variant="danger" onClick={handleDelete}>
            {!waitingDeleteConfirmation ? "Deletar" : "Confirmar"}
          </Button>
        )}
      </div>
    </div>
  );
}
