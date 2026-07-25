<div align="center">

# ⚡️ ★ CommitCraft CLI ★ ⚡️

**Um assistente interativo de linha de comando para otimização do fluxo de trabalho Git e padronização com Conventional Commits, ultrarrápido e construído com zero dependências externas.**

[![Versão](https://img.shields.io/badge/versão-1.0.0-00C9FF?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/commit-craft-cli)
[![Licença](https://img.shields.io/badge/licença-MIT-00ff88?style=for-the-badge)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
[![Zero Dependências](https://img.shields.io/badge/dependências-ZERO_%E2%9A%A1%EF%B8%8F-brightgreen?style=for-the-badge)](https://github.com/carlosguedes-dev/commit-craft-cli)
[![Feito com Amor](https://img.shields.io/badge/Feito_com-MUITO_AMOR_❤️-ff0055?style=for-the-badge)](https://github.com/carlosguedes-dev)

🔗 **[Acessar o Repositório no GitHub](https://github.com/carlosguedes-dev/commit-craft-cli)**

---

<p align="center">
  <img src="https://images.unsplash.com/photo-1618401471353-b98aedd04e11?q=80&w=1200&auto=format&fit=crop" alt="CommitCraft CLI Banner" width="80%" style="border-radius: 20px; box-shadow: 0 10px 30px rgba(0, 201, 255, 0.4);">
</p>

</div>

---

## 📖 Sobre o Projeto

O **CommitCraft CLI** é uma ferramenta de terminal de alto nível concebida para revolucionar a forma como desenvolvedores e equipes gerenciam seus fluxos de trabalho no Git. No desenvolvimento moderno, manter um histórico de commits limpo, semântico e rastreável é um desafio constante. Muitas interfaces de linha de comando tentam resolver esse problema, mas acabam sobrecarregando o ambiente com dezenas de bibliotecas de terceiros pesadas, aumentando o tempo de inicialização e criando riscos desnecessários de segurança na cadeia de suprimentos do NPM.

Para superar esses obstáculos, o **CommitCraft CLI** foi desenvolvido **100% do zero utilizando exclusivamente módulos nativos do Node.js** (`readline`, `child_process`, `fs`, `path` e formatação ANSI crua para terminal). O resultado é uma execução instantânea de menos de 30 milissegundos, segurança à prova de falhas sem nenhuma dependência de terceiros, e uma interface de terminal de extrema elegância, com caixas Unicode personalizadas, animações de carregamento, emblemas coloridos e cabeçalhos com gradientes dinâmicos.

Muito mais do que um simples formatador de commits, o projeto atua como um assistente completo no dia a dia do engenheiro de software: guia o desenvolvedor através do padrão **Conventional Commits**, automatiza a geração de changelogs em formato Markdown em questão de segundos e oferece uma rotina interativa de limpeza para remover ramificações locais antigas e já mescladas, mantendo o workspace sempre limpo e organizado.

---

## ✨ Principais Funcionalidades

- 🧙‍♂️ **Assistente Interativo de Commits**: Elimine a necessidade de memorizar a sintaxe complexa dos *Conventional Commits*. O assistente guia o usuário na escolha do tipo de commit (`feat`, `fix`, `docs`, `refactor`, etc.), escopo da alteração, descrição curta, corpo detalhado e referência a *issues* ou tarefas de fechamento.
- ⚡ **Desempenho Instantâneo (<30ms)**: Arquitetura leve e altamente otimizada sem bibliotecas pesadas de terminal, abrindo mais rápido do que um piscar de olhos e consumindo recursos mínimos de processamento e memória.
- 🛡️ **Zero Dependências Externas**: Código puramente construído sobre os pilares nativos do Node.js. Total imunidade a vulnerabilidades em pacotes transitivos do NPM e máxima facilidade de auditoria.
- 📜 **Gerador Automático de Changelogs**: Varre o histórico do repositório entre tags de release ou datas específicas, extrai os commits semânticos e exporta um arquivo `CHANGELOG.md` estruturado com perfeição e agrupado por categoria de impacto.
- 🧹 **Limpeza Interativa de Branches (`cleanup`)**: Identifica inteligentemente quais branches locais já foram mescladas (*merged*) na branch principal (`main` ou `master`) e exibe uma lista interativa permitindo marcar e excluir múltiplas ramificações obsoletas de uma só vez.
- 🎨 **Interface Terminal UI Premium**: Exibição de caixas delimitadoras personalizadas em Unicode, indicadores visuais de progresso (*spinners*) interativos e formatação profissional nativa com suporte a cores ANSI 24-bit TrueColor.
- 🤖 **Integração Inteligente com Git Staging**: Verifica o status da área de *staging* do Git antes da execução e oferece opções interativas para adicionar arquivos automaticamente ou continuar com a seleção atual.

---

## 💻 Tecnologias Utilizadas

O **CommitCraft CLI** é um exemplo exemplar de engenharia de software eficiente, utilizando o melhor do ecossistema moderno sem recorrer a pacotes externos desnecessários:

- **Node.js (>= 16.0.0)**: Plataforma de execução JavaScript do lado do servidor, aproveitando ao máximo os recursos assíncronos e o desempenho do motor V8.
- **Módulo Nativo `readline` & TTY**: Gerenciamento completo de fluxos de entrada e saída, captura interativa de eventos do teclado e renderização visual avançada na linha de comando.
- **Módulo Nativo `child_process`**: Execução robusta e segura de subcomandos do Git (`git commit`, `git tag`, `git branch`, `git log`) de forma sincronizada e assíncrona.
- **Módulos Nativos `fs` & `path`**: Leitura, análise, formatação e gravação segura do arquivo de histórico de mudanças (`CHANGELOG.md`) diretamente no sistema de arquivos local.
- **ANSI Escape Codes (Raw Formatting)**: Engine customizada de estilização, cores, gradientes e animações de terminal escrita sem o auxílio de bibliotecas como `chalk` ou `inquirer`.

---

## 📁 Estrutura de Arquivos

```text
commit-craft-cli/
│
├── bin/
│   └── commit-craft.js    # Ponto de entrada executável do CLI e roteador de comandos binários
├── src/
│   ├── commands/          # Implementação isolada dos comandos (commit, changelog, cleanup)
│   ├── utils/             # Utilitários para formatação ANSI, execução do Git e spinners
│   └── index.js           # Orquestrador central e assistente interativo da aplicação
├── test/                  # Suíte de testes automatizados para validação do CLI e regras Git
├── CONTRIBUTING.md        # Guia e boas práticas para contribuições de desenvolvedores
├── LICENSE                # Licença MIT de software livre e código aberto
├── package.json           # Manifesto do projeto, configuração de binários e scripts executáveis
└── README.md              # Documentação oficial e completa do projeto (este arquivo)
```

---

## 🚀 Como Instalar e Executar o Projeto

Você pode utilizar o **CommitCraft CLI** em qualquer repositório local instalando de forma global ou executando instantaneamente sob demanda.

### 1. Execução Instantânea via `npx` (Sem Instalação)
Se você deseja executar o assistente sem instalar pacotes em sua máquina:

```bash
npx commit-craft-cli
```

### 2. Instalação Global via NPM
Para ter os comandos `commit-craft` e `ccraft` disponíveis em qualquer terminal de seu sistema:

```bash
npm install -g commit-craft-cli
```

### 3. Comandos e Utilização
Abra o terminal em qualquer repositório Git e utilize os seguintes comandos:

| Comando Principal | Atalho / Alias | Descrição da Funcionalidade |
| :--- | :--- | :--- |
| `commit-craft` | `ccraft` | **Comando Padrão.** Abre o assistente interativo de Conventional Commits. |
| `commit-craft commit` | `ccraft c` | Inicia explicitamente o fluxo de criação de commit com verificação de *staging*. |
| `commit-craft changelog` | `ccraft ch` | Gera ou atualiza o arquivo `CHANGELOG.md` com base no histórico de commits. |
| `commit-craft cleanup` | `ccraft cl` | Inicia a checklist interativa para remoção de branches locais mescladas. |
| `commit-craft --help` | `ccraft -h` | Exibe o banner explicativo com todas as opções e exemplos de uso. |
| `commit-craft --version` | `ccraft -v` | Exibe a versão atual instalada do CLI. |

### 4. Opções Avançadas e Exemplos Práticos
```bash
# Gerar changelog especificando intervalo entre tags de release:
ccraft changelog --from v1.0.0 --to v1.1.0 --write

# Exportar o histórico para um arquivo de notas de lançamento personalizado:
ccraft changelog --output RELEASE_NOTES.md --write

# Verificar branches mescladas comparando com a branch 'develop' em vez de 'main':
ccraft cleanup --base develop

# Forçar a exclusão (-D) de ramificações resistentes ou sem merge concluído:
ccraft cleanup --force
```

---

## 🤝 Como Contribuir

O **CommitCraft CLI** é um projeto de software livre e sua comunidade é o que o torna tão incrível! Se você tem ideias para novas funcionalidades, melhorias no design do terminal ou correções de bugs, adoraríamos receber sua contribuição.

Por favor, consulte o arquivo [CONTRIBUTING.md](CONTRIBUTING.md) para entender nossas diretrizes de desenvolvimento, regras de envio de *Pull Requests* e como executar a suíte de testes localmente.

---

## 📄 Licença

Este projeto está licenciado sob os termos da licença **MIT**. Para mais detalhes sobre os direitos e permissões de uso, consulte o arquivo [LICENSE](LICENSE).

---

<div align="center">
  <p>Feito com todo o carinho e dedicação por <b>Carlos Guedes</b> ❤️</p>
  <p><b>Transformando código em excelência e inovação! ✨</b></p>
</div>
