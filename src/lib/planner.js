// CookDay planning engine.
// Pure functions, no side effects — given the user's "day profile" it returns a
// full plan: meals per slot, a costed + categorised grocery list, relevant
// substitutions, and budget-feasibility logic with concrete suggestions.

import { RECIPES, SUBSTITUTIONS, SLOTS, DIET_TAGS } from '../data/recipes.js'

const VALID_DIET = new Set(Object.keys(DIET_TAGS))
const VALID_ENERGY = new Set(['low', 'medium', 'high'])
const VALID_FOODTYPE = new Set(['all', 'veg', 'nonveg'])

const clamp = (n, lo, hi, fallback) => {
  const v = Number(n)
  if (!Number.isFinite(v)) return fallback
  return Math.min(hi, Math.max(lo, v))
}

// Normalise whatever reaches the engine into a known-good profile. Defends the
// planner against malformed, out-of-range, or hostile input regardless of caller.
export function sanitizeProfile(raw) {
  const input = raw && typeof raw === 'object' ? raw : {}

  const meals = Array.isArray(input.meals)
    ? SLOTS.filter((s) => input.meals.includes(s)) // canonical order, known values only
    : []

  const diet = Array.isArray(input.diet)
    ? [...new Set(input.diet.filter((d) => VALID_DIET.has(d)))]
    : []

  // Free-text avoidances: coerce to string, trim, and cap length so a huge or
  // non-string value can't blow up the downstream string scans.
  const avoidances =
    typeof input.avoidances === 'string' ? input.avoidances.slice(0, 200).trim() : ''

  // Use-up ingredients: keep only non-empty strings, trimmed and length-capped,
  // de-duplicated, and limited in count.
  const useIngredients = Array.isArray(input.useIngredients)
    ? [
        ...new Set(
          input.useIngredients
            .filter((v) => typeof v === 'string')
            .map((v) => v.slice(0, 40).trim())
            .filter(Boolean),
        ),
      ].slice(0, 20)
    : []

  return {
    meals: meals.length ? meals : [...SLOTS],
    people: Math.round(clamp(input.people, 1, 12, 2)),
    budget: clamp(input.budget, 0, 1000, 0),
    diet,
    energy: VALID_ENERGY.has(input.energy) ? input.energy : 'medium',
    maxPrep: Math.round(clamp(input.maxPrep, 1, 240, 40)),
    foodType: VALID_FOODTYPE.has(input.foodType) ? input.foodType : 'all',
    avoidances,
    useIngredients,
  }
}

const CATEGORY_ORDER = ['produce', 'protein', 'dairy', 'bakery', 'pantry']
const CATEGORY_LABEL = {
  produce: 'Produce',
  protein: 'Meat & protein',
  dairy: 'Dairy & chilled',
  bakery: 'Bakery',
  pantry: 'Pantry & dry goods',
}

// Energy → how much cooking effort the user can stomach today.
// We allow difficulty up to the cap and softly prefer the cap.
const ENERGY = {
  low: { difficultyCap: 1, prepBias: 0.5, label: 'Running on empty' },
  medium: { difficultyCap: 2, prepBias: 1, label: 'Normal day' },
  high: { difficultyCap: 3, prepBias: 1.5, label: 'Feeling ambitious' },
}

const round2 = (n) => Math.round(n * 100) / 100

// Scale an ingredient quantity + cost from a recipe's base servings to target.
function scaleIngredient(ingredient, factor) {
  return {
    ...ingredient,
    qty: round2(ingredient.qty * factor),
    cost: round2(ingredient.cost * factor),
  }
}

