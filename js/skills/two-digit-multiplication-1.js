(function(window) {
    const { randomInt, shuffle } = window.SkillUtils;

    function addWrongAnswer(wrong, candidate, correct) {
        if (Number.isInteger(candidate) && candidate > 0 && candidate !== correct) {
            wrong.add(candidate.toString());
        }
    }

    function generateTwoDigitMultiplicationQuestion() {
        const a = randomInt(10, 99);
        const b = randomInt(10, 99);
        const correct = a * b;
        const wrong = new Set();

        addWrongAnswer(wrong, (a + 1) * b, correct);
        addWrongAnswer(wrong, a * (b + 1), correct);
        addWrongAnswer(wrong, Math.max(1, (a - 1) * b), correct);
        addWrongAnswer(wrong, Math.max(1, a * (b - 1)), correct);
        addWrongAnswer(wrong, (a + b) * 10, correct);

        while (wrong.size < 5) {
            addWrongAnswer(wrong, correct + randomInt(-250, 250), correct);
        }

        return {
            prompt: `${a} × ${b} = ?`,
            correctAnswer: correct.toString(),
            answers: shuffle([...wrong, correct.toString()])
        };
    }

    window.registerPracticeSkill({
        id: 'two-digit-multiplication-1',
        name: 'Two-Digit Multiplication 1',
        description: 'Multiply a two-digit number by another two-digit number.',
        generateQuestion: generateTwoDigitMultiplicationQuestion
    });
})(window);
