const editors_devs = editors || document.querySelectorAll(".editor");
const terminals_devs = terminals || document.querySelectorAll(".terminal");

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
    ]
};

let cvars = new Set(),
    lvars = new Set(),
    bvars = new Set(["fs", "http", "url", "module", "exports", ...nodeWords.libraries]);

const changeColorsJSON = (output) => {
    // String
    let i = 0;
    output = output.replace(/"[^"]*"/g, (s,a,b,c) => {
        if (i++%2==0)
            return `<span class="variable">${s}</span>`;
        else
            return `<span class="string">${s}</span>`;
    });
    output = output.replace(/'[^']*'/g, (s) => `<span class="string">${s}</span>`);
    output = output.replace(/`[^`]*`/g, (s) => `<span class="string">${s}</span>`);
    // Counter
    if (!isNaN(+output)) {
        return output.replace(/\d+/g, (s) => (s != 1 ? `<br><span class="editor-counter">${s}</span>` : `<span class="editor-counter">${s}</span>`));
    }
    // Tab
    else if (output.startsWith("\\t")) {
        output = output.replace(/\\t/g, `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`);
    }
    // Numbers
    output = output.replace(/\d+/g, (s) => `<span class="number">${s}</span>`);
    return output;
};

const changeColorsJS = (output) => {
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
        output = output.replace(/\\t/g, `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`);
    }
    // Functions
    output = output.replace(/ [A-Z][a-zA-Z]*\(/g, (s) => ` <span class="library-used">${s.slice(0, -1)}</span>(`);
    output = output.replace(/[a-z][a-zA-Z]*\(/g, (s) => `<span class="function">${s.slice(0, -1)}</span>(`);
    // like if
    output = output.replace(/(for |if |else |return |while |switch |do )/g, (s) => `<span class="for">${s}</span>`);
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
        const lang = editor.getAttribute("data-lang");
        cvars = new Set();
        lvars = new Set();
        const editor_body = [...editor.children].find((el) => el.classList == "editor-body");
        let content = editor_body.innerHTML.split("\n");
        content = content.map((str) => {
            let x = str.replace(/\s\s\s\s/g, "");
            return x;
        });
        let html = "";
        if (lang){
            if (lang.toLowerCase() == "json"){
                content.forEach((con) => {
                    if (con.length != 0) html += changeColorsJSON(con);
                });
            }
        }
        else {
            content.forEach((con) => {
                if (con.length != 0) html += changeColorsJS(con);
            });
        }
        editor_body.innerHTML = html;
    });
}

if (terminals_devs) {
    terminals_devs.forEach((terminal) => {
        const terminal_body = [...terminal.children].find((el) => el.classList == "terminal-body");
        let content = terminal_body.innerHTML;
        content = content.replace(/\\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
        terminal_body.innerHTML = content;
    });
}
