import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import DayForm from './components/DayForm.jsx'
import Results from './components/Results.jsx'
import Dashboard from './components/Dashboard.jsx'
import PastPlans from './components/PastPlans.jsx'
import KitchenProfile from './components/KitchenProfile.jsx'
import { generatePlan } from './lib/planner.js'
import {
  DashboardIcon,
  PlannerIcon,
  GroceryIcon,
  HistoryIcon,
  PreferencesIcon,
  CollapseIcon,
  ExpandIcon,
} from './components/Icons.jsx'

const STAGES = { form: 'form', cooking: 'cooking', results: 'results' }

const ONBOARDING_SLIDES = [
  {
    title: 'AI Personalization',
    desc: 'Plans based on your schedule, vibe, and default kitchen settings.',
    color: '#C17F5B',
    icon: '🥑'
  },
  {
    title: 'Smart Grocery Lists',
    desc: 'Auto-generated categorized listings to ease your grocery shopping.',
    color: '#798254',
    icon: '🛒'
  },
  {
    title: 'Cooking To-Do List',
    desc: 'Turn recipes into interactive action checklists to cook easily.',
    color: '#5C3E21',
    icon: '📝'
  }
]

const COOKING_LINES = [
  'Reading your day…',
  'Balancing energy & time…',
  'Picking dishes that fit…',
  'Costing the grocery run…',
  'Checking the budget…',
]

