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
            divisor = randomInt(2, 9);
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
        addWrongAnswer(wrong, quotient + divisor, quotient);
        addWrongAnswer(wrong, Math.max(1, quotient - divisor), quotient);
        addWrongAnswer(wrong, Math.floor(dividend / Math.max(1, divisor - 1)), quotient);

        while (wrong.size < 5) {
            addWrongAnswer(wrong, quotient + randomInt(-25, 25), quotient);
        }

        return {
            prompt: `${dividend} ÷ ${divisor} = ?`,
            correctAnswer: quotient.toString(),
            answers: shuffle([...wrong, quotient.toString()])
        };
    }

    window.registerPracticeSkill({
        id: 'three-digit-by-one-digit-division-1',
        name: '3-Digit ÷ 1-Digit Division 1',
        description: 'Divide a three-digit number by a one-digit number. Answers are always whole numbers.',
        generateQuestion: generateDivisionQuestion
    });
})(window);
