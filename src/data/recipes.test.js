import { describe, it, expect } from 'vitest'
import { RECIPES, SLOTS, SUBSTITUTIONS, byId, bySlot } from './recipes.js'

const MEAT_WORDS = ['chicken', 'turkey', 'beef', 'pork', 'fish', 'salmon', 'bacon', 'ham']

describe('recipe library integrity', () => {
  it('has recipes for every slot', () => {
    SLOTS.forEach((slot) => {
      expect(bySlot(slot).length).toBeGreaterThan(0)
    })
  })

  it('has unique ids', () => {
    const ids = RECIPES.map((r) => r.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every recipe has the required shape', () => {
    RECIPES.forEach((r) => {
      expect(typeof r.id).toBe('string')
      expect(typeof r.title).toBe('string')
      expect(SLOTS).toContain(r.slot)
      expect(r.base).toBeGreaterThan(0)
      expect(r.prep).toBeGreaterThan(0)
      expect(r.calories).toBeGreaterThan(0)
      expect(Array.isArray(r.tags)).toBe(true)
      expect(r.ingredients.length).toBeGreaterThan(0)
      expect(r.steps.length).toBeGreaterThan(0)
    })
  })

  it('every ingredient is fully costed', () => {
    RECIPES.forEach((r) => {
      r.ingredients.forEach((i) => {
        expect(typeof i.item).toBe('string')
        expect(i.qty).toBeGreaterThan(0)
        expect(typeof i.cost).toBe('number')
        expect(i.cost).toBeGreaterThanOrEqual(0)
      })
    })
  })

  it('every recipe is enriched with type, protein and a health note', () => {
    RECIPES.forEach((r) => {
      expect(['veg', 'nonveg']).toContain(r.type)
      expect(typeof r.protein).toBe('number')
      expect(r.protein).toBeGreaterThan(0)
      expect(typeof r.health).toBe('string')
      expect(r.health.length).toBeGreaterThan(0)
    })
  })

  it('veg/non-veg classification matches the ingredients', () => {
    RECIPES.forEach((r) => {
      const hasMeat = r.ingredients.some((i) =>
        MEAT_WORDS.some((m) => i.item.toLowerCase().includes(m)),
      )
      expect(r.type).toBe(hasMeat ? 'nonveg' : 'veg')
    })
  })

  it('byId maps every recipe', () => {
    RECIPES.forEach((r) => {
      expect(byId[r.id]).toBe(r)
    })
  })

  it('substitution options are well formed', () => {
    Object.values(SUBSTITUTIONS).forEach((opts) => {
      expect(opts.length).toBeGreaterThan(0)
      opts.forEach((o) => {
        expect(typeof o.swap).toBe('string')
        expect(typeof o.reason).toBe('string')
      })
    })
  })
})
