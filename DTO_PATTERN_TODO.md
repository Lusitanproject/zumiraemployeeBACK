# TODO: Implementar DTO Pattern para Centralizar Retornos de Models

## Objetivo

Centralizar os retornos de dados da API usando o padrão DTO (Data Transfer Object), permitindo:

- Definir quais campos são retornados
- Validar dados
- Transformar/formatar respostas
- Corrigir typos (ex: `wheight` → `weight`)

## Plano de Implementação

### 1. Criar diretório de DTOs

```
src/dto/
  ├── PsychosocialFactorDTO.ts
  ├── UserDTO.ts
  ├── AssessmentDTO.ts
  ├── etc...
```

### 2. Estrutura Base de um DTO

```typescript
// src/dto/PsychosocialFactorDTO.ts
export class PsychosocialFactorDTO {
  // Select config para Prisma
  static select = {
    id: true,
    name: true,
    wheight: true,
    description: true,
    selfMonitoringBlockId: true,
  } as const;

  // Formato para retorno da API
  static format(data: any) {
    return {
      id: data.id,
      name: data.name,
      weight: data.wheight, // Corrige o typo
      description: data.description,
      selfMonitoringBlockId: data.selfMonitoringBlockId,
    };
  }

  // Validações
  static validate(data: any) {
    if (data.wheight < 0) {
      throw new Error("Weight não pode ser negativo");
    }
    if (!data.name || data.name.trim() === "") {
      throw new Error("Name é obrigatório");
    }
    return true;
  }
}
```

### 3. Atualizar Services

```typescript
import { PsychosocialFactorDTO } from "../../dto/PsychosocialFactorDTO";

async findAll() {
  const factors = await prismaClient.psychosocialFactor.findMany({
    select: PsychosocialFactorDTO.select,
  });
  return { items: factors.map(f => PsychosocialFactorDTO.format(f)) };
}

async create(data: CreatePsychosocialFactorRequest) {
  PsychosocialFactorDTO.validate(data);
  const result = await prismaClient.psychosocialFactor.create({
    data,
    select: PsychosocialFactorDTO.select,
  });
  return PsychosocialFactorDTO.format(result);
}
```

## Models Prioritários

1. PsychosocialFactor (já existe)
2. User
3. Assessment
4. Notification
5. Company

## Benefícios

- ✅ DRY (Don't Repeat Yourself)
- ✅ Centralizado em um único lugar
- ✅ Fácil de manter
- ✅ Validações reutilizáveis
- ✅ Transformações de dados
- ✅ Type-safe

## Próximos Passos

1. Criar DTOs para todos os models
2. Atualizar services
3. Validar controllers retornam dados formatados
4. Atualizar testes

## Status

- [ ] Criar PsychosocialFactorDTO
- [ ] Criar UserDTO
- [ ] Criar AssessmentDTO
- [ ] Criar NotificationDTO
- [ ] Criar CompanyDTO
- [ ] Atualizar services
- [ ] Testar implementação
