import { useState, useEffect } from 'react'
import {
  CozyIcon,
  QuickIcon,
  ChefIcon,
  HealthyIcon,
  BudgetIcon,
  IngredientsIcon,
  ScheduleIcon,
  SearchIcon,
  InfoIcon
} from './Icons.jsx'

const VIBES = [
  { key: 'cozy', label: 'Cozy', icon: CozyIcon, desc: 'Comforting, warm dishes', energy: 'low' },
  { key: 'quick', label: 'Quick', icon: QuickIcon, desc: 'Fast, minimal effort', energy: 'medium' },
  { key: 'chef', label: 'Chef', icon: ChefIcon, desc: 'A bit of culinary fun', energy: 'high' },
  { key: 'healthy', label: 'Healthy', icon: HealthyIcon, desc: 'Fresh, nutrient-dense', energy: 'medium' }
]

const INGREDIENT_TAGS = [
  { key: 'Chicken breast', label: 'Chicken' },
  { key: 'Spinach', label: 'Spinach' },
  { key: 'Garlic', label: 'Garlic' },
  { key: 'Greek yogurt', label: 'Greek Yogurt' },
  { key: 'Pasta', label: 'Pasta' },
  { key: 'Avocado', label: 'Avocado' }
]

const SCHEDULES = [
  { key: 'busy', label: 'The Busy Professional', desc: 'Max 15 mins per meal', maxPrep: 15 },
  { key: 'casual', label: 'Casual Cook', desc: '30-45 mins for dinner', maxPrep: 40 },
  { key: 'roast', label: 'Sunday Roast Vibe', desc: 'I have all day to simmer', maxPrep: 90 }
]

