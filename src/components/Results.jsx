import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DIET_TAGS } from '../data/recipes.js'
import { toast } from './Toast.jsx'
import {
  ClockIcon,
  SparklesIcon,
  InfoIcon,
  ArrowRightIcon
} from './Icons.jsx'

const IMAGE_MAP = {
  breakfast: '/breakfast_pancakes.png',
  lunch: '/lunch_salad.png',
  dinner: '/dinner_salmon.png'
}

const getIngredientEmoji = (name) => {
  const n = name.toLowerCase()
  if (n.includes('chicken')) return '🍗'
  if (n.includes('spinach')) return '🥬'
  if (n.includes('garlic')) return '🧄'
  if (n.includes('yogurt')) return '🥛'
  if (n.includes('pasta') || n.includes('spaghetti')) return '🍝'
  if (n.includes('avocado')) return '🥑'
  if (n.includes('oats') || n.includes('oat')) return '🌾'
  if (n.includes('berry') || n.includes('berries')) return '🍓'
  if (n.includes('chia')) return '🌱'
  if (n.includes('maple') || n.includes('honey')) return '🍯'
  if (n.includes('egg')) return '🥚'
  if (n.includes('tomato')) return '🍅'
  if (n.includes('butter')) return '🧈'
  if (n.includes('feta') || n.includes('cheese') || n.includes('cheddar') || n.includes('parmesan')) return '🧀'
  if (n.includes('banana')) return '🍌'
  if (n.includes('peanut')) return '🥜'
  if (n.includes('bread')) return '🍞'
  if (n.includes('chickpea')) return '🧆'
  if (n.includes('cucumber')) return '🥒'
  if (n.includes('oil')) return '🫗'
  if (n.includes('lemon')) return '🍋'
  if (n.includes('lime')) return '💚'
  if (n.includes('parsley')) return '🌿'
  if (n.includes('tortilla')) return '🫓'
  if (n.includes('turkey')) return '🦃'
  if (n.includes('lettuce')) return '🥬'
  if (n.includes('hummus')) return '🥣'
  if (n.includes('onion')) return '🧅'
  if (n.includes('carrot')) return '🥕'
  if (n.includes('noodle')) return '🍜'
  if (n.includes('beef')) return '🥩'
  if (n.includes('lentil')) return '🥣'
  if (n.includes('coconut')) return '🥥'
  if (n.includes('curry')) return '🌶️'
  if (n.includes('bean')) return '🫘'
  if (n.includes('potato')) return '🥔'
  if (n.includes('pepper')) return '🫑'
  if (n.includes('tofu')) return '⬜'
  if (n.includes('broccoli')) return '🥦'
  return '🥗'
}

// Classic veg / non-veg square indicator (green for veg, red for non-veg).
function VegBadge({ type, size = 16 }) {
  const color = type === 'nonveg' ? '#B04B3E' : '#6C7A4E'
  const label = type === 'nonveg' ? 'Non-vegetarian' : 'Vegetarian'
  return (
    <span
      title={label}
      aria-label={label}
      style={{
        width: size,
        height: size,
        border: `2px solid ${color}`,
        borderRadius: 4,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          width: size * 0.42,
          height: size * 0.42,
          borderRadius: '50%',
          background: color,
        }}
      />
    </span>
  )
}

function MealRow({ meal }) {
  const [expanded, setExpanded] = useState(false)
  
  if (meal.missing) {
    return (
      <div className="meal-horizontal-card" style={{ cursor: 'default' }}>
        <div className="meal-card-details">
          <span className="meal-slot-pill">{meal.slot}</span>
          <h3 className="meal-card-title">No recipe fits today</h3>
          <p className="meal-card-desc">
            No recipe in our database matches your current dietary styles and avoidances. Try adjusting your preferences.
          </p>
        </div>
      </div>
    )
  }

  const mealImage = IMAGE_MAP[meal.slot] || '/public/favicon.svg'

  return (
    <div 
      className="meal-horizontal-card"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="meal-card-details">
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
          <VegBadge type={meal.type} />
          <span className="meal-slot-pill">{meal.slot}</span>
          <span className="meal-meta-pill" style={{ border: 'none', background: 'transparent', padding: 0 }}>
            <ClockIcon size={12} style={{ marginRight: '4px' }} />
            {meal.prep} min
          </span>
        </div>
        
        <div className="meal-card-top-row">
          <h3 className="meal-card-title">{meal.title}</h3>
          <span className="meal-card-cost">${meal.estCost.toFixed(2)}</span>
        </div>
        
        <p className="meal-card-desc">{meal.blurb}</p>

        <div className="meal-card-meta">
          <span className="meal-meta-pill">🔥 {meal.calories} kcal/serving</span>
          <span className="meal-meta-pill">💪 {meal.protein}g protein</span>
          <span className="meal-meta-pill">👥 {meal.servings} servings</span>
        </div>

        <div className="meal-health-note">
          <span style={{ flexShrink: 0 }}>💚</span>
          <span>{meal.health}</span>
        </div>

        <div className="meal-card-tags">
          {meal.tags.map((t) => (
            <span key={t} className="meal-diet-tag">
              {DIET_TAGS[t]}
            </span>
          ))}
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div 
              className="meal-card-steps-box"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()} // prevent double toggles
            >
              <h4 className="meal-card-ingredients-title">Ingredients Item List</h4>
              <div className="meal-card-ingredients-grid">
                {meal.ingredients.map((ing, idx) => (
                  <div key={idx} className="meal-ingredient-card">
                    <div className="meal-ingredient-emoji-box">
                      {getIngredientEmoji(ing.item)}
                    </div>
                    <div className="meal-ingredient-info">
                      <span className="meal-ingredient-name">{ing.item}</span>
                      <span className="meal-ingredient-qty">{ing.qty} {ing.unit}</span>
                    </div>
                  </div>
                ))}
              </div>

              <h4 className="steps-title">Recipe Steps</h4>
              <ol className="steps-list">
                {meal.steps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="meal-card-image-box">
        <img src={mealImage} alt={meal.title} />
      </div>
    </div>
  )
}

