// SPDX-License-Identifier: MIT
// @prometheus-disable seguranca vulnerabilidade-seguranca
/**
 * 插件分析器消息
 *
 * 集中所有插件的消息:
 * - React
 * - React Hooks
 * - Tailwind
 * - CSS
 * - HTML
 * - Python
 */

/* -------------------------- REACT消息 -------------------------- */

export const ReactMensagens = {
  linkTargetBlank: '链接使用target="_blank"但没有rel="noreferrer"/"noopener"。',
  dangerouslySetInnerHTML: '发现dangerouslySetInnerHTML的使用;请验证必要性。',
  imgWithoutAlt: '图片缺少alt属性(可访问性)。',
  httpFetch: '检测到无TLS的HTTP调用;请使用HTTPS。',
  hardcodedCredential: '可能的硬编码凭证;请使用环境变量。',
  locationHrefRedirect: '直接赋值location.href;请验证来源以避免开放重定向。',
  listItemNoKey: '列表项(map)缺少key属性。',
  indexAsKey: '使用索引作为key(可能导致重排序问题)。',
  inlineHandlerJsx: '检测到JSX内联处理程序;请使用稳定函数(useCallback)或提取到渲染外部。',
  deprecatedLifecycleMethod: (name: string) => `已弃用的生命周期方法: ${name}。请使用componentDidMount、componentDidUpdate或hooks。`,
  complexInlineStyles: '检测到复杂内联样式。请考虑使用CSS modules或styled-components以获得更好的性能和组织。'
} as const;

/* -------------------------- REACT HOOKS消息 -------------------------- */

export const ReactHooksMensagens = {
  useEffectNoDeps: 'useEffect没有依赖数组(请评估依赖以避免循环)。',
  memoCallbackNoDeps: 'Hook没有依赖数组(useMemo/useCallback)。',
  hookInConditional: '在条件语句中声明Hook(违反Hooks规则)。'
} as const;

/* -------------------------- TAILWIND消息 -------------------------- */

export const TailwindMensagens = {
  conflictingClasses: (key: string, tokens: string[]) => `可能的${key}冲突 (${tokens.slice(0, 4).join(', ')})。请检查重复。`,
  repeatedClass: (token: string) => `检测到重复类 (${token})。请考虑移除冗余。`,
  importantUsage: (token: string) => `检测到!important的使用 (${token})。请优先使用工具类或作用域增强而不是important。`,
  variantConflict: (prop: string, variants: string[]) => `可能的${prop}变体冲突 (变体: ${variants.slice(0, 6).join(', ')})。请检查顺序/作用域。`,
  dangerousArbitraryValue: (token: string) => `具有潜在危险URL的任意值 (${token})。请避免javascript:/data:text/html。`,
  arbitraryValue: (token: string) => `具有任意值的类 (${token})。请确认是否符合设计。`
} as const;

/* -------------------------- CSS消息 -------------------------- */

export const CssMensagens = {
  duplicatePropertySame: (prop: string) => `具有相同值的重复属性 (${prop}):检测到错误。`,
  duplicatePropertyDifferent: (prop: string, prev: string, curr: string) => `重复属性(${prop})具有不同值。可能错误: "${prev}" vs "${curr}"。`,
  importantUsage: '检测到!important的使用;请使用适当的特异性。',
  httpImport: '检测到HTTP导入;请使用HTTPS或本地打包。',
  httpUrl: 'url()中的HTTP外部资源;请使用HTTPS。',
  unifySelectors: (selectors: string[], propsCount: number) => `选择器中的相同CSS规则 (${propsCount}个属性) (${selectors.slice(0, 6).join(', ')})。请考虑统一/集中在共享工具类或选择器中。',
  idSelectorPreferClass: (selector: string) => `检测到ID选择器 (${selector})。为可复用性和一致性,请尽可能使用类。`,
  invalidProperty: (prop: string) => `无效或未知的CSS属性 (${prop})。请检查拼写或浏���器支持。`,
  malformedSelector: (selector: string) => `格式错误或无效的CSS选择器 (${selector})。可能导致渲染问题。',
  emptyRule: '检测到空CSS规则。请移除无声明的规则。',
  vendorPrefixDeprecated: (prop: string) => `已弃用的浏览器前缀 (${prop})。请在支持时使用标准属性。',
  cssHackDetected: (hack: string) => `检测到CSS hack (${hack})。请考虑现代方法或特性查询。'
} as const;

