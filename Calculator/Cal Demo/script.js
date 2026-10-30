const valueEl = document.getElementById("value");
const exprEl = document.getElementById("expr");
const symbols = { "+": "+", "-": "\u2212", "*": "\u00d7", "/": "\u00f7" };

let current = "0";     // number being typed
let previous = null;   // left operand
let operator = null;   // pending operator
let justEvaluated = false;

function calculate(a, b, op) {
  a = parseFloat(a);
  b = parseFloat(b);
  if (op === "+") return a + b;
  if (op === "-") return a - b;
  if (op === "*") return a * b;
  if (op === "/") return b === 0 ? NaN : a / b;
  return b;
}

function format(n) {
  if (!isFinite(n)) return "Error";
  return String(parseFloat(n.toPrecision(12)));
}

function render() {
  valueEl.textContent = current;
  exprEl.textContent = operator ? previous + " " + symbols[operator] : "";
}

function clearAll() {
  current = "0";
  previous = null;
  operator = null;
  justEvaluated = false;
}

function inputNumber(d) {
  if (current === "Error" || justEvaluated) {
    current = "0";
    justEvaluated = false;
  }
  if (current === "0") current = d;
  else if (current.length < 14) current += d;
}

function inputDot() {
  if (current === "Error" || justEvaluated) {
    current = "0";
    justEvaluated = false;
  }
  if (!current.includes(".")) current += ".";
}

function setOperator(op) {
  if (current === "Error") return;
  if (operator && !justEvaluated) {
    // chain: 2 + 3 + ... -> evaluate first
    const result = format(calculate(previous, current, operator));
    if (result === "Error") {
      clearAll();
      current = "Error";
      return;
    }
    previous = result;
  } else {
    previous = current;
  }
  operator = op;
  current = "0";
  justEvaluated = false;
}

function equals() {
  if (!operator || current === "Error") return;
  const result = format(calculate(previous, current, operator));
  exprEl.textContent = previous + " " + symbols[operator] + " " + current + " =";
  current = result;
  previous = null;
  operator = null;
  justEvaluated = true;
  valueEl.textContent = current;
}

function backspace() {
  if (justEvaluated || current === "Error") {
    current = "0";
    justEvaluated = false;
    return;
  }
  current = current.length > 1 ? current.slice(0, -1) : "0";
}

function percent() {
  if (current === "Error") return;
  current = format(parseFloat(current) / 100);
}

function handle(btn) {
  if (btn.dataset.num !== undefined) {
    inputNumber(btn.dataset.num);
  } else if (btn.dataset.op) {
    setOperator(btn.dataset.op);
  } else {
    switch (btn.dataset.act) {
      case "clear":   clearAll(); break;
      case "back":    backspace(); break;
      case "dot":     inputDot(); break;
      case "percent": percent(); break;
      case "equals":  equals(); return;
    }
  }
  render();
}

document.getElementById("keys").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (btn) handle(btn);
});

// Keyboard support
document.addEventListener("keydown", (e) => {
  const k = e.key;
  let selector = null;

  if (/^[0-9]$/.test(k)) selector = `[data-num="${k}"]`;
  else if ("+-*/".includes(k)) selector = `[data-op="${k}"]`;
  else if (k === ".") selector = '[data-act="dot"]';
  else if (k === "%") selector = '[data-act="percent"]';
  else if (k === "Backspace") selector = '[data-act="back"]';
  else if (k === "Escape") selector = '[data-act="clear"]';
  else if (k === "Enter" || k === "=") {
    e.preventDefault();
    selector = '[data-act="equals"]';
  }

  if (selector) handle(document.querySelector(selector));
});