// Score a candidate recipe for a given day profile. Higher = better fit.
function scoreRecipe(recipe, profile) {
  const energy = ENERGY[profile.energy]
  let score = 100

  // Effort fit — penalise recipes harder than today's energy allows.
  if (recipe.difficulty > energy.difficultyCap) score -= 60
  score -= Math.abs(recipe.difficulty - energy.difficultyCap) * 8

  // Time fit — penalise anything over the per-meal time the user has.
  if (profile.maxPrep && recipe.prep > profile.maxPrep) {
    score -= (recipe.prep - profile.maxPrep) * 2
  }
  score -= recipe.prep * energy.prepBias * 0.4

  // Cuisine variety nudge handled by caller; tag matches add a small bonus.
  const matched = profile.diet.filter((d) => recipe.tags.includes(d)).length
  score += matched * 6

  // Use-up ingredients check - add high priority score boost for using up matching ingredients!
  if (Array.isArray(profile.useIngredients) && profile.useIngredients.length > 0) {
    const matchedUseIngredients = recipe.ingredients.filter(ing => 
      profile.useIngredients.some(ui => ing.item.toLowerCase().includes(ui.toLowerCase()))
    ).length
    score += matchedUseIngredients * 35
  }

  return score
}

// Does a recipe satisfy every hard dietary requirement?
function passesDiet(recipe, diet, avoidances = '', foodType = 'all') {
  const passesTags = diet.every((d) => recipe.tags.includes(d))
  if (!passesTags) return false

  // Veg / non-veg hard filter.
  if (foodType === 'veg' && recipe.type !== 'veg') return false
  if (foodType === 'nonveg' && recipe.type !== 'nonveg') return false

  // Hard avoidances check - filter out if ingredients contain avoided terms
  if (avoidances) {
    const avoidList = avoidances
      .split(',')
      .map(v => v.trim().toLowerCase())
      .filter(Boolean)
    const containsAvoided = recipe.ingredients.some(ing =>
      avoidList.some(avoid => ing.item.toLowerCase().includes(avoid))
    )
    if (containsAvoided) return false
  }

  return true
}

// Pick the best recipe for a slot, avoiding ingredient-protein repetition.
function pickForSlot(slot, profile, usedTitles) {
  const candidates = RECIPES.filter(
    (r) => r.slot === slot && passesDiet(r, profile.diet, profile.avoidances, profile.foodType),
  )
  if (candidates.length === 0) return null

  const ranked = candidates
    .map((r) => ({
      recipe: r,
      score: scoreRecipe(r, profile) - (usedTitles.has(r.title) ? 40 : 0),
    }))
    .sort((a, b) => b.score - a.score)

  return ranked[0].recipe
}

// Merge ingredients across all chosen meals into a single grocery list,
// summing quantities of identical items and grouping by category.
function buildGroceryList(meals) {
  const merged = new Map()

  for (const meal of meals) {
    for (const ing of meal.ingredients) {
      const key = `${ing.item}|${ing.unit}`
      if (merged.has(key)) {
        const prev = merged.get(key)
        prev.qty = round2(prev.qty + ing.qty)
        prev.cost = round2(prev.cost + ing.cost)
        prev.usedIn.add(meal.title)
      } else {
        merged.set(key, {
          item: ing.item,
          qty: ing.qty,
          unit: ing.unit,
          cat: ing.cat,
          cost: ing.cost,
          usedIn: new Set([meal.title]),
        })
      }
    }
  }

  const groups = CATEGORY_ORDER.map((cat) => ({
    cat,
    label: CATEGORY_LABEL[cat],
    items: [...merged.values()]
      .filter((i) => i.cat === cat)
      .map((i) => ({ ...i, usedIn: [...i.usedIn] }))
      .sort((a, b) => a.item.localeCompare(b.item)),
  })).filter((g) => g.items.length > 0)

  const total = round2(
    [...merged.values()].reduce((sum, i) => sum + i.cost, 0),
  )

  return { groups, total }
}

// Collect substitutions relevant to the ingredients actually in the plan.
function collectSubstitutions(meals) {
  const items = new Set()
  for (const meal of meals) {
    for (const ing of meal.ingredients) items.add(ing.item)
  }
  return [...items]
    .filter((item) => SUBSTITUTIONS[item])
    .map((item) => ({ item, options: SUBSTITUTIONS[item] }))
    .sort((a, b) => a.item.localeCompare(b.item))
}

