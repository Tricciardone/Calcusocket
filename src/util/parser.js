function tokenise(expr) {
    const tokens = [];
    const regex = /\s*([0-9]+\.?[0-9]*|\+|\-|\*|\/|\^|\(|\))\s*/g;
    let match;

    while ((match = regex.exec(expr)) !== null) {
        tokens.push(match[1]);
    }

    // Validar que todo el string fue tokenizado (evitar caracteres no permitidos)
    const totalMatched = tokens.join('');
    const exprSanitized = expr.replace(/\s/g, '');
    if (totalMatched.length !== exprSanitized.length) {
        throw new Error(`[SYNTAX ERROR] La operación "${expr}" contiene caracteres no permitidos.`);
    }

    return tokens;
}

function parse(tokens) {
    function peek() {
        return tokens[0] || null;
    }

    function get() {
        return tokens.shift();
    }

    function parseExpression() {
        let left = parseTerm();
        while (peek() === '+' || peek() === '-') {
            const op = get();
            const right = parseTerm();
            left = op === '+' ? left + right : left - right;
        }
        return left;
    }

    function parseTerm() {
        let left = parseFactor();
        while (peek() === '*' || peek() === '/') {
            const op = get();
            const right = parseFactor();
            left = op === '*' ? left * right : left / right;
        }
        return left;
    }

    function parseFactor() {
        let left = parsePower();
        while (peek() === '^') {
            get(); // consume ^
            const right = parsePower();
            left = Math.pow(left, right);
        }
        return left;
    }

    function parsePower() {
        if (peek() === '(') {
            get(); // consume '('
            const expr = parseExpression();
            if (get() !== ')') throw new Error('[SYNTAX ERROR] Falta el paréntesis de cierre');
            return expr;
        }

        const token = get();
        const value = Number(token);
        if (isNaN(value)) throw new Error(`[SYNTAX ERROR] El token "${token}" fue inesperado.`);
        return value;
    }

    return parseExpression();
}

function evaluate(expr) {
    if (!expr || expr.trim() === '') {
        throw new Error('[SYNTAX ERROR] La operación no puede estar vacía.');
    }

    // Eliminar caracteres no imprimibles (como los que puede enviar Telnet)
    expr = expr.replace(/[^\x20-\x7E]/g, '');

    console.log(`[DEBUG] Recibido: "${expr}"`);

    const tokens = tokenise(expr);
    const result = parse(tokens);

    if (tokens.length > 0) {
        throw new Error(`[SYNTAX ERROR] Sobraron los siguientes tokens: ${tokens.join(' ')}.`);
    }

    return result;
}

module.exports = { evaluate };
