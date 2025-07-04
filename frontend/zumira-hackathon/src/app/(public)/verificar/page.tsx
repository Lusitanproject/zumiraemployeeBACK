import { Mail } from "lucide-react";
import Image from "next/image";

import logo from "../../../../public/logo--green.svg";
import { ResendButton } from "./components/resend-button";
import { VerifyCodeForm } from "./form";

export default function Verificar() {
  return (
    <div className="w-full md:w-96 mx-auto flex flex-col items-center">
      <Image alt="Logo Zumira" className="mb-12 md:mb-14" height={40} src={logo} width={127} />
      <div className="mb-8 text-center">
        <div className="w-28 h-28 rounded-full border-4 border-primary-25 mx-auto mb-8 flex items-center justify-center">
          <Mail className="size-14 text-primary-600" />
        </div>
        <h3 className="text-4xl text-text-700 font-bold mb-4">Verifique seu email</h3>
        <p className="text-lg text-center text-text-700 tracking-tight">
          Enviamos um <span className="font-bold">código de verificação para seu e-mail.</span> Digite o código abaixo
          para continuar.
        </p>
      </div>
      <VerifyCodeForm />
      <ResendButton />
    </div>
  );
}