/* -------------------------- HTML消息 -------------------------- */

export const HtmlMensagens = {
  // 结构
  doctype: '文档未声明<!DOCTYPE html>。',
  htmlLang: '<html>元素缺少lang属性(可访问性)。',
  metaCharset: '文档缺少<meta charset="utf-8">。',
  viewport: '缺少viewport meta以实现响应式。',
  title: '文档未定义<title>。',
  // 链接
  linkTargetBlank: '链接使用target="_blank"但没有rel="noreferrer"/"noopener"。',
  linkNoHref: '链接无有效href或处理程序(UX)。请使用<button>或role="button"。',
  // 图片
  imgWithoutAlt: '图片缺少alt属性或可访问性(WCAG 2.1)。',
  imgWithoutLoading: '图片缺少loading属性(性能)。请考虑loading="lazy"。',
  imgWithoutDimensions: '图片缺少width/height(布局偏移)。请定义尺寸以避免CLS。',
  // 表单
  formWithoutMethod: '表单未指定method(GET/POST)。',
  formWithoutAction: '表单缺少action或数据属性用于处理。',
  inputWithoutLabel: 'Input缺少name、id或aria-label(可访问性/可用性)。',
  passwordWithoutAutocomplete: '密码字段未指定autocomplete(安全)。',
  inputWithoutType: 'Input未指定type(默认为text,但请明确)。',
  // 处理程序
  inlineHandler: '检测到内联处理程序(on*)。请优先使用外部监听器或带JS的数据属性。',
  // 脚本/样式
  inlineScript: '检测到内联脚本。请优先使用外部文件以获得更好的缓存和CSP。',
  inlineStyle: '检测到内联样式。请优先使用外部CSS文件以获得更好的缓存。',
  scriptWithoutDefer: '脚本无 defer/async。可能阻塞渲染;请考虑defer。',
  // 可访问性
  headingSkipped: (current: number, expected: number) => `跳过的标题: h${current}前面没有h${expected}(语义结构)。',
  buttonWithoutText: '按钮缺少文本或aria-label(可访问性)。',
  tableWithoutCaption: '表格缺少<caption>或aria-label(可访问性)。',
  iframeWithoutTitle: 'Iframe缺少title(可访问性)。',
  // 性能
  largeInlineScript: '内联脚本太大。请移至外部文件。',
  multipleH1: '检测到多个<h1>。请每个页面仅使用一个以利SEO/可访问性。'
} as const;

/* -------------------------- XML消息 -------------------------- */

export const XmlMensagens = {
  xmlPrologAusente: 'XML缺少<?xml ...?>声明(可选,但可提高兼容性)。',
  doctypeDetectado: 'XML包含<!DOCTYPE>。注意XXE向量(外部实体)。',
  doctypeExternoDetectado: 'XML包含带外部标识符的DOCTYPE (SYSTEM/PUBLIC)。如果解析器不安全,XXE风险很高。',
  entidadeDetectada: 'XML包含<!ENTITY>。请检查膨胀/XXE风险。',
  entidadeExternaDetectada: 'XML包含外部实体 (SYSTEM/PUBLIC)。如果解析器不安全,XXE风险很高。',
  entidadeParametroDetectada: 'XML包含参数实体 (<!ENTITY % ...>)。可能用于XXE/DTD注入;请仔细审查。',
  xincludeDetectado: 'XML包含XInclude (<xi:include>)。可以加载外部资源;请验证来源和解析器。',
  namespaceUndeclared: (prefix: string) => `未声明的命名空间前缀 "${prefix}"。`,
  invalidXmlStructure: '检测到无效XML结构(标签未关闭或嵌套错误)。',
  encodingMismatch: (declared: string, detected: string) => `声明的编码(${declared})与检测到的编码不匹配(${detected})。`,
  largeEntityExpansion: '可能具有过大的实体扩展。十亿次 laughs 攻击风险。',
  cdataInAttribute: '在属性值���检��到CDATA(XML中无效)。'
} as const;

/* -------------------------- 格式化程序消息 -------------------------- */

export const FormatadorMensagens = {
  naoFormatado: (parser: string, detalhes?: string) => {
    const base = `文件看起来未格式化 (解析器: ${parser})。请考虑使用Prometheus格式化程序规范化。`;
    if (!detalhes) return base;
    return `${base} (${detalhes})`;
  },
  parseErro: (parser: string, err: string) => `验证内部格式化失败 (解析器: ${parser}): ${err}`
} as const;

/* -------------------------- SVG消息(优化) -------------------------- */

export const SvgMensagens = {
  naoPareceSvg: '.svg文件不包含有效的<svg>标签。',
  semViewBox: 'SVG缺少viewBox(可能影响响应式)。',
  scriptInline: 'SVG包含<script>。安全风险:避免带内嵌脚本的SVG。',
  eventoInline: 'SVG包含内联处理程序(on*)。避免资产中的内联事件。',
  javascriptUrl: 'SVG在URL/href中包含javascript:。安全风险。',
  podeOtimizar: (originalBytes: number, optimizedBytes: number, mudancas: string[]) => `SVG可以优化 (${originalBytes}B → ${optimizedBytes}B)。更改: ${mudancas.join(', ')}。`
} as const;

/* -------------------------- CSS-IN-JS消息 -------------------------- */

export const CssInJsMensagens = {
  detectedStyledComponents: '检测到styled-components模式(CSS-in-JS)。',
  detectedStyledJsx: '检测到styled-jsx模式(React中的CSS-in-JS)。',
  globalStyles: (fonte: 'styled-components' | 'styled-jsx') => `检测到全局样式 (${fonte})。请尽可能使用本地作用域。',
  importantUsage: '在CSS-in-JS中检测到!important;请使用适当的特异性。',
  httpUrl: 'url()中的HTTP外部资源;请使用HTTPS。'
} as const;

