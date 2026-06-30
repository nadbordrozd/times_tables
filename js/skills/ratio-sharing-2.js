(function(window) {
    const { randomInt, shuffle } = window.SkillUtils;

    const templates = [
        {
            names: ['Maya', 'Noah'],
            item: 'stickers',
            context: 'sorted a stack of {total} stickers',
            unit: 'stickers'
        },
        {
            names: ['Ava', 'Leo'],
            item: 'marbles',
            context: 'found a bag of {total} marbles',
            unit: 'marbles'
        },
        {
            names: ['Sofia', 'Ethan'],
            item: 'trading cards',
            context: 'opened a box with {total} trading cards',
            unit: 'cards'
        },
        {
            names: ['Priya', 'Sam'],
            item: 'tickets',
            context: 'earned {total} arcade tickets',
            unit: 'tickets'
        },
        {
            names: ['Grace', 'Omar'],
            item: 'beads',
            context: 'counted {total} beads for a craft project',
            unit: 'beads'
        }
    ];

    const ratios = [
        [1, 2], [2, 3], [3, 4], [4, 5], [2, 5], [3, 5], [5, 7]
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

    function generateWrongAnswers(shares, ratio, total, correctAnswer) {
        const wrong = new Set();
        addWrongAnswer(wrong, [shares[1], shares[0]], correctAnswer);
        addWrongAnswer(wrong, [ratio[0], ratio[1]], correctAnswer);
        addWrongAnswer(wrong, [shares[0] + ratio[0], shares[1] + ratio[1]], correctAnswer);
        addWrongAnswer(wrong, [Math.max(1, shares[0] - ratio[0]), shares[1] + ratio[0]], correctAnswer);
        addWrongAnswer(wrong, [shares[0], total - shares[0]], correctAnswer);

        while (wrong.size < 5) {
            const offset = randomInt(-3, 3);
            addWrongAnswer(wrong, [shares[0] + offset, shares[1] - offset], correctAnswer);
        }

        return Array.from(wrong);
    }

    function generateRatioSharingQuestion() {
        const template = templates[randomInt(0, templates.length - 1)];
        const ratio = ratios[randomInt(0, ratios.length - 1)];
        const multiplier = randomInt(3, 15);
        const shares = ratio.map(part => part * multiplier);
        const total = shares[0] + shares[1];
        const correctAnswer = shares.join(', ');
        const wrong = generateWrongAnswers(shares, ratio, total, correctAnswer);

        return {
            prompt: `${template.names[0]} and ${template.names[1]} ${formatContext(template, total)}. They divide the ${template.item} in the ratio ${ratio[0]}:${ratio[1]}. How many ${template.unit} does each person get? Answer as ${template.names[0]}, ${template.names[1]}.`,
            correctAnswer,
            answers: shuffle([...wrong, correctAnswer])
        };
    }

    window.registerPracticeSkill({
        id: 'ratio-sharing-2',
        name: 'Ratio Sharing 2 Numbers',
        description: 'Split a total amount between two people using a ratio such as 3:4.',
        generateQuestion: generateRatioSharingQuestion
    });
})(window);
