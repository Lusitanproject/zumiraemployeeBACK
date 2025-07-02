"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import { ChevronRight } from "lucide-react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";

import { verifyCode } from "./actions";

export function VerifyCodeForm() {
  const [state, action, pending] = useActionState(verifyCode, undefined);

  return (
    <form action={action} className="w-full">
      <div className="w-fit mx-auto">
        <InputOTP className="w-fit mx-auto" maxLength={6} name="code" pattern={REGEXP_ONLY_DIGITS}>
          <InputOTPGroup className="text-text-700">
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
      <Button className="w-full mt-8" disabled={pending} size="xxl" variant="primary">
        <span>Entrar</span>
        <ChevronRight className="size-6" />
      </Button>
    </form>
  );
}
