(function(window) {
    const { formatFraction, randomInt, shuffle, simplifyFraction } = window.SkillUtils;

    function generateEquivalentFractionsQuestion() {
        const simplestDenominator = randomInt(2, 12);
        const simplestNumerator = randomInt(1, simplestDenominator - 1);
        const simplest = simplifyFraction(simplestNumerator, simplestDenominator);
        const promptMultiplier = randomInt(2, 6);
        const promptFraction = {
            numerator: simplest.numerator * promptMultiplier,
            denominator: simplest.denominator * promptMultiplier
        };
        const equivalentMultipliers = [1, 2, 3, 4, 5, 6].filter(multiplier => multiplier !== promptMultiplier);
        const answerMultiplier = equivalentMultipliers[randomInt(0, equivalentMultipliers.length - 1)];
        const correctFraction = {
            numerator: simplest.numerator * answerMultiplier,
            denominator: simplest.denominator * answerMultiplier
        };
        const correctAnswer = formatFraction(correctFraction);
        const wrong = new Set();

        while (wrong.size < 5) {
            const denominator = randomInt(2, 12);
            const numerator = randomInt(1, denominator - 1);
            const candidate = simplifyFraction(numerator, denominator);
            const candidateText = formatFraction(candidate);
            const isEquivalent = candidate.numerator === simplest.numerator && candidate.denominator === simplest.denominator;
            if (!isEquivalent && candidateText !== correctAnswer) wrong.add(candidateText);
        }

        return {
            prompt: `Which fraction is equivalent to ${formatFraction(promptFraction)}?`,
            correctAnswer,
            answers: shuffle([...wrong, correctAnswer])
        };
    }

    window.registerPracticeSkill({
        id: 'equivalent-fractions-1',
        name: 'Equivalent Fractions 1',
        description: 'Choose an equivalent fraction. Simplest denominators are no more than 12.',
        generateQuestion: generateEquivalentFractionsQuestion
    });
})(window);
