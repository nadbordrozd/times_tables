(function(window) {
    const practiceSkills = [];

    function registerPracticeSkill(skill) {
        practiceSkills.push(skill);
    }

    function shuffle(items) {
        return items.sort(() => Math.random() - 0.5);
    }

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function formatVariableTerm(coefficient, variable) {
        if (coefficient === 0) return '0';
        if (coefficient === 1) return variable;
        if (coefficient === -1) return `-${variable}`;
        return `${coefficient}${variable}`;
    }

    function formatExpression(constant, coefficient, variable) {
        const term = formatVariableTerm(Math.abs(coefficient), variable);
        if (coefficient >= 0) return `${constant} + ${term}`;
        return `${constant} - ${term}`;
    }

    function greatestCommonDivisor(a, b) {
        let x = Math.abs(a);
        let y = Math.abs(b);
        while (y !== 0) {
            const remainder = x % y;
            x = y;
            y = remainder;
        }
        return x;
    }

    function simplifyFraction(numerator, denominator) {
        const divisor = greatestCommonDivisor(numerator, denominator);
        return { numerator: numerator / divisor, denominator: denominator / divisor };
    }

    function formatFraction(fraction) {
        return `${fraction.numerator}/${fraction.denominator}`;
    }

    window.practiceSkills = practiceSkills;
    window.registerPracticeSkill = registerPracticeSkill;
    window.SkillUtils = {
        shuffle,
        randomInt,
        formatVariableTerm,
        formatExpression,
        greatestCommonDivisor,
        simplifyFraction,
        formatFraction
    };
})(window);
