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
  


### Definição de cada pasta dento da src:
- @types: tipagens gerais
- app: pasta padrão para roteamento do Next.js
- config: local onde crio estruturas para configuração, definição de variaveis de ambientes, link de roteamento centralizados, entre outros.
- schemas: todos os schemas do zod são armazenados aqui.
- controllers: todos os controlles serão feitos aqui
- libs: configurações de infraestrutura, como pipes e databases
- repositories: todas as definições e implementação de repositorios estarão lá
- useCases: casos de uso para chamar no controller
- consts: constantes geais do projeto
- utils: funções de utilidades gerais um dos exemplos são máscaras de dados e tratamento de datas.
