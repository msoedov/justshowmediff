// Language detection by file extension
function getLang(file) {
  if (/\.py$/.test(file)) return 'py';
  if (/\.(js|jsx|ts|tsx|mjs|cjs)$/.test(file)) return 'js';
  if (/\.go$/.test(file)) return 'go';
  if (/\.rs$/.test(file)) return 'rs';
  if (/\.rb$/.test(file)) return 'rb';
  if (/\.(java|kt|scala)$/.test(file)) return 'java';
  if (/\.(c|cpp|cc|cxx|h|hpp)$/.test(file)) return 'c';
  if (/\.(sh|bash|zsh)$/.test(file)) return 'sh';
  if (/\.(yaml|yml)$/.test(file)) return 'yaml';
  if (/\.json$/.test(file)) return 'json';
  if (/\.(css|scss|less)$/.test(file)) return 'css';
  if (/\.(html|htm|xml|svg|vue|svelte)$/.test(file)) return 'html';
  if (/\.(md|mdx)$/.test(file)) return 'md';
  return null;
}

// Regex patterns per language. Named groups: cmt, str, dec, kw, bi, num
const SH_PY = /(?<cmt>#.*)|(?<str>f?"""[\s\S]*?"""|f?'''[\s\S]*?'''|f?"(?:[^"\\]|\\.)*"|f?'(?:[^'\\]|\\.)*')|(?<dec>@[\w.]+)|(?<kw>\b(?:def|class|if|elif|else|for|while|return|import|from|as|with|try|except|finally|raise|yield|async|await|pass|break|continue|and|or|not|in|is|lambda|global|nonlocal|assert|del|match|case)\b)|(?<bi>\b(?:True|False|None|self|cls|super|__\w+__|print|len|range|list|dict|set|tuple|int|str|float|bool|type|isinstance|enumerate|zip|map|filter|sorted|reversed|any|all|open|property|staticmethod|classmethod|dataclass)\b)|(?<num>\b\d+\.?\d*(?:e[+-]?\d+)?\b)/gi;
const SH_JS = /(?<cmt>\/\/.*)|(?<str>`(?:[^`\\]|\\.)*`|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(?<kw>\b(?:const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|class|extends|import|export|from|default|new|typeof|instanceof|try|catch|finally|throw|async|await|yield|of|in|void|delete)\b)|(?<bi>\b(?:true|false|null|undefined|NaN|Infinity|this|console|document|window|Math|Array|Object|String|Number|Promise|Map|Set|JSON|Error|RegExp|Date|parseInt|parseFloat|setTimeout|setInterval|require|module|process)\b)|(?<num>\b\d+\.?\d*(?:e[+-]?\d+)?\b)/gi;
const SH_GO = /(?<cmt>\/\/.*)|(?<str>`[^`]*`|"(?:[^"\\]|\\.)*")|(?<kw>\b(?:func|return|if|else|for|range|switch|case|default|break|continue|go|defer|select|chan|map|struct|interface|type|package|import|var|const|fallthrough)\b)|(?<bi>\b(?:true|false|nil|error|string|int|int8|int16|int32|int64|uint|uint8|uint16|uint32|uint64|float32|float64|bool|byte|rune|any|make|len|cap|append|copy|delete|close|panic|recover|new|println|fmt|err)\b)|(?<num>\b\d+\.?\d*(?:e[+-]?\d+)?\b)/gi;
const SH_RS = /(?<cmt>\/\/.*)|(?<str>"(?:[^"\\]|\\.)*")|(?<dec>#\[[\w:]+)|(?<kw>\b(?:fn|let|mut|const|if|else|for|while|loop|match|return|use|mod|pub|struct|enum|impl|trait|where|type|async|await|move|ref|self|super|crate|unsafe|extern|dyn|static|in|as)\b)|(?<bi>\b(?:true|false|None|Some|Ok|Err|Self|String|Vec|Box|Option|Result|i8|i16|i32|i64|i128|u8|u16|u32|u64|u128|f32|f64|bool|char|usize|isize|str|println|eprintln|format|todo|unimplemented|unreachable|assert|panic|dbg)\b)|(?<num>\b\d+\.?\d*(?:e[+-]?\d+)?\b)/gi;
const SH_RB = /(?<cmt>#.*)|(?<str>"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(?<kw>\b(?:def|class|module|if|elsif|else|unless|case|when|for|while|until|do|end|return|yield|begin|rescue|ensure|raise|require|include|extend|attr_accessor|attr_reader|attr_writer|private|protected|public|self|super|block_given\?|lambda|proc)\b)|(?<bi>\b(?:true|false|nil|puts|print|p|gets|chomp|to_s|to_i|to_f|each|map|select|reject|reduce|inject|flat_map|any\?|all\?|none\?|find|count|sort|uniq|freeze|frozen\?|dup|clone)\b)|(?<num>\b\d+\.?\d*(?:e[+-]?\d+)?\b)/gi;
const SH_JAVA = /(?<cmt>\/\/.*)|(?<str>"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(?<dec>@\w+)|(?<kw>\b(?:class|interface|enum|extends|implements|import|package|public|private|protected|static|final|abstract|synchronized|volatile|transient|native|new|return|if|else|for|while|do|switch|case|default|break|continue|try|catch|finally|throw|throws|void|this|super|instanceof|assert)\b)|(?<bi>\b(?:true|false|null|String|int|long|float|double|boolean|char|byte|short|Integer|Long|Float|Double|Boolean|Object|List|Map|Set|Array|System|Math|Collections|Optional|Stream|Override|Deprecated)\b)|(?<num>\b\d+\.?\d*[lLfFdD]?(?:e[+-]?\d+)?\b)/gi;
const SH_C = /(?<cmt>\/\/.*)|(?<str>"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(?<dec>#\w+)|(?<kw>\b(?:if|else|for|while|do|switch|case|default|break|continue|return|goto|struct|union|enum|typedef|sizeof|static|extern|inline|volatile|const|register|auto|signed|unsigned|void|class|public|private|protected|virtual|override|template|namespace|using|new|delete|throw|try|catch|noexcept|constexpr|nullptr|auto)\b)|(?<bi>\b(?:true|false|NULL|nullptr|size_t|int8_t|int16_t|int32_t|int64_t|uint8_t|uint16_t|uint32_t|uint64_t|string|vector|map|set|pair|shared_ptr|unique_ptr|cout|cin|endl|printf|scanf|malloc|free|memcpy|strlen|strcmp|assert|stdout|stderr|stdin)\b)|(?<num>\b\d+\.?\d*[uUlLfF]*(?:e[+-]?\d+)?\b)/gi;
const SH_SH = /(?<cmt>#.*)|(?<str>"(?:[^"\\]|\\.)*"|'[^']*'|\$\([^)]*\))|(?<kw>\b(?:if|then|else|elif|fi|for|while|do|done|case|esac|in|function|return|local|export|source|eval|exec|exit|trap|set|unset|shift|break|continue|readonly|declare|typeset)\b)|(?<bi>\b(?:true|false|echo|printf|read|test|cd|ls|cp|mv|rm|mkdir|cat|grep|sed|awk|find|xargs|sort|uniq|wc|head|tail|cut|tr|tee|chmod|chown|curl|wget|git|docker|npm|yarn|pip|sudo)\b)|(?<num>\b\d+\.?\d*\b)/gi;
const SH_YAML = /(?<cmt>#.*)|(?<str>"(?:[^"\\]|\\.)*"|'[^']*')|(?<kw>^[\w.-]+(?=\s*:))|(?<bi>\b(?:true|false|null|yes|no|on|off)\b)|(?<num>\b\d+\.?\d*\b)/gim;
const SH_JSON = /(?<str>"(?:[^"\\]|\\.)*"(?=\s*:))|(?<kw>"(?:[^"\\]|\\.)*")|(?<bi>\b(?:true|false|null)\b)|(?<num>-?\b\d+\.?\d*(?:e[+-]?\d+)?\b)/gi;
const SH_CSS = /(?<cmt>\/\*[\s\S]*?\*\/)|(?<str>"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(?<dec>@[\w-]+)|(?<kw>[.#][\w-]+|:[\w-]+(?:\([^)]*\))?)|(?<bi>\b(?:none|auto|inherit|initial|unset|important|solid|dashed|dotted|block|inline|flex|grid|absolute|relative|fixed|sticky|hidden|visible|transparent)\b)|(?<num>-?\d+\.?\d*(?:px|em|rem|vh|vw|%|s|ms|deg|fr)?)/gi;
const SH_HTML = /(?<cmt><!--[\s\S]*?-->)|(?<str>"[^"]*"|'[^']*')|(?<kw><\/?[\w-]+|\/?>)|(?<dec>[\w-]+(?==))/gi;
const SH_MD = /(?<kw>^#{1,6}\s.*$|^\*\*.*?\*\*|^__.*?__)|(?<str>`[^`]+`)|(?<cmt>^\s*>.*$)|(?<dec>\[.*?\]\(.*?\))|(?<num>^\s*[-*+]\s|^\s*\d+\.\s)/gim;

const SH_MAP = {py:SH_PY,js:SH_JS,go:SH_GO,rs:SH_RS,rb:SH_RB,java:SH_JAVA,c:SH_C,sh:SH_SH,yaml:SH_YAML,json:SH_JSON,css:SH_CSS,html:SH_HTML,md:SH_MD};

function hilite(raw, lang) {
  if (!lang || !raw) return esc(raw);
  const re = SH_MAP[lang]; if (!re) return esc(raw);
  re.lastIndex = 0;
  let result = '', last = 0, m;
  while ((m = re.exec(raw)) !== null) {
    result += esc(raw.slice(last, m.index));
    const g = m.groups;
    const cls = g.cmt != null ? 'cmt' : g.str != null ? 'str' : g.dec != null ? 'dec' : g.kw != null ? 'kw' : g.bi != null ? 'bi' : 'num';
    result += `<span class="sh-${cls}">${esc(m[0])}</span>`;
    last = m.index + m[0].length;
  }
  result += esc(raw.slice(last));
  return result;
}

function shHtml(html, lang) {
  if (!lang) return html;
  const segs = html.split(/(<[^>]+>)/g);
  return segs.map(s => s.startsWith('<') ? s : hilite(unesc(s), lang)).join('');
}
