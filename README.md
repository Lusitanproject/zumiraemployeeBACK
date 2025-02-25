# hackathon_documenta-o
📌 Visão Geral do Projeto - MVP Zumira
🎯 Objetivo
Desenvolver uma plataforma web responsiva e integrada para fornecer uma experiência fluida ao usuário final, permitindo:
 ✅ Interação direta com o bot da Zumira (Chatbase) para narrativas autobiográficas.
 ✅ Aplicação de escalas psicométricas (Google Forms embutido) para avaliar aspectos psicológicos.
 ✅ Área de automonitoramento para devolutivas personalizadas, combinando os resultados das escalas psicométricas com os insights extraídos dos logs de conversas.
A plataforma será acessível tanto via web quanto mobile, garantindo uma navegação intuitiva, rápida e segura.
✅ Área de gestão, com representação gráfica, com dados anonimozados, sobre indicadores de riscos Psicossociais Sociais, risco de Burnout e nível de bem estar organizacional.

🖥️ Componentes da Interface Web Responsiva
A plataforma Zumira será organizada em quatro principais áreas, garantindo uma jornada fluida ao usuário:
1️⃣ Área de Interação com o Bot (Chatbase Embed)
📍 Objetivo: Permitir que o usuário inicie e continue sua jornada autobiográfica com a IA Zumira.
 📍 Funcionalidade:
Chat embutido com o bot do Chatbase.
Suporte para transições automáticas entre a interação narrativa, avaliação por escalas psicométricas e área de devolutiva.
📍 Experiência do Usuário:
O usuário acessa o site e vê uma interface limpa e convidativa.
Ele pode interagir com o bot da Zumira diretamente na página, sem precisar abrir outros aplicativos.
A IA Zumira pode sugerir escalas psicométricas quando identifica padrões relevantes.
O Usuário também pode navegar para área de autoavaliação, onde responde as escalas ou para a área de devolutiva, para visualizar o resultado.

2️⃣ Área de Aplicação das Escalas Psicométricas (Google Forms Embed ou Power BI)
📍 Objetivo: Coletar dados estruturados por meio de escalas psicométricas padronizadas.
 📍 Funcionalidade:
Forms embutido na página, evitando redirecionamentos.
Autopreenchimento opcional de dados básicos (se permitido pelo usuário), informando como seus dados serão usados 
Feedback imediato após a conclusão das escalas.
📍 Experiência do Usuário:
Após interagir com o bot, o usuário pode ser direcionado para responder uma escala.
O formulário aparece diretamente na plataforma, sem a necessidade de abrir novas guias.
Ao finalizar, uma mensagem confirma o recebimento e orienta o usuário sobre a devolutiva.

3️⃣ Área do Painel de Automonitoramento e Devolutiva
📍 Objetivo: Permitir que o usuário visualize seus resultados de forma clara e compreensível, combinando dados psicométricos e insights das conversas.
 📍 Funcionalidade:
Gráficos e indicadores visuais sobre as respostas nas escalas
Indicadores de riscos e pontos fortes do usuário.
integração com o bot da Zumira Analitics, que interpreta o consolidado dos dados psicométricos em conjunto com os logs do Chatbase e gera um tipo de laudo, editável.
Histórico das interações e evolução do bem-estar ao longo do tempo.
Geração de relatório em PDF ou em excel, se o usuário desejar baixar.
📍 Experiência do Usuário:
Após responder as escalas, o usuário pode acessar sua devolutiva automaticamente.
O painel exibe insights de maneira fácil de interpretar (sem jargões técnicos).
Caso tenha autorizado, a IA Zumira pode sugerir ações personalizadas com base nos dados.


4) Área de gestão, com representação gráfica, com dados anonimozados, sobre indicadores de riscos Psicossociais Sociais, risco de Burnout e nível de bem estar organizacional.
📍 Objetivo: Permitir que o usuário visualize os resultados anonimizados dos seus colaboradores, de forma clara e compreensível, combinando dados psicométricos e insights das conversas.
 📍 Funcionalidade:
Gráficos e indicadores visuais sobre o consolidado dos constructos das respostas das escalas.
Indicadores de riscos e pontos fortes do grupo.
Resumo textual gerado automaticamente, interpretando os dados psicométricos em conjunto com os logs do Chatbase.
Histórico das interações e evolução do bem-estar ao longo do tempo.
Geração de relatório em PDF, se o usuário desejar baixar.
📍 Experiência do Usuário:
O usuário gestor tem acesso a todas as funcionalidades anteriores e também a esta, onde acessa o dashboard de gestão de saúde mental em tempo real.
O painel exibe alertas de riscos, pontos fortes, gráficos, número de usuários ativos, opções de filtros por período, região ou setor e pode gerar um relatório descritivo.

🔧 Tecnologias Utilizadas (A DEFINIR)
Frontend (Interface Web Responsiva)
✅ React.js + Next.js → Alta performance e carregamento rápido.
 ✅ TypeScript → Tipagem segura para evitar erros.
 ✅ Tailwind CSS → Design responsivo e moderno.
 ✅ Google Forms Embed API → Para exibir os formulários diretamente na página.
 ✅ Chatbase Web Embed → Para integração do bot na interface.
Backend
✅ C# (.NET 7/8 - ASP.NET Core) → Gerenciamento das APIs e da lógica de negócio.
 ✅ Google Sheets API → Para buscar e processar respostas das escalas.
 ✅ PostgreSQL + Entity Framework Core → Banco de dados para armazenar informações estruturadas.
 ✅ iTextSharp (C#) → Para gerar devolutivas em PDF.
 ✅ Firebase → Para notificações e atualizações em tempo real.

📌 Roadmap de Implementação

🚀 Benefícios da Solução
✔ Navegação fluida e intuitiva: O usuário passa da interação com o bot para as escalas e para a devolutiva sem fricções.
 ✔ Personalização na devolutiva: Os dados psicométricos são combinados com a análise das conversas, criando um relatório mais rico.
 ✔ Acessibilidade e praticidade: Tudo ocorre dentro da plataforma, sem necessidade de abrir múltiplos aplicativos.
 ✔ Escalabilidade: A arquitetura permite crescimento para novas integrações no futuro.
🚀 Essa estratégia garante uma experiência integrada e eficiente, elevando o impacto da Zumira na saúde mental dos usuários.
