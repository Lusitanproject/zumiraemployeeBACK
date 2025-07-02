"use client";

import { ChevronRight } from "lucide-react";
import { useActionState } from "react";

import { Label } from "@/components/custom/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { signup } from "./actions";

export function SignUpForm() {
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <form action={action} className="w-full">
      <Label className="text-text-700" htmlFor="email">
        Digite seu e-mail corporativo
      </Label>
      <Input
        className="text-text-700"
        hasError={!!state?.errors?.email}
        id="email"
        name="email"
        placeholder="Ex.: nome@empresa.com"
      />
      {state?.errors?.email && <span className="mt-3 mb-8 text-sm text-red-400">{state.errors.email}</span>}
      <Button className="w-full mt-8" disabled={pending} size="xxl" variant="primary">
        <span>Entrar</span>
        <ChevronRight className="size-6" />
      </Button>
    </form>
  );
}
