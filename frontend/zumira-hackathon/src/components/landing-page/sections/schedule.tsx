"use client"
import dynamic from "next/dynamic";

const CalendlyButton = dynamic(() => import('../calendly/button'), { ssr: false })

export function Schedule() {
  return (
    <section className="w-full px-4 sm:px-12 pt-[9rem] sm:pb-32 bg-[#f5f5eb]">
      <div className="w-full max-w-[82.5rem] mx-auto flex flex-col items-start">
        <div className="flex flex-col w-full mb-16 sm:mb-0 text-center items-center">
          <h2 className="text-3xl font-bold leading-[1.25] sm:text-4xl sm:leading-[1.2] mb-6 text-slate-800">Sua empresa com mais saúde, segurança e empatia.</h2>
          <p className="text-lg leading-normal mb-8 text-slate-700 font-medium max-w-[720px]">Agende uma demonstração gratuita e veja como a Zumira pode transformar o bem-estar organizacional na prática.</p>
          <CalendlyButton />
        </div>
        <div className="overflow-hidden "></div>
      </div>
    </section>
  )
}