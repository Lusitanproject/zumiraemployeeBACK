"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

import { register } from "./actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/custom/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormState, Nationality, RegisterFormState } from "./definitions";
import { toast } from "sonner";

interface RegisterFormProps {
  nationalities: Nationality[];
}

export function RegisterForm({ nationalities }: RegisterFormProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [state, setState] = useState<FormState>();
  const [formData, setFormData] = useState<RegisterFormState>({
    name: "",
    email: "",
    birthdate: String(new Date()),
    nationalityId: "",
    gender: undefined,
    occupation: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await register(formData);
      setState(result);

      if (result?.errors) return;

      toast.success("Cadastro realizado com sucesso");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="w-full flex flex-col gap-3" onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="name"> Nome completo</Label>
        <Input
          name="name"
          id="name"
          placeholder="Digite seu nome completo"
          hasError={!!state?.errors?.name}
          value={formData.name}
          onChange={handleChange}
        />
        {state?.errors?.name && <span className="mt-3 mb-8 text-sm text-red-400">{state.errors.name}</span>}
      </div>
      <div>
        <Label htmlFor="email">E-mail</Label>
        <Input
          name="email"
          id="email"
          placeholder="Digite seu email"
          hasError={!!state?.errors?.email}
          value={formData.email}
          onChange={handleChange}
        />
        {state?.errors?.email && <span className="mt-3 mb-8 text-sm text-red-400">{state.errors.email}</span>}
      </div>
      <div>
        <Label htmlFor="birthdate">Data de Nascimento</Label>
        <Input
          name="birthdate"
          id="birthdate"
          type="date"
          hasError={!!state?.errors?.birthdate}
          onChange={handleChange}
          value={String(formData.birthdate)}
        />
        {state?.errors?.birthdate && <span className="mt-3 mb-8 text-sm text-red-400">{state.errors.birthdate}</span>}
      </div>
      <div>
        <Label htmlFor="nationality">Nacionalidade</Label>
        <Select
          name="nationality"
          value={formData.nationalityId}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, nationalityId: value }))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione" className="text-muted-foreground" />
          </SelectTrigger>
          <SelectContent>
            {nationalities.map((nationality) => (
              <SelectItem key={nationality.id} value={nationality.id}>
                {nationality.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {state?.errors?.nationalityId && (
          <span className="mt-3 mb-8 text-sm text-red-400">{state.errors.nationalityId}</span>
        )}
      </div>
      <div>
        <Label htmlFor="gender">Gênero (Opicional)</Label>
        <Select
          name="gender"
          value={formData.gender}
          onValueChange={(value) => {
            if (value === "MALE" || value === "FEMALE" || value === "OTHER") {
              setFormData((prev) => ({ ...prev, gender: value }));
            }
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione" className="text-muted-foreground" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MALE">Masculino</SelectItem>
            <SelectItem value="FEMALE">Feminino</SelectItem>
            <SelectItem value="OTHER">Outro</SelectItem>
          </SelectContent>
        </Select>
        {state?.errors?.gender && <span className="mt-3 mb-8 text-sm text-red-400">{state.errors.gender}</span>}
      </div>
      <div>
        <Label htmlFor="occupation">Profissão (Opcional)</Label>
        <Input
          name="occupation"
          id="occupation"
          placeholder="Digite sua profissão"
          hasError={!!state?.errors?.occupation}
          value={formData.occupation}
          onChange={handleChange}
        />
        {state?.errors?.occupation && <span className="mt-3 mb-8 text-sm text-red-400">{state.errors.occupation}</span>}
      </div>
      {state?.errors?.response && <span className="text-sm text-red-400">{state.errors.response}</span>}
      <Button variant="primary" size="xxl" className="w-full mt-8" loading={loading}>
        <span>Criar conta</span>
        <ChevronRight className="size-6" />
      </Button>
    </form>
  );
}
