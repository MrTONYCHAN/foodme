import { useState } from 'react'
import {
  PreferencesIcon,
  IngredientsIcon,
  BudgetIcon,
  SaveIcon
} from './Icons.jsx'

const DIET_STYLES = [
  { key: 'vegetarian', label: 'Vegetarian' },
  { key: 'vegan', label: 'Vegan' },
  { key: 'keto', label: 'Keto' },
  { key: 'paleo', label: 'Paleo' },
  { key: 'glutenFree', label: 'Gluten-Free' },
  { key: 'lowCarb', label: 'Low Carb' }
]

const CONFIDENCE_LEVELS = [
  { key: 'Beginner', label: 'Beginner', desc: 'Simple 15-min meals' },
  { key: 'Home Cook', label: 'Home Cook', desc: 'Balanced & tasty' },
  { key: 'Chef', label: 'Chef', desc: 'Advanced techniques' }
]

const TOOLS = [
  { key: 'airFryer', label: 'Air Fryer', icon: '🍟' },
  { key: 'slowCooker', label: 'Slow Cooker', icon: '🍲' },
  { key: 'ovenStove', label: 'Oven & Stovetop', icon: '🍳' },
  { key: 'instantPot', label: 'Instant Pot', icon: '🍲' },
  { key: 'blender', label: 'Blender / Food', icon: '🥤' },
  { key: 'castIron', label: 'Cast Iron Skillet', icon: '🍳' }
]

