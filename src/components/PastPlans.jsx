export default function PastPlans({ history, onRestorePlan, onDeletePlan, onNavigate }) {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Past Plans</h1>
          <p className="page-subtitle">View and restore your previously generated meal plans.</p>
        </div>
      </div>

      {history && history.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {history.map((item, index) => {
            const dateStr = item.date || new Date().toLocaleDateString()
            const totalCost = item.plan?.grocery?.total || 0
            const mealsPlannedCount = item.plan?.meals?.filter(m => !m.missing).length || 0
            const prepTime = item.plan?.summary?.totalPrep || 0
            
            return (
              <div 
                key={item.id || index} 
                className="meal-horizontal-card past-plan-card"
                style={{ cursor: 'default' }}
              >
                <div className="meal-card-details">
                  <div className="meal-slot-pill" style={{ background: 'var(--color-cream)', color: 'var(--text-primary)' }}>
                    Saved Plan · {dateStr}
                  </div>
                  
                  <div className="meal-card-top-row" style={{ marginTop: '8px' }}>
                    <h3 className="meal-card-title">
                      {mealsPlannedCount} Meal{mealsPlannedCount > 1 ? 's' : ''} Planned
                    </h3>
                    <span className="meal-card-cost">${totalCost.toFixed(2)}</span>
                  </div>

                  <p className="meal-card-desc" style={{ marginBottom: '14px' }}>
                    Meals: {item.plan?.meals?.filter(m => !m.missing).map(m => m.title).join(', ') || 'No meals'}
                  </p>

                  <div className="meal-card-meta">
                    <span className="meal-meta-pill">⏱ {prepTime} mins prep</span>
                    <span className="meal-meta-pill">👥 {item.plan?.profile?.people || 2} servings</span>
                  </div>
                </div>

                <div className="past-plan-actions">
                  <button 
                    className="onboarding-btn btn-pill" 
                    style={{ padding: '10px 18px', fontSize: '0.82rem', width: 'auto' }}
                    onClick={() => onRestorePlan(item.plan)}
                  >
                    🔄 Restore Plan
                  </button>
                  <button 
                    className="btn btn-secondary btn-pill" 
                    style={{ padding: '10px 18px', fontSize: '0.82rem', borderColor: '#D3A58E', color: '#B04B3E' }}
                    onClick={() => onDeletePlan(item.id || index)}
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="empty-state-card">
          <div className="empty-state-icon">📂</div>
          <h2 className="empty-state-title">No Saved Plans</h2>
          <p className="empty-state-desc">
            You haven't generated or saved any meal plans yet. Go to the Meal Planner tab to cook up your first plan!
          </p>
          <button 
            className="onboarding-btn btn-pill" 
            style={{ width: 'auto' }}
            onClick={() => onNavigate('planner')}
          >
            🍳 Go to Meal Planner
          </button>
        </div>
      )}
    </div>
  )
}
