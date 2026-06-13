export default function Dashboard({ plan, profile, spentHistory, history, onNavigate }) {
  // Calculate some simple dashboard stats
  const activePlanMeals = plan?.meals?.filter(m => !m.missing) || []
  const planCost = plan?.grocery?.total || 0
  const planPrep = plan?.summary?.totalPrep || 0
  const planProtein = plan?.summary?.totalProtein || 0
  const planCalories = plan?.summary?.totalCalories || 0
  const isAllVeg = plan?.summary?.allVeg

  // Ongoing vs done — real counts from saved data.
  const ongoingCount = plan ? 1 : 0
  const plansCreated = history?.length || 0
  const tripsDone = spentHistory?.length || 0

  // Spent history details calculations
  const totalSpent = spentHistory?.reduce((sum, h) => sum + h.amountSpent, 0) || 0
  const totalSaved = spentHistory?.reduce((sum, h) => sum + h.savings, 0) || 0
  const recentCheckoutLog = spentHistory?.slice(0, 3) || []

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

      {/* Ongoing vs Done — live status from saved data */}
      <div className="status-strip">
        <div className="status-card" data-tone="ongoing">
          <span className="status-card-icon">🍳</span>
          <div>
            <span className="status-card-num">{ongoingCount}</span>
            <span className="status-card-label">Ongoing plan{ongoingCount === 1 ? '' : 's'}</span>
          </div>
          <span className="status-card-foot">
            {plan ? `${activePlanMeals.length} meals · today` : 'Nothing cooking yet'}
          </span>
        </div>
        <div className="status-card" data-tone="done">
          <span className="status-card-icon">✅</span>
          <div>
            <span className="status-card-num">{tripsDone}</span>
            <span className="status-card-label">Shopping trips done</span>
          </div>
          <span className="status-card-foot">
            {tripsDone > 0 ? `$${totalSaved.toFixed(2)} saved total` : 'Checkout to log a trip'}
          </span>
        </div>
        <div className="status-card" data-tone="plans">
          <span className="status-card-icon">📋</span>
          <div>
            <span className="status-card-num">{plansCreated}</span>
            <span className="status-card-label">Plans created</span>
          </div>
          <span className="status-card-foot">All-time meal plans</span>
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

            <div className="dashboard-stat-card">
              <div className="dashboard-stat-icon-box">💪</div>
              <div className="dashboard-stat-text-group">
                <span className="dashboard-stat-label">Protein / serving</span>
                <span className="dashboard-stat-val">{plan ? `${planProtein}g` : '0g'}</span>
              </div>
            </div>
          </div>

          {plan && (
            <div className="nutrition-banner">
              <span className="nutrition-banner-icon">{isAllVeg ? '🥗' : '🍗'}</span>
              <div>
                <span className="nutrition-banner-title">
                  {isAllVeg ? 'Fully vegetarian day' : 'Mixed veg & non-veg day'} · {planProtein}g protein · {planCalories} kcal
                </span>
                <span className="nutrition-banner-desc">
                  A protein-forward plan supports muscle repair and keeps you fuller for longer — steadier energy and fewer cravings.
                </span>
              </div>
            </div>
          )}

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

          {/* Spent Checkout Log history listing */}
          <div style={{ marginTop: '28px' }}>
            <h3 className="dashboard-section-title">Recent Grocery Checkout Trips</h3>
            {recentCheckoutLog.length > 0 ? (
              <div className="spending-log-list">
                {recentCheckoutLog.map((log) => (
                  <div key={log.id} className="spending-log-row">
                    <div className="spending-log-left">
                      <span className="spending-log-date">Shopping log · {log.date}</span>
                      <span className="spending-log-amount">Spent: ${log.amountSpent.toFixed(2)}</span>
                    </div>
                    {log.savings > 0 && (
                      <span className="spending-log-saving">Saved: ${log.savings.toFixed(2)}</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div 
                className="widget-panel" 
                style={{ 
                  textAlign: 'center', 
                  padding: '24px', 
                  background: 'var(--bg-card)', 
                  border: '1px dashed var(--border)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  No shopping trips logged yet. Complete checklist item buyings and click checkout on the Groceries list page!
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-sidebar">
          {/* Spending Analytics panel widgets */}
          <div className="widget-panel" style={{ background: 'var(--color-cream)', marginBottom: '20px' }}>
            <div className="widget-title-row">
              <span>💳</span>
              <span className="widget-title">Shopping Analytics</span>
            </div>
            <p className="widget-desc" style={{ marginBottom: '12px', fontSize: '0.8rem' }}>
              Historical spending aggregated from your logged grocery trips:
            </p>
            <ul style={{ paddingLeft: '18px', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong>Total Spent:</strong> ${totalSpent.toFixed(2)}</li>
              <li><strong>Total Savings:</strong> ${totalSaved.toFixed(2)}</li>
              <li><strong>Logged Trips:</strong> {spentHistory?.length || 0} checkout trips</li>
            </ul>
          </div>

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

          <div className="widget-panel" style={{ background: 'var(--bg-active)', marginTop: '20px' }}>
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
