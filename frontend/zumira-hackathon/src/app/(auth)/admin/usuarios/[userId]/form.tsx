"use client";

import { redirect } from "next/navigation";
import { useCallback, useState } from "react";

import { Label } from "@/components/custom/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [loading, setLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");

  const handleSubmit = async () => {
    setLoading(true);
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
    setLoading(false);
  };

  const handleCancel = useCallback(() => {
    redirect("/admin/autoconhecimento");
  }, []);

  return (
    <div className="w-full py-4 md:pt-4 md:pb-24">
      <div className="w-full md:w-[30rem]">
        <div className="pb-3">
          <Label htmlFor="title">Nome</Label>
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
          <Label htmlFor="title">Email</Label>
          <Input
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
          <Label htmlFor="companyId">Empresa</Label>
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
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {companies?.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!!errors?.email && <span className="text-sm text-error-500">{errors.email}</span>}
        </div>
        <div className="pb-3">
          <Label htmlFor="roleId">Perfil</Label>
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
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roles?.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.slug}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!!errors?.email && <span className="text-sm text-error-500">{errors.email}</span>}
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
