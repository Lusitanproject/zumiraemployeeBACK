import Image from "next/image";
import Link from "next/link";

import { borel } from "@/app/fonts";
import { HeadImage } from "@/components/custom/head-image";

import logo from "../../../../public/logo--green.svg";
import { SignUpForm } from "./form";

export default function Entrar() {
  return (
    <div className="w-full md:w-96 mx-auto flex flex-col items-center">
      <Image unoptimized alt="Logo Zumira" className="mb-12 md:mb-14" height={40} src={logo} width={127} />

      {/* IMAGEM CASO SEJA EM TELAS MENORES */}
      <div className="md:hidden flex">
        <HeadImage size="medium" />
      </div>

      <div className="mb-8">
        <p className="text-[1.625rem] md:text-3xl font-semibold text-center text-text-700 tracking-tight">
          Entre e comece a desfrutar
          <br />
          de todos os <span className={`${borel.className} text-primary-500 tracking-normal`}>benefícios</span>
        </p>
      </div>
      <SignUpForm />
      <span className="text-sm leading-4 mt-8 text-text-900">
        Ao utilizar a plataforma, você concorda com os nossos{" "}
        <Link className="text-primary-600 underline" href="/termos">
          Termos de Uso
        </Link>
      </span>
      {process.env.ENABLE_REGISTER === "true" && (
        <span className="text-center text-text-500 font-semibold mt-8">
          Não tem uma conta?{" "}
          <Link className="underline" href="/registrar">
            Cadastre-se
          </Link>
        </span>
      )}
    </div>
  );
}