// Budget feasibility: compare projected cost to the user's budget and return
// a verdict plus actionable suggestions when it's tight or over.
function assessBudget(total, budget, meals) {
  if (!budget || budget <= 0) {
    return { status: 'unset', total, budget: 0, ratio: 0, headroom: 0, suggestions: [] }
  }

  const ratio = total / budget
  const headroom = round2(budget - total)

  let status
  if (ratio <= 0.85) status = 'comfortable'
  else if (ratio <= 1.0) status = 'tight'
  else status = 'over'

  const suggestions = []
  if (status !== 'comfortable') {
    // Find the priciest meal and its priciest ingredient for targeted advice.
    const costliestMeal = [...meals].sort((a, b) => b.estCost - a.estCost)[0]
    if (costliestMeal) {
      const costliestIng = [...costliestMeal.ingredients].sort(
        (a, b) => b.cost - a.cost,
      )[0]
      suggestions.push(
        `${costliestMeal.title} is your priciest meal ($${costliestMeal.estCost.toFixed(
          2,
        )}). Swapping ${costliestIng.item} is the fastest saving.`,
      )
    }
    suggestions.push(
      'Buy pantry staples (rice, lentils, pasta) in bulk — the per-meal cost drops sharply.',
    )
    if (status === 'over') {
      suggestions.push(
        `You're $${Math.abs(headroom).toFixed(
          2,
        )} over. Dropping one cooked meal for leftovers usually closes the gap.`,
      )
    }
  } else {
    suggestions.push(
      `You have $${headroom.toFixed(2)} of headroom — room for a treat or a spare portion.`,
    )
  }

  return { status, total, budget, ratio: round2(ratio), headroom, suggestions }
}

// ── Main entry point ──────────────────────────────────────────────────────
// profile = { meals:['breakfast',...], people, budget, diet:[tags], energy, maxPrep }
export function generatePlan(rawProfile) {
  const profile = sanitizeProfile(rawProfile)
  const usedTitles = new Set()
  const meals = []

  for (const slot of profile.meals) {
    const recipe = pickForSlot(slot, profile, usedTitles)
    if (!recipe) {
      meals.push({ slot, missing: true })
      continue
    }
    usedTitles.add(recipe.title)

    const factor = profile.people / recipe.base
    const ingredients = recipe.ingredients.map((i) => scaleIngredient(i, factor))
    const estCost = round2(ingredients.reduce((s, i) => s + i.cost, 0))

    meals.push({
      ...recipe,
      slot,
      servings: profile.people,
      ingredients,
      estCost,
      caloriesTotal: recipe.calories * profile.people,
    })
  }

  const cookable = meals.filter((m) => !m.missing)
  const grocery = buildGroceryList(cookable)
  const substitutions = collectSubstitutions(cookable)
  const budget = assessBudget(grocery.total, profile.budget, cookable)

  const totalPrep = cookable.reduce((s, m) => s + m.prep, 0)
  const totalCalories = cookable.reduce((s, m) => s + m.calories, 0)
  const totalProtein = cookable.reduce((s, m) => s + (m.protein || 0), 0)
  const allVeg = cookable.length > 0 && cookable.every((m) => m.type === 'veg')

  // Cooking to-do checklist, ordered by slot then by step.
  const todos = cookable.flatMap((m) =>
    m.steps.map((step, i) => ({
      id: `${m.id}-${i}`,
      meal: m.title,
      slot: m.slot,
      text: step,
    })),
  )

  return {
    profile,
    meals,
    grocery,
    substitutions,
    budget,
    todos,
    summary: {
      totalPrep,
      totalCalories,
      totalProtein,
      allVeg,
      mealCount: cookable.length,
      anyMissing: meals.some((m) => m.missing),
    },
  }
}

export { ENERGY, CATEGORY_LABEL }
