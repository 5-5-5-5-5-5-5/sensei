// SPDX-License-Identifier: MIT
// @prometheus-disable seguranca vulnerabilidade-seguranca
/**
 * プラグインアナリストメッセージ
 *
 * プラグインすべてのメッセージを一元化:
 * - React
 * - React Hooks
 * - Tailwind
 * - CSS
 * - HTML
 * - Python
 */

  /* -------------------------- REACT メッセージ -------------------------- */

export const ReactMensagens = {
  linkTargetBlank: 'target="_blank"のLinkにrel="noreferrer"/"noopener"がありません。',
  dangerouslySetInnerHTML: 'dangerouslySetInnerHTMLの使用が見つかりました; 必要性を検証してください。',
  imgWithoutAlt: 'alt属性のない画像（アクセシビリティ）。',
  httpFetch: 'TLSなしのHTTP検出; HTTPSを使用してください。',
  hardcodedCredential: '的可能性のあるハードコードされた認証情報; 環境変数を使用してください。',
  locationHrefRedirect: 'location.hrefへの直接代入; 起源を検証してopen redirectを避けてください。',
  listItemNoKey: 'リストアイテム（map）にkey属性がありません。',
  indexAsKey: 'インデックスをkeyとして使用（並べ替えの問題を引き起こす可能性があります）。',
  inlineHandlerJsx: 'JSXでインラインハンドラを検出; 安定した関数（useCallback）を使用するかレンダリング外に抽出してください。',
  deprecatedLifecycleMethod: (name: string) => `廃止されたライフサイクルメソッド: ${name}。componentDidMount、componentDidUpdate、またはフックを使用してください。`,
  complexInlineStyles: '複雑なインラインスタイルを検出しました。パフォーマンスと整理のためにCSS modulesまたはstyled-componentsの使用を検討してください。`
} as const;

  /* -------------------------- REACT HOOKS メッセージ -------------------------- */

export const ReactHooksMensagens = {
  useEffectNoDeps: '依存配列のないuseEffect（ループを避けるためにdepsを評価）。',
  memoCallbackNoDeps: '依存配列のないフック（useMemo/useCallback）。',
  hookInConditional: '条件内で宣言されたフック（フックルールを壊します）。'
} as const;

  /* -------------------------- TAILWIND メッセージ -------------------------- */

export const TailwindMensagens = {
  conflictingClasses: (key: string, tokens: string[]) => `的可能性のある競合${key} (${tokens.slice(0, 4).join(', ')})。重複を確認してください。`,
  repeatedClass: (token: string) => `重複クラスを検出 (${token})。冗長性の削除を検討してください。`,
  importantUsage: (token: string) => `! (important)の使用を検出 (${token})。ユーティリティクラスまたはスコープの強化を使用し、importantの代わりにしてください。`,
  variantConflict: (prop: string, variants: string[]) => `的可能性のあるバリアント競合${prop} (variants: ${variants.slice(0, 6).join(', ')})。順序/スコープを確認してください。`,
  dangerousArbitraryValue: (token: string) => `潜在的に危険なURLを持つ任意の値 (${token})。javascript:/data:text/htmlを避けてください。`,
  arbitraryValue: (token: string) => `任意の値を持つクラス (${token})。デザインと一致していることを確認してください。`
} as const;

  /* -------------------------- CSS メッセージ -------------------------- */

export const CssMensagens = {
  duplicatePropertySame: (prop: string) => `同一の値を持つ重複プロパティ (${prop}): エラーを検出しました。`,
  duplicatePropertyDifferent: (prop: string, prev: string, curr: string) => `異なる値を持つ重複プロパティ (${prop})。的可能性のあるエラー: "${prev}" vs "${curr}"。`,
  importantUsage: '!importantの使用を検出; 適切な特異度を使用してください。',
  httpImport: 'HTTPでのインポートを検出; HTTPSまたはローカルバンドリングを使用してください。',
  httpUrl: 'url()でHTTP外部リソース; HTTPSを使用してください。',
  unifySelectors: (selectors: string[], propsCount: number) => `同一のCSSルール (${propsCount}プロパティ) がセレクタ (${selectors.slice(0, 6).join(', ')}) にあります。ユーティリティクラスまたは共有セレクタに統合/集中することを検討してください。`,
  idSelectorPreferClass: (selector: string) => `IDによるセレクタ (${selector}) を検出。再利用性と一貫性のために、可能であればクラスを使用してください。`,
  invalidProperty: (prop: string) => `無効または不明なCSSプロパティ (${prop})。スペルまたはブラウザサポートを確認してください。`,
  malformedSelector: (selector: string) => `不正または無効なCSSセレクタ (${selector})。レンダリングの問題を引き起こす可能性があります。`,
  emptyRule: '空のCSSルールを検出。宣言のないルールを削除してください。',
  vendorPrefixDeprecated: (prop: string) => `廃止されたベンダープレフィックス (${prop})。サポートされている場合は標準プロパティを使用してください。`,
  cssHackDetected: (hack: string) => `CSSハックを検出 (${hack})。モダンなアプローチまたはフィーチャークエリを検討してください。`
} as const;

  /* -------------------------- HTML メッセージ -------------------------- */

