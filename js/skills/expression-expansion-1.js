(function(window) {
    const { formatVariableTerm, randomInt, shuffle } = window.SkillUtils;

    function formatFactorExpression(expression) {
        if (expression.variable) return formatVariableTerm(expression.coefficient, expression.variable);
        return expression.coefficient.toString();
    }

    function makeNumberExpression() {
        return { coefficient: randomInt(1, 9), variable: null };
    }

    function makeVariableExpression(availableVariables) {
        const variable = availableVariables[randomInt(0, availableVariables.length - 1)];
        const coefficient = Math.random() < 0.5 ? 1 : randomInt(2, 9);
        return { coefficient, variable };
    }

    function multiplyExpressionTerms(left, right, coefficientOffset = 0) {
        const coefficient = Math.max(1, left.coefficient * right.coefficient + coefficientOffset);
        const variables = [left.variable, right.variable].filter(Boolean).sort();
        return { coefficient, variables: variables.join('') };
    }

    function formatExpandedTerms(terms) {
        const combined = new Map();
        terms.forEach(term => {
            combined.set(term.variables, (combined.get(term.variables) || 0) + term.coefficient);
        });
        const orderedTerms = Array.from(combined.entries())
            .map(([variables, coefficient]) => ({ variables, coefficient }))
            .filter(term => term.coefficient !== 0)
            .sort((a, b) => {
                if (a.variables === '' && b.variables !== '') return -1;
                if (a.variables !== '' && b.variables === '') return 1;
                if (a.variables.length !== b.variables.length) return a.variables.length - b.variables.length;
                return a.variables.localeCompare(b.variables);
            });

        if (orderedTerms.length === 0) return '0';
        return orderedTerms.map(term => {
            if (!term.variables) return term.coefficient.toString();
            return formatVariableTerm(term.coefficient, term.variables);
        }).join(' + ');
    }

    function cloneExpression(expression) {
        return { coefficient: expression.coefficient, variable: expression.variable };
    }

    function generateExpressionExpansionQuestion() {
        const variables = shuffle(['a', 'b', 'c', 'm', 'n', 'p', 'x', 'y', 'z']).slice(0, 3);
        const outside = Math.random() < 0.35 ? makeNumberExpression() : makeVariableExpression(variables);
        const bracketVariables = outside.variable ? variables.filter(variable => variable !== outside.variable) : variables;
        const firstInner = Math.random() < 0.4 ? makeNumberExpression() : makeVariableExpression(bracketVariables);
        let secondInner = Math.random() < 0.4 ? makeNumberExpression() : makeVariableExpression(bracketVariables);
        if (firstInner.variable && secondInner.variable && firstInner.variable === secondInner.variable) {
            const alternateVariables = bracketVariables.filter(variable => variable !== firstInner.variable);
            secondInner = makeVariableExpression(alternateVariables.length ? alternateVariables : bracketVariables);
        }

        const prompt = `${formatFactorExpression(outside)}*(${formatFactorExpression(firstInner)} + ${formatFactorExpression(secondInner)}) = ?`;
        const correctTerms = [
            multiplyExpressionTerms(outside, firstInner),
            multiplyExpressionTerms(outside, secondInner)
        ];
        const correctAnswer = formatExpandedTerms(correctTerms);
        const wrong = new Set();
        const outsidePlusOne = cloneExpression(outside);
        outsidePlusOne.coefficient += 1;
        const firstPlusOne = cloneExpression(firstInner);
        firstPlusOne.coefficient += 1;
        const secondMinusOne = cloneExpression(secondInner);
        secondMinusOne.coefficient = Math.max(1, secondMinusOne.coefficient - 1);
        const distractorTermSets = [
            [multiplyExpressionTerms(outside, firstInner), multiplyExpressionTerms(outside, secondInner, outside.coefficient)],
            [multiplyExpressionTerms(outside, firstInner), multiplyExpressionTerms(firstInner, secondInner)],
            [multiplyExpressionTerms(outside, firstInner), multiplyExpressionTerms(outsidePlusOne, secondInner)],
            [multiplyExpressionTerms(outside, firstPlusOne), multiplyExpressionTerms(outside, secondInner)],
            [multiplyExpressionTerms(outside, firstInner), multiplyExpressionTerms(outside, secondMinusOne)],
            [multiplyExpressionTerms(outside, makeNumberExpression()), multiplyExpressionTerms(outside, secondInner)]
        ];

        shuffle(distractorTermSets).forEach(termSet => {
            const candidate = formatExpandedTerms(termSet);
            if (candidate !== correctAnswer && wrong.size < 5) wrong.add(candidate);
        });

        while (wrong.size < 5) {
            const adjustedFirst = cloneExpression(firstInner);
            const adjustedSecond = cloneExpression(secondInner);
            adjustedFirst.coefficient = randomInt(1, 9);
            adjustedSecond.coefficient = randomInt(1, 9);
            const candidate = formatExpandedTerms([
                multiplyExpressionTerms(outside, adjustedFirst),
                multiplyExpressionTerms(outside, adjustedSecond)
            ]);
            if (candidate !== correctAnswer) wrong.add(candidate);
        }

        return { prompt, correctAnswer, answers: shuffle([...wrong, correctAnswer]) };
    }

    window.registerPracticeSkill({
        id: 'expression-expansion-1',
        name: 'Expression Expansion 1',
        description: 'Expand expressions such as 5a(1 + b) without squared terms.',
        generateQuestion: generateExpressionExpansionQuestion
    });
})(window);
