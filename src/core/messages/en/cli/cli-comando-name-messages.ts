// SPDX-License-Identifier: MIT

export const CliComandoNameMensagens = {
  descricao: 'Manages variable names in the repository. Use --escrever to extract names and --replace to apply renames.',
  opcaoEscrever: 'Extracts variable names and generates mapping files in names/ (mirrored structure).',
  opcaoReplace: 'Applies variable renames based on mapping file(s) in names/.',
  opcaoLegacy: 'Also generates names/name.txt (legacy mode), used with --escrever.',
  initiatingVarredura: 'Starting variable name scan...',
  avisoErroProcessar: '[Warning] Error processing {arquivo}',
  varreduraConcluidaFragmentada: 'Scan complete! {variaveis} variables in {arquivos} files. Mapped in {pastaFragmentada} and aggregated in {pastaAgregada}.',
  varreduraConcluidaEspelhada: 'Scan complete! {variaveis} variables in {arquivos} files. Mapping in {pasta} (mirrored structure).',
  nenhumArquivoMapeamento: 'No mapping file in {pasta}. Run {comando} first.',
  pastaNaoEncontrada: 'Mapping folder not found: {pasta}. Run {comando} first.',
  nenhumMapeamento: 'No translation mapping found (format: oldName = newName per line).',
  conflitoMapeamento: 'Mapping conflict for "{nome}": {arquivo} uses "{novo}", previous was "{anterior}" (last wins).',
  iniciandoRenomeacao: 'Starting variable rename ({total} mappings)...',
  arquivoAtualizado: 'Updated: {arquivo}',
  renomeacaoConcluida: 'Rename complete! {total} files updated.',
  uso: 'Usage: name --escrever (extract names) or name --replace (apply renames). Combine with --legacy for aggregated mode.',
} as const;