export const HtmlMensagens = {
  // 構造
  doctype: '<!DOCTYPE html>が宣言されていません。',
  htmlLang: '<html>要素にlang属性がありません（アクセシビリティ）。',
  metaCharset: 'ドキュメントに<meta charset="utf-8">がありません。',
  viewport: 'レスポンシブ用のmeta viewportがありません。',
  title: '<title>が定義されていません。',
  // リンク
  linkTargetBlank: 'target="_blank"のLinkにrel="noreferrer"/"noopener"がありません。',
  linkNoHref: '有効なhrefのないリンクまたはハンドラなし（UX）。<button>またはrole="buttonを使用してください。',
  // 画像
  imgWithoutAlt: 'alt属性のない画像またはアクセシビリティなし（WCAG 2.1）。',
  imgWithoutLoading: 'loading属性のない画像（パフォーマンス）。loading="lazy"を検討してください。',
  imgWithoutDimensions: 'width/heightのない画像（レイアウトシフト）。CLSを避けるために寸法を定義してください。',
  // フォーム
  formWithoutMethod: 'methodが指定されていないフォーム（GET/POST）。',
  formWithoutAction: '処理用のactionまたはdata-attributeのないフォーム。',
  inputWithoutLabel: 'name、id、またはaria-labelのない入力（アクセシビリティ/ユーザビリティ）。',
  passwordWithoutAutocomplete: 'autocompleteが指定されていないパスワードフィールド（セキュリティ）。',
  inputWithoutType: 'typeが指定されていない入力（textと仮定しますが、明示的にしてください）。',
  // ハンドラ
  inlineHandler: 'インラインハンドラを検出 (on*)。外部リスナーまたはdata-attributes with JSを検討してください。',
  // スクリプト/スタイル
  inlineScript: 'インラインスクリプトを検出。より良いキャッシュとCSPのために外部ファイルを検討してください。',
  inlineStyle: 'インラインスタイルを検出。より良いキャッシュのために外部CSSファイルを検討してください。',
  scriptWithoutDefer: 'defer/asyncのないスクリプト。レンダリングをブロックする可能性があります; deferを検討してください。',
  // アクセシビリティ
  headingSkipped: (current: number, expected: number) => `見出しスキップ: h${current}にh${expected}が先行していません（セマンティック構造）。`,
  buttonWithoutText: 'テキストまたはaria-labelのないボタン（アクセシビリティ）。',
  tableWithoutCaption: '<caption>またはaria-labelのないテーブル（アクセシビリティ）。',
  iframeWithoutTitle: 'titleのないiframe（アクセシビリティ）。',
  // パフォーマンス
  largeInlineScript: '大きなインラインスクリプト。外部ファイルに移動してください。',
  multipleH1: '複数の<h1>を検出。SEO/アクセシビリティのためにページごとに1つだけ使用してください。'
} as const;

  /* -------------------------- XML メッセージ -------------------------- */

export const XmlMensagens = {
  xmlPrologAusente: 'XMLに<?xml ...?>がありません（オプションですが互換性が向上します）。',
  doctypeDetectado: 'XMLに<!DOCTYPE>が含まれています。XXE（外部エンティティ）ベクトルに注意してください。',
  doctypeExternoDetectado: 'XMLに外部識別子を持つDOCTYPEが含まれています（SYSTEM/PUBLIC）。パースタが安全でない場合、XXEのリスクが高くなります。',
  entidadeDetectada: 'XMLに<!ENTITY>が含まれています。展開/XXEのリスクがあるかどうかを確認してください。',
  entidadeExternaDetectada: 'XMLに外部エンティティが含まれています（SYSTEM/PUBLIC）。パースタが安全でない場合、XXEのリスクが高いです。',
  entidadeParametroDetectada: 'XMLにパラメータエンティティ（<!ENTITY % ...>）が含まれています。XXE/DTDインジェectionに使用される可能性があります; 注意して確認してください。',
  xincludeDetectado: 'XMLにXInclude（<xi:include>）が含まれています。外部リソースを読み込む可能性があります; 起源とパースタを検証してください。',
  namespaceUndeclared: (prefix: string) => `名前空間プレフィックス"${prefix}"がxmlns:${prefix}の宣言なしで使われています。`,
  invalidXmlStructure: '無効なXML構造を検出（タグが閉じていないか正しくネストされていない）。',
  encodingMismatch: (declared: string, detected: string) => `宣言されたエンコーディング (${declared}) が検出されたものと一致しません (${detected})。`,
  largeEntityExpansion: '的可能性のある非常に大きな展開を持つエンティティ。Billion Laughs攻撃のリスク。',
  cdataInAttribute: '属性値でCDATAを検出（XMLで無効）。'
} as const;

  /* -------------------------- フォーマッタ（最小化）メッセージ -------------------------- */

export const FormatadorMensagens = {
  naoFormatado: (parser: string, detalhes?: string) => {
    const base = `ファイルがフォーマットされていないようです（パーサー: ${parser}）。Prometheusのフォーマッタで正規化することを検討してください。`;
    if (!detalhes) return base;
    return `${base} (${detalhes})`;
  },
  parseErro: (parser: string, err: string) => `内部フォーマットの検証に失敗しました（パーサー: ${parser}）: ${err}`
} as const;

  /* -------------------------- SVG（最適化）メッセージ -------------------------- */

