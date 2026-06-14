(function(window) {
    const { randomInt, shuffle } = window.SkillUtils;

    function generateAdditionQuestion() {
        const a = randomInt(0, 9);
        const b = randomInt(0, 9);
        const correct = a + b;
        const wrong = new Set();
        while (wrong.size < 5) {
            const candidate = randomInt(0, 18);
            if (candidate !== correct) wrong.add(candidate);
        }
        return { prompt: `${a} + ${b} = ?`, correctAnswer: correct.toString(), answers: shuffle([...wrong].map(String).concat(correct.toString())) };
    }

    window.registerPracticeSkill({
        id: 'addition-1',
        name: 'Addition 1',
        description: 'Single digit addition with answers from 0 to 18.',
        generateQuestion: generateAdditionQuestion
    });
})(window);
