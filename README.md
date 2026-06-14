# Skills Master

Skills Master is a browser-based practice app. The default screen drills times tables, and the **Skills** screen lists additional practice modules such as addition, equivalent fractions, and expression expansion.

## Project structure

- `index.html` contains the page markup, styles, and the ordered `<script>` tags that load the app.
- `js/app.js` controls the shared UI: skill selection, question rendering, answer handling, progress storage, and times-table-specific logic.
- `js/skills/common.js` defines the skill registry and shared helper functions such as `randomInt`, `shuffle`, `simplifyFraction`, and `formatFraction`.
- `js/skills/*-1.js` files each register one practice skill. A skill file owns its own question-generation logic and calls `window.registerPracticeSkill(...)` when loaded.

## Skill file contract

Each skill registers an object with this shape:

```js
window.registerPracticeSkill({
    id: 'unique-skill-id',
    name: 'Human Friendly Name',
    description: 'Short explanation shown on the skill card.',
    generateQuestion: generateQuestionFunction
});
```

`generateQuestion` must return:

```js
{
    prompt: 'Question text shown to the learner',
    correctAnswer: 'The exact answer string that should be accepted',
    answers: ['six', 'answer', 'strings', 'including', 'the', 'correctAnswer']
}
```

The app compares answers by exact string equality, so fraction skills should use `simplifyFraction` and `formatFraction` from `window.SkillUtils` to keep answers in simplest form.

## How to add a skill

1. Create a new file in `js/skills/`, usually named after the skill and level, such as `adding-fractions-1.js`.
2. Wrap the file in an immediately invoked function expression: `(function(window) { ... })(window);`.
3. Pull any helpers you need from `window.SkillUtils`.
4. Write a `generateQuestion` function that returns one prompt, one `correctAnswer`, and six shuffled answer choices.
5. Register the skill with a unique `id`, display `name`, `description`, and the generator function.
6. Add a `<script>` tag for the new file in `index.html` after `js/skills/common.js` and before `js/app.js`.
7. Open the app, click **Skills**, and verify that the new skill card appears and produces questions.

## Fraction-answer guidance

For fraction skills, create answers with numeric numerator and denominator values first, then simplify and format them before putting them into `answers`. This prevents duplicate-looking choices such as `1/2` and `2/4`, and keeps correct answers in simplest form.
