"use client";

import { useActionState } from "react";
import { ChevronRight } from "lucide-react";

import { verifyCode } from "./actions";

import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export function VerifyCodeForm() {
  const [state, action, pending] = useActionState(verifyCode, undefined);

  return (
    <form className="w-full" action={action}>
      <div className="w-fit mx-auto">
        <InputOTP maxLength={6} name="code" className="w-fit mx-auto">
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      {state?.errors?.email && <span className="mt-3 mb-8 text-sm text-red-400">{state.errors.code}</span>}
      <Button variant="primary" size="xxl" className="w-full mt-8" disabled={pending}>
        <span>Entrar</span>
        <ChevronRight className="size-6" />
      </Button>
    </form>
  );
}
