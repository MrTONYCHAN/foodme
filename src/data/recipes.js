// CookDay recipe library.
// Each recipe carries everything the planner needs: dietary tags, effort, time,
// per-serving nutrition, a fully-costed ingredient list, steps, and substitutions.
//
// Cost is expressed in USD for the quantity listed (already scaled to `base` servings).
// Ingredient categories drive the grocery-list grouping.

export const SLOTS = ['breakfast', 'lunch', 'dinner']

export const DIET_TAGS = {
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
  glutenFree: 'Gluten-free',
  dairyFree: 'Dairy-free',
  highProtein: 'High-protein',
  lowCarb: 'Low-carb',
}

// ── Ingredient substitution knowledge base ───────────────────────────────
// Keyed by ingredient name. Each entry lists swaps with the constraint it solves.
export const SUBSTITUTIONS = {
  'Greek yogurt': [
    { swap: 'Coconut yogurt', reason: 'dairy-free / vegan', ratio: '1:1' },
    { swap: 'Silken tofu, blended', reason: 'vegan, high-protein', ratio: '1:1' },
  ],
  Milk: [
    { swap: 'Oat milk', reason: 'dairy-free / vegan', ratio: '1:1' },
    { swap: 'Almond milk', reason: 'dairy-free, lower-cal', ratio: '1:1' },
  ],
  Butter: [
    { swap: 'Olive oil', reason: 'dairy-free', ratio: '3:4' },
    { swap: 'Vegan butter', reason: 'vegan', ratio: '1:1' },
  ],
  Eggs: [
    { swap: 'Flax egg (1 tbsp flax + 3 tbsp water)', reason: 'vegan', ratio: '1 egg' },
    { swap: 'Silken tofu (¼ cup)', reason: 'vegan, in scrambles', ratio: '1 egg' },
  ],
  'Chicken breast': [
    { swap: 'Firm tofu', reason: 'vegetarian / vegan', ratio: '1:1' },
    { swap: 'Chickpeas', reason: 'vegan, budget', ratio: '1:1 by weight' },
  ],
  'Ground beef': [
    { swap: 'Lentils (cooked)', reason: 'vegetarian, budget', ratio: '1:1' },
    { swap: 'Plant mince', reason: 'vegan', ratio: '1:1' },
  ],
  Pasta: [
    { swap: 'Gluten-free pasta', reason: 'gluten-free', ratio: '1:1' },
    { swap: 'Zucchini noodles', reason: 'low-carb', ratio: '1:1 by volume' },
  ],
  'Soy sauce': [
    { swap: 'Tamari', reason: 'gluten-free', ratio: '1:1' },
    { swap: 'Coconut aminos', reason: 'gluten-free, lower-sodium', ratio: '1:1' },
  ],
  'White rice': [
    { swap: 'Brown rice', reason: 'more fibre', ratio: '1:1' },
    { swap: 'Cauliflower rice', reason: 'low-carb', ratio: '1:1' },
  ],
  Bread: [
    { swap: 'Gluten-free bread', reason: 'gluten-free', ratio: '1:1' },
    { swap: 'Lettuce wrap', reason: 'low-carb', ratio: 'to taste' },
  ],
  Parmesan: [
    { swap: 'Nutritional yeast', reason: 'vegan', ratio: '1:2' },
  ],
  Honey: [
    { swap: 'Maple syrup', reason: 'vegan', ratio: '1:1' },
  ],
  Tortilla: [
    { swap: 'Corn tortilla', reason: 'gluten-free', ratio: '1:1' },
  ],
}

// helper to keep recipe entries terse
const ing = (item, qty, unit, cat, cost) => ({ item, qty, unit, cat, cost })

