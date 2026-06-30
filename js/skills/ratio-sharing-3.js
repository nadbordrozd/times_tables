(function(window) {
    const { randomInt, shuffle } = window.SkillUtils;

    const templates = [
        {
            names: ['Mia', 'Ben', 'Chloe'],
            item: 'pencils',
            context: 'shared a box of {total} pencils',
            unit: 'pencils'
        },
        {
            names: ['Lina', 'Kai', 'Rosa'],
            item: 'shells',
            context: 'collected {total} shells at the beach',
            unit: 'shells'
        },
        {
            names: ['Ivy', 'Max', 'Nora'],
            item: 'cupcakes',
            context: 'baked {total} cupcakes for a fundraiser',
            unit: 'cupcakes'
        },
        {
            names: ['Amir', 'Jade', 'Tess'],
            item: 'game tokens',
            context: 'won {total} game tokens',
            unit: 'tokens'
        },
        {
            names: ['Elena', 'Finn', 'Zara'],
            item: 'building blocks',
            context: 'packed {total} building blocks into three tubs',
            unit: 'blocks'
        }
    ];

    const ratios = [
        [1, 2, 3], [2, 3, 4], [3, 2, 5], [2, 5, 3], [4, 3, 5], [3, 4, 7]
    ];

    function formatContext(template, total) {
        return template.context.replace('{total}', total);
    }

    function addWrongAnswer(wrong, candidate, correctAnswer) {
        if (candidate.every(value => value > 0)) {
            const answer = candidate.join(', ');
            if (answer !== correctAnswer) wrong.add(answer);
        }
    }

    function generateWrongAnswers(shares, ratio, correctAnswer) {
        const wrong = new Set();
        addWrongAnswer(wrong, [shares[2], shares[1], shares[0]], correctAnswer);
        addWrongAnswer(wrong, [ratio[0], ratio[1], ratio[2]], correctAnswer);
        addWrongAnswer(wrong, shares.map((share, index) => share + ratio[index]), correctAnswer);
        addWrongAnswer(wrong, [shares[0] + ratio[0], shares[1] - ratio[1], shares[2]], correctAnswer);
        addWrongAnswer(wrong, [shares[0], shares[2], shares[1]], correctAnswer);

        while (wrong.size < 5) {
            const offset = randomInt(-3, 3);
            addWrongAnswer(wrong, [shares[0] + offset, shares[1], shares[2] - offset], correctAnswer);
        }

        return Array.from(wrong);
    }

    function generateThreeNumberRatioSharingQuestion() {
        const template = templates[randomInt(0, templates.length - 1)];
        const ratio = ratios[randomInt(0, ratios.length - 1)];
        const multiplier = randomInt(2, 12);
        const shares = ratio.map(part => part * multiplier);
        const total = shares[0] + shares[1] + shares[2];
        const correctAnswer = shares.join(', ');
        const wrong = generateWrongAnswers(shares, ratio, correctAnswer);

        return {
            prompt: `${template.names.join(', ')} ${formatContext(template, total)}. They divide the ${template.item} in the ratio ${ratio.join(':')}. How many ${template.unit} does each person get? Answer as ${template.names.join(', ')}.`,
            correctAnswer,
            answers: shuffle([...wrong, correctAnswer])
        };
    }

    window.registerPracticeSkill({
        id: 'ratio-sharing-3',
        name: 'Ratio Sharing 3 Numbers',
        description: 'Split a total amount between three people using a ratio such as 3:2:5.',
        generateQuestion: generateThreeNumberRatioSharingQuestion
    });
})(window);
