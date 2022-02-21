let current_equation;
let current_result;
let previous;
let result;
let operator;
let previousOperator ;
let func;
let isDot
let countAfterDot;
let is_operator;

function init() {
    current_equation = '';
    current_result = '';
    result = 0;
    operator = 'none';
    func;
    isDot = false;
    countAfterDot = 0;
    is_operator = false;
}


init();

function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
}

function onclick_number(input) {
    if(input === 'dot') {
        if(!isDot)
            current_equation += '.';

        isDot = true;
        return;
    }
    
    let number = Number(input);
    current_equation += number;
    if (isDot) {
        countAfterDot++;
        number *=Math.pow(0.1, countAfterDot);    
    }  

    console.log(`result = ${result}`);
    
    console.log(`operator = ${operator}`);

    result = Eval(current_equation);
    document.getElementById('result').textContent = `= ${result}`;
    document.getElementById('equation').textContent = `${current_equation}`;
    console.log();
    is_operator = false;
}

function update() {
    result = Eval(current_equation);
    document.getElementById('result').textContent = `= ${result}`;
    document.getElementById('equation').textContent = current_equation;
}

function Eval(equation) {
    while(equation.indexOf('√') != -1) {
        let index = equation.indexOf('√');
        let i = index;
        for (; i < equation.length; i++) {
            if (equation[i] == ' ') {
                break;
            }
        }
        let repl = equation.slice(index, i);
        console.log(equation.slice(index, i));
        let num = Math.sqrt(Number(repl.slice(1)));
        if (equation[index - 1] != ' ' && index>0) {
            num = ' * '+ num;
        }
        equation = equation.replace(repl, num);
    }
    while(equation.indexOf('^') != -1) {
        let index = equation.indexOf('^');
        let leftIndex = index;
        for (; leftIndex > 0; leftIndex--) {
            if (equation[leftIndex] == ' ') {
                break;
            }
        }
        let rightIndex = index;
        for (; rightIndex < equation.length; rightIndex++) {
            if (equation[rightIndex] == ' ') {
                break;
            }
        }

        let repl = equation.slice(leftIndex, rightIndex);
        let arr = repl.split('^');
        equation = equation.replace(repl, Math.pow(arr[0], arr[1]));
    }
    
    console.log(equation);

    return eval(equation);
}

function onclick_operator(input) {
    if (current_equation.length === 0
        && input !== '-' && input !== 'sqrt') {
            return;
    }
    switch (input) {
        case '=': {
            console.log('result = ' + result);
            current_equation = result.toString();
            document.getElementById('equation').textContent = result;
            document.getElementById('result').textContent = '';
            return;
        }
        case '+-': {
            if (is_operator) {
                return;
            }
            let i = current_equation.length - 1;
            for (; i >= 0; i--) {
                if(current_equation[i] == '/' || current_equation[i] == '*' || current_equation[i] == '%' 
                || current_equation[i] == '^' || current_equation[i] == '√') {
                    i = -1;
                    console.log('i ' + i);
                    break;
                }
                if(current_equation[i] == '-' || current_equation[i] == '+') {
                    console.log('i ' + i);
                    break;
                }
                
            }
            if (i !== -1){
                if (operator === '+') {
                    current_equation = setCharAt(current_equation, i, '-');
                    operator = '-';
                }
                else if (operator === '-') {
                    current_equation = setCharAt(current_equation, i, '+');
                    operator = '+'
                }
            }
            update();
            return;
        }
        case 'clear': {
            init();
            document.getElementById('equation').textContent = '[your  equation]';
            document.getElementById('result').textContent = 0;
            return;
        }
        case 'del': {
            is_operator = false;
            if (current_equation[current_equation.length - 1] != ' ')
                current_equation = current_equation.slice(0, -1);
            else
                current_equation = current_equation.slice(0, current_equation.length - 3);
            if (current_equation[current_equation.length - 1] != ' ') {
                console.log('1');
                if (current_equation[current_equation.length - 1] != ' ') {
                    result = Eval(current_equation);
                    if (!result) {
                        result = 0;
                    }
                    console.log('2');
                }
                document.getElementById('result').textContent = `= ${result}`;
                document.getElementById('equation').textContent = current_equation;
            }
            else {
                let oper = current_equation[current_equation.length - 2];
                current_equation = current_equation.slice(0, current_equation.length - 3);
                result = Eval(current_equation);
                if (!result) {
                    result = 0;
                }
                is_operator = false;
                onclick_operator(oper);           
                console.log('3' + oper);
            }
            return;
        }
        case '!': {
            current_equation = `(${current_equation})! = (${result})! = `;
            let tempStr = BigInt(result);
            tempStr = result;
            for (let i = result - 1; i > 1; i--) {
                tempStr += ` * ${i - 1}`;
                result *= i;
            }
            current_equation += tempStr;
            document.getElementById('result').textContent = `= ${result}`;
            document.getElementById('equation').textContent = current_equation;
            operator = 'none';
            return;
        }
        case 'sqrt': {
            if (current_equation[current_equation.length - 1] == '√') {
                return;
            }
            current_equation += `√`;
            document.getElementById('equation').textContent = current_equation;
            return;
        }
        case 'pow': {
            if (!/[0-9]/.test(current_equation[current_equation.length - 1])) {
                return;
            }
            current_equation += '^';
            document.getElementById('equation').textContent = current_equation;
            return;
        }
    }
    if(is_operator) {
        current_equation = current_equation.slice(0, current_equation.length - 3);
    }
    is_operator = true;
    current_equation += ` ${input} `;
    
    operator = input;
   
    document.getElementById('equation').textContent = `${current_equation}`;
}