export const SvgMensagens = {
  naoPareceSvg: '.svgファイルに有効な<svg>タグがありません。',
  semViewBox: 'viewBoxのないSVGを検出（レスポンシブを損なう可能性があります）。',
  scriptInline: 'SVGに<script>が含まれています。セキュリティリスク: スクリプト付きのSVGを避けてください。',
  eventoInline: 'SVGにインラインハンドラ（on*）が含まれています。アセットでインラインイベントを避けてください。',
  javascriptUrl: 'SVGにURL/hrefにjavascript:が含まれています。セキュリティリスク。',
  podeOtimizar: (originalBytes: number, optimizedBytes: number, mudancas: string[]) => `SVGは最適化できます (${originalBytes}B → ${optimizedBytes}B)。変更: ${mudancas.join(', ')}。`
} as const;

  /* -------------------------- CSS-IN-JS メッセージ -------------------------- */

export const CssInJsMensagens = {
  detectedStyledComponents: 'styled-componentsのパターンを検出（CSS-in-JS）。',
  detectedStyledJsx: 'styled-jsxのパターンを検出（ReactでのCSS-in-JS）。',
  globalStyles: (fonte: 'styled-components' | 'styled-jsx') => `グローバルスタイルを検出 (${fonte})。可能な限りローカルスコープを検討してください。`,
  importantUsage: 'CSS-in-JSで!importantの使用を検出; 適切な特異度を使用してください。',
  httpUrl: 'url()でHTTP外部リソース; HTTPSを使用してください。'
} as const;

  /* -------------------------- PYTHON メッセージ -------------------------- */

export const PythonMensagens = {
  // インポートと依存関係
  missingTypeHints: '型ヒントのない関数を検出; 可読性向上のために型ヒントを追加してください。',
  hardcodedString: (string: string) => `ハードコードされた文字列を検出 (${string.slice(0, 30)}...); 定数の使用を検討してください。',
  httpWithoutVerify: 'verify=TrueなしのHTTPリクエストを検出; SSL証明書を検証してください。',
  sqlInjection: 'の可能性のあるSQLインジェクションを検出; プリペアードステートメントを使用してください。',
  // コード品質
  broadExcept: '汎用例外（except:）を検出; 具体的にしてください。',
  bareRaise: 'コンテキストなしのraiseを検出; スタックトレースを維持するために常に例外を渡してください。',
  passInExcept: 'pass exceptブロック; 適切なエラー処理を実装してください。',
  // ベストプラクティス
  printInsteadOfLog: 'print()を検出; 本番ではloggingモジュールを使用してください。',
  evalUsage: 'eval()を検出; evalの使用を避けてください - セキュリティ脆弱性。',
  execUsage: 'exec()を検出; execの使用を避けてください - セキュリティ脆弱性。',
  subprocessShellTrue: 'shell=Trueのsubprocessを検出; コマンドインジェクションのリスク。引数リストとshell=Falseを使用してください。',
  pickleUsage: 'pickle load(s)を検出; 信頼できないデータを逆シリアル化しないでください（RCE）。安全な形式（JSON）を使用してください。',
  yamlUnsafeLoad: '安全なLoaderなしのyaml.loadを検出; yaml.safe_loadを使用してください（実行を回避）。',
  globalKeyword: 'globalキーワードの使用を検出; パラメータとして渡すことが検討してください。',
  mutableDefault: '可変デフォルト引数（list/dict）を検出; デフォルトとしてNoneを使用してください。',
  // パフォーマンス
  listComprehensionOpportunity: 'リスト内包表記にできるループを検出。',
  loopingOverDict: '.items()なしでdictを反復; .items()の使用を検討してください。'
} as const;

  /* -------------------------- 重大度レベル -------------------------- */

export const SeverityNiveis = {
  error: 'エラー',
  warning: '警告',
  info: '情報',
  suggestion: '提案'
} as const;

  /* -------------------------- アナリストタイプ/カテゴリ -------------------------- */

export const AnalystTipos = {
  react: 'react/ルール',
  reactHooks: 'react-hooks/ルール',
  tailwind: 'tailwindcss/ルール',
  css: 'css/ルール',
  html: 'html/ルール',
  python: 'python/ルール',
  xml: 'xml/ルール',
  formatador: 'フォーマッタ/ルール',
  svg: 'svg/ルール',
  cssInJs: 'css-in-js/ルール'
} as const;
export const AnalystOrigens = {
  react: 'アナリスト-react',
  reactHooks: 'アナリスト-react-hooks',
  tailwind: 'アナリスト-tailwind',
  css: 'アナリスト-css',
  html: 'アナリスト-html',
  python: 'アナリスト-python',
  xml: 'アナリスト-xml',
  formatador: 'アナリスト-フォーマッタ',
  svg: 'アナリスト-svg',
  cssInJs: 'アナリスト-css-in-js'
} as const;
