import Image from "next/image";

import { borel } from "@/app/fonts";

import image from "../images/zumira-picture3.png";

export function TellYourStory() {
  return (
    <section className="w-full px-4 py-20 sm:py-32 bg-gradient-to-b from-success-600 to-zumira-green">
      <div className="w-full max-w-[82.5rem] mx-auto flex flex-col sm:flex-row items-start sm:items-center sm:justify-between">
        <div className="flex flex-col w-full mb-16 sm:mb-0">
          <h2 className="text-2xl font-bold leading-[1.25] sm:text-4xl sm:leading-[1.2] mb-10 text-white sm:max-w-[32rem]">Fale a sua história, <span className={`${borel.className} tracking-normal leading-none inline-flex h-6`}>conecte-se</span> com seus sentimentos e obtenha apoio</h2>
          <p className="text-xl leading-normal mb-4 text-white font-medium sm:max-w-[33rem]">Ao oferecer um canal seguro para expressar suas preocupações e emoções, as pessoas se sentem mais apoiadas e compreendidas, o que reduz os níveis de estresse e a probabilidade de esgotamento</p>
        </div>
        
        <div className="overflow-hidden w-full sm:max-w-[30rem] pt-28">
          <Image alt="" className="" src={image}  />
        </div>
      </div>
    </section>
  )
}