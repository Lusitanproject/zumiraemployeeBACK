"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const isDistRuntime = __dirname.includes("/dist/");
const docsBaseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : `http://localhost:${(_a = process.env.PORT) !== null && _a !== void 0 ? _a : "3000"}`;
const srcRoutes = ["./src/routes/*.ts", "./src/routes/admin/*.ts"];
const distRoutes = ["./dist/routes/*.js", "./dist/routes/admin/*.js"];
const apis = isDistRuntime ? distRoutes : srcRoutes;
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Zumira API",
            version: "1.0.0",
            description: "Documentação completa dos endpoints da API Zumira",
        },
        servers: [{ url: docsBaseUrl }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            responses: {
                BadRequest: {
                    description: "Dados de entrada inválidos",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                        },
                    },
                },
                Unauthorized: {
                    description: "Token de autenticação ausente ou inválido",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                        },
                    },
                },
                Forbidden: {
                    description: "Sem permissão para realizar esta ação",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                        },
                    },
                },
                NotFound: {
                    description: "Recurso não encontrado",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                        },
                    },
                },
                InternalError: {
                    description: "Erro interno do servidor",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                        },
                    },
                },
            },
            schemas: {
                SuccessResponse: {
                    type: "object",
                    properties: {
                        status: { type: "string", example: "SUCCESS" },
                        data: { nullable: true },
                    },
                },
                ErrorResponse: {
                    type: "object",
                    properties: {
                        status: { type: "string", example: "ERROR" },
                        message: { type: "string" },
                    },
                },
                Role: {
                    type: "object",
                    description: "Papel/perfil de acesso do usuário no sistema",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        slug: {
                            type: "string",
                            description: "Identificador legível do papel (ex: 'admin', 'collaborator')",
                            example: "collaborator",
                        },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                Nationality: {
                    type: "object",
                    description: "Nacionalidade utilizada para segmentar avaliações por região",
                    properties: {
                        id: { type: "string", format: "cuid" },
                        acronym: {
                            type: "string",
                            minLength: 2,
                            maxLength: 5,
                            description: "Código curto da nacionalidade (ex: 'BR', 'PT', 'USA')",
                            example: "BR",
                        },
                        name: { type: "string", example: "Brasileiro" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                Trail: {
                    type: "object",
                    description: "Trilha/programa de intervenção que agrupa ACTs e empresas",
                    properties: {
                        id: { type: "string", format: "cuid" },
                        title: { type: "string" },
                        subtitle: { type: "string" },
                        description: { type: "string" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                Company: {
                    type: "object",
                    description: "Empresa participante vinculada a uma trilha de intervenção",
                    properties: {
                        id: { type: "string", format: "cuid" },
                        name: { type: "string" },
                        email: { type: "string", format: "email" },
                        trailId: {
                            type: "string",
                            format: "cuid",
                            description: "ID da trilha/programa ao qual a empresa pertence",
                        },
                        trail: { $ref: "#/components/schemas/Trail" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                User: {
                    type: "object",
                    description: "Usuário do sistema (colaborador da empresa participante)",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        name: { type: "string" },
                        email: { type: "string", format: "email" },
                        phoneNumber: {
                            type: "string",
                            nullable: true,
                            description: "Telefone celular (somente dígitos após normalização)",
                        },
                        customId: {
                            type: "string",
                            nullable: true,
                            description: "Identificador externo do usuário no sistema do cliente (ex: matrícula de RH)",
                        },
                        occupation: { type: "string", nullable: true, description: "Cargo ou função do colaborador" },
                        occupationLevel: {
                            type: "string",
                            nullable: true,
                            description: "Nível hierárquico do cargo (ex: 'Júnior', 'Sênior', 'Gerência')",
                        },
                        area: { type: "string", nullable: true, description: "Área ou departamento do colaborador" },
                        location: { type: "string", nullable: true, description: "Localidade/unidade onde o colaborador atua" },
                        skinColor: {
                            type: "string",
                            nullable: true,
                            description: "Autodeclaração de cor/raça (campo demográfico)",
                        },
                        hasDisability: {
                            type: "boolean",
                            nullable: true,
                            description: "Indica se o colaborador possui deficiência",
                        },
                        birthdate: { type: "string", format: "date-time", nullable: true },
                        admissionDate: {
                            type: "string",
                            format: "date-time",
                            nullable: true,
                            description: "Data de admissão na empresa",
                        },
                        gender: {
                            type: "string",
                            enum: ["MALE", "FEMALE", "OTHER"],
                            nullable: true,
                        },
                        nationalityId: { type: "string", format: "cuid", nullable: true },
                        roleId: { type: "string", format: "uuid", description: "Papel de acesso do usuário" },
                        companyId: { type: "string", format: "cuid", nullable: true },
                        currentActChatbotId: {
                            type: "string",
                            format: "cuid",
                            nullable: true,
                            description: "ID do ACT que o usuário está realizando atualmente",
                        },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                SelfMonitoringBlock: {
                    type: "object",
                    description: "Bloco temático de automonitoramento que agrupa avaliações e dimensões (ex: 'Saúde Mental', 'Clima Organizacional')",
                    properties: {
                        id: { type: "string", format: "cuid" },
                        title: { type: "string" },
                        summary: { type: "string", nullable: true },
                        icon: { type: "string", nullable: true, description: "Identificador do ícone para exibição na UI" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                PsychologicalDimension: {
                    type: "object",
                    description: "Dimensão psicológica medida pelas perguntas de uma avaliação (ex: 'Estresse', 'Resiliência')",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        acronym: { type: "string", description: "Código curto da dimensão (ex: 'EST', 'RES')" },
                        name: { type: "string" },
                        selfMonitoringBlockId: { type: "string", format: "cuid" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                PsychosocialFactor: {
                    type: "object",
                    description: "Fator de risco psicossocial identificado nas análises de ACT",
                    properties: {
                        id: { type: "string", format: "cuid" },
                        name: { type: "string" },
                        wheight: {
                            type: "integer",
                            description: "Peso/relevância do fator na análise (campo nomeado 'wheight' no schema — não é typo editável no banco)",
                        },
                        description: { type: "string" },
                        selfMonitoringBlockId: { type: "string" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                AssessmentResultRating: {
                    type: "object",
                    description: "Faixa de classificação de risco associada a um resultado de avaliação",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        risk: {
                            type: "string",
                            description: "Rótulo textual do nível de risco (ex: 'Baixo', 'Moderado', 'Alto')",
                            example: "Moderado",
                        },
                        profile: {
                            type: "string",
                            description: "Descrição do perfil psicológico correspondente a essa faixa de resultado",
                        },
                        color: {
                            type: "string",
                            description: "Cor hexadecimal para representação visual da faixa (#RRGGBB ou #RGB)",
                            example: "#FFA500",
                        },
                        assessmentId: { type: "string", format: "cuid" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                AssessmentQuestionChoice: {
                    type: "object",
                    description: "Opção de resposta de uma pergunta de avaliação",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        label: { type: "string", description: "Texto exibido ao usuário para essa opção" },
                        value: {
                            type: "number",
                            format: "float",
                            description: "Valor numérico da opção, utilizado no cálculo do score final (SUM ou AVERAGE)",
                        },
                        index: { type: "integer", description: "Posição de ordenação (0-based) da opção dentro da pergunta" },
                        assessmentQuestionId: { type: "string", format: "uuid" },
                    },
                },
                AssessmentQuestion: {
                    type: "object",
                    description: "Pergunta de uma avaliação, vinculada a uma dimensão psicológica",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        description: { type: "string", description: "Texto da pergunta exibido ao usuário" },
                        index: { type: "integer", description: "Posição de ordenação (0-based) dentro da avaliação" },
                        assessmentId: { type: "string", format: "cuid" },
                        psychologicalDimensionId: { type: "string", format: "uuid" },
                        choices: {
                            type: "array",
                            items: { $ref: "#/components/schemas/AssessmentQuestionChoice" },
                        },
                    },
                },
                Assessment: {
                    type: "object",
                    description: "Template de avaliação psicossocial",
                    properties: {
                        id: { type: "string", format: "cuid" },
                        title: { type: "string" },
                        summary: { type: "string" },
                        description: { type: "string", nullable: true },
                        userFeedbackInstructions: {
                            type: "string",
                            nullable: true,
                            description: "Prompt de sistema usado pela IA para gerar feedback individual ao usuário",
                        },
                        companyFeedbackInstructions: {
                            type: "string",
                            nullable: true,
                            description: "Prompt de sistema usado pela IA para gerar feedback consolidado para a empresa",
                        },
                        operationType: {
                            type: "string",
                            enum: ["SUM", "AVERAGE"],
                            description: "Define como o score final é calculado: SUM = soma dos valores das respostas; AVERAGE = média dos valores",
                        },
                        public: {
                            type: "boolean",
                            description: "true = avaliação visível para qualquer usuário; false = restrita às empresas vinculadas",
                        },
                        selfMonitoringBlockId: {
                            type: "string",
                            format: "cuid",
                            description: "Bloco temático ao qual esta avaliação pertence (ex: 'Saúde Mental')",
                        },
                        nationalityId: {
                            type: "string",
                            format: "cuid",
                            description: "Avaliação segmentada por nacionalidade (conteúdo e contexto cultural específicos)",
                        },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                AssessmentResult: {
                    type: "object",
                    description: "Registro de uma avaliação respondida por um usuário",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        feedback: {
                            type: "string",
                            nullable: true,
                            description: "Feedback textual gerado pela IA após análise das respostas — null até ser solicitada a geração",
                        },
                        assessmentResultRatingId: {
                            type: "string",
                            format: "uuid",
                            nullable: true,
                            description: "Faixa de risco classificada para este resultado (null se ainda não classificado)",
                        },
                        rating: { $ref: "#/components/schemas/AssessmentResultRating" },
                        userId: { type: "string", format: "uuid" },
                        assessmentId: { type: "string", format: "cuid" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                Alert: {
                    type: "object",
                    description: "Alerta criado automaticamente quando um resultado de avaliação indica risco elevado",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        assessmentResultId: { type: "string", format: "uuid" },
                        assessmentResultRatingId: {
                            type: "string",
                            format: "uuid",
                            description: "Faixa de risco que disparou o alerta",
                        },
                        read: { type: "boolean", description: "false = alerta ainda não visualizado pelo destinatário" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                ActChatbot: {
                    type: "object",
                    description: "Chatbot narrativo interativo (ACT = atividade de narrativa terapêutica/reflexiva)",
                    properties: {
                        id: { type: "string", format: "cuid" },
                        name: { type: "string" },
                        description: { type: "string" },
                        icon: { type: "string", description: "Identificador do ícone para exibição na UI" },
                        initialMessage: {
                            type: "string",
                            nullable: true,
                            description: "Primeira mensagem exibida ao usuário ao iniciar o ACT",
                        },
                        messageInstructions: {
                            type: "string",
                            nullable: true,
                            description: "Prompt de sistema para guiar a IA na geração de respostas durante a conversa",
                        },
                        compilationInstructions: {
                            type: "string",
                            nullable: true,
                            description: "Prompt de sistema para guiar a IA na compilação final do capítulo em narrativa",
                        },
                        trailId: { type: "string", format: "cuid", description: "Trilha à qual este ACT pertence" },
                        index: { type: "integer", description: "Posição de ordenação (0-based) dentro da trilha" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                ActChapter: {
                    type: "object",
                    description: "Capítulo individual de um usuário dentro de um ACT (sessão de conversa e reflexão)",
                    properties: {
                        id: { type: "string", format: "cuid" },
                        externalId: {
                            type: "string",
                            nullable: true,
                            description: "ID do chatbot externo (ex: Chatbase) que originou este capítulo, quando importado",
                        },
                        title: { type: "string", description: "Título do capítulo (padrão: 'Novo capítulo' até ser editado)" },
                        compilation: {
                            type: "string",
                            nullable: true,
                            description: "Narrativa final compilada das mensagens do capítulo pela IA — null até o capítulo ser compilado",
                        },
                        type: {
                            type: "string",
                            enum: ["REGULAR", "ADMIN_TEST"],
                            description: "REGULAR = capítulo real de um usuário; ADMIN_TEST = capítulo criado para teste administrativo",
                        },
                        actChatbotId: { type: "string", format: "cuid" },
                        userId: { type: "string", format: "uuid" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                ActChapterMessage: {
                    type: "object",
                    description: "Mensagem individual de uma conversa num capítulo de ACT",
                    properties: {
                        id: { type: "string", format: "cuid" },
                        content: { type: "string", description: "Conteúdo textual da mensagem" },
                        role: {
                            type: "string",
                            enum: ["user", "assistant"],
                            description: "user = mensagem enviada pelo colaborador; assistant = resposta gerada pelo chatbot/IA",
                        },
                        actChapterId: { type: "string", format: "cuid" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                NotificationType: {
                    type: "object",
                    description: "Categoria de notificação com configuração visual e de prioridade",
                    properties: {
                        id: { type: "string", format: "cuid" },
                        name: { type: "string", description: "Nome da categoria (ex: 'Alerta Crítico', 'Informativo')" },
                        color: {
                            type: "string",
                            description: "Cor hexadecimal para identificação visual da categoria (#RRGGBB ou #RGB)",
                            example: "#FF0000",
                        },
                        priority: {
                            type: "integer",
                            description: "Nível de prioridade numérico — quanto maior o valor, mais prioritária a notificação",
                        },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                Notification: {
                    type: "object",
                    description: "Notificação enviada a usuários específicos",
                    properties: {
                        id: { type: "string", format: "cuid" },
                        title: { type: "string" },
                        summary: { type: "string", description: "Resumo curto exibido na listagem de notificações" },
                        content: { type: "string", nullable: true, description: "Corpo completo da notificação (HTML ou texto)" },
                        actionUrl: {
                            type: "string",
                            nullable: true,
                            description: "URL de deep link para a ação relacionada à notificação (ex: link para resultado de avaliação)",
                        },
                        notificationTypeId: { type: "string", format: "cuid" },
                        type: { $ref: "#/components/schemas/NotificationType" },
                        read: { type: "boolean", description: "Indica se o usuário autenticado já leu esta notificação" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                CompanyAssessmentFeedback: {
                    type: "object",
                    description: "Feedback gerado por IA para a empresa sobre os resultados consolidados de uma avaliação",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        text: { type: "string", description: "Texto do feedback gerado pela IA" },
                        companyId: { type: "string", format: "cuid" },
                        assessmentId: { type: "string", format: "cuid" },
                        respondents: {
                            type: "integer",
                            description: "Quantidade de usuários que responderam a avaliação no momento em que o feedback foi gerado",
                        },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                PaginatedUsers: {
                    type: "object",
                    description: "Resultado paginado de busca de usuários",
                    properties: {
                        data: {
                            type: "array",
                            items: { $ref: "#/components/schemas/User" },
                        },
                        total: { type: "integer", description: "Total de registros encontrados com os filtros aplicados" },
                        page: { type: "integer" },
                        pageSize: { type: "integer" },
                        totalPages: { type: "integer" },
                    },
                },
            },
        },
    },
    apis,
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
