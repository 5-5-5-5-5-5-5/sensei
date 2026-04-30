// SPDX-License-Identifier: MIT
/**
 * Context Detector for React, Next.js, Vue, and Electron
 *
 * Provides context detection for frontend frameworks and Electron apps
 */

import type { EvidenciaContexto, FileEntryWithAst, PackageJson, ResultadoDeteccaoContextual } from '@prometheus';

const PADROES_REACT = {
  'next-fullstack': {
    dependencias: ['next', 'react', 'react-dom', '@types/react', '@types/node', 'typescript'],
    imports: ['next', 'react', 'next/router', 'next/link', 'next/head'],
    estrutura: ['pages', 'app', 'api', 'components', 'lib', 'utils', 'styles', 'public', 'prisma'],
    configs: ['next.config.js', 'next.config.ts', 'next.config.mjs', 'next-env.d.ts', 'tailwind.config.js'],
    scripts: ['dev', 'build', 'start', 'lint', 'type-check'],
    codigoPatterns: [
      /export\s+default\s+function.*Page/i,
      /getServerSideProps/i,
      /getStaticProps/i,
      /getStaticPaths/i,
      /NextApiRequest/i,
      /NextApiResponse/i,
      /useRouter/i,
      /next\/head/i,
      /next\/link/i,
      /export\s+default\s+function\s+Page/i,
      /export\s+default\s+function\s+Layout/i,
      /export\s+default\s+function\s+Loading/i,
      /export\s+default\s+function\s+Error/i,
      /export\s+default\s+function\s+NotFound/i,
      /metadata\s*=/i,
      /generateStaticParams/i,
      /generateMetadata/i
    ],
    antiPatterns: []
  },
  'react-spa': {
    dependencias: ['react', 'react-dom', 'react-router-dom', 'vite'],
    imports: ['react', 'react-dom', 'react-router'],
    estrutura: ['src/components', 'src/pages', 'src/hooks', 'src/context'],
    configs: ['vite.config.js', 'webpack.config.js', 'tsconfig.json'],
    scripts: ['dev', 'build', 'preview'],
    codigoPatterns: [
      /ReactDOM\.render/i,
      /createRoot/i,
      /useState/i,
      /useEffect/i,
      /BrowserRouter/i,
      /Routes/i,
      /Route/i,
      /Switch/i
    ],
    antiPatterns: []
  },
  'electron-app': {
    dependencias: ['electron', 'electron-builder', 'electron-updater', 'electron-log'],
    imports: ['electron'],
    estrutura: ['src/main', 'src/renderer', 'src/preload', 'dist', 'build'],
    configs: ['main.js', 'main.ts', 'preload.js', 'preload.ts', 'electron.js'],
    scripts: ['electron', 'build:electron', 'pack', 'start:electron'],
    codigoPatterns: [
      /new\s+BrowserWindow/i,
      /app\.whenReady/i,
      /ipcMain\.handle/i,
      /ipcMain\.on/i,
      /ipcRenderer/i,
      /contextBridge\.exposeInMainWorld/i,
      /webContents\.loadURL/i,
      /app\.quit/i,
      /app\.ready/i
    ],
    antiPatterns: []
  },
  'vue-spa': {
    dependencias: ['vue', '@vue/cli-service', 'vue-router', 'vuex', 'pinia'],
    imports: ['vue', 'vue-router', 'vuex', 'pinia'],
    estrutura: ['src/components', 'src/views', 'src/router', 'src/store', 'src/composables', 'public'],
    configs: ['vue.config.js', 'vue.config.ts', 'vite.config.ts'],
    scripts: ['serve', 'build', 'lint'],
    codigoPatterns: [
      /createApp\(/i,
      /<template>/i,
      /<script>/i,
      /<style/i,
      /defineComponent/i,
      /setup\(\)/i,
      /ref\(/i,
      /reactive\(/i,
      /computed\(/i,
      /watch\(/i,
      /onMounted/i,
      /onUnmounted/i,
      /useRouter/i,
      /useRoute/i,
      /useStore/i
    ],
    antiPatterns: []
  },
  'nuxt-app': {
    dependencias: ['nuxt', 'nuxt3', '@nuxt/devtools', '@nuxtjs/tailwindcss'],
    imports: ['nuxt', '@nuxt/kit'],
    estrutura: ['pages', 'components', 'layouts', 'plugins', 'middleware', 'composables', 'server/api'],
    configs: ['nuxt.config.js', 'nuxt.config.ts'],
    scripts: ['dev', 'build', 'generate', 'preview'],
    codigoPatterns: [
      /defineNuxtConfig/i,
      /useHead/i,
      /useState/i,
      /useFetch/i,
      /useAsyncData/i,
      /navigateTo/i,
      /<NuxtPage/i,
      /<NuxtLink/i,
      /definePageMeta/i,
      /server\/api/i
    ],
    antiPatterns: []
  },
  'vite-vue': {
    dependencias: ['vue', 'vite', '@vitejs/plugin-vue', 'vue-router', 'pinia'],
    imports: ['vue', 'vite', '@vitejs/plugin-vue'],
    estrutura: ['src/components', 'src/views', 'src/router', 'src/stores', 'src/composables', 'src/assets'],
    configs: ['vite.config.js', 'vite.config.ts', 'index.html'],
    scripts: ['dev', 'build', 'preview'],
    codigoPatterns: [
      /createApp\(/i,
      /<template>/i,
      /<script\s+setup/i,
      /<style\s+scoped/i,
      /defineComponent/i,
      /setup\(\)/i,
      /ref\(/i,
      /reactive\(/i,
      /computed\(/i
    ],
    antiPatterns: []
  }
};

function analisarDependenciasReact(packageJson?: PackageJson): EvidenciaContexto[] {
  const evidencias: EvidenciaContexto[] = [];
  if (!packageJson) return evidencias;
  const deps = {
    ...(packageJson.dependencies as Record<string, string> || {}),
    ...(packageJson.devDependencies as Record<string, string> || {})
  };
  for (const [tecnologia, padroes] of Object.entries(PADROES_REACT)) {
    for (const dep of padroes.dependencias) {
      if (deps[dep]) {
        evidencias.push({
          tipo: 'dependencia',
          valor: dep,
          confianca: 0.8,
          tecnologia,
          localizacao: 'package.json'
        });
      }
    }
  }
  return evidencias;
}

function analisarScriptsReact(packageJson?: PackageJson): EvidenciaContexto[] {
  const evidencias: EvidenciaContexto[] = [];
  if (!packageJson) return evidencias;
  const scripts = packageJson.scripts as Record<string, string> || {};
  for (const [tecnologia, padroes] of Object.entries(PADROES_REACT)) {
    for (const script of padroes.scripts) {
      if (Object.keys(scripts).some(key => key.includes(script) || scripts[key]?.includes(script))) {
        evidencias.push({
          tipo: 'script',
          valor: script,
          confianca: 0.6,
          tecnologia,
          localizacao: 'package.json'
        });
      }
    }
  }
  return evidencias;
}

function analisarEstruturaReact(estruturaDetectada: string[]): EvidenciaContexto[] {
  const evidencias: EvidenciaContexto[] = [];
  for (const [tecnologia, padroes] of Object.entries(PADROES_REACT)) {
    for (const estrutura of padroes.estrutura) {
      const matchExato = estruturaDetectada.find(dir => {
        if (dir === estrutura) return true;
        if (dir.endsWith(`/${estrutura}`)) return true;
        if (dir.startsWith(`${estrutura}/`)) return true;
        return false;
      });
      if (matchExato) {
        evidencias.push({
          tipo: 'estrutura',
          valor: estrutura,
          confianca: 0.7,
          tecnologia,
          localizacao: matchExato
        });
      }
    }
  }
  return evidencias;
}

function analisarPadroesCodigoReact(arquivos: FileEntryWithAst[]): EvidenciaContexto[] {
  const evidencias: EvidenciaContexto[] = [];
  for (const arquivo of arquivos) {
    if (!arquivo.content) continue;
    for (const [tecnologia, padroes] of Object.entries(PADROES_REACT)) {
      for (const pattern of padroes.codigoPatterns) {
        if (pattern.test(arquivo.content)) {
          evidencias.push({
            tipo: 'codigo',
            valor: pattern.source,
            confianca: 0.85,
            tecnologia,
            localizacao: arquivo.relPath
          });
        }
      }
    }
  }
  return evidencias;
}

function detectarProblemasReact(tecnologia: string, arquivos: FileEntryWithAst[]): string[] {
  const problemas: string[] = [];
  switch (tecnologia) {
    case 'electron-app':
      for (const arquivo of arquivos) {
        if (arquivo.content?.includes('nodeIntegration: true')) {
          problemas.push(` nodeIntegration habilitado em ${arquivo.relPath} - risco de segurança`);
        }
        if (arquivo.content?.includes('contextIsolation: false')) {
          problemas.push(` contextIsolation desabilitado em ${arquivo.relPath} - vulnerabilidade`);
        }
        if (arquivo.content?.includes('webSecurity: false')) {
          problemas.push(` webSecurity desabilitado em ${arquivo.relPath} - risco de segurança`);
        }
      }
      break;
    case 'next-fullstack':
      for (const arquivo of arquivos) {
        if (arquivo.content?.includes('getServerSideProps') && arquivo.content?.includes('await fetch(') && !arquivo.content?.includes('try') && !arquivo.content?.includes('catch')) {
          problemas.push(` getServerSideProps em ${arquivo.relPath} sem tratamento de erros`);
        }
        if (arquivo.content?.includes('process.env') && !arquivo.content?.includes('NEXT_PUBLIC_')) {
          const hasEnvCheck = /process\.env\.NODE_ENV/.test(arquivo.content);
          if (!hasEnvCheck) {
            problemas.push(` Variável de ambiente em ${arquivo.relPath} pode não estar disponível no cliente`);
          }
        }
      }
      break;
  }
  return problemas;
}

function gerarSugestoesReact(tecnologia: string): string[] {
  const sugestoes: string[] = [];
  switch (tecnologia) {
    case 'electron-app':
      sugestoes.push(' Implementar preload script para comunicação segura');
      sugestoes.push(' Habilitar context isolation para segurança');
      break;
    case 'next-fullstack':
      sugestoes.push(' Usar getStaticProps para conteúdo estático');
      sugestoes.push(' Implementar incremental static regeneration');
      break;
    case 'vue-spa':
      sugestoes.push(' Considerar Composition API para melhor code reuse');
      break;
  }
  return sugestoes;
}

export function detectarContextoReact(
  estruturaDetectada: string[],
  arquivos: FileEntryWithAst[],
  packageJson?: PackageJson
): ResultadoDeteccaoContextual[] {
  const todasEvidencias: EvidenciaContexto[] = [
    ...analisarDependenciasReact(packageJson),
    ...analisarScriptsReact(packageJson),
    ...analisarEstruturaReact(estruturaDetectada),
    ...analisarPadroesCodigoReact(arquivos)
  ];

  const evidenciasPorTecnologia = new Map<string, EvidenciaContexto[]>();
  for (const evidencia of todasEvidencias) {
    const tec = evidencia.tecnologia || 'desconhecido';
    if (!evidenciasPorTecnologia.has(tec)) {
      evidenciasPorTecnologia.set(tec, []);
    }
    const tecEvidencias = evidenciasPorTecnologia.get(tec);
    if (tecEvidencias) {
      tecEvidencias.push(evidencia);
    }
  }

  const resultados: ResultadoDeteccaoContextual[] = [];
  for (const [tecnologia, evidencias] of evidenciasPorTecnologia) {
    let confiancaTotal = 0;
    if (evidencias.length > 0) {
      const soma = evidencias.reduce((acc, e) => acc + e.confianca, 0);
      confiancaTotal = soma / evidencias.length;
    }

    const padraoTecnologia = PADROES_REACT[tecnologia as keyof typeof PADROES_REACT];
    if (padraoTecnologia && padraoTecnologia.dependencias.length > 0) {
      const temDependenciaObrigatoria = evidencias.some(e => e.tipo === 'dependencia' && padraoTecnologia.dependencias.includes(e.valor));
      if (!temDependenciaObrigatoria) {
        confiancaTotal *= 0.1;
      }
    }

    if (confiancaTotal > 0.3) {
      resultados.push({
        tecnologia,
        confiancaTotal,
        evidencias,
        sugestoesMelhoria: gerarSugestoesReact(tecnologia),
        problemasDetectados: detectarProblemasReact(tecnologia, arquivos)
      });
    }
  }

  return resultados.sort((a, b) => b.confiancaTotal - a.confiancaTotal);
}

export function inferirArquetipoReact(
  estruturaDetectada: string[],
  arquivos: FileEntryWithAst[],
  packageJson?: PackageJson
): string {
  const resultados = detectarContextoReact(estruturaDetectada, arquivos, packageJson);
  if (resultados.length === 0) return 'generico';

  const mapeamentoArquetipos: Record<string, string> = {
    'next-fullstack': 'fullstack',
    'react-spa': 'landing-page',
    'electron-app': 'electron',
    'vue-spa': 'vue-spa',
    'nuxt-app': 'vue-spa',
    'vite-vue': 'vue-spa'
  };

  return mapeamentoArquetipos[resultados[0].tecnologia] || 'generico';
}
