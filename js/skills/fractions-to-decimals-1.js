(function(window) {
    const { formatFraction, randomInt, shuffle, simplifyFraction } = window.SkillUtils;

    const denominators = [2, 4, 5, 8, 10, 20, 25, 50, 100];

    function formatDecimal(value) {
        return value.toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
    }

    function makeFraction() {
        const denominator = denominators[randomInt(0, denominators.length - 1)];
        const numerator = randomInt(1, denominator - 1);
        return simplifyFraction(numerator, denominator);
    }

    function addDecimalAnswer(wrong, value, correctAnswer) {
        if (value <= 0 || value >= 1) return;
        const candidate = formatDecimal(value);
        if (candidate !== correctAnswer) wrong.add(candidate);
    }

    function generateFractionsToDecimalsQuestion() {
        const fraction = makeFraction();
        const correctAnswer = formatDecimal(fraction.numerator / fraction.denominator);
        const wrong = new Set();

        addDecimalAnswer(wrong, fraction.denominator / 100, correctAnswer);
        addDecimalAnswer(wrong, fraction.numerator / 100, correctAnswer);
        addDecimalAnswer(wrong, fraction.numerator / 10, correctAnswer);
        addDecimalAnswer(wrong, (fraction.numerator + 1) / fraction.denominator, correctAnswer);
        addDecimalAnswer(wrong, Math.max(1, fraction.numerator - 1) / fraction.denominator, correctAnswer);

        while (wrong.size < 5) {
            const alternate = makeFraction();
            addDecimalAnswer(wrong, alternate.numerator / alternate.denominator, correctAnswer);
        }

        return {
            prompt: `${formatFraction(fraction)} = ?`,
            correctAnswer,
            answers: shuffle([...wrong, correctAnswer])
        };
    }

    window.registerPracticeSkill({
        id: 'fractions-to-decimals-1',
        name: 'Fractions to Decimals 1',
        description: 'Convert proper fractions to decimals using denominators 2, 4, 5, 8, 10, 20, 25, 50, and 100.',
        generateQuestion: generateFractionsToDecimalsQuestion
    });
})(window);
