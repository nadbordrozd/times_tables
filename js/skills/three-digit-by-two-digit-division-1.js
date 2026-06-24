(function(window) {
    const { randomInt, shuffle } = window.SkillUtils;

    function addWrongAnswer(wrong, candidate, correct) {
        if (Number.isInteger(candidate) && candidate > 0 && candidate !== correct) {
            wrong.add(candidate.toString());
        }
    }

    function makeDivisionValues() {
        let divisor;
        let quotient;
        let dividend;
        do {
            divisor = randomInt(10, 99);
            quotient = randomInt(Math.ceil(100 / divisor), Math.floor(999 / divisor));
            dividend = divisor * quotient;
        } while (dividend < 100 || dividend > 999);
        return { dividend, divisor, quotient };
    }

    function generateDivisionQuestion() {
        const { dividend, divisor, quotient } = makeDivisionValues();
        const wrong = new Set();

        addWrongAnswer(wrong, quotient + 1, quotient);
        addWrongAnswer(wrong, Math.max(1, quotient - 1), quotient);
        addWrongAnswer(wrong, quotient + 10, quotient);
        addWrongAnswer(wrong, Math.max(1, quotient - 10), quotient);
        addWrongAnswer(wrong, Math.round(dividend / Math.max(1, divisor - 1)), quotient);

        while (wrong.size < 5) {
            addWrongAnswer(wrong, quotient + randomInt(-15, 15), quotient);
        }

        return {
            prompt: `${dividend} ÷ ${divisor} = ?`,
            correctAnswer: quotient.toString(),
            answers: shuffle([...wrong, quotient.toString()])
        };
    }

    window.registerPracticeSkill({
        id: 'three-digit-by-two-digit-division-1',
        name: '3-Digit ÷ 2-Digit Division 1',
        description: 'Divide a three-digit number by a two-digit number. Answers are always whole numbers.',
        generateQuestion: generateDivisionQuestion
    });
})(window);
