"use client";

import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Label } from "@/components/custom/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { register } from "./actions";
import { FormState, Nationality, RegisterFormState } from "./definitions";

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
          hasError={!!state?.errors?.name}
          id="name"
          name="name"
          placeholder="Digite seu nome completo"
          value={formData.name}
          onChange={handleChange}
        />
        {state?.errors?.name && <span className="mt-3 mb-8 text-sm text-red-400">{state.errors.name}</span>}
      </div>
      <div>
        <Label htmlFor="email">E-mail</Label>
        <Input
          hasError={!!state?.errors?.email}
          id="email"
          name="email"
          placeholder="Digite seu email"
          value={formData.email}
          onChange={handleChange}
        />
        {state?.errors?.email && <span className="mt-3 mb-8 text-sm text-red-400">{state.errors.email}</span>}
      </div>
      <div>
        <Label htmlFor="birthdate">Data de Nascimento</Label>
        <Input
          hasError={!!state?.errors?.birthdate}
          id="birthdate"
          name="birthdate"
          type="date"
          value={String(formData.birthdate)}
          onChange={handleChange}
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
            <SelectValue className="text-muted-foreground" placeholder="Selecione" />
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
            <SelectValue className="text-muted-foreground" placeholder="Selecione" />
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
          hasError={!!state?.errors?.occupation}
          id="occupation"
          name="occupation"
          placeholder="Digite sua profissão"
          value={formData.occupation}
          onChange={handleChange}
        />
        {state?.errors?.occupation && <span className="mt-3 mb-8 text-sm text-red-400">{state.errors.occupation}</span>}
      </div>
      {state?.errors?.response && <span className="text-sm text-red-400">{state.errors.response}</span>}
      <Button className="w-full mt-8" loading={loading} size="xxl" variant="primary">
        <span>Criar conta</span>
        <ChevronRight className="size-6" />
      </Button>
    </form>
  );
}
