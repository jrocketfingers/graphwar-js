function getFunctionName(func)
{
    var name = func.toString();
    name = name.substr("function ".length);
    name = name.substr(0, name.indexOf("("));
    return name;
}

var constants = ["e", "pi"];

//Math functions
function ln(a) { return Math.log(a); }
var	functions = [Math.abs, Math.acos, Math.asin,
    Math.atan, Math.cos, Math.exp, Math.log, Math.pow, Math.sin, Math.sqrt, Math.tan, ln];
function getMathFunction(name)
{
    for(var i = 0; i < functions.length; i++)
        if (getFunctionName(functions[i]) === name) return functions[i];
    return;
}
//End math functions

//Operators
function positive(a) { return a; }
function negative(a) { return -a; }
function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
function multiply(a, b) { return a*b; }
function divide(a, b) { return a/b; }

var operators = [];
function addOperator(op, fs)
{
    operators.push({symbol: op, functions: fs});
}
function isOperator(op) { for(var i = 0; i < operators.length; i++) if (op === operators[i].symbol) return true; return false; }
function getOperatorFunctions(op)
{
    for(var i = 0; i < operators.length; i++)
        if (operators[i].symbol === op) return operators[i].functions;
    return;
}
(function setupOperators()
{
    addOperator("+", [add, positive]);
    addOperator("-", [subtract, negative]);
    addOperator("*", [multiply]);
    addOperator("/", [divide]);
    addOperator("^", [Math.pow]);
})();
//End operators

//Priorities
var priorityTable = [];
function addPriority(t, ipr, spr)
{
    priorityTable.push({token: t, inputPriority: ipr, stackPriority: spr});
}
function findPriority(t)
{
    var priority;
    for(var i = 0; i < priorityTable.length; i++)
        if (priorityTable[i].token === t) { priority = priorityTable[i]; return {inputPriority: priority.inputPriority, stackPriority: priority.stackPriority}; }
    return;
}
(function getYourPrioritiesStraight()
{
    addPriority("+", 2, 2);
    addPriority("-", 2, 2);
    addPriority("*", 3, 3);
    addPriority("/", 3, 3);
    addPriority("^", 5, 4);
    addPriority("function", Infinity, 10);
    addPriority("(", Infinity, 0);
    addPriority(")", 1, -1);
    addPriority(",", 1, -1);
})();
var unaryOperatorIPR = Infinity;
var unaryOperatorSPR = 9;
//End priorities

function Token(value, type, ipr, spr)
{
    if (typeof type === "undefined")
    {
        if (typeof value != "undefined")
        {
            this.value = value.value;
            this.type = value.type;
            this.inputPriority = value.inputPriority;
            this.stackPriority = value.stackPriority;
        }
    }
    else
    {
        this.value = value;
        this.type = type;
        this.inputPriority = ipr;
        this.stackPriority = spr;
    }
}

