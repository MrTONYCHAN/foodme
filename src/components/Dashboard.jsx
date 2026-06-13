export default function Dashboard({ plan, profile, onNavigate }) {
  // Calculate some simple dashboard stats
  const activePlanMeals = plan?.meals?.filter(m => !m.missing) || []
  const planCost = plan?.grocery?.total || 0
  const planPrep = plan?.summary?.totalPrep || 0

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome back, Chef!</h1>
          <p className="page-subtitle">Here is what is cooking in your kitchen today.</p>
        </div>
        <div className="ai-ready-badge">
          <span>✨ Premium Account</span>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-left">
          {plan ? (
            <div className="dashboard-hero-card" style={{ background: 'var(--bg-active)' }}>
              <h2 className="dashboard-hero-title">Today's Menu is Ready</h2>
              <p className="dashboard-hero-subtitle">
                You have {activePlanMeals.length} meals planned for today costing around ${planCost.toFixed(2)}. 
                Your total kitchen active time will be about {planPrep} minutes.
              </p>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  className="onboarding-btn btn-pill" 
                  style={{ width: 'auto' }}
                  onClick={() => onNavigate('planner')}
                >
                  🍽 View Meal Plan
                </button>
                <button 
                  className="btn btn-secondary btn-pill"
                  onClick={() => onNavigate('groceries')}
                >
                  🛒 Check Groceries
                </button>
              </div>
            </div>
          ) : (
            <div className="dashboard-hero-card">
              <h2 className="dashboard-hero-title">Plan Your Day's Menu</h2>
              <p className="dashboard-hero-subtitle">
                Let's plan your meals today! Tell us about your schedule, budget, and vibes, 
                and we'll build a tailored plan with recipes, groceries, and instructions.
              </p>
              <button 
                className="onboarding-btn btn-pill" 
                style={{ width: 'auto' }}
                onClick={() => onNavigate('planner')}
              >
                🍳 Start Planning My Day
              </button>
            </div>
          )}

          <h3 className="dashboard-section-title">Today's Stats</h3>
          <div className="dashboard-stats-strip">
            <div className="dashboard-stat-card">
              <div className="dashboard-stat-icon-box">👥</div>
              <div className="dashboard-stat-text-group">
                <span className="dashboard-stat-label">Servings</span>
                <span className="dashboard-stat-val">{profile?.people || 2} People</span>
              </div>
            </div>

            <div className="dashboard-stat-card">
              <div className="dashboard-stat-icon-box">⏱</div>
              <div className="dashboard-stat-text-group">
                <span className="dashboard-stat-label">Active Time</span>
                <span className="dashboard-stat-val">{plan ? `${planPrep}m` : '0m'}</span>
              </div>
            </div>

            <div className="dashboard-stat-card">
              <div className="dashboard-stat-icon-box">💰</div>
              <div className="dashboard-stat-text-group">
                <span className="dashboard-stat-label">Est. Budget</span>
                <span className="dashboard-stat-val">${plan ? planCost.toFixed(2) : '0.00'}</span>
              </div>
            </div>
          </div>

          {plan && (
            <div style={{ marginTop: '28px' }}>
              <h3 className="dashboard-section-title">Quick Menu Preview</h3>
              <div className="meals-list">
                {activePlanMeals.map((meal) => (
                  <div key={meal.slot} className="meal-horizontal-card" style={{ padding: '16px 20px' }} onClick={() => onNavigate('planner')}>
                    <div className="meal-card-details">
                      <div className="meal-slot-pill" style={{ marginBottom: '6px' }}>{meal.slot}</div>
                      <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.1rem' }}>{meal.title}</h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{meal.blurb}</p>
                    </div>
                    <span style={{ fontSize: '1.25rem', alignSelf: 'center', color: 'var(--text-faint)' }}>→</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="dashboard-sidebar">
          <div className="tip-widget-card">
            <div className="tip-header">
              <span className="tip-icon">💡</span>
              <span className="tip-title">Chef's Smart Tip</span>
            </div>
            <p className="tip-content">
              "To keep vegetables like broccoli and spinach vibrant green when boiling or steaming, transfer them immediately into an ice bath (a bowl filled with cold water and ice cubes) for 30 seconds after cooking. This halts the cooking process instantly."
            </p>
            <span className="tip-author">— SousChef Culinary Team</span>
          </div>

          <div className="widget-panel" style={{ background: 'var(--color-cream)' }}>
            <div className="widget-title-row">
              <span>🥑</span>
              <span className="widget-title">Diet Preferences</span>
            </div>
            <p className="widget-desc" style={{ marginBottom: '12px', fontSize: '0.8rem' }}>
              Your culinary AI is calibrated to your profile constraints:
            </p>
            <ul style={{ paddingLeft: '18px', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><strong>Diet:</strong> {profile?.dietStyle && profile.dietStyle.length > 0 ? profile.dietStyle.join(', ') : 'Everything'}</li>
              <li><strong>Cooking Skill:</strong> {profile?.confidence || 'Home Cook'}</li>
              <li><strong>Avoidances:</strong> {profile?.avoidances || 'None specified'}</li>
              <li><strong>Priciest ingredient rule:</strong> Enabled</li>
            </ul>
            <button 
              className="btn btn-secondary btn-pill" 
              style={{ width: '100%', marginTop: '16px', fontSize: '0.8rem', padding: '10px 18px' }}
              onClick={() => onNavigate('preferences')}
            >
              ⚙️ Adjust Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
