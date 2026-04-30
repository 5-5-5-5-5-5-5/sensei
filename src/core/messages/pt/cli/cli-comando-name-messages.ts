// SPDX-License-Identifier: MIT

export const CliComandoNameMensagens = {
  descricao: 'Gerencia nomes de variáveis no repositório. Use --escrever para extrair nomes e --replace para aplicar renomeações.',
  opcaoEscrever: 'Extrai nomes de variáveis e gera arquivos de mapeamento em names/ (estrutura espelhada).',
  opcaoReplace: 'Aplica as renomeações de variáveis baseadas no arquivo(s) de mapeamento em names/.',
  opcaoLegacy: 'Gera também names/name.txt único (compatibilidade com fluxo antigo), usado com --escrever.',
  iniciandoVarredura: 'Iniciando varredura de nomes de variáveis...',
  avisoErroProcessar: '[Aviso] Erro ao processar {arquivo}',
  varreduraConcluidaFragmentada: 'Varredura concluída! {variaveis} variáveis em {arquivos} arquivos. Mapeamento fragmentado em {pastaFragmentada} e agregado em {pastaAgregada}.',
  varreduraConcluidaEspelhada: 'Varredura concluída! {variaveis} variáveis em {arquivos} arquivos. Mapeamento em {pasta} (estrutura espelhada).',
  nenhumArquivoMapeamento: 'Nenhum arquivo de mapeamento em {pasta}. Execute o comando {comando} primeiro.',
  pastaNaoEncontrada: 'Pasta de mapeamento não encontrada: {pasta}. Execute o comando {comando} primeiro.',
  nenhumMapeamento: 'Nenhum mapeamento de tradução encontrado (formato: nomeAntigo = nomeNovo por linha).',
  conflitoMapeamento: 'Conflito de mapeamento para "{nome}": {arquivo} usa "{novo}", anterior era "{anterior}" (last wins).',
  iniciandoRenomeacao: 'Iniciando renomeação de variáveis ({total} mapeamentos)...',
  arquivoAtualizado: 'Atualizado: {arquivo}',
  renomeacaoConcluida: 'Renomeação concluída! {total} arquivos atualizados.',
  uso: 'Uso: name --escrever (extrai nomes) ou name --replace (aplica renomeações). Combine com --legacy para modo agregado.',
} as const;