import { describe, it, expect } from 'vitest'
import { generatePlan, sanitizeProfile } from './planner.js'

describe('sanitizeProfile', () => {
  it('returns safe defaults for non-object / empty input', () => {
    const p = sanitizeProfile(undefined)
    expect(p.meals).toEqual(['breakfast', 'lunch', 'dinner'])
    expect(p.people).toBe(2)
    expect(p.budget).toBe(0)
    expect(p.energy).toBe('medium')
    expect(p.foodType).toBe('all')
    expect(p.diet).toEqual([])
    expect(p.avoidances).toBe('')
    expect(p.useIngredients).toEqual([])
  })

  it('clamps people to 1..12 and rounds', () => {
    expect(sanitizeProfile({ people: 0 }).people).toBe(1)
    expect(sanitizeProfile({ people: 99 }).people).toBe(12)
    expect(sanitizeProfile({ people: 3.7 }).people).toBe(4)
    expect(sanitizeProfile({ people: 'x' }).people).toBe(2) // NaN → fallback
  })

  it('clamps budget to 0..1000', () => {
    expect(sanitizeProfile({ budget: -50 }).budget).toBe(0)
    expect(sanitizeProfile({ budget: 5000 }).budget).toBe(1000)
    expect(sanitizeProfile({ budget: 45 }).budget).toBe(45)
  })

  it('whitelists energy and foodType, falling back when invalid', () => {
    expect(sanitizeProfile({ energy: 'turbo' }).energy).toBe('medium')
    expect(sanitizeProfile({ energy: 'high' }).energy).toBe('high')
    expect(sanitizeProfile({ foodType: 'pescatarian' }).foodType).toBe('all')
    expect(sanitizeProfile({ foodType: 'veg' }).foodType).toBe('veg')
  })

  it('keeps only known meals in canonical order', () => {
    expect(sanitizeProfile({ meals: ['dinner', 'breakfast', 'bogus'] }).meals).toEqual([
      'breakfast',
      'dinner',
    ])
    expect(sanitizeProfile({ meals: [] }).meals).toEqual(['breakfast', 'lunch', 'dinner'])
  })

  it('filters diet tags to the known set and de-dupes', () => {
    expect(sanitizeProfile({ diet: ['vegan', 'vegan', 'nonsense'] }).diet).toEqual(['vegan'])
  })

  it('sanitizes avoidances: coerces, trims, caps length', () => {
    expect(sanitizeProfile({ avoidances: 123 }).avoidances).toBe('')
    expect(sanitizeProfile({ avoidances: '  peanuts  ' }).avoidances).toBe('peanuts')
    expect(sanitizeProfile({ avoidances: 'x'.repeat(500) }).avoidances).toHaveLength(200)
  })

  it('sanitizes useIngredients: strings only, trimmed, de-duped, capped', () => {
    const out = sanitizeProfile({
      useIngredients: ['  Tofu ', 'Tofu', 42, '', 'Rice'],
    }).useIngredients
    expect(out).toEqual(['Tofu', 'Rice'])
    expect(sanitizeProfile({ useIngredients: Array(50).fill('x') }).useIngredients).toHaveLength(1)
  })
})

describe('generatePlan', () => {
  it('produces one entry per requested meal slot', () => {
    const plan = generatePlan({ meals: ['breakfast', 'lunch', 'dinner'], budget: 60 })
    expect(plan.meals).toHaveLength(3)
    expect(plan.meals.map((m) => m.slot)).toEqual(['breakfast', 'lunch', 'dinner'])
    expect(plan.summary.mealCount).toBe(3)
  })

  it('respects the veg foodType filter', () => {
    const plan = generatePlan({ foodType: 'veg', budget: 60 })
    const cookable = plan.meals.filter((m) => !m.missing)
    expect(cookable.length).toBeGreaterThan(0)
    expect(cookable.every((m) => m.type === 'veg')).toBe(true)
  })

  it('respects a hard dietary requirement (vegan)', () => {
    const plan = generatePlan({ diet: ['vegan'], budget: 60 })
    const cookable = plan.meals.filter((m) => !m.missing)
    expect(cookable.every((m) => m.tags.includes('vegan'))).toBe(true)
  })

  it('excludes recipes containing an avoided ingredient', () => {
    const plan = generatePlan({ avoidances: 'chicken', budget: 60 })
    const usesChicken = plan.meals
      .filter((m) => !m.missing)
      .some((m) => m.ingredients.some((i) => /chicken/i.test(i.item)))
    expect(usesChicken).toBe(false)
  })

  it('marks a slot missing when nothing matches (non-veg breakfast)', () => {
    const plan = generatePlan({ meals: ['breakfast'], foodType: 'nonveg', budget: 60 })
    expect(plan.meals[0].missing).toBe(true)
    expect(plan.summary.mealCount).toBe(0)
  })

  it('scales ingredient cost with the number of people', () => {
    const one = generatePlan({ meals: ['dinner'], people: 1, budget: 100 }).grocery.total
    const four = generatePlan({ meals: ['dinner'], people: 4, budget: 100 }).grocery.total
    expect(four).toBeGreaterThan(one)
  })

  it('assesses budget: comfortable when generous, over when tiny', () => {
    expect(generatePlan({ budget: 200 }).budget.status).toBe('comfortable')
    expect(generatePlan({ budget: 3 }).budget.status).toBe('over')
  })

  it('aggregates a costed grocery list grouped by aisle', () => {
    const { grocery } = generatePlan({ budget: 60 })
    expect(grocery.total).toBeGreaterThan(0)
    expect(grocery.groups.length).toBeGreaterThan(0)
    const sumOfItems = grocery.groups
      .flatMap((g) => g.items)
      .reduce((s, i) => s + i.cost, 0)
    expect(Math.round(sumOfItems * 100) / 100).toBeCloseTo(grocery.total, 1)
  })

  it('totals protein across the plan to match the meals', () => {
    const plan = generatePlan({ budget: 60 })
    const expected = plan.meals
      .filter((m) => !m.missing)
      .reduce((s, m) => s + m.protein, 0)
    expect(plan.summary.totalProtein).toBe(expected)
  })

  it('builds a cooking to-do list from recipe steps', () => {
    const plan = generatePlan({ budget: 60 })
    const stepCount = plan.meals
      .filter((m) => !m.missing)
      .reduce((s, m) => s + m.steps.length, 0)
    expect(plan.todos).toHaveLength(stepCount)
    expect(plan.todos[0]).toHaveProperty('text')
    expect(plan.todos[0]).toHaveProperty('meal')
  })

  it('surfaces relevant substitutions for ingredients in the plan', () => {
    const plan = generatePlan({ budget: 60 })
    expect(Array.isArray(plan.substitutions)).toBe(true)
    plan.substitutions.forEach((s) => {
      expect(s.options.length).toBeGreaterThan(0)
    })
  })

  it('never throws on hostile input', () => {
    expect(() => generatePlan(null)).not.toThrow()
    expect(() => generatePlan({ people: 'x', budget: {}, meals: 'nope' })).not.toThrow()
  })
})
