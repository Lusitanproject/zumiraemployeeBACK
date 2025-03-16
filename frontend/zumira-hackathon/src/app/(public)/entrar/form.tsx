"use client"

import { useActionState } from "react";
import { ChevronRight } from "lucide-react";

import { signup } from "./actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/custom/label";

export function SignUpForm() {
  const [state, action, pending] = useActionState(signup, undefined)

  return (
    <form className="w-full" action={action}>
      <Label htmlFor="email">Digite seu e-mail corporativo</Label>
      <Input
        name="email"
        id="email"
        placeholder="Ex.: nome@empresa.com"
        hasError={!!state?.errors?.email}
      />
      {state?.errors?.email && (
        <span className="mt-3 mb-8 text-sm text-red-400">{state.errors.email}</span>
      )}
      <Button variant="primary" size="xxl" className="w-full mt-8" disabled={pending}>
        <span>Entrar</span>
        <ChevronRight className="size-6"/>
      </Button>
    </form>
  )
}
