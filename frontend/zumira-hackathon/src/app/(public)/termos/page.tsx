import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import logo from "../../../../public/logo--green.svg";

export default function Termos() {
  return (
    <article className="relative max-w-4xl mx-auto px-4 font-sans text-text-700">
      <div className="flex w-full justify-center">
        <Image unoptimized alt="Logo Zumira" className="mb-12 md:mb-14" height={40} src={logo} width={127} />
      </div>

      <Link
        className="absolute top-0 -translate-y-full inline-block mb-8 text-primary-600 hover:text-primary-700 transition-colors text-sm font-medium"
        href="/entrar"
      >
        ← Voltar
      </Link>

      <header className="mb-12">
        <h1 className="text-[1.625rem] md:text-3xl font-semibold tracking-tight text-text-900">
          Termo de Consentimento para Tratamento de Dados Pessoais
        </h1>
      </header>

      <section className="space-y-10">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-text-800 mb-4">1. Finalidade</h2>
          <p className="text-sm leading-6 text-text-700">
            Ao utilizar a plataforma Zumira, você declara estar ciente de que seus dados pessoais poderão ser coletados,
            tratados e armazenados para as seguintes finalidades:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2">
            <li className="text-sm text-text-700">Realizar triagens de saúde mental e avaliações psicossociais;</li>
            <li className="text-sm text-text-700">Gerar relatórios de bem-estar e orientações personalizadas;</li>
            <li className="text-sm text-text-700">
              Produzir relatórios organizacionais de forma estritamente anonimizada;
            </li>
            <li className="text-sm text-text-700">
              Garantir o funcionamento da plataforma e a melhoria contínua dos nossos serviços.
            </li>
          </ul>
          <p className="mt-4 text-sm leading-6 text-text-700">
            Todos os dados tratados respeitarão os princípios da finalidade, necessidade, segurança e transparência,
            conforme a Lei nº 13.709/2018 (LGPD).
          </p>
        </div>

        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-text-800 mb-4">2. Tipos de Dados Coletados</h2>
          <p className="text-sm leading-6 text-text-700">A Zumira poderá coletar e tratar os seguintes dados:</p>
          <ul className="list-disc list-inside mt-4 space-y-2">
            <li className="text-sm text-text-700">
              Informações cadastrais (nome, e-mail, data de nascimento, nacionalidade, profissão);
            </li>
            <li className="text-sm text-text-700">Informações fornecidas nas interações com a assistente virtual;</li>
            <li className="text-sm text-text-700">Respostas a questionários e escalas de bem-estar psicológico;</li>
            <li className="text-sm text-text-700">Informações de navegação, de forma anonimizada.</li>
          </ul>
          <p className="mt-4 text-sm text-text-600">
            <strong>Nota:</strong> Dados sensíveis, como informações relacionadas à sua saúde mental, não serão
            compartilhados individualmente com terceiros em hipótese alguma.
            <br />
            As análises são realizadas exclusivamente para fins de melhoria da experiência do usuário e para a geração
            de relatórios de grupo totalmente anonimizados, sem possibilidade de identificação individual.
          </p>
        </div>

        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-text-800 mb-4">3. Compartilhamento de Dados</h2>
          <p className="text-sm leading-6 text-text-700">
            A Zumira não compartilha seus dados individuais de saúde mental. O compartilhamento ocorre apenas:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2">
            <li className="text-sm text-text-700">
              De forma anonimizada, para compor relatórios coletivos destinados a organizações contratantes;
            </li>
            <li className="text-sm text-text-700">
              Para cumprimento de obrigações legais ou regulatórias, se necessário;
            </li>
            <li className="text-sm text-text-700">
              Com fornecedores autorizados, sob cláusulas contratuais rigorosas de segurança e confidencialidade.
            </li>
          </ul>
          <p className="mt-4 text-sm leading-6 text-text-700">
            Nenhum dado de saúde será comercializado, exposto ou utilizado para outros fins que não os descritos acima.
          </p>
        </div>

        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-text-800 mb-4">
            4. Seus Direitos como Titular de Dados
          </h2>
          <ul className="list-disc list-inside mt-4 space-y-2">
            <li className="text-sm text-text-700">Confirmar a existência de tratamento;</li>
            <li className="text-sm text-text-700">Acessar, corrigir ou atualizar informações;</li>
            <li className="text-sm text-text-700">Revogar o consentimento a qualquer momento;</li>
            <li className="text-sm text-text-700">Solicitar a exclusão dos dados pessoais.</li>
          </ul>
          <p className="mt-4 text-sm leading-6 text-text-700">
            Esses direitos podem ser exercidos por meio de solicitações para:{" "}
            <a className="text-primary-600 underline hover:text-primary-700" href="mailto:support@zumira.ai">
              support@zumira.ai
            </a>
            .
          </p>
        </div>

        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-text-800 mb-4">5. Segurança da Informação</h2>
          <p className="text-sm leading-6 text-text-700">
            A Zumira adota práticas rigorosas de segurança para proteger seus dados.
          </p>
        </div>

        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-text-800 mb-4">6. Consentimento</h2>
          <p className="text-sm leading-6 text-text-700">Ao continuar utilizando a plataforma, você declara que:</p>
          <ul className="list-disc list-inside mt-4 space-y-2">
            <li className="text-sm text-text-700">Leu, compreendeu e concorda com os termos deste documento;</li>
            <li className="text-sm text-text-700">
              Autoriza, de forma livre e informada, o tratamento dos seus dados pessoais conforme descrito;
            </li>
            <li className="text-sm text-text-700">
              Reconhece que seus dados de saúde mental serão tratados de forma confidencial e anonimizada.
            </li>
          </ul>
        </div>
      </section>

      <header className="mt-20 mb-12">
        <h1 className="text-[1.625rem] md:text-3xl font-semibold tracking-tight text-text-900">
          Termo de Uso – Plataforma Zumira (Versão BETA)
        </h1>
      </header>

      <section className="space-y-10">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-text-800 mb-4">1. Natureza da Plataforma</h2>
          <p className="text-sm leading-6 text-text-700">
            A Zumira é uma plataforma de tecnologia voltada para a promoção da saúde mental e avaliação de riscos
            psicossociais, utilizando inteligência artificial para triagem, orientações iniciais e encaminhamentos.
            Atualmente, a plataforma encontra-se em Versão BETA, o que significa que está em fase de testes, ajustes e
            melhorias contínuas.
          </p>
        </div>

        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-text-800 mb-4">2. Limitação dos Serviços</h2>
          <p className="text-sm leading-6 text-text-700">
            A Zumira não realiza diagnósticos clínicos e não substitui a consulta ou tratamento realizado por
            profissionais de saúde mental devidamente habilitados. As informações fornecidas têm caráter informativo e
            orientativo, e visam apoiar a promoção do bem-estar, a detecção precoce de riscos e o encaminhamento para
            suporte especializado. Em caso de sofrimento intenso, emergência psicológica ou necessidade de diagnóstico,
            o usuário deve procurar imediatamente um(a) profissional qualificado(a) ou serviços de urgência
            especializados.
          </p>
        </div>

        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-text-800 mb-4">
            3. Fase BETA – Considerações Específicas
          </h2>
          <p className="text-sm leading-6 text-text-700">
            Sendo uma versão BETA, a plataforma pode apresentar imprecisões, instabilidades ou limitações em suas
            funcionalidades. O usuário compreende e aceita que o sistema está sujeito a atualizações, correções e
            mudanças sem aviso prévio. Feedbacks, sugestões e relatos de falhas serão bem-vindos e contribuirão para o
            aprimoramento da plataforma.
          </p>
        </div>

        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-text-800 mb-4">4. Responsabilidades do Usuário</h2>
          <ul className="list-disc list-inside mt-4 space-y-2">
            <li className="text-sm text-text-700">Utilizar a plataforma de forma ética;</li>
            <li className="text-sm text-text-700">Fornecer informações verdadeiras;</li>
            <li className="text-sm text-text-700">Buscar atendimento humano sempre que necessário.</li>
            <li className="text-sm text-text-700">
              Compreender as limitações da plataforma e buscar atendimento humano qualificado sempre que necessário;
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-text-800 mb-4">5. Privacidade e Proteção de Dados</h2>
          <p className="text-sm leading-6 text-text-700">
            A utilização da Zumira pressupõe o aceite da nossa Política de Privacidade e do Termo de Consentimento para
            Tratamento de Dados Pessoais, disponíveis para consulta na plataforma. A segurança, a privacidade e o
            tratamento adequado de dados sensíveis são compromissos fundamentais da Zumira.
          </p>
        </div>

        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-text-800 mb-4">
            7. Compromisso Ético e Conformidade Profissional
          </h2>
          <p className="text-sm leading-6 text-text-700">
            A Zumira foi desenvolvida respeitando os princípios éticos previstos no Código de Ética Profissional do
            Psicólogo (CFP, Resolução nº 10/2005) e na legislação aplicável à saúde mental e proteção de dados pessoais.
            A plataforma:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2">
            <li className="text-sm text-text-700">
              Atua como suporte tecnológico para promoção de bem-estar e triagem inicial, sem substituir a avaliação,
              diagnóstico ou intervenção psicológica presencial ou remota conduzida por profissionais registrados em
              seus respectivos Conselhos;
            </li>
            <li className="text-sm text-text-700">
              Zela pela confidencialidade, privacidade e dignidade dos usuários;
            </li>
            <li className="text-sm text-text-700">
              Compromete-se a adotar linguagens e práticas que respeitem a diversidade humana e evitem qualquer forma de
              estigmatização;
            </li>
            <li className="text-sm text-text-700">
              Está em constante revisão para garantir que suas práticas estejam em conformidade com a legislação, com as
              diretrizes do Conselho Federal de Psicologia (CFP) e com a Lei Geral de Proteção de Dados Pessoais (LGPD,
              Lei nº 13.709/2018).
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-text-800 mb-4">8. Aceite dos Termos</h2>
          <p className="text-sm leading-6 text-text-700">Ao utilizar a plataforma Zumira, o usuário declara que:</p>
          <ul className="list-disc list-inside mt-4 space-y-2">
            <li className="text-sm text-text-700">
              Leu, compreendeu e aceitou integralmente os presentes Termos de Uso;
            </li>
            <li className="text-sm text-text-700">
              Tem conhecimento da natureza BETA do serviço e de suas limitações;
            </li>
            <li className="text-sm text-text-700">
              Reconhece que as informações fornecidas têm caráter orientativo e não substituem diagnóstico clínico.
            </li>
          </ul>
          <p className="mt-4 text-sm leading-6 text-text-700">
            Caso não concorde com este termo, solicitamos que não prossiga com o uso da plataforma.
          </p>
        </div>

        <Link className="flex w-full justify-center" href={"/entrar"}>
          <Button size={"xl"} variant={"primary"}>
            Voltar para o login
          </Button>
        </Link>

        <p className="text-sm text-text-500">Versão: 1.0 | Vigência: 28/04/2026</p>
      </section>
    </article>
  );
}
