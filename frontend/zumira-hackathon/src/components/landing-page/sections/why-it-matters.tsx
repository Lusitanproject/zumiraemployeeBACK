import { BookCheckIcon, BookLockIcon, ChartNoAxesCombinedIcon, HeartHandshakeIcon } from "lucide-react";

export function WhyItMatters() {
  return (
    <section className="w-full px-4 py-28 sm:pb-32 bg-white">
      <div className="w-full max-w-[82.5rem] mx-auto flex flex-col items-center">
        <h2 className="text-3xl font-bold leading-[1.25] sm:text-4xl sm:leading-[1.2] mb-20 text-slate-800 text-center">
          Por que a Zumira importa para sua empresa?
        </h2>

        <div className="w-full grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-6 rounded-xl bg-[#f5f5eb]">
            <div className="rounded-xl w-12 h-12 bg-green-50 flex items-center justify-center mb-6">
              <BookCheckIcon />
            </div>
            <h3 className="font-bold text-xl mb-4">Conformidade com as normas regulamentadoras (NR1)</h3>
            <p className="text-sm">Automatize o rastreio de fatores psicossociais exigido por lei.</p>
          </div>
          <div className="p-6 rounded-xl bg-[#f5f5eb]">
            <div className="rounded-xl w-12 h-12 bg-green-50 flex items-center justify-center mb-6">
              <BookLockIcon />
            </div>
            <h3 className="font-bold text-xl mb-4">Dados anonimizados e insights organizacionais</h3>
            <p className="text-sm">
              Receba relatórios com indicadores de bem-estar, esgotamento e engajamento, sem violar a privacidade dos
              seus colaboradores.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-[#f5f5eb]">
            <div className="rounded-xl w-12 h-12 bg-green-50 flex items-center justify-center mb-6">
              <HeartHandshakeIcon />
            </div>
            <h3 className="font-bold text-xl mb-4">Acolhimento e suporte emocional 24/7</h3>
            <p className="text-sm">
              A Zumira conversa com os colaboradores, ajuda na autoanálise e direciona para a rede de apoio mais
              adequada, quando necessário.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-[#f5f5eb]">
            <div className="rounded-xl w-12 h-12 bg-green-50 flex items-center justify-center mb-6">
              <ChartNoAxesCombinedIcon />
            </div>
            <h3 className="font-bold text-xl mb-4">Redução de afastamentos e aumento de produtividade</h3>
            <p className="text-sm">Identifique sinais precoces de burnout e fortaleça a cultura do cuidado.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