function parseMathFunction(input) //converts to postfix
{
    var counter = 0, token = new Token("", "", -1, -1);
    input = input.replace(/\s/g, '');
    input = input.toLowerCase();

    function readToken()
    {
        if (counter >= input.length)
        {
            token = undefined;
            return;
        }

        var first = input.charAt(counter), length = 1;

        if (!isNaN(first)) //is token a number?
        {
            while((counter + length < input.length) && (!isNaN(input.substr(counter, length + 1)))) length++;
            token.value = Number(input.substr(counter, length));
            token.type = "operand";
        }
        else if (isOperator(first)) //is token an operator?
        {
            token.value = first;
            token.type = "operator";
        }
        else if ((first === '(') || (first === ')')) //is token a bracket?
        {
            token.value = first;
            token.type = "bracket";
        }
        else if (first === ',')
        {
            token.value = first;
            token.type = "comma";
        }
        else if (first.match(/[a-z]/)) //is token a constant, the variable or a function?
        {
            while((counter + length < input.length) && (input.charAt(counter + length).match(/[a-z]/))) length++;
            var word = input.substr(counter, length), func = getMathFunction(word);
            if (typeof func === "undefined")
            {
                var constant = false;
                for(var i = 0; i < constants.length; i++) //is token a mathematical constant?
                    if ((word.length >= constants[i].length) && (word.substr(0, constants[i].length) === constants[i]))
                    {
                        token.value = Math[constants[i].toUpperCase()];
                        token.type = "operand";
                        length = constants[i].length;
                        constant = true;
                        break;
                    }
                if (!constant)
                {
                    if (word.charAt(0) === "x") //is token the variable?
                    {
                        token.value = "x";
                        token.type = "operand";
                        length = 1;
                    }
                    else
                        throw "Unrecognized token.";
                }
            }
            else
            {
                token.value = func;
                token.type = "function";
            }
        }
        else
            throw "Unrecognized character.";

        counter+= length;
    }

    var parse = [], stack = [], prevToken, priority, rank = 0;
    function pushToken(token)
    {
        while ((stack.length > 0) && (stack[stack.length - 1].stackPriority >= token.inputPriority))
        {
            parse.push(stack.pop().value);
        }
        if ((token.type === "comma") || (token.value === ")")) {
            stack.pop();
            if (token.type === "comma")
            {
                priority = findPriority("(");
                stack.push(new Token("(", "bracket", priority.inputPriority, priority.stackPriority));
            }
        }
        else
            stack.push(token);
        if (typeof token.value === "function") rank-= token.value.length - 1;
    }

    while (1)
    {
        readToken();
        if (typeof token === "undefined") {
            break;
        }
        else
        {
            if (token.type === "operand")
            {
                if ((typeof prevToken != "undefined") && (prevToken.type === "operand"))
                {
                    priority = findPriority("*");
                    pushToken(new Token(multiply, "operand", priority.inputPriority, priority.stackPriority));
                }
                parse.push(token.value);
                rank++;
            }
            else
            {
                if (token.type === "operator") {
                    var func = getOperatorFunctions(token.value)[0];
                    if ((typeof prevToken != "undefined") &&
                        ((prevToken.type === "operand") || (prevToken.value === ")"))) {
                        if (func.length === 2)
                            priority = findPriority(token.value);
                        else
                            priority = {inputPriority: unaryOperatorIPR, stackPriority: unaryOperatorSPR};
                    }
                    else {
                        if (func.length === 2) func = getOperatorFunctions(token.value)[1];
                        priority = {inputPriority: unaryOperatorIPR, stackPriority: unaryOperatorSPR};
                    }
                    token.value = func;
                }
                else if (token.type === "function") {
                    priority = findPriority("function");
                }
                else
                {
                    priority = findPriority(token.value);
                    if (typeof priority === "undefined") throw "A token has no priority.";
                }
                token.inputPriority = priority.inputPriority;
                token.stackPriority = priority.stackPriority;

                pushToken(new Token(token));
            }
        }
        prevToken = new Token(token);
    }
    while (stack.length > 0) parse.push(stack.pop().value);
    if (rank != 1) throw "Invalid expression.";
    return parse;
}

function calculateParse(parse, x)
{
    var stack = [], result = 0, token, operands, operand;
    for(var i = 0; i < parse.length; i++)
    {
        token = parse[i];
        if (typeof token == "number")
            stack.push(token);
        else if (token === "x")
            stack.push(x);
        else if (typeof token === "function")
        {
            operands = [];
            for(var j = 0; j < token.length; j++)
            {
                operand = stack.pop();
                if (typeof operand === "undefined")
                    throw "Parse has insufficient operands.";
                else
                    operands.push(operand);
            }
            operands.reverse();
            stack.push(token.apply(this, operands));
        }
        else
            throw "Invalid parse token.";
    }
    result = stack.pop();
    if ((typeof result === "undefined") || (stack.length > 0)) throw "Invalid parse.";
    return result;
}

window.parser = {};
window.parser.calculate = calculateParse;
window.parser.parse = parseMathFunction;