function CookingLoader() {
  const [line, setLine] = useState(0)
  useEffect(() => {
    const id = setInterval(
      () => setLine((l) => (l + 1) % COOKING_LINES.length),
      700,
    )
    return () => clearInterval(id)
  }, [])
  return (
    <div className="loader-container">
      <div className="loader-spinner"></div>
      <AnimatePresence mode="wait">
        <motion.div
          key={line}
          className="loader-text"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
        >
          {COOKING_LINES[line]}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function Onboarding({ onStart }) {
  const [activeSlide, setActiveSlide] = useState(0)

  // Auto transition slide dots for premium feel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % ONBOARDING_SLIDES.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="onboarding-container">
      <div className="onboarding-left">
        <img src="/onboarding_backdrop.png" alt="Fresh Ingredients Backdrop" />
      </div>
      <div className="onboarding-right">
        <div className="onboarding-pill">Meal Planning Reimagined</div>
        <h1 className="onboarding-title">Welcome to SousChef</h1>
        <p className="onboarding-subtitle">Your AI-powered kitchen assistant for smarter daily cooking.</p>
        
        <div className="onboarding-carousel">
          {ONBOARDING_SLIDES.map((s, idx) => (
            <div 
              key={idx} 
              className="onboarding-card"
              style={{
                borderColor: activeSlide === idx ? 'var(--color-rust)' : 'var(--border)',
                transform: activeSlide === idx ? 'scale(1.02)' : 'scale(1)',
                opacity: activeSlide === idx ? 1 : 0.7,
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onClick={() => setActiveSlide(idx)}
            >
              <div 
                className="onboarding-card-icon" 
                style={{ background: s.color, color: '#FFFFFF', fontSize: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {s.icon}
              </div>
              <h3 className="onboarding-card-title">{s.title}</h3>
              <p className="onboarding-card-desc">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="onboarding-alert">
          <span className="onboarding-alert-icon">🐷</span>
          <p className="onboarding-alert-text">
            Real-time budget feasibility checks help you keep your meal plan realistic and affordable.
          </p>
        </div>

        <button className="onboarding-btn" onClick={onStart}>
          Start Planning My Day
        </button>

        <div className="onboarding-dots">
          {ONBOARDING_SLIDES.map((_, idx) => (
            <div 
              key={idx} 
              className={`onboarding-dot ${activeSlide === idx ? 'active' : ''}`}
              onClick={() => setActiveSlide(idx)}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </div>

        <span className="onboarding-login-link" onClick={onStart}>
          Already have a plan? Log in
        </span>
      </div>
    </div>
  )
}

function GroceriesTab({ plan, onNavigate }) {
  const [checkedItems, setCheckedItems] = useState({})
  
  if (!plan) {
    return (
      <div className="empty-state-card">
        <div className="empty-state-icon">🛒</div>
        <h2 className="empty-state-title">No Grocery List</h2>
        <p className="empty-state-desc">
          You don't have an active meal plan yet. Go to the Meal Planner tab to generate one!
        </p>
        <button 
          className="onboarding-btn btn-pill" 
          style={{ width: 'auto' }}
          onClick={() => onNavigate('planner')}
        >
          🍳 Go to Meal Planner
        </button>
      </div>
    )
  }

  const { grocery } = plan
  const totalCount = grocery.groups.reduce((s, g) => s + g.items.length, 0)
  const checkedCount = Object.values(checkedItems).filter(Boolean).length

  const toggleItem = (key) => {
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Grocery List</h1>
          <p className="page-subtitle">Checked ingredients are crossed off as you buy them.</p>
        </div>
        <div className="ai-ready-badge">
          <span>{checkedCount}/{totalCount} Items Checked</span>
        </div>
      </div>

      <div className="widget-panel" style={{ background: 'var(--bg-sidebar)', boxShadow: 'var(--shadow-sm)' }}>
        <div className="results-section-header" style={{ marginBottom: '18px' }}>
          <h3 className="results-section-title">Aisle Ingredients Checklist</h3>
          <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-rust)' }}>
            Est. Cost: ${grocery.total.toFixed(2)}
          </span>
        </div>

        {grocery.groups.map(g => (
          <div key={g.cat} className="grocery-group">
            <h4>{g.label}</h4>
            {g.items.map(it => {
              const key = `${it.item}-${it.unit}`
              const isChecked = !!checkedItems[key]
              return (
                <div 
                  key={key}
                  className="grocery-item"
                  data-checked={isChecked}
                  onClick={() => toggleItem(key)}
                >
                  <div className="box">
                    {isChecked && '✓'}
                  </div>
                  <span className="nm">{it.item}</span>
                  <span className="qty">{it.qty} {it.unit}</span>
                  <span className="ic">${it.cost.toFixed(2)}</span>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

function TodoTab({ plan, onNavigate }) {
  const [doneTasks, setDoneTasks] = useState({})

  if (!plan) {
    return (
      <div className="empty-state-card">
        <div className="empty-state-icon">📝</div>
        <h2 className="empty-state-title">No Cooking Tasks</h2>
        <p className="empty-state-desc">
          Plan your meals first to generate your interactive step-by-step cooking checklists!
        </p>
        <button 
          className="onboarding-btn btn-pill" 
          style={{ width: 'auto' }}
          onClick={() => onNavigate('planner')}
        >
          🍳 Plan My Day
        </button>
      </div>
    )
  }

  const { todos, meals } = plan
  const activeMeals = meals.filter(m => !m.missing)
  const totalTasks = todos.length
  const completedTasks = Object.values(doneTasks).filter(Boolean).length
  const percentCompleted = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0

  const toggleTask = (id) => {
    setDoneTasks(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div>
      <div className="todo-view-header">
        <button className="todo-back-btn" onClick={() => onNavigate('planner')} title="Back to Plan">
          ←
        </button>
        <div className="todo-header-pill">
          <span>✨ AI Optimized</span>
        </div>
        <button className="todo-menu-btn">•••</button>
      </div>

      <h1 className="page-title" style={{ marginBottom: '4px' }}>Cooking To-Do List</h1>
      <p className="page-subtitle" style={{ marginBottom: '24px' }}>
        Today · {activeMeals.length} Meals Planned
      </p>

      <div className="todo-progress-banner">
        <div className="todo-progress-left">
          <div className="progress-circle-box">
            <span className="progress-circle-val">{completedTasks}/{totalTasks}</span>
          </div>
          <div className="todo-progress-text-group">
            <span className="todo-progress-title">Keep it up, Chef!</span>
            <span className="todo-progress-desc">You've completed {percentCompleted}% of today's prep tasks.</span>
          </div>
        </div>
        <span className="todo-progress-icon">👨‍🍳</span>
      </div>

      {activeMeals.map(meal => {
        const mealTodos = todos.filter(t => t.meal === meal.title)
        if (mealTodos.length === 0) return null

        return (
          <div key={meal.id} className="todo-meal-section">
            <div className="todo-meal-header">
              <span className="todo-meal-slot">{meal.slot}</span>
              <span className="todo-meal-name">{meal.title}</span>
              <span className="todo-meal-time">⏱ {meal.prep} mins prep</span>
            </div>
            <div className="todo-list-items">
              {mealTodos.map(task => {
                const isCompleted = !!doneTasks[task.id]
                return (
                  <div 
                    key={task.id} 
                    className={`todo-item-row ${isCompleted ? 'completed' : ''}`}
                    onClick={() => toggleTask(task.id)}
                  >
                    <div className="todo-item-checkbox">
                      {isCompleted && '✓'}
                    </div>
                    <span className="todo-item-text">{task.text}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return localStorage.getItem('souschef_onboarding_done') !== 'true'
  })
  const [activeTab, setActiveTab] = useState('planner')
  const [stage, setStage] = useState(STAGES.form)
  const [plan, setPlan] = useState(null)
  
  // Collapse/Expand state for left sidebar
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('souschef_sidebar_collapsed') === 'true'
  })

  // Kitchen profile settings loaded from localStorage
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('souschef_profile')
    return saved ? JSON.parse(saved) : {
      name: 'John Doe',
      people: 2,
      dietStyle: [],
      avoidances: 'Peanuts, Shellfish',
      confidence: 'Home Cook',
      tools: ['ovenStove', 'blender', 'castIron'],
      budgetRange: 15
    }
  })

  // Plans history loaded from localStorage
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('souschef_history')
    return saved ? JSON.parse(saved) : []
  })

  const toggleSidebar = () => {
    const nextState = !isSidebarCollapsed
    setIsSidebarCollapsed(nextState)
    localStorage.setItem('souschef_sidebar_collapsed', nextState.toString())
  }

  const handleStartApp = () => {
    setShowOnboarding(false)
    localStorage.setItem('souschef_onboarding_done', 'true')
  }

  const handleGenerate = (profileParams) => {
    setStage(STAGES.cooking)
    setTimeout(() => {
      const generated = generatePlan(profileParams)
      setPlan(generated)
      setStage(STAGES.results)
      
      // Save generated plan to history
      const historyItem = {
        id: Date.now(),
        date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
        plan: generated
      }
      const updatedHistory = [historyItem, ...history]
      setHistory(updatedHistory)
      localStorage.setItem('souschef_history', JSON.stringify(updatedHistory))
    }, 2000)
  }

  const handleSaveProfile = (newProfile) => {
    const updated = { ...profile, ...newProfile }
    setProfile(updated)
    localStorage.setItem('souschef_profile', JSON.stringify(updated))
  }

  const handleRestorePlan = (restoredPlan) => {
    setPlan(restoredPlan)
    setStage(STAGES.results)
    setActiveTab('planner')
  }

  const handleDeletePlan = (id) => {
    const updatedHistory = history.filter(h => h.id !== id)
    setHistory(updatedHistory)
    localStorage.setItem('souschef_history', JSON.stringify(updatedHistory))
  }

  const restartPlanner = () => {
    setStage(STAGES.form)
    setPlan(null)
  }

  if (showOnboarding) {
    return <Onboarding onStart={handleStartApp} />
  }

  return (
    <div className="app-container">
      {/* Persistent Left Sidebar with Expand/Collapse support */}
      <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-top">
          <button 
            className="sidebar-toggle-btn" 
            onClick={toggleSidebar} 
            title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isSidebarCollapsed ? <ExpandIcon size={14} /> : <CollapseIcon size={14} />}
          </button>

          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">🍳</div>
            <div className="sidebar-logo-text">
              SousChef
              <small>AI Assistant</small>
            </div>
          </div>

          <nav className="sidebar-nav">
            <button 
              className={`sidebar-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
              title="Dashboard"
            >
              <span className="sidebar-nav-icon">
                <DashboardIcon size={20} />
              </span>
              <span>Dashboard</span>
            </button>
            <button 
              className={`sidebar-nav-item ${activeTab === 'planner' || activeTab === 'todo' ? 'active' : ''}`}
              onClick={() => setActiveTab('planner')}
              title="Meal Planner"
            >
              <span className="sidebar-nav-icon">
                <PlannerIcon size={20} />
              </span>
              <span>Meal Planner</span>
            </button>
            <button 
              className={`sidebar-nav-item ${activeTab === 'groceries' ? 'active' : ''}`}
              onClick={() => setActiveTab('groceries')}
              title="Grocery List"
            >
              <span className="sidebar-nav-icon">
                <GroceryIcon size={20} />
              </span>
              <span>Grocery List</span>
            </button>
            <button 
              className={`sidebar-nav-item ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
              title="Past Plans"
            >
              <span className="sidebar-nav-icon">
                <HistoryIcon size={20} />
              </span>
              <span>Past Plans</span>
            </button>
            <button 
              className={`sidebar-nav-item ${activeTab === 'preferences' ? 'active' : ''}`}
              onClick={() => setActiveTab('preferences')}
              title="Preferences"
            >
              <span className="sidebar-nav-icon">
                <PreferencesIcon size={20} />
              </span>
              <span>Preferences</span>
            </button>
          </nav>
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-promo-card">
            <span className="sidebar-promo-tag">Pro Member</span>
            <span className="sidebar-promo-desc">Unlimited AI meal generations active.</span>
          </div>
          <div className="sidebar-profile">
            <div className="sidebar-profile-avatar">
              {profile.name ? profile.name.split(' ').map(n => n[0]).join('') : 'JD'}
            </div>
            <div className="sidebar-profile-info">
              <span className="sidebar-profile-name">{profile.name || 'John Doe'}</span>
              <span className="sidebar-profile-plan">Premium Plan</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <Dashboard 
                plan={plan}
                profile={profile}
                onNavigate={setActiveTab}
              />
            </motion.div>
          )}

          {activeTab === 'planner' && (
            <motion.div
              key="planner"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <div className="page-header">
                <div>
                  <h1 className="page-title">
                    {stage === STAGES.form ? 'Plan Your Day' : stage === STAGES.cooking ? 'Cooking Plan...' : "Today's Plan"}
                  </h1>
                  <p className="page-subtitle">
                    {stage === STAGES.form 
                      ? "Tell us about your day and we'll handle the menu."
                      : stage === STAGES.cooking 
                        ? 'Simulating AI recipe constraints matching...' 
                        : 'Review your personalized menus and substitutions.'}
                  </p>
                </div>
                {stage === STAGES.form && (
                  <div className="ai-ready-badge">
                    <span>✨ AI Ready</span>
                  </div>
                )}
              </div>

              {stage === STAGES.form && (
                <DayForm 
                  onGenerate={handleGenerate}
                  profile={profile}
                />
              )}

              {stage === STAGES.cooking && <CookingLoader />}

              {stage === STAGES.results && plan && (
                <Results 
                  plan={plan}
                  onRestart={restartPlanner}
                  onNavigate={setActiveTab}
                />
              )}
            </motion.div>
          )}

          {activeTab === 'groceries' && (
            <motion.div
              key="groceries"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <GroceriesTab 
                plan={plan}
                onNavigate={setActiveTab}
              />
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <PastPlans 
                history={history}
                onRestorePlan={handleRestorePlan}
                onDeletePlan={handleDeletePlan}
                onNavigate={setActiveTab}
              />
            </motion.div>
          )}

          {activeTab === 'preferences' && (
            <motion.div
              key="preferences"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <KitchenProfile 
                profile={profile}
                onSaveProfile={handleSaveProfile}
              />
            </motion.div>
          )}

          {activeTab === 'todo' && (
            <motion.div
              key="todo"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <TodoTab 
                plan={plan}
                onNavigate={setActiveTab}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
