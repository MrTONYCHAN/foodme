# 🍳 CookDay

An AI micro-app that turns *your day* into a personal cooking to-do list. Tell it
your meals, headcount, budget, energy level and time — it plates a full
breakfast / lunch / dinner plan with everything you need to actually cook it.

## What it produces

- **Meal plan** — a fitted Breakfast / Lunch / Dinner with recipe, time, calories and difficulty.
- **Grocery list** — every ingredient merged across meals, grouped by aisle and fully costed.
- **Smart substitutions** — diet- and budget-aware swaps for the ingredients in *your* plan.
- **Budget feasibility** — projected cost vs. your budget, a verdict, and concrete ways to cut it.
- **Cooking to-do** — the recipe steps as a checkable, progress-tracked task list.

## How the planner thinks

The engine (`src/lib/planner.js`) is pure and deterministic:

1. **Filters** recipes per slot against your hard dietary requirements.
2. **Scores** survivors on effort vs. your energy and time-per-meal.
3. **Scales** ingredients + cost to your headcount.
4. **Merges** ingredients into a categorised grocery list.
5. **Assesses** total cost against budget (`comfortable` / `tight` / `over`) and suggests savings.

No backend, no API keys, no data leaves the browser.

## Tech

- **React 18** + **Vite**
- **Framer Motion** for staged entrances, the cooking loader, and micro-interactions
- A hand-built recipe + substitution knowledge base (`src/data/recipes.js`)

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
npm run preview  # serve the built bundle
npm run lint     # check JS/JSX with ESLint
```

## Project layout

```
src/
  App.jsx                 three-stage flow: form → cooking → results
  data/recipes.js         recipe library + substitution knowledge base
  lib/planner.js          pure planning / costing / budget engine
  components/
    DayForm.jsx           the "your day" input
    Results.jsx           plan, grocery, budget, subs, to-do
  styles.css              design system (dark warm glass theme)
```
