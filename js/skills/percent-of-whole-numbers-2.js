(function(window) {
    const { greatestCommonDivisor, randomInt, shuffle } = window.SkillUtils;

    function getRequiredFactor(percent) {
        return 100 / greatestCommonDivisor(percent, 100);
    }

    function makeQuestionValues() {
        const percent = randomInt(1, 99);
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
        addWrongAnswer(wrong, Math.round((whole * Math.max(1, percent + 1)) / 100), correct);
        addWrongAnswer(wrong, Math.round((whole * Math.max(1, percent - 1)) / 100), correct);
        addWrongAnswer(wrong, Math.round((whole * Math.max(1, percent + 10)) / 100), correct);
        addWrongAnswer(wrong, Math.round((whole * percent) / 10), correct);
        addWrongAnswer(wrong, whole - correct, correct);

        while (wrong.size < 5) {
            const offset = randomInt(-50, 50);
            addWrongAnswer(wrong, correct + offset, correct);
        }

        return Array.from(wrong);
    }

    function generatePercentOfWholeNumbersSequelQuestion() {
        const { percent, whole, answer } = makeQuestionValues();
        const correctAnswer = answer.toString();
        const wrong = generateWrongAnswers(percent, whole, answer);

        return {
            prompt: `What is ${percent}% of ${whole}?`,
            correctAnswer,
            answers: shuffle([...wrong, correctAnswer])
        };
    }

    window.registerPracticeSkill({
        id: 'percent-of-whole-numbers-2',
        name: 'Percent of Whole Numbers 2',
        description: 'Find any whole-number percent from 1% to 99% of a whole number up to 1000. Answers are always whole numbers.',
        generateQuestion: generatePercentOfWholeNumbersSequelQuestion
    });
})(window);