export default function KitchenProfile({ profile, onSaveProfile }) {
  const [dietStyle, setDietStyle] = useState(profile?.dietStyle || [])
  const [avoidances, setAvoidances] = useState(profile?.avoidances || '')
  const [confidence, setConfidence] = useState(profile?.confidence || 'Home Cook')
  const [tools, setTools] = useState(profile?.tools || ['ovenStove', 'blender', 'castIron'])
  const [budgetRange, setBudgetRange] = useState(profile?.budgetRange || 15)
  const [people, setPeople] = useState(profile?.people || 2)
  const [showSavedToast, setShowSavedToast] = useState(false)

  const toggleDietStyle = (style) => {
    if (dietStyle.includes(style)) {
      setDietStyle(dietStyle.filter(d => d !== style))
    } else {
      setDietStyle([...dietStyle, style])
    }
  }

  const toggleTool = (tool) => {
    if (tools.includes(tool)) {
      setTools(tools.filter(t => t !== tool))
    } else {
      setTools([...tools, tool])
    }
  }

  const handleSave = () => {
    onSaveProfile({
      dietStyle,
      avoidances,
      confidence,
      tools,
      budgetRange,
      people
    })
    setShowSavedToast(true)
    setTimeout(() => setShowSavedToast(false), 2500)
  }

  return (
    <div>
      <div className="profile-banner">
        <img src="/kitchen_profile_hero.png" alt="Cozy Kitchen" />
        <div className="profile-banner-overlay">
          <h1 className="profile-banner-title">Kitchen Profile</h1>
          <p className="profile-banner-sub">Customize your AI cooking experience to match your lifestyle.</p>
        </div>
      </div>

      {showSavedToast && (
        <div 
          className="onboarding-alert" 
          style={{ 
            background: 'var(--color-cream)', 
            borderColor: 'var(--color-green-check)', 
            marginBottom: '20px',
            animation: 'fadeIn 0.3s'
          }}
        >
          <span className="onboarding-alert-icon" style={{ color: 'var(--color-green-check)', display: 'flex', alignItems: 'center' }}>
            <SaveIcon size={18} />
          </span>
          <span className="onboarding-alert-text" style={{ fontWeight: 600 }}>Kitchen settings saved successfully! Your planner is updated.</span>
        </div>
      )}

      <div className="profile-layout">
        {/* Left Column */}
        <div className="profile-field-group">
          <div>
            <h2 className="profile-section-title">
              <PreferencesIcon size={18} style={{ color: 'var(--color-rust)' }} />
              Dietary Style
            </h2>
            <div className="profile-label-row">
              <span className="profile-help-text" style={{ marginBottom: '10px' }}>What's your typical eating pattern?</span>
            </div>
            <div className="diet-style-chips">
              <div 
                className={`diet-style-chip ${dietStyle.length === 0 ? 'selected' : ''}`}
                onClick={() => setDietStyle([])}
              >
                Everything
              </div>
              {DIET_STYLES.map(style => (
                <div 
                  key={style.key}
                  className={`diet-style-chip ${dietStyle.includes(style.key) ? 'selected' : ''}`}
                  onClick={() => toggleDietStyle(style.key)}
                >
                  {style.label}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="profile-section-title">
              <IngredientsIcon size={18} style={{ color: 'var(--color-rust)' }} />
              Avoidances
            </h2>
            <div className="profile-label-row">
              <span className="profile-help-text" style={{ marginBottom: '10px' }}>Ingredients we should never suggest:</span>
            </div>
            <div className="avoidances-input-wrapper">
              <input 
                type="text" 
                className="avoidances-input"
                placeholder="e.g. Peanuts, Shellfish, Cilantro..."
                value={avoidances}
                onChange={(e) => setAvoidances(e.target.value)}
              />
              <span className="avoidances-icon">⚠️</span>
            </div>
          </div>

          <div>
            <h2 className="profile-section-title">
              <PreferencesIcon size={18} style={{ color: 'var(--color-rust)' }} />
              Cooking Confidence
            </h2>
            <div className="profile-label-row">
              <span className="profile-help-text" style={{ marginBottom: '10px' }}>How complex should the recipes be?</span>
            </div>
            <div className="confidence-options">
              {CONFIDENCE_LEVELS.map(level => (
                <div 
                  key={level.key}
                  className={`confidence-row ${confidence === level.key ? 'selected' : ''}`}
                  onClick={() => setConfidence(level.key)}
                >
                  <div className="confidence-radio">
                    <div className="confidence-radio-dot"></div>
                  </div>
                  <div className="confidence-details">
                    <span className="confidence-label">{level.label}</span>
                    <span className="confidence-desc">{level.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="profile-field-group">
          <div>
            <h2 className="profile-section-title">
              <PreferencesIcon size={18} style={{ color: 'var(--color-rust)' }} />
              Kitchen Tools
            </h2>
            <div className="profile-label-row">
              <span className="profile-help-text" style={{ marginBottom: '10px' }}>Select the appliances you have ready:</span>
            </div>
            <div className="tools-grid">
              {TOOLS.map(tool => (
                <div 
                  key={tool.key}
                  className={`tool-card ${tools.includes(tool.key) ? 'active' : ''}`}
                  onClick={() => toggleTool(tool.key)}
                >
                  <div className="tool-card-left">
                    <span className="tool-card-icon">{tool.icon}</span>
                    <span className="tool-card-name">{tool.label}</span>
                  </div>
                  <div className="tool-card-checkbox">
                    {tools.includes(tool.key) && '✓'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="profile-section-title">
              <BudgetIcon size={18} style={{ color: 'var(--color-rust)' }} />
              Daily Budget
            </h2>
            <div className="profile-label-row">
              <span className="profile-help-text" style={{ marginBottom: '12px' }}>Average target budget per meal:</span>
            </div>
            <div className="profile-budget-box">
              <div className="profile-budget-labels">
                <span style={{ fontWeight: 600 }}>Budget Range</span>
                <span style={{ fontWeight: 700, color: 'var(--color-rust)' }}>${budgetRange - 5} - ${budgetRange}</span>
              </div>
              <input 
                type="range"
                min="10"
                max="50"
                step="5"
                value={budgetRange}
                className="custom-range-input"
                style={{ '--pct': `${((budgetRange - 10) / 40) * 100}%` }}
                onChange={(e) => setBudgetRange(+e.target.value)}
              />
              <div className="profile-budget-limits">
                <span>$10</span>
                <span>$50</span>
              </div>
              <p className="widget-subtext" style={{ marginTop: '14px', fontStyle: 'italic' }}>
                SousChef will prioritize affordable, seasonal ingredients fitting this budget window.
              </p>
            </div>
          </div>

          <div>
            <h2 className="profile-section-title">
              <PreferencesIcon size={18} style={{ color: 'var(--color-rust)' }} />
              Default Servings
            </h2>
            <div className="profile-label-row">
              <span className="profile-help-text" style={{ marginBottom: '10px' }}>Number of people you usually cook for:</span>
            </div>
            <div className="profile-budget-box" style={{ padding: '16px' }}>
              <div className="profile-budget-labels" style={{ marginBottom: '8px' }}>
                <span>Default Group Size</span>
                <span style={{ fontWeight: 700 }}>{people} servings</span>
              </div>
              <input 
                type="range"
                min="1"
                max="8"
                step="1"
                value={people}
                className="custom-range-input"
                style={{ '--pct': `${((people - 1) / 7) * 100}%` }}
                onChange={(e) => setPeople(+e.target.value)}
              />
              <div className="profile-budget-limits">
                <span>1</span>
                <span>8</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-save-row">
        <button 
          className="onboarding-btn btn-pill" 
          style={{ width: 'auto', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          onClick={handleSave}
        >
          <SaveIcon size={16} />
          Save Kitchen Settings
        </button>
      </div>
    </div>
  )
}
