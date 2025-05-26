"use client";

import { useActionState } from "react";
import { ChevronRight } from "lucide-react";

import { verifyCode } from "./actions";

import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { cn } from "@/lib/utils";

export function VerifyCodeForm() {
  const [state, action, pending] = useActionState(verifyCode, undefined);

  return (
    <form className="w-full" action={action}>
      <div className="w-fit mx-auto">
        <InputOTP maxLength={6} name="code" className="w-fit mx-auto" pattern={REGEXP_ONLY_DIGITS}>
          <InputOTPGroup>
            <InputOTPSlot className={cn(state?.errors.input && "border-error-400")} index={0} />
            <InputOTPSlot className={cn(state?.errors.input && "border-error-400")} index={1} />
            <InputOTPSlot className={cn(state?.errors.input && "border-error-400")} index={2} />
            <InputOTPSlot className={cn(state?.errors.input && "border-error-400")} index={3} />
            <InputOTPSlot className={cn(state?.errors.input && "border-error-400")} index={4} />
            <InputOTPSlot className={cn(state?.errors.input && "border-error-400")} index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      {state?.errors.code && (
        <span className="flex w-full h-fit justify-center mt-3 text-sm text-red-400">{state.errors.code}</span>
      )}
      <Button variant="primary" size="xxl" className="w-full mt-8" disabled={pending}>
        <span>Entrar</span>
        <ChevronRight className="size-6" />
      </Button>
    </form>
  );
}
