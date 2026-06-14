(function(window) {
    const { formatFraction, randomInt, shuffle, simplifyFraction } = window.SkillUtils;

    function makeProperFraction() {
        const denominator = randomInt(2, 10);
        const numerator = randomInt(1, denominator - 1);
        return simplifyFraction(numerator, denominator);
    }

    function addFractions(left, right) {
        return simplifyFraction(
            left.numerator * right.denominator + right.numerator * left.denominator,
            left.denominator * right.denominator
        );
    }

    function maybeAddAnswer(wrong, fraction, correctAnswer) {
        if (fraction.numerator <= 0 || fraction.denominator <= 0) return;
        const candidate = formatFraction(simplifyFraction(fraction.numerator, fraction.denominator));
        if (candidate !== correctAnswer) wrong.add(candidate);
    }

    function generateAddingFractionsQuestion() {
        const left = makeProperFraction();
        const right = makeProperFraction();
        const correct = addFractions(left, right);
        const correctAnswer = formatFraction(correct);
        const wrong = new Set();

        maybeAddAnswer(wrong, {
            numerator: left.numerator + right.numerator,
            denominator: Math.max(left.denominator, right.denominator)
        }, correctAnswer);
        maybeAddAnswer(wrong, {
            numerator: left.numerator + right.numerator,
            denominator: left.denominator + right.denominator
        }, correctAnswer);
        maybeAddAnswer(wrong, {
            numerator: left.numerator * right.denominator + right.numerator,
            denominator: left.denominator * right.denominator
        }, correctAnswer);
        maybeAddAnswer(wrong, {
            numerator: left.numerator * right.denominator + right.numerator * left.denominator,
            denominator: Math.max(left.denominator, right.denominator)
        }, correctAnswer);
        maybeAddAnswer(wrong, {
            numerator: Math.abs(left.numerator * right.denominator - right.numerator * left.denominator),
            denominator: left.denominator * right.denominator
        }, correctAnswer);

        while (wrong.size < 5) {
            const nearbyNumerator = Math.max(1, correct.numerator + randomInt(-3, 3));
            const nearbyDenominator = Math.max(2, correct.denominator + randomInt(-3, 3));
            maybeAddAnswer(wrong, { numerator: nearbyNumerator, denominator: nearbyDenominator }, correctAnswer);
        }

        return {
            prompt: `${formatFraction(left)} + ${formatFraction(right)} = ?`,
            correctAnswer,
            answers: shuffle([...wrong, correctAnswer])
        };
    }

    window.registerPracticeSkill({
        id: 'adding-fractions-1',
        name: 'Adding Fractions 1',
        description: 'Add two random proper fractions with denominators up to 10. Answers are shown in simplest form.',
        generateQuestion: generateAddingFractionsQuestion
    });
})(window);
