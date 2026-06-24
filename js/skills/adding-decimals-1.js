(function(window) {
    const { randomInt, shuffle } = window.SkillUtils;

    function makeDecimalParts() {
        const integerPart = randomInt(1, 99);
        const decimalPlaces = randomInt(1, 3);
        const fractionalPart = randomInt(Math.pow(10, decimalPlaces - 1), Math.pow(10, decimalPlaces) - 1);
        const scale = Math.pow(10, decimalPlaces);
        return {
            text: `${integerPart}.${fractionalPart.toString().padStart(decimalPlaces, '0')}`,
            thousandths: integerPart * 1000 + fractionalPart * (1000 / scale)
        };
    }

    function formatThousandths(value) {
        const sign = value < 0 ? '-' : '';
        const absolute = Math.abs(value);
        const integerPart = Math.floor(absolute / 1000);
        const fractionalPart = (absolute % 1000).toString().padStart(3, '0').replace(/0+$/, '');
        return fractionalPart ? `${sign}${integerPart}.${fractionalPart}` : `${sign}${integerPart}`;
    }

    function addWrongAnswer(wrong, candidate, correct) {
        if (candidate > 0 && candidate !== correct) wrong.add(formatThousandths(candidate));
    }

    function generateAddingDecimalsQuestion() {
        const left = makeDecimalParts();
        const right = makeDecimalParts();
        const correct = left.thousandths + right.thousandths;
        const correctAnswer = formatThousandths(correct);
        const wrong = new Set();

        addWrongAnswer(wrong, correct + 1000, correct);
        addWrongAnswer(wrong, Math.max(1, correct - 1000), correct);
        addWrongAnswer(wrong, correct + 100, correct);
        addWrongAnswer(wrong, Math.max(1, correct - 100), correct);
        addWrongAnswer(wrong, correct + 10, correct);

        while (wrong.size < 5) {
            addWrongAnswer(wrong, correct + randomInt(-2500, 2500), correct);
        }

        return {
            prompt: `${left.text} + ${right.text} = ?`,
            correctAnswer,
            answers: shuffle([...wrong, correctAnswer])
        };
    }

    window.registerPracticeSkill({
        id: 'adding-decimals-1',
        name: 'Adding Decimals 1',
        description: 'Add decimals with 1, 2, or 3 decimal digits and 1- or 2-digit integer parts.',
        generateQuestion: generateAddingDecimalsQuestion
    });
})(window);
