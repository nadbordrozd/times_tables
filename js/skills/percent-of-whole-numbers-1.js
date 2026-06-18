(function(window) {
    const { greatestCommonDivisor, randomInt, shuffle } = window.SkillUtils;

    const allowedPercents = [1, 2];
    for (let percent = 5; percent < 100; percent += 5) allowedPercents.push(percent);

    function getRequiredFactor(percent) {
        return 100 / greatestCommonDivisor(percent, 100);
    }

    function makeQuestionValues(percent) {
        const requiredFactor = getRequiredFactor(percent);
        const multiplier = randomInt(1, Math.floor(1000 / requiredFactor));
        const whole = requiredFactor * multiplier;
        return { percent, whole, answer: (percent * whole) / 100 };
    }

    function addWrongAnswer(wrong, candidate, correct) {
        if (Number.isInteger(candidate) && candidate >= 0 && candidate !== correct) {
            wrong.add(candidate.toString());
        }
    }

    function generateWrongAnswers(percent, whole, correct) {
        const wrong = new Set();
        addWrongAnswer(wrong, Math.round((whole * Math.max(1, percent + 5)) / 100), correct);
        addWrongAnswer(wrong, Math.round((whole * Math.max(1, percent - 5)) / 100), correct);
        addWrongAnswer(wrong, Math.round((whole * percent) / 10), correct);
        addWrongAnswer(wrong, whole - correct, correct);
        addWrongAnswer(wrong, correct + percent, correct);

        while (wrong.size < 5) {
            const offset = randomInt(-25, 25);
            addWrongAnswer(wrong, correct + offset, correct);
        }

        return Array.from(wrong);
    }

    function generatePercentOfWholeNumbersQuestion() {
        const percent = allowedPercents[randomInt(0, allowedPercents.length - 1)];
        const { whole, answer } = makeQuestionValues(percent);
        const correctAnswer = answer.toString();
        const wrong = generateWrongAnswers(percent, whole, answer);

        return {
            prompt: `What is ${percent}% of ${whole}?`,
            correctAnswer,
            answers: shuffle([...wrong, correctAnswer])
        };
    }

    window.registerPracticeSkill({
        id: 'percent-of-whole-numbers-1',
        name: 'Percent of Whole Numbers 1',
        description: 'Find 1%, 2%, or a multiple of 5% of a whole number up to 1000. Answers are always whole numbers.',
        generateQuestion: generatePercentOfWholeNumbersQuestion
    });
})(window);
