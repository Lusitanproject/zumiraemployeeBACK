import Image from "next/image";
import Link from "next/link";

import { borel } from "@/app/fonts";
import { HeadImage } from "@/components/custom/head-image";

import logo from "../../../../public/logo--green.svg";
import { getNationalities } from "./actions";
import { RegisterForm } from "./form";

export default async function Registrar() {
  const nationalities = await getNationalities();

  return (
    <div className="w-full md:w-96 mx-auto flex flex-col items-center">
      <Image unoptimized alt="Logo Zumira" className="mb-12 md:mb-14" height={40} src={logo} width={127} />

      {/* IMAGEM CASO SEJA EM TELAS MENORES */}
      <div className="md:hidden flex">
        <HeadImage size="medium" />
      </div>

      <div className="mb-8">
        <h1 className="text-[1.625rem] md:text-3xl font-semibold text-center text-gray-700 tracking-tight">
          Vamos começar sua jornada de{" "}
          <span className={`${borel.className} text-primary-500 tracking-normal`}>autoconhecimento</span>?
        </h1>
        <h2 className="text-gray-500 text-center">
          Cadastre-se gratuitamente e descubra novas formas de cuidar de você.
        </h2>
      </div>
      <RegisterForm nationalities={nationalities} />
      <span className="text-center text-gray-500 font-semibold mt-8">
        Ja tem uma conta?{" "}
        <Link className="underline" href="/entrar">
          Entre
        </Link>
      </span>
    </div>
  );
}
