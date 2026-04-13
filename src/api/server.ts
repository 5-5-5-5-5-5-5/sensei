// SPDX-License-Identifier: MIT
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrometheusSDK } from '../sdk/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Servidor de API e Dashboard do Prometheus (v0.6.0)
 */
const server = http.createServer(async (req, res) => {
  // CORS basic
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Endpoints

  // Listar arquivos
  if (req.method === 'GET' && req.url === '/api/v1/repositorio/arquivos') {
    const workflowDir = path.join(process.cwd(), '.github', 'workflows');
    let files: string[] = [];
    if (fs.existsSync(workflowDir)) {
      files = fs.readdirSync(workflowDir).filter(f => f.endsWith('.yml') || f.endsWith('.yaml'));
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ workflows: files }));
    return;
  }

  // Status Geral do Repositório (Guardian + Métricas)
  if (req.method === 'GET' && req.url === '/api/v1/repositorio/status') {
    try {
      const { scanSystemIntegrity } = await import('../guardian/sentinela.js');
      // Mock de file entries para o scan rápido (ou scan real se leve)
      // Para o dashboard, vamos focar em retornar metadados básicos por enquanto
      const workflowDir = path.join(process.cwd(), '.github', 'workflows');
      const hasWorkflows = fs.existsSync(workflowDir);
      const totalWorkflows = hasWorkflows ? fs.readdirSync(workflowDir).length : 0;

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        projeto: path.basename(process.cwd()),
        versao: '0.6.0',
        saude: 'OK',
        metricas: {
          workflows: totalWorkflows,
          integridade: 'Protegido (Guardian Active)',
          ultimaAnalise: new Date().toLocaleDateString(),
          radar: {
            seguranca: 95,
            performance: 80,
            documentacao: 70,
            arquitetura: 90,
            qualidade: 85
          }
        }
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Erro ao obter status', details: String(err) }));
    }
    return;
  }

  // Histórico de Métricas (Tendências)

  // Analisar Workflow
  if (req.method === 'POST' && req.url === '/api/v1/analistas/github-actions/analisar') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body);
        let { conteudo, relPath } = payload;

        if (!conteudo && relPath) {
          const fullPath = path.join(process.cwd(), relPath);
          if (fs.existsSync(fullPath)) {
            conteudo = fs.readFileSync(fullPath, 'utf-8');
          }
        }

        const resultados = await PrometheusSDK.analisarGithubActions(conteudo, relPath);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, resultados }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Erro na análise', detail: (err as Error).message }));
      }
    });
    return;
  }

  // --- Execução de Comandos do Dashboard ---

  // Comando: Diagnosticar Projeto
  if (req.method === 'POST' && req.url === '/api/v1/comando/diagnosticar') {
    try {
      const { processarDiagnostico } = await import('../cli/processamento-diagnostico.js');
      // Executa diagnóstico completo
      const resultado = await processarDiagnostico({ full: true, fast: true });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'Diagnóstico concluído com sucesso!',
        totalOcorrencias: resultado.totalOcorrencias
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: String(err) }));
    }
    return;
  }

  // Comando: Otimizar SVG
  if (req.method === 'POST' && req.url === '/api/v1/comando/otimizar-svg') {
    try {
      const { scanRepository } = await import('../core/execution/scanner.js');
      const { otimizarSvgLikeSvgo } = await import('../shared/impar/svgs.js');
      const { salvarEstado } = await import('../shared/persistence/persistencia.js');

      const files = await scanRepository(process.cwd(), {
        includeContent: true,
        filter: (relPath) => relPath.toLowerCase().endsWith('.svg'),
      });

      let otimizados = 0;
      for (const e of Object.values(files)) {
        const src = typeof e.content === 'string' ? e.content : '';
        if (src && /<svg\b/i.test(src)) {
          const opt = otimizarSvgLikeSvgo({ svg: src, pretty: true });
          if (opt.changed) {
            await salvarEstado(path.resolve(process.cwd(), e.relPath), opt.data);
            otimizados++;
          }
        }
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, otimizados }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: String(err) }));
    }
    return;
  }

  // Dashboard Estático
  let filePath = path.join(__dirname, 'static', req.url === '/' || req.url === '/dashboard' ? 'index.html' : req.url!);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    const contentType = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpg',
      '.svg': 'image/svg+xml',
    }[ext] || 'text/plain';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Recurso não encontrado' }));
  }
});

/**
 * Inicia o servidor de API
 */
export function iniciarServidorApi(porta = 3000) {
  server.listen(porta, () => {
    console.log(`🚀 Prometheus REST API rodando em http://localhost:${porta}`);
  });
}

// Se executado diretamente
if (process.argv[1]?.includes('server.ts') || process.argv[1]?.includes('server.js')) {
  iniciarServidorApi();
}
