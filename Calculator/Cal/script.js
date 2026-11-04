let current = "0";
let previous = null;
let operator = null;
let newEntry = true;

const a = document.getElementById("a");
const op = document.getElementById("op");

function show() {
  a.textContent = current;
}

function onClick(num) {
  switch (num) {
    case "0": 
    case "1": 
    case "2": 
    case "3": 
    case "4":
    case "5": 
    case "6": 
    case "7":  
    case "8": 
    case "9":
    case "00":

      if (newEntry) {
        current = num;
        newEntry = false;
      } 
      else {
        current = current === "0" ? num : current + num;
      }
      break;

    case "+": 
    case "-": 
    case "*": 
    case "/":
        
      if (operator !== null && !newEntry) handleClick("=");
      previous = parseFloat(current);
      operator = num;
      newEntry = true;
      op.textContent = current + " " + num;
      break;

    case "=": {
      if (operator === null) break;
      const a = previous;
      const b = parseFloat(current);
      let result;

      switch (operator) {

        case "+": result = a + b; break;
        case "-": result = a - b; break;
        case "*": result = a * b; break;
        case "/": result = b === 0 ? "Error" : a / b; break;
      }
      op.textContent = a + " " + operator + " " + b + " =";
      current = String(result);
      previous = null;
      operator = null;
      newEntry = true;
      break;
    }

    case ".":
      if (newEntry) {
        current = "0";
        newEntry = false;
      }
      if (!current.includes(".")) current += ".";
      break;

    case "%":
      current = String(parseFloat(current) / 100);
      newEntry = false;
      break;

    case "AC":
      current = "0";
      previous = null;
      operator = null;
      newEntry = true;
      exp.textContent = "";
      break;

    case "back":
      if (newEntry) break;
      current = current.slice(0, -1) || "0";
      break;
  }
  show();
}

show();



/*
console.log(eval("2 + 2"));
console.log(eval(new String("2 + 2")))
*/

