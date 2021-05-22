function getFuncName(fn) {
    const fnStr = fn.toString();
    const replaced = fnStr.replace(/^function /, "");
    const fnName = replaced.substr(0, replaced.indexOf("("));
    return fnName;
}

export { getFuncName };
