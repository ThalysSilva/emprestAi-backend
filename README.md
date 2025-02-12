## EmprestÁi

Criação de um projeto para exemplificar minhas habilidades com nestJs em um case financeiro.
Link para acessar a aplicação frontend já em produção e utilizando o backend: https://emprest-ai-frontend.vercel.app
Link do backend em produção: https://emprest-ai-backend.vercel.app

### Tecnologias utilizadas:
- NestJs
- Zod
- Prisma
- Jest
- Clean architeture

 #### Identificadores
Existem 4 tipos de identificadores:

- Pessoa Física;
- Pessoa Jurídica;
- Estudante Universitário;
- Aposentado;

Cada um dos identificadores tem uma logica para a sua definição:

- Pessoa física: deve ser um cpf válido, logo deve ter 11 dígitos;
- Pessoa jurídica: deve ser um cnpj válido, logo precisa ter 14 dígitos;
- Estudante: 1. O candidato deve validar que o número do identificador possui
  exatamente 8 caracteres 2. A soma do primeiro e último dígito deve ser igual a 9
- Aposentado: 1. O candidato deve validar que o número do identificador possui
  exatamente 10 caracteres 2. O último dígito não pode estar presente nos outros 9 dígitos.

#### Valor das parcelas
Cada Tipo de identificador terá acesso a diferentes faixas em relação a solicitação de parcelas. Segue a relação abaixo:

Pessoa Física:
- Valor mínimo mensal das parcelas: R$ 300,00
- Valor máximo de todo o empréstimo: R$ 10.000,00

  Pessoa Jurídica:
- Valor mínimo mensal das parcelas: R$ 1000,00
- Valor máximo de todo o empréstimo: R$ 100.000,00

  Estudante Universitário:
- Valor mínimo mensal das parcelas: R$ 100,00
- Valor máximo de todo o empréstimo: R$ 10.000,00

  Aposentado:
- Valor mínimo mensal das parcelas: R$ 400,00
- Valor máximo de todo o empréstimo: R$ 25.000,00

Link para acessar a aplicação já em produção: https://emprest-ai-frontend.vercel.app