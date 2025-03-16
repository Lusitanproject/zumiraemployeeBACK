import Image from "next/image";
import logo from "../../../../public/logo-zumira.png";
import { SignUpForm } from "./form";
import { borel } from "@/app/fonts";

export default function Entrar() {
  return (
    <div className="w-full md:w-96 mx-auto flex flex-col items-center">
      <Image src={logo} width={127} height={40} alt="Logo Zumira" className="mb-12 md:mb-14" />
      {/* IMAGEM CASO SEJA EM TELAS MENORES */}
      <div className="mb-8">
        <p className="text-[1.625rem] md:text-3xl font-semibold text-center text-gray-700 tracking-tight">
          Entre e comece a desfrutar<br />
          de todos os <span className={`${borel.className} text-primary-500 tracking-normal`}>benefícios</span>
        </p>
      </div>
      <SignUpForm />
    </div>
  )
}