/* -------------------------- PYTHON消息 -------------------------- */

export const PythonMensagens = {
  // 导入和依赖
  missingTypeHints: '检测到函数缺少类型提示;请添加类型提示以提高可读性。',
  hardcodedString: (string: string) => `检测到硬编码字符串 (${string.slice(0, 30)}...);请考虑使用常量。`,
  httpWithoutVerify: '检测到不带verify=True的HTTP请求;请验证SSL证书。',
  sqlInjection: '检测到可能的SQL注入;请使用预编译语句。',
  // 代码质量
  broadExcept: '检测到通用异常(except:);请具体。',
  bareRaise: '检测到不带上下文的raise;请始终传递异常以保持堆栈跟踪。',
  passInExcept: '在except块中使用pass;请实现适当的错误处理。',
  // 最佳实践
  printInsteadOfLog: '检测到print();请优先使用生产环境的logging模块。',
  evalUsage: '检测到eval();请避免使用eval-安全漏洞。',
  execUsage: '检测到exec();请避免使用exec-安全漏洞。',
  subprocessShellTrue: '检测到shell=True的subprocess;命令注入风险。请优先使用参数列表和shell=False。',
  pickleUsage: '检测到pickle load(s);请勿反序列化不受信任的数据(RCE)。请优先使用安全格式(JSON)。',
  yamlUnsafeLoad: '检测到不带安全Loader的yaml.load;请优先使用yaml.safe_load(避免执行)。',
  globalKeyword: '检测到global关键字的使用;请优先作为参数传递。',
  mutableDefault: '检测到可变默认值的参数(list/dict);请使用None作为默认值。',
  // 性能
  listComprehensionOpportunity: '检测到可以改为列表推导式的循环。',
  loopingOverDict: '迭代dict时没有使用.items();请考虑使用.items()。'
} as const;

/* -------------------------- 严重性级别 -------------------------- */

export const SeverityNiveis = {
  error: '错误',
  warning: '警告',
  info: '信息',
  suggestion: '建议'
} as const;

/* -------------------------- 分析器类型/类别 -------------------------- */

export const AnalystTipos = {
  react: 'react/规则',
  reactHooks: 'react-hooks/规则',
  tailwind: 'tailwindcss/规则',
  css: 'css/规则',
  html: 'html/规则',
  python: 'python/规则',
  xml: 'xml/规则',
  formatador: '格式化程序/规则',
  svg: 'svg/规则',
  cssInJs: 'css-in-js/规则'
} as const;
export const AnalystOrigens = {
  react: '分析器-react',
  reactHooks: '分析器-react-hooks',
  tailwind: '分析器-tailwind',
  css: '分析器-css',
  html: '分析器-html',
  python: '分析器-python',
  xml: '分析器-xml',
  formatador: '分析器-formatador',
  svg: '分析器-svg',
  cssInJs: '分析器-css-in-js'
} as const;