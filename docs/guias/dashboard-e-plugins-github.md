---
Proveniência e Autoria: Documentação completa do Prometheus (licença MIT-0).
---

# 🚀 Dashboard Web e Sistema de Plugins (v0.6.0)

Este documento detalha as novas funcionalidades de análise visual e extensibilidade introduzidas no Prometheus para o ecossistema de GitHub Actions.

## 🎨 Dashboard Interativo

O Prometheus agora conta com uma interface visual premium para análise detalhada de workflows.

### Como Iniciar

Para abrir o dashboard no seu navegador:
```bash
prometheus dashboard --port 3000
```

### Funcionalidades Principais

1.  **Análise de Workflows**: Lista interativa de todos os arquivos `.yml` em `.github/workflows/`.
2.  **Visualização de Jobs (Grafo)**: Geração automática de diagramas de dependência utilizando Mermaid.js.
3.  **Tendências e Métricas**: Gráficos de linha (Chart.js) mostrando a evolução da qualidade e segurança ao longo do tempo.
4.  **Filtros Avançados**: Busca textual e filtragem por severidade (Crítica, Alta, Média, Baixa) para isolar problemas rapidamente.
5.  **Score Card**: Pontuação de saúde para cada workflow e para o repositório como um todo.

---

## 🔌 Sistema de Plugins (GitHub Actions)

A partir da v0.5.0, o analista de GitHub Actions tornou-se extensível, permitindo que você adicione suas próprias regras de detecção.

### Criando um Plugin

Para inicializar um novo plugin:
```bash
prometheus plugins init meu-detector-seguranca
```

### Exemplo de Implementação

```typescript
import { registrarDetectorGithubActions } from '@analistas/plugins/analista-github-actions.js';

registrarDetectorGithubActions({
  nome: 'no-sudo-allowed',
  descricao: 'Detecta uso proibido de sudo em runners',
  severidade: 'alta',
  testar: (workflow, context) => {
    const problemas = [];
    // O parâmetro 'workflow' é o YAML parseado como objeto JS
    if (context.conteudo.includes('sudo ')) {
      problemas.push({
        tipo: 'security-policy',
        descricao: 'Uso de sudo detectado. Runners devem ser não-root.',
        severidade: 'alta',
        sugestao: 'Remover sudo ou usar containers com usuários específicos.'
      });
    }
    return problemas;
  }
});
```

---

## 🔍 Analista Avançado (Engine v0.6.0)

O motor de análise agora combina **Análise Estruturada (YAML AST)** com **Análise Sintática**, permitindo detecções muito mais precisas:

- **Segurança**: Script Injection, Hardcoded Secrets, Permissões excessivas, Pinning por SHA.
- **Performance**: Falta de Caching, Jobs redundantes, Matrix strategy sem fail-fast.
- **Governança**: Falta de CODEOWNERS, README sem Código de Conduta, Ausência de automação de stale/release.

---

## 🛠️ Tecnologias Utilizadas

- **Backend**: Node.js (HTTP nativo) com Prometheus SDK.
- **Frontend**: Vanilla JS (ESNext), CSS Moderno (Glassmorphism), Google Fonts (Outfit).
- **Gráficos/Visualização**: Chart.js e Mermaid.js.
- **Parsing**: Biblioteca `yaml` para suporte a AST completo.