export const RECIPES = [
  // ───────────────────────── BREAKFAST ─────────────────────────
  {
    id: 'overnight-oats',
    title: 'Berry Overnight Oats',
    slot: 'breakfast',
    base: 1,
    prep: 5,
    difficulty: 1,
    calories: 380,
    tags: ['vegetarian', 'dairyFree'],
    blurb: 'Stir tonight, grab and go tomorrow. Zero morning effort.',
    ingredients: [
      ing('Rolled oats', 0.5, 'cup', 'pantry', 0.25),
      ing('Oat milk', 0.5, 'cup', 'dairy', 0.4),
      ing('Chia seeds', 1, 'tbsp', 'pantry', 0.3),
      ing('Mixed berries', 0.5, 'cup', 'produce', 1.1),
      ing('Maple syrup', 1, 'tsp', 'pantry', 0.15),
    ],
    steps: [
      'Combine oats, oat milk and chia in a jar.',
      'Stir in maple syrup, top with berries.',
      'Refrigerate overnight (or at least 4 hours).',
    ],
  },
  {
    id: 'veggie-scramble',
    title: 'Garden Veggie Scramble',
    slot: 'breakfast',
    base: 1,
    prep: 12,
    difficulty: 2,
    calories: 320,
    tags: ['vegetarian', 'glutenFree', 'highProtein', 'lowCarb'],
    blurb: 'Fluffy eggs loaded with whatever veg you have.',
    ingredients: [
      ing('Eggs', 3, 'each', 'protein', 0.9),
      ing('Spinach', 1, 'cup', 'produce', 0.6),
      ing('Cherry tomatoes', 0.5, 'cup', 'produce', 0.7),
      ing('Butter', 1, 'tsp', 'dairy', 0.1),
      ing('Feta', 2, 'tbsp', 'dairy', 0.5),
    ],
    steps: [
      'Melt butter, wilt spinach and tomatoes 1 min.',
      'Pour in whisked eggs, fold gently till just set.',
      'Crumble feta over and serve.',
    ],
  },
  {
    id: 'pb-banana-toast',
    title: 'Peanut Butter Banana Toast',
    slot: 'breakfast',
    base: 1,
    prep: 4,
    difficulty: 1,
    calories: 340,
    tags: ['vegetarian', 'vegan', 'dairyFree'],
    blurb: 'The five-dollar-week classic. Fast, filling, cheap.',
    ingredients: [
      ing('Bread', 2, 'slice', 'bakery', 0.4),
      ing('Peanut butter', 2, 'tbsp', 'pantry', 0.4),
      ing('Banana', 1, 'each', 'produce', 0.3),
      ing('Honey', 1, 'tsp', 'pantry', 0.15),
    ],
    steps: [
      'Toast the bread.',
      'Spread peanut butter, layer banana slices.',
      'Drizzle honey, finish with a pinch of salt.',
    ],
  },
  {
    id: 'yogurt-parfait',
    title: 'Honey Granola Parfait',
    slot: 'breakfast',
    base: 1,
    prep: 5,
    difficulty: 1,
    calories: 360,
    tags: ['vegetarian', 'glutenFree', 'highProtein'],
    blurb: 'Creamy, crunchy, sweet — assembled in a glass.',
    ingredients: [
      ing('Greek yogurt', 0.75, 'cup', 'dairy', 1.1),
      ing('Granola', 0.33, 'cup', 'pantry', 0.6),
      ing('Mixed berries', 0.5, 'cup', 'produce', 1.1),
      ing('Honey', 1, 'tsp', 'pantry', 0.15),
    ],
    steps: [
      'Layer half the yogurt, then granola and berries.',
      'Repeat the layers.',
      'Finish with a thread of honey.',
    ],
  },

  // ───────────────────────── LUNCH ─────────────────────────
  {
    id: 'chickpea-bowl',
    title: 'Mediterranean Chickpea Bowl',
    slot: 'lunch',
    base: 1,
    prep: 15,
    difficulty: 2,
    calories: 520,
    tags: ['vegetarian', 'vegan', 'dairyFree', 'highProtein'],
    blurb: 'No-cook, meal-prep friendly, travels well.',
    ingredients: [
      ing('Chickpeas', 1, 'cup', 'pantry', 0.8),
      ing('Cucumber', 0.5, 'each', 'produce', 0.5),
      ing('Cherry tomatoes', 0.5, 'cup', 'produce', 0.7),
      ing('Olive oil', 1, 'tbsp', 'pantry', 0.2),
      ing('Lemon', 0.5, 'each', 'produce', 0.3),
      ing('Parsley', 0.25, 'cup', 'produce', 0.4),
    ],
    steps: [
      'Drain chickpeas, dice cucumber and halve tomatoes.',
      'Toss with olive oil, lemon juice and parsley.',
      'Season well and chill until lunch.',
    ],
  },
  {
    id: 'turkey-wrap',
    title: 'Crunchy Turkey Wrap',
    slot: 'lunch',
    base: 1,
    prep: 8,
    difficulty: 1,
    calories: 450,
    tags: ['highProtein'],
    blurb: 'Roll it, wrap it, eat it at your desk.',
    ingredients: [
      ing('Tortilla', 1, 'each', 'bakery', 0.5),
      ing('Turkey slices', 4, 'slice', 'protein', 1.8),
      ing('Lettuce', 1, 'cup', 'produce', 0.4),
      ing('Cheddar', 1, 'slice', 'dairy', 0.4),
      ing('Hummus', 2, 'tbsp', 'pantry', 0.5),
    ],
    steps: [
      'Spread hummus over the tortilla.',
      'Layer turkey, cheese and lettuce.',
      'Roll tight, slice on the diagonal.',
    ],
  },
  {
    id: 'tomato-soup-grilled-cheese',
    title: 'Tomato Soup & Grilled Cheese',
    slot: 'lunch',
    base: 1,
    prep: 18,
    difficulty: 2,
    calories: 560,
    tags: ['vegetarian'],
    blurb: 'The comfort lunch for a grey, low-energy day.',
    ingredients: [
      ing('Canned tomatoes', 1, 'cup', 'pantry', 0.7),
      ing('Bread', 2, 'slice', 'bakery', 0.4),
      ing('Cheddar', 2, 'slice', 'dairy', 0.8),
      ing('Butter', 1, 'tbsp', 'dairy', 0.2),
      ing('Onion', 0.5, 'each', 'produce', 0.3),
    ],
    steps: [
      'Soften onion, add tomatoes, simmer 10 min, blend.',
      'Butter bread, fill with cheese, griddle till golden.',
      'Serve the toastie alongside the soup.',
    ],
  },
  {
    id: 'rice-noodle-salad',
    title: 'Cold Rice Noodle Salad',
    slot: 'lunch',
    base: 1,
    prep: 16,
    difficulty: 2,
    calories: 480,
    tags: ['vegan', 'dairyFree', 'glutenFree'],
    blurb: 'Bright, herby and refreshing — great in warm weather.',
    ingredients: [
      ing('Rice noodles', 100, 'g', 'pantry', 0.7),
      ing('Carrot', 1, 'each', 'produce', 0.3),
      ing('Cucumber', 0.5, 'each', 'produce', 0.5),
      ing('Soy sauce', 1, 'tbsp', 'pantry', 0.15),
      ing('Lime', 1, 'each', 'produce', 0.35),
      ing('Peanuts', 2, 'tbsp', 'pantry', 0.4),
    ],
    steps: [
      'Soak noodles in hot water till tender, rinse cold.',
      'Julienne carrot and cucumber.',
      'Toss with soy, lime and crushed peanuts.',
    ],
  },

  // ───────────────────────── DINNER ─────────────────────────
  {
    id: 'sheet-pan-chicken',
    title: 'Sheet-Pan Chicken & Veg',
    slot: 'dinner',
    base: 2,
    prep: 35,
    difficulty: 2,
    calories: 540,
    tags: ['glutenFree', 'highProtein', 'dairyFree'],
    blurb: 'One tray, one cleanup. Hands-off oven time.',
    ingredients: [
      ing('Chicken breast', 2, 'each', 'protein', 4.0),
      ing('Potatoes', 3, 'each', 'produce', 1.2),
      ing('Bell pepper', 2, 'each', 'produce', 1.4),
      ing('Olive oil', 2, 'tbsp', 'pantry', 0.4),
      ing('Paprika', 1, 'tsp', 'pantry', 0.15),
    ],
    steps: [
      'Heat oven to 220°C / 425°F.',
      'Toss everything with oil, paprika, salt on a tray.',
      'Roast 28–32 min until chicken is cooked through.',
    ],
  },
  {
    id: 'veg-stir-fry',
    title: '15-Minute Veg Stir-Fry',
    slot: 'dinner',
    base: 2,
    prep: 15,
    difficulty: 2,
    calories: 430,
    tags: ['vegan', 'vegetarian', 'dairyFree'],
    blurb: 'Weeknight rescue: fast, flexible, wok-charred.',
    ingredients: [
      ing('Firm tofu', 200, 'g', 'protein', 1.8),
      ing('White rice', 1, 'cup', 'pantry', 0.5),
      ing('Broccoli', 1, 'each', 'produce', 1.0),
      ing('Soy sauce', 2, 'tbsp', 'pantry', 0.3),
      ing('Garlic', 2, 'clove', 'produce', 0.2),
      ing('Sesame oil', 1, 'tbsp', 'pantry', 0.25),
    ],
    steps: [
      'Cook rice. Press and cube tofu.',
      'Sear tofu till golden, add broccoli and garlic.',
      'Splash soy and sesame oil, toss, serve over rice.',
    ],
  },
  {
    id: 'spaghetti-bolognese',
    title: 'Weeknight Spaghetti Bolognese',
    slot: 'dinner',
    base: 2,
    prep: 30,
    difficulty: 2,
    calories: 620,
    tags: ['highProtein'],
    blurb: 'A big-batch crowd-pleaser that reheats beautifully.',
    ingredients: [
      ing('Ground beef', 300, 'g', 'protein', 4.5),
      ing('Pasta', 200, 'g', 'pantry', 0.8),
      ing('Canned tomatoes', 1, 'cup', 'pantry', 0.7),
      ing('Onion', 1, 'each', 'produce', 0.5),
      ing('Garlic', 2, 'clove', 'produce', 0.2),
      ing('Parmesan', 0.25, 'cup', 'dairy', 1.0),
    ],
    steps: [
      'Brown beef with onion and garlic.',
      'Add tomatoes, simmer 15 min while pasta cooks.',
      'Toss pasta through sauce, finish with parmesan.',
    ],
  },
  {
    id: 'lentil-curry',
    title: 'Red Lentil Coconut Curry',
    slot: 'dinner',
    base: 2,
    prep: 28,
    difficulty: 2,
    calories: 500,
    tags: ['vegan', 'vegetarian', 'dairyFree', 'glutenFree', 'highProtein'],
    blurb: 'Cozy, cheap, freezer-friendly and naturally vegan.',
    ingredients: [
      ing('Red lentils', 1, 'cup', 'pantry', 0.7),
      ing('Coconut milk', 1, 'can', 'pantry', 1.5),
      ing('Onion', 1, 'each', 'produce', 0.5),
      ing('White rice', 1, 'cup', 'pantry', 0.5),
      ing('Curry powder', 1, 'tbsp', 'pantry', 0.2),
      ing('Garlic', 2, 'clove', 'produce', 0.2),
    ],
    steps: [
      'Soften onion and garlic, bloom curry powder.',
      'Add lentils and coconut milk, simmer 18 min.',
      'Serve over rice; season with salt and lime.',
    ],
  },
  {
    id: 'taco-night',
    title: 'Black Bean Tacos',
    slot: 'dinner',
    base: 2,
    prep: 20,
    difficulty: 1,
    calories: 470,
    tags: ['vegetarian', 'vegan', 'dairyFree'],
    blurb: 'Low-effort, high-joy. Everyone builds their own.',
    ingredients: [
      ing('Black beans', 1, 'can', 'pantry', 0.9),
      ing('Tortilla', 6, 'each', 'bakery', 1.5),
      ing('Avocado', 1, 'each', 'produce', 1.2),
      ing('Lime', 1, 'each', 'produce', 0.35),
      ing('Red onion', 0.5, 'each', 'produce', 0.3),
      ing('Cumin', 1, 'tsp', 'pantry', 0.15),
    ],
    steps: [
      'Warm beans with cumin and a splash of water.',
      'Char tortillas in a dry pan.',
      'Fill with beans, avocado, onion and lime.',
    ],
  },
]

