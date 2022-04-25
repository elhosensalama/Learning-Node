const editors_devs = editors || document.querySelectorAll(".editor");

const nodeWords = {
    libraries: [
        "AbortController",
        "AbortSignal",
        "Array",
        "ArrayBuffer",
        "BigInt64Array",
        "BigUint64Array",
        "Boolean",
        "Date",
        "Error",
        "EvalError",
        "DataView",
        "Event",
        "EventTarget",
        "Float32Array",
        "Float64Array",
        "Function",
        "Int16Array",
        "Int32Array",
        "Int8Array",
        "Number",
        "Object",
        "Promise",
        "Proxy",
        "RangeError",
        "ReferenceError",
        "Map",
        "MessageChannel",
        "MessageEvent",
        "MessagePort",
        "RegExp",
        "Set",
        "SharedArrayBuffer",
        "String",
        "SyntaxError",
        "TextDecoder",
        "TextEncoder",
        "TypeError",
        "URIError",
        "URL",
        "URLSearchParams",
        "Uint16Array",
        "Uint32Array",
        "Uint8Array",
        "Uint8ClampedArray",
        "WeakMap",
        "WeakSet",
        "Intl",
        "Reflect",
        "WebAssembly",
        "module",
    ],
    functions: [
        "atob",
        "btoa",
        "clearInterval",
        "clearTimeout",
        "decodeURI",
        "decodeURIComponent",
        "encodeURI",
        "encodeURIComponent",
        "escape",
        "eval",
        "parseFloat",
        "isFinite",
        "isNaN",
        "parseInt",
        "queueMicrotask",
        "setInterval",
        "setTimeout",
        "unescape",
        "toString",
    ],
    property: [
        "AggregateError",
        "Atomics",
        "BigInt",
        "Buffer",
        "FinalizationRegistry",
        "Infinity",
        "Math",
        "JSON",
        "NaN",
        "Symbol",
        "WeakRef",
        "_",
        "_error",
        "assert",
        "async_hooks",
        "console",
        "constants",
        "crypto",
        "cluster",
        "buffer",
        "child_process",
        "clearImmediate",
        "dgram",
        "diagnostics_channel",
        "dns",
        "domain",
        "events",
        "fs",
        "global",
        "globalThis",
        "http",
        "http2",
        "https",
        "inspector",
        "net",
        "os",
        "path",
        "perf_hooks",
        "performance",
        "process",
        "punycode",
        "querystring",
        "stream",
        "string_decoder",
        "sys",
        "timers",
        "tls",
        "trace_events",
        "tty",
        "readline",
        "repl",
        "require",
        "setImmediate",
        "url",
        "util",
        "v8",
        "vm",
        "wasi",
        "worker_threads",
        "zlib",
        "__proto__",
        "hasOwnProperty",
        "isPrototypeOf",
        "propertyIsEnumerable",
        "toLocaleString",
        "valueOf",
        "constructor",
    ],
};

let cvars = new Set(),
    lvars = new Set(),
    bvars = new Set(["fs", "http", "url", "module", "exports", ...nodeWords.libraries]);

const changeColors = (output) => {
    // String
    output = output.replace(/"[^"]*"/g, (s) => `<span class="string">${s}</span>`);
    output = output.replace(/'[^']*'/g, (s) => `<span class="string">${s}</span>`);
    output = output.replace(/`[^`]*`/g, (s) => `<span class="string">${s}</span>`);
    // Counter
    if (!isNaN(+output)) {
        return output.replace(/\d+/g, (s) => (s != 1 ? `<br><span class="editor-counter">${s}</span>` : `<span class="editor-counter">${s}</span>`));
    }
    // Comment
    else if (output.startsWith("// ")) {
        return output.replace(/\/\/[ a-zA-Z]*/g, (s) => `<span class="comment">${s}</span>`);
    }
    // Tab
    else if (output.startsWith("\\t")) {
        output = output.replace(/\\t/g, `<span class="tab"></span>`);
    }
    // Functions
    output = output.replace(/ [A-Z][a-zA-Z]*\(/g, (s) => ` <span class="library-used">${s.slice(0, -1)}</span>(`);
    output = output.replace(/[a-z][a-zA-Z]*\(/g, (s) => `<span class="function">${s.slice(0, -1)}</span>(`);
    // like if
    output = output.replace(/(for|if|else|return|while|switch|do)/g, (s) => `<span class="for">${s}</span>`);
    // variables
    output.replace(/(\{|\()[ a-zA-Z\d,]+(\}|\))/g, (s) => {
        s.slice(1, -1)
            .replace(/\s/g, "")
            .split(",")
            .forEach((s1) => {
                if (!bvars.has(s1)) lvars.add(s1);
            });
    });
    output.replace(/[a-zA-Z]+\./g, (s) => {
        if (!cvars.has(s.slice(0, -1)) && !cvars.has(s.slice(0, -1))) {
            lvars.add(s.slice(0, -1));
        }
    });
    output.replace(/const [a-zA-Z\d_]+/g, (s) => {
        if (!bvars.has(s.split(" ")[1])) cvars.add(s.split(" ")[1]);
    });
    output.replace(/let [a-zA-Z\d_]+/g, (s) => {
        if (!bvars.has(s.split(" ")[1])) lvars.add(s.split(" ")[1]);
    });
    cvars.forEach((s) => {
        let reg = new RegExp(`${s}`, "g");
        output = output.replace(reg, (s2) => `<span class="const">${s2}</span>`);
    });
    lvars.forEach((s) => {
        let reg = new RegExp(`${s}`, "g");
        output = output.replace(reg, (s2) => `<span class="variable">${s2}</span>`);
    });
    bvars.forEach((s) => {
        let reg = new RegExp(`${s}`, "g");
        output = output.replace(reg, (s2) => `<span class="library-used">${s2}</span>`);
    });
    // keywords
    output = output.replace(/(const |let |new | =&gt; )/g, (s) => `<span class="keyword">${s}</span>`);
    // Numbers
    output = output.replace(/\d+/g, (s) => `<span class="number">${s}</span>`);
    return output;
};

if (editors_devs) {
    editors_devs.forEach((editor) => {
        cvars = new Set();
        lvars = new Set();
        const editor_body = [...editor.children].find((el) => el.classList == "editor-body");
        let content = editor_body.innerHTML.split("\n");
        content = content.map((str) => {
            let x = str.replace(/\s\s\s\s/g, "");
            return x;
        });
        let html = "";
        content.forEach((con) => {
            if (con.length != 0) html += changeColors(con);
        });
        editor_body.innerHTML = html;
    });
}
