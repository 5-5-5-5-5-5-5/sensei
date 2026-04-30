---
Proveniência e Autoria: Este documento integra o projeto Prometheus (licença MIT-0).
---


# Guia de Comandos

Este guia documenta os comandos efetivamente expostos pela CLI atual do Prometheus.

## Visão Geral

```bash
prometheus --help
```

Comandos disponíveis:

- `diagnosticar|diag`
- `guardian`
- `formatar`
- `otimizar-svg`
- `podar`
- `reestruturar`
- `atualizar`
- `analistas`
- `metricas`
- `fix-types`
- `licencas`
- `name`
- `reverter`
- `perf`

## diagnosticar

Análise completa do repositório.

```bash
prometheus diagnosticar [opções]
```

Flags principais:

- `--listar-analistas`
- `--guardian-check`
- `--json`
- `--json-ascii`
- `--fast`
- `--trust-compiler`
- `--verify-cycles`
- `--criar-arquetipo`
- `--salvar-arquetipo`
- `--include <padrao>`
- `--exclude <padrao>`
- `--exclude-tests`
- `--full`
- `--compact`
- `--log-level <nivel>`
- `--executive`
- `--auto-fix`
- `--auto-fix-mode <modo>`
- `--auto-fix-conservative`
- `--fix`
- `--fix-safe`
- `--show-fixes`
- `--export`
- `--export-full`
- `--export-to <dir>`

Exemplos:

```bash
prometheus diagnosticar --compact
prometheus diagnosticar --full --guardian-check
prometheus diagnosticar --json --export --export-to relatorios
prometheus diagnosticar --include "src/**" --exclude "**/*.test.ts"
prometheus diagnosticar --fix-safe
```

## guardian

Baseline e verificação de integridade.

```bash
prometheus guardian [opções]
```

Flags:

- `--accept-baseline`
- `--diff`
- `--full-scan`
- `--json`

Exemplos:

```bash
prometheus guardian --accept-baseline
prometheus guardian --diff
prometheus guardian --diff --json
```

## formatar

Formatação interna do projeto e correção de padrões.

```bash
prometheus formatar [opções]
```

Flags:

- `--check` - Apenas verifica se precisa formatação (default)
- `--write` - Aplica as mudanças no filesystem
- `--engine <engine>` - Motor: auto|interno|prettier
- `--fix-patterns` - Escaneia padrões não padronizados
- `--fix-patterns-write` - Aplica correções de padrões
- `--include <padrao>` - Glob pattern a INCLUIR
- `--exclude <padrao>` - Glob pattern a EXCLUIR

Exemplos:

```bash
prometheus formatar --check
prometheus formatar --write --engine auto
prometheus formatar --fix-patterns
prometheus formatar --fix-patterns --write
```

## otimizar-svg

Otimização de SVGs usando o motor interno.

```bash
prometheus otimizar-svg [opções]
```

Flags:

- `--dir <caminho>`
- `--write`
- `--dry`
- `--include <padrao>`
- `--exclude <padrao>`

Exemplos:

```bash
prometheus otimizar-svg --dry
prometheus otimizar-svg --dir assets/icons --write
```

## podar

Remoção de arquivos órfãos e lixo do repositório.

```bash
prometheus podar [opções]
```

Flags:

- `--force`
- `--include <padrao>`
- `--exclude <padrao>`

Exemplos:

```bash
prometheus podar
prometheus podar --force
```

## reestruturar

Aplica plano de reorganização estrutural.

```bash
prometheus reestruturar [opções]
```

Flags:

- `--auto`
- `--aplicar`
- `--somente-plano`
- `--domains`
- `--flat`
- `--prefer-estrategista`
- `--preset <nome>`
- `--categoria <pair>`
- `--include <padrao>`
- `--exclude <padrao>`

Exemplos:

```bash
prometheus reestruturar --somente-plano --preset prometheus
prometheus reestruturar --auto --flat
prometheus reestruturar --preset node-community --categoria controller=handlers
```

## atualizar

Atualização segura do Prometheus.

```bash
prometheus atualizar [opções]
```

Flags:

- `--global`

## analistas

Lista analistas registrados e seus metadados.

```bash
prometheus analistas [opções]
```

Flags:

- `--json`
- `--output <arquivo>`
- `--doc <arquivo>`

## metricas

Consulta histórico de métricas de execução.

```bash
prometheus metricas [opções]
```

Flags:

- `--json`
- `--limite <n>`
- `--export <arquivo>`
- `--analistas`

Exemplos:

```bash
prometheus metricas
prometheus metricas --analistas
prometheus metricas --json --limite 20
```

## fix-types

Detecta e corrige `any` e `unknown`.

```bash
prometheus fix-types [opções]
```

Flags:

- `--dry-run`
- `--target <path>`
- `--confidence <number>`
- `--verbose`
- `--interactive`
- `--export`
- `--include <padrao>`
- `--exclude <padrao>`

Exemplos:

```bash
prometheus fix-types --dry-run
prometheus fix-types --target src --confidence 90 --verbose
```

## licencas

Ferramentas relacionadas a licenças e avisos de terceiros.

```bash
prometheus licencas [subcomando]
```

Subcomandos confirmados:

- `scan`
- `notices`
- `disclaimer`

## name

Gerencia nomes de variáveis - extração e renomeação.

```bash
prometheus name [opções]
```

Flags:

- `--escrever` - Extrai nomes de variáveis para `names/`
- `--replace` - Aplica renomeações do arquivo `names/`
- `--legacy` - Gera também names/name.txt único

Exemplos:

```bash
prometheus name --escrever
prometheus name --escrever --legacy
prometheus name --replace
```

## reverter

Gerencia o mapa de reversão de moves estruturais.

```bash
prometheus reverter [subcomando]
```

Subcomandos:

- `listar`
- `arquivo <arquivo>`
- `move <id>`
- `limpar`
- `status`

## perf

Baseline e comparação de performance sintética.

```bash
prometheus perf [opções] [subcomando]
```

Flags:

- `--dir <dir>`
- `--json`
- `--limite <n>`

Subcomandos:

- `baseline`
- `compare`

Exemplos:

```bash
prometheus perf baseline
prometheus perf compare
prometheus perf --json compare
```