// ── Nutrition & veg/non-veg enrichment ───────────────────────────────────
// Protein is grams per serving. `health` is a one-line "why it's good for you".
// Kept in one table so recipes above stay readable; applied to RECIPES below.
const NUTRITION = {
  'overnight-oats': { protein: 12, health: 'Fibre-rich oats and chia steady blood sugar and keep you full to lunch.' },
  'veggie-scramble': { protein: 22, health: 'Complete-protein eggs plus iron-rich spinach for steady morning energy.' },
  'pb-banana-toast': { protein: 13, health: 'Healthy unsaturated fats and potassium for a quick, lasting lift.' },
  'yogurt-parfait': { protein: 20, health: 'Gut-friendly probiotics and 20g protein to start the day strong.' },
  'chickpea-bowl': { protein: 18, health: 'Plant protein and fibre with heart-healthy olive oil and antioxidants.' },
  'turkey-wrap': { protein: 30, health: 'Lean turkey gives 30g muscle-repairing protein with little saturated fat.' },
  'tomato-soup-grilled-cheese': { protein: 18, health: 'Lycopene-rich tomatoes support heart health; cheese adds calcium.' },
  'rice-noodle-salad': { protein: 11, health: 'Light and hydrating, with anti-inflammatory fresh herbs and lime.' },
  'sheet-pan-chicken': { protein: 42, health: 'Lean chicken protein plus potassium-rich potatoes and vitamin-C peppers.' },
  'veg-stir-fry': { protein: 21, health: 'Tofu protein with cruciferous broccoli and garlic — antioxidant-dense.' },
  'spaghetti-bolognese': { protein: 35, health: 'Iron and B12 from beef fuel red blood cells and lasting fullness.' },
  'lentil-curry': { protein: 22, health: 'Lentil protein and fibre with anti-inflammatory turmeric and ginger.' },
  'taco-night': { protein: 16, health: 'Black-bean protein and fibre with heart-healthy monounsaturated avocado.' },
}

// Ingredient words that make a dish non-vegetarian.
const MEAT_WORDS = ['chicken', 'turkey', 'beef', 'pork', 'fish', 'salmon', 'bacon', 'ham', 'shrimp', 'lamb']

const isNonVeg = (recipe) =>
  recipe.ingredients.some((i) => MEAT_WORDS.some((m) => i.item.toLowerCase().includes(m)))

// Attach derived fields once at module load so every consumer sees them.
for (const recipe of RECIPES) {
  recipe.type = isNonVeg(recipe) ? 'nonveg' : 'veg'
  recipe.protein = NUTRITION[recipe.id]?.protein ?? Math.round(recipe.calories * 0.05)
  recipe.health = NUTRITION[recipe.id]?.health ?? 'A balanced, wholesome choice.'
}

// Quick lookup helpers
export const byId = Object.fromEntries(RECIPES.map((r) => [r.id, r]))
export const bySlot = (slot) => RECIPES.filter((r) => r.slot === slot)
