import { LinkedInLogo, MainLogo } from "../ui";

export function Footer() {
  return (
    <footer className="w-full bg-success-900 border-t-2 border-zumira-green flex flex-col px-4 sm:px-12">
      <div className="w-full flex justify-between items-center max-w-[82.5rem] mx-auto pt-12">
        <div className="w-32 opacity-60 text-white">
          <MainLogo />
        </div>
      </div>
      <div className="w-full flex justify-between items-center max-w-[82.5rem] mx-auto pt-3 pb-8">
        <p className="text-white text-sm opacity-65">Junte-se a nós para promover<br />saúde e o bem-estar</p>
      </div>
      <div className="w-full flex flex-col md:flex-row md:justify-between md:items-center max-w-[82.5rem] mx-auto pt-3 pb-8">
        <div className="flex flex-col mb-10 md:mb-0">
          <p className="font-medium text-lg text-white">Siga-nos em:</p>
          <div className="flex gap-x-3 pt-4 mb-2">
            <a
              href="https://lnkd.in/djnYmhqV"
              target="_blank"
              rel="noopener noreferer"
              className="w-8 h-8 rounded-full bg-black/45 text-white hover:bg-black/65 hover:text-white/60 flex items-center justify-center"
            >
              <LinkedInLogo />
            </a>
          </div>
          <p className="text-sm text-white">support@zumira.ai</p>
        </div>
        <p className="text-sm text-white/60 text-left md:text-right">Rua Visconde de Ouro Preto, 5 - 5&ordm; andar<br />Botafogo - Rio de Janeiro<br />Rj - Brasil - CEP 22250-180</p>
      </div>
      <div className="w-full flex justify-between items-center max-w-[82.5rem] mx-auto py-6 border-t border-white/30">
        <p className="text-white text-sm opacity-65">Zumira AI &copy; 2025. Todos os direitos reservados</p>
      </div>
    </footer>
  )
}