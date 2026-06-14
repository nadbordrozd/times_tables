(function(window) {
    const { formatExpression, formatVariableTerm, randomInt, shuffle } = window.SkillUtils;

    function generateDistributiveQuestion() {
        const outside = randomInt(2, 9);
        const constant = randomInt(1, 9);
        const variable = ['a', 'b', 'm', 'n', 'p', 'x', 'y', 'z'][randomInt(0, 7)];
        const innerCoefficient = Math.random() < 0.5 ? 1 : randomInt(2, 9);
        const sign = Math.random() < 0.5 ? 1 : -1;
        const variableTerm = formatVariableTerm(innerCoefficient, variable);
        const operator = sign === 1 ? '+' : '-';
        const bracket = `(${constant} ${operator} ${variableTerm})`;
        const prompt = Math.random() < 0.5 ? `${outside}${bracket}` : `${bracket}${outside}`;
        const correctConstant = outside * constant;
        const correctCoefficient = outside * innerCoefficient * sign;
        const correctAnswer = formatExpression(correctConstant, correctCoefficient, variable);
        const wrong = new Set();
        const candidates = [
            formatExpression(correctConstant, innerCoefficient * sign, variable),
            formatExpression(constant, correctCoefficient, variable),
            formatExpression(correctConstant + outside, correctCoefficient, variable),
            formatExpression(correctConstant, -correctCoefficient, variable),
            formatExpression(outside + constant, (outside + innerCoefficient) * sign, variable),
            formatExpression(correctConstant - outside, correctCoefficient, variable),
            formatExpression(correctConstant, correctCoefficient + sign * outside, variable)
        ];
        shuffle(candidates).forEach(candidate => {
            if (candidate !== correctAnswer && wrong.size < 5) wrong.add(candidate);
        });
        while (wrong.size < 5) {
            const candidate = formatExpression(randomInt(1, 81), randomInt(1, 81) * (Math.random() < 0.5 ? 1 : -1), variable);
            if (candidate !== correctAnswer) wrong.add(candidate);
        }
        return { prompt: `${prompt} = ?`, correctAnswer, answers: shuffle([...wrong, correctAnswer]) };
    }

    window.registerPracticeSkill({
        id: 'distributive-property-1',
        name: 'Distributive Property 1',
        description: 'Expand simple brackets such as 3(2 + a).',
        generateQuestion: generateDistributiveQuestion
    });
})(window);