export default function Results({ plan, onRestart, onNavigate }) {
  const { meals, grocery, substitutions, budget, summary, profile } = plan

  const copyList = () => {
    const lines = ['🛒 SousChef Premium Grocery List', '']
    grocery.groups.forEach((g) => {
      lines.push(g.label.toUpperCase())
      g.items.forEach((it) => lines.push(`  [ ] ${it.item} — ${it.qty} ${it.unit}`))
      lines.push('')
    })
    lines.push(`Estimated total: $${grocery.total.toFixed(2)}`)
    navigator.clipboard?.writeText(lines.join('\n'))
    toast('Grocery list copied to clipboard!', 'success')
  }

  const totalItems = grocery.groups.reduce((s, g) => s + g.items.length, 0)
  
  const getFeasibilityText = (status) => {
    if (status === 'comfortable') return 'High'
    if (status === 'tight') return 'Medium'
    return 'Low'
  }

  const getFeasibilityColor = (status) => {
    if (status === 'comfortable') return '#6C7A4E'
    if (status === 'tight') return 'var(--color-rust)'
    return '#B04B3E'
  }

  return (
    <div style={{ marginTop: '24px' }}>
      <div className="results-layout">
        
        {/* Left Side: Your Menu */}
        <div className="results-left">
          <div className="results-section-header">
            <h2 className="results-section-title">Your Menu</h2>
            <button className="refresh-btn" onClick={onRestart}>
              🔄 Re-plan All
            </button>
          </div>

          <div className="meals-list">
            {meals.map((m) => (
              <MealRow key={m.slot} meal={m} />
            ))}
          </div>

          <div className="results-actions-row">
            <button 
              className="onboarding-btn btn-pill" 
              style={{ width: 'auto' }}
              onClick={() => onNavigate('todo')}
            >
              📝 View Cooking Checklist
            </button>
            <button 
              className="btn btn-secondary btn-pill"
              onClick={copyList}
            >
              📋 Copy Grocery List
            </button>
          </div>
        </div>

        {/* Right Side: AI Widgets */}
        <div className="results-sidebar">
          
          {/* AI Planning Logic */}
          <div className="widget-panel">
            <div className="widget-title-row">
              <span>
                <SparklesIcon size={18} />
              </span>
              <span className="widget-title">AI Planning Logic</span>
            </div>
            <p className="widget-desc">
              Optimized for a ${profile?.budget || 45}/day budget, {profile?.energy || 'medium'} preference, and max {profile?.maxPrep || 40} mins per meal.
            </p>

            <div className="widget-stats-grid">
              <div className="widget-stat-box">
                <span className="widget-stat-label">Budget Used</span>
                <span className="widget-stat-value">${grocery.total.toFixed(2)}</span>
              </div>
              <div className="widget-stat-box">
                <span className="widget-stat-label">Prep Time</span>
                <span className="widget-stat-value">{summary.totalPrep}m</span>
              </div>
              <div className="widget-stat-box">
                <span className="widget-stat-label">Feasibility</span>
                <span 
                  className="widget-stat-value"
                  style={{ color: getFeasibilityColor(budget.status) }}
                >
                  {getFeasibilityText(budget.status)}
                </span>
              </div>
            </div>

            <span className="widget-subtext">
              {budget.status === 'comfortable' 
                ? `You have $${budget.headroom.toFixed(2)} of budget headroom left for other groceries.`
                : budget.status === 'tight' 
                  ? 'Budget is slightly tight. Avoid premium items or check organic labels.'
                  : 'Currently over budget. Consider dropping a slot or making substitutions.'}
            </span>
          </div>

          {/* Smart Grocery List Card (Dark Brown) */}
          <div 
            className="groceries-link-card"
            onClick={() => onNavigate('groceries')}
          >
            <div className="groceries-link-left">
              <div className="groceries-link-icon-box">🛒</div>
              <div className="groceries-link-text-group">
                <span className="groceries-link-title">Smart Grocery List</span>
                <span className="groceries-link-sub">{totalItems} items needed for today</span>
              </div>
            </div>
            <span className="groceries-link-arrow">
              <ArrowRightIcon size={16} />
            </span>
          </div>

          {/* AI Substitutions */}
          {substitutions.length > 0 && (
            <div className="widget-alert">
              <span className="widget-alert-icon">
                <InfoIcon size={18} />
              </span>
              <div className="widget-alert-content">
                <span className="widget-alert-title">AI Substitutions</span>
                <span className="widget-alert-text">
                  Adjust plan ingredients easily to match your kitchen inventory:
                </span>
                <div className="substitutions-list">
                  {substitutions.slice(0, 2).map((s) => (
                    <div key={s.item} className="sub-item-row">
                      <strong>{s.item}</strong> → {s.options[0]?.swap} ({s.options[0]?.reason})
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  )
}
