// Prometheus Dashboard Master Controller (v0.6.0)

document.addEventListener('DOMContentLoaded', () => {
    // Estado Global
    const state = {
        workflows: [],
        currentWorkflow: null,
        analysisResults: null,
        view: 'workflows' // 'workflows', 'projeto', 'tendencias'
    };

    // Criar Banner de Status (Souls Style)
    const banner = document.createElement('div');
    banner.id = 'souls-banner';
    banner.className = 'hidden';
    document.body.appendChild(banner);

    // Inicialização
    initNavigation();
    loadWorkflows();
    loadProjectStatus();

    // --- Navegação Global ---
    function initNavigation() {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.dataset.view;
                switchView(view);
            });
        });

        // Tabs de Workflow
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                switchTab(tab);
            });
        });

        // Botões de Ferramentas
        document.getElementById('btn-diagnosticar')?.addEventListener('click', async () => {
            const btn = document.getElementById('btn-diagnosticar');
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Executando...';
            btn.disabled = true;
            try {
                const res = await fetch('/api/v1/comando/diagnosticar', { method: 'POST' });
                const data = await res.json();
                alert(data.message || 'Diagnóstico Concluído!');
                loadProjectStatus(); // Atualiza métricas
            } catch (err) {
                alert('Erro na execução: ' + err);
            } finally {
                btn.innerHTML = '<i class="fas fa-stethoscope"></i> Diagnosticar';
                btn.disabled = false;
            }
        });

        document.getElementById('btn-otimizar')?.addEventListener('click', async () => {
            const btn = document.getElementById('btn-otimizar');
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Otimizando...';
            btn.disabled = true;
            try {
                const res = await fetch('/api/v1/comando/otimizar-svg', { method: 'POST' });
                const data = await res.json();
                alert(`Otimização concluída! ${data.otimizados} arquivos processados.`);
            } catch (err) {
                alert('Erro na otimização: ' + err);
            } finally {
                btn.innerHTML = '<i class="fas fa-compress-arrows-alt"></i> Otimizar SVG';
                btn.disabled = false;
            }
        });
    }

    function switchView(view) {
        state.view = view;
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelector(`[data-view="${view}"]`).classList.add('active');

        document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
        document.getElementById(`view-${view}`).classList.remove('hidden');

        if (view === 'tendencias') loadTrends();
        if (view === 'projeto') loadProjectStatus();
    }

    function switchTab(tab) {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
        document.getElementById(`tab-${tab}`).classList.remove('hidden');

        if (tab === 'grafo' && state.analysisResults) renderGraph();
    }

    // --- API Interactions ---
    async function loadWorkflows() {
        try {
            const res = await fetch('/api/v1/repositorio/arquivos');
            const data = await res.json();
            state.workflows = data.workflows || [];
            renderWorkflowList();
        } catch (err) {
            console.error('Erro ao listar workflows:', err);
        }
    }

    async function loadProjectStatus() {
        try {
            const res = await fetch('/api/v1/repositorio/status');
            const data = await res.json();

            document.getElementById('status-integridade').textContent = data.saude || 'OK';
            document.getElementById('info-workflows').textContent = data.metricas?.workflows || '0';
            document.getElementById('info-versao').textContent = data.versao || '0.6.0';

            const guardianDesc = document.getElementById('guardian-desc');
            if (data.metricas?.integridade) {
                guardianDesc.textContent = data.metricas.integridade;
            }

            if (data.metricas?.radar) {
                renderRadarChart(data.metricas.radar);
            }
        } catch (err) {
            console.error('Erro ao obter status:', err);
        }
    }

    function renderRadarChart(radarData) {
        const ctx = document.getElementById('radar-chart').getContext('2d');
        if (window.radarChart) window.radarChart.destroy();

        window.radarChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Segurança', 'Performance', 'Documentação', 'Arquitetura', 'Qualidade'],
                datasets: [{
                    label: 'Saúde do Projeto',
                    data: [
                        radarData.seguranca || 0,
                        radarData.performance || 0,
                        radarData.documentacao || 0,
                        radarData.arquitetura || 0,
                        radarData.qualidade || 0
                    ],
                    backgroundColor: 'rgba(78, 205, 196, 0.2)',
                    borderColor: '#4ecdc4',
                    pointBackgroundColor: '#4ecdc4',
                    borderWidth: 2
                }]
            },
            options: {
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        pointLabels: { color: '#a4b0be', font: { size: 12 } },
                        ticks: { display: false, max: 100, min: 0, stepSize: 20 }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    function renderWorkflowList() {
        const list = document.getElementById('workflow-list');
        list.textContent = '';
        state.workflows.forEach(wf => {
            const li = document.createElement('li');
            li.textContent = wf;
            li.addEventListener('click', () => analyzeWorkflow(wf));
            list.appendChild(li);
        });
    }

    async function analyzeWorkflow(relPath) {
        state.currentWorkflow = relPath;
        document.getElementById('welcome-screen').classList.add('hidden');
        document.getElementById('analysis-detail').classList.remove('hidden');
        document.getElementById('current-workflow-name').textContent = relPath;

        // Limpar resultados anteriores
        const list = document.querySelectorAll('#workflow-list li');
        list.forEach(li => li.classList.remove('active'));
        document.querySelector(`#workflow-list li:nth-child(${state.workflows.indexOf(relPath) + 1})`)?.classList.add('active');

        try {
            const res = await fetch('/api/v1/analistas/github-actions/analisar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ relPath })
            });
            const data = await res.json();
            state.analysisResults = data.resultados;
            renderAnalysis();
        } catch (err) {
            console.error('Erro na análise:', err);
        }
    }

    function renderAnalysis() {
        const results = state.analysisResults || [];
        const score = 100 - (results.length * 5);
        const scoreEl = document.getElementById('workflow-score');
        scoreEl.textContent = `Score: ${Math.max(0, score)}`;
        scoreEl.className = 'score-badge ' + (score > 80 ? 'good' : (score > 50 ? 'warn' : 'critical'));

        // Problemas Tabela
        const body = document.getElementById('problems-body');
        body.textContent = '';
        results.forEach(p => {
            const tr = document.createElement('tr');

            const tdLinha = document.createElement('td');
            tdLinha.textContent = p.linha || 1;

            const tdTipo = document.createElement('td');
            tdTipo.textContent = p.tipo;

            const tdMsg = document.createElement('td');
            tdMsg.textContent = p.mensagem;

            const tdNivel = document.createElement('td');
            const spanNivel = document.createElement('span');
            spanNivel.className = `severity ${p.nivel}`;
            spanNivel.textContent = p.nivel;
            tdNivel.appendChild(spanNivel);

            tr.appendChild(tdLinha);
            tr.appendChild(tdTipo);
            tr.appendChild(tdMsg);
            tr.appendChild(tdNivel);

            body.appendChild(tr);
        });

        // Resumo
        const hasCritical = results.some(r => r.nivel === 'erro');
        document.getElementById('sec-status').textContent = hasCritical ? '❌ Problemas de Segurança' : '✅ Seguro';
        document.getElementById('sec-status').className = hasCritical ? 'critical' : 'success';

        // Souls Feedback
        showSoulsBanner(hasCritical, score);

        // Reset view to resume
        switchTab('resumo');
    }

    function showSoulsBanner(hasCritical, score) {
        const b = document.getElementById('souls-banner');
        if (!b) return;

        b.className = '';
        if (score >= 100) {
            b.textContent = 'VICTORY ACHIEVED';
            b.classList.add('victory', 'visible');
        } else if (hasCritical) {
            b.textContent = 'YOU DIED';
            b.classList.add('death', 'visible');
        }

        setTimeout(() => {
            b.classList.remove('visible');
            b.classList.add('hidden');
        }, 4000);
    }

    function renderGraph() {
        const mermaidDiv = document.getElementById('workflow-graph');
        // Simple logic to build graph from steps
        let graphDef = 'graph TD;\n';
        const steps = state.analysisResults ? state.analysisResults.filter(r => r.mensagem.includes('Job') || r.mensagem.includes('step')) : [];

        if (steps.length === 0) {
            graphDef += '  Start((Start)) --> End((Fim))';
        } else {
             graphDef += '  Workflow --> Analise;\n';
             graphDef += '  Analise --> Concluido;';
        }

        mermaidDiv.textContent = graphDef;
        mermaid.init(undefined, mermaidDiv);
    }

    async function loadTrends() {
        try {
            const res = await fetch('/api/v1/repositorio/metricas');
            const data = await res.json();
            renderChart(data);
        } catch (err) {
            console.error('Erro ao carregar tendências:', err);
        }
    }

    function renderChart(data) {
        const ctx = document.getElementById('trend-chart').getContext('2d');
        if (window.myChart) window.myChart.destroy();

        window.myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(d => new Date(d.timestamp).toLocaleDateString()),
                datasets: [{
                    label: 'Score de Saúde',
                    data: data.map(d => d.score),
                    borderColor: '#ff4757',
                    tension: 0.4,
                    fill: true,
                    backgroundColor: 'rgba(255, 71, 87, 0.1)'
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: false, grid: { color: 'rgba(255,255,255,0.05)' } },
                    x: { grid: { display: false } }
                }
            }
        });
    }
});