export default function DayForm({ onGenerate, profile }) {
  const [vibe, setVibe] = useState('quick')
  const [budget, setBudget] = useState(45)
  const [selectedIngredients, setSelectedIngredients] = useState([])
  const [schedule, setSchedule] = useState('busy')
  const [foodType, setFoodType] = useState('all')

  // Load defaults from profile if available
  useEffect(() => {
    if (profile) {
      if (profile.budgetRange) {
        setBudget(profile.budgetRange * 3) // Scale per-meal target to daily total for 3 meals
      }
      if (profile.dietStyle?.includes('lowCarb') || profile.dietStyle?.includes('keto')) {
        setVibe('healthy')
      }
      if (profile.dietStyle?.includes('vegan') || profile.dietStyle?.includes('vegetarian')) {
        setFoodType('veg')
      }
      if (profile.confidence === 'Beginner') {
        setSchedule('busy')
      } else if (profile.confidence === 'Chef') {
        setSchedule('roast')
      } else {
        setSchedule('casual')
      }
    }
  }, [profile])

  const toggleIngredient = (ing) => {
    if (selectedIngredients.includes(ing)) {
      setSelectedIngredients(selectedIngredients.filter(i => i !== ing))
    } else {
      setSelectedIngredients([...selectedIngredients, ing])
    }
  }

  // Generate dynamic subtext for budget description
  const getBudgetSubtext = () => {
    if (budget < 25) {
      return 'This budget is cost-effective, prioritizing pantry staples and basic proteins.'
    } else if (budget >= 25 && budget < 60) {
      return 'This budget allows for fresh produce, quality meats, and moderate proteins.'
    } else {
      return 'This budget supports organic ingredients, premium seafood or cuts, and gourmet items.'
    }
  }

  const handleSubmit = () => {
    const selectedVibe = VIBES.find(v => v.key === vibe)
    const selectedSched = SCHEDULES.find(s => s.key === schedule)
    
    // Build parameters for planner
    const plannerProfile = {
      meals: ['breakfast', 'lunch', 'dinner'], // default all 3
      people: profile?.people || 2,
      budget: budget,
      energy: selectedVibe.energy,
      maxPrep: selectedSched.maxPrep,
      diet: profile?.dietStyle || [],
      avoidances: profile?.avoidances || '',
      useIngredients: selectedIngredients, // custom logic inside planner.js
      foodType, // 'all' | 'veg' | 'nonveg'
    }
    onGenerate(plannerProfile)
  }

  const FOOD_TYPES = [
    { key: 'all', label: 'Everything', icon: '🍽' },
    { key: 'veg', label: 'Vegetarian', icon: '🥗' },
    { key: 'nonveg', label: 'Non-veg', icon: '🍗' },
  ]

  return (
    <div style={{ marginTop: '24px' }}>
      <div className="foodtype-toggle" role="tablist" aria-label="Veg or non-veg">
        <span className="foodtype-toggle-label">I want to eat</span>
        <div className="foodtype-options">
          {FOOD_TYPES.map((f) => (
            <button
              key={f.key}
              role="tab"
              aria-selected={foodType === f.key}
              className={`foodtype-pill ${foodType === f.key ? 'active' : ''}`}
              data-type={f.key}
              onClick={() => setFoodType(f.key)}
            >
              <span>{f.icon}</span>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="form-grid">
        {/* Today's Vibe */}
        <div className="form-panel">
          <div className="panel-header">
            <div className="panel-icon-box">
              <CozyIcon size={18} />
            </div>
            <div className="panel-title-group">
              <span className="panel-title">Today's Vibe</span>
              <span className="panel-subtitle">What are you in the mood for?</span>
            </div>
          </div>
          <div className="vibe-grid">
            {VIBES.map(v => {
              const IconComp = v.icon
              return (
                <button
                  key={v.key}
                  className={`vibe-card ${vibe === v.key ? 'active' : ''}`}
                  onClick={() => setVibe(v.key)}
                  title={v.desc}
                >
                  <span className="vibe-card-icon">
                    <IconComp size={20} />
                  </span>
                  <span>{v.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Daily Budget */}
        <div className="form-panel">
          <div className="panel-header">
            <div className="panel-icon-box">
              <BudgetIcon size={18} />
            </div>
            <div className="panel-title-group">
              <span className="panel-title">Daily Budget</span>
              <span className="panel-subtitle">Total for breakfast, lunch, & dinner</span>
            </div>
          </div>
          <div className="budget-display-row">
            <span className="budget-large-val">${budget.toFixed(2)}</span>
          </div>
          <div className="custom-slider-container">
            <input
              type="range"
              min="15"
              max="100"
              step="5"
              value={budget}
              className="custom-range-input"
              style={{ '--pct': `${((budget - 15) / 85) * 100}%` }}
              onChange={(e) => setBudget(+e.target.value)}
            />
            <div className="slider-limits">
              <span>$15</span>
              <span>$100+</span>
            </div>
          </div>
          <p className="budget-subtext">{getBudgetSubtext()}</p>
        </div>

        {/* Ingredients to Use Up */}
        <div className="form-panel">
          <div className="panel-header">
            <div className="panel-icon-box">
              <IngredientsIcon size={18} />
            </div>
            <div className="panel-title-group">
              <span className="panel-title">Ingredients</span>
              <span className="panel-subtitle">What do we need to use up?</span>
            </div>
          </div>
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="e.g. Chicken, Spinach, Pasta..."
              disabled // visual input matching mockups
            />
            <span className="search-icon">
              <SearchIcon size={16} />
            </span>
          </div>
          <div className="ingredients-chips">
            {INGREDIENT_TAGS.map(tag => {
              const isSelected = selectedIngredients.includes(tag.key)
              return (
                <div
                  key={tag.key}
                  className={`ingredient-chip ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleIngredient(tag.key)}
                >
                  {isSelected && '✓ '}
                  {tag.label}
                </div>
              )
            })}
          </div>
        </div>

        {/* Schedule */}
        <div className="form-panel">
          <div className="panel-header">
            <div className="panel-icon-box">
              <ScheduleIcon size={18} />
            </div>
            <div className="panel-title-group">
              <span className="panel-title">Your Schedule</span>
              <span className="panel-subtitle">How much time can you spend cooking?</span>
            </div>
          </div>
          <div className="schedule-list">
            {SCHEDULES.map(sched => (
              <div
                key={sched.key}
                className={`schedule-option ${schedule === sched.key ? 'selected' : ''}`}
                onClick={() => setSchedule(sched.key)}
              >
                <div className="schedule-radio">
                  <div className="schedule-radio-dot"></div>
                </div>
                <div className="schedule-details">
                  <span className="schedule-label">{sched.label}</span>
                  <span className="schedule-desc">{sched.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="form-action-row">
        <div className="form-info-text">
          <span className="form-info-icon">
            <InfoIcon size={16} />
          </span>
          <span>AI takes ~5 seconds to cook up a personalized plan.</span>
        </div>
        <button className="generate-btn" onClick={handleSubmit}>
          ✨ Generate My Meal Plan
        </button>
      </div>
    </div>
  )
}
