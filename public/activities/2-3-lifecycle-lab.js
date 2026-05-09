const scenarios = [
  {
    id: 'battery-phone',
    title: 'Phone with weak battery, otherwise functional',
    tag: 'Home device',
    detail: 'The screen works, the cameras work, and the owner just complains that the battery dies by afternoon.',
    answer: 'reduce',
    value: 3,
    hazard: 1,
    insight: 'This is a reduce case because replacing the battery or changing charging habits can delay full replacement and prevent premature waste.',
  },
  {
    id: 'drawer-tablet',
    title: 'Older tablet no longer used for school',
    tag: 'Second-life candidate',
    detail: 'The tablet is too slow for modern coursework but still streams video and displays recipes well.',
    answer: 'reuse',
    value: 2,
    hazard: 1,
    insight: 'This is a reuse case because the hardware can still serve as a recipe display, reading device, or home dashboard.',
  },
  {
    id: 'cracked-laptop',
    title: 'Laptop with dead motherboard and swollen battery',
    tag: 'Hazard priority',
    detail: 'Repair cost is higher than replacement and the battery needs controlled handling immediately.',
    answer: 'recycle',
    value: 1,
    hazard: 3,
    insight: 'This is a recycle case because the device is unsafe and beyond sensible repair. It should enter formal dismantling quickly.',
  },
  {
    id: 'router',
    title: 'Retired Wi-Fi router after a network upgrade',
    tag: 'Infrastructure reuse',
    detail: 'It no longer suits the main connection but still powers on and can serve limited network tasks.',
    answer: 'reuse',
    value: 2,
    hazard: 1,
    insight: 'This is a reuse case because the router can still serve niche roles such as a lab practice unit or low-demand secondary node.',
  },
  {
    id: 'dusty-desktop',
    title: 'Desktop slowing down from dust and full storage',
    tag: 'Maintenance case',
    detail: 'Nothing is broken. It overheats, the storage is packed, and several unnecessary apps launch on startup.',
    answer: 'reduce',
    value: 3,
    hazard: 1,
    insight: 'This is a reduce case because cleaning, storage management, and basic maintenance extend the device life without changing its job.',
  },
  {
    id: 'burned-charger-box',
    title: 'Box of dead chargers, cords, and broken accessories',
    tag: 'Collection residue',
    detail: 'The pile contains mixed cables and damaged accessories with no remaining practical function.',
    answer: 'recycle',
    value: 1,
    hazard: 2,
    insight: 'This is a recycle case because the items have no meaningful second-life role and should be separated into formal recovery streams.',
  },
]

const state = {
  answers: new Map(),
  score: 0,
  value: 0,
  hazard: 0,
}

const scenarioList = document.getElementById('scenario-list')
const scoreValue = document.getElementById('score-value')
const scoreMessage = document.getElementById('score-message')
const scoreMeter = document.getElementById('score-meter')
const valueSaved = document.getElementById('value-saved')
const hazardAvoided = document.getElementById('hazard-avoided')
const correctCount = document.getElementById('correct-count')
const remainingCount = document.getElementById('remaining-count')
const feedbackPanel = document.getElementById('feedback-panel')

function decisionLabel(decision) {
  if (decision === 'reduce') return 'Reduce'
  if (decision === 'reuse') return 'Reuse'
  return 'Recycle'
}

function renderScenarioCard(scenario) {
  const card = document.createElement('article')
  card.className = 'scenario-card'
  card.id = `scenario-${scenario.id}`

  card.innerHTML = `
    <div class="scenario-head">
      <div>
        <div class="scenario-tag">${scenario.tag}</div>
        <h3>${scenario.title}</h3>
      </div>
      <div class="score-badge">Choose The Best R</div>
    </div>
    <p>${scenario.detail}</p>
    <div class="decision-grid">
      <button class="decision-btn decision-reduce" data-scenario="${scenario.id}" data-choice="reduce">
        <span>Path A</span>
        <strong>Reduce</strong>
      </button>
      <button class="decision-btn decision-reuse" data-scenario="${scenario.id}" data-choice="reuse">
        <span>Path B</span>
        <strong>Reuse</strong>
      </button>
      <button class="decision-btn decision-recycle" data-scenario="${scenario.id}" data-choice="recycle">
        <span>Path C</span>
        <strong>Recycle</strong>
      </button>
    </div>
  `

  card.querySelectorAll('.decision-btn').forEach((button) => {
    button.addEventListener('click', () => handleDecision(scenario, button.dataset.choice))
  })

  return card
}

function handleDecision(scenario, choice) {
  const previous = state.answers.get(scenario.id)
  if (previous === scenario.answer) {
    state.score -= 3
    state.value -= scenario.value
    state.hazard -= scenario.hazard
  }

  if (previous && previous !== scenario.answer && choice === scenario.answer) {
    state.score += 3
    state.value += scenario.value
    state.hazard += scenario.hazard
  }

  if (!previous && choice === scenario.answer) {
    state.score += 3
    state.value += scenario.value
    state.hazard += scenario.hazard
  }

  state.answers.set(scenario.id, choice)

  const card = document.getElementById(`scenario-${scenario.id}`)
  card.classList.add('active')
  card.querySelectorAll('.decision-btn').forEach((button) => {
    button.classList.toggle('active', button.dataset.choice === choice)
  })

  const correct = choice === scenario.answer
  feedbackPanel.innerHTML = `
    <div class="eyebrow">Console Feedback</div>
    <h3>${correct ? 'Correct route selected' : 'Recheck the lifecycle logic'}</h3>
    <p><strong>${decisionLabel(choice)}</strong> was chosen for <strong>${scenario.title}</strong>. ${scenario.insight}</p>
  `

  updateScoreboard()
}

function updateScoreboard() {
  const answered = state.answers.size
  const correct = Array.from(state.answers.entries()).filter(([id, choice]) => {
    const scenario = scenarios.find((entry) => entry.id === id)
    return scenario?.answer === choice
  }).length

  scoreValue.textContent = `${state.score} / ${scenarios.length * 3}`
  valueSaved.textContent = `${state.value} value points`
  hazardAvoided.textContent = `${state.hazard} hazard points`
  correctCount.textContent = `${correct} correct`
  remainingCount.textContent = `${scenarios.length - answered}`

  const percent = Math.round((state.score / (scenarios.length * 3)) * 100)
  scoreMeter.style.width = `${percent}%`

  if (percent === 100) {
    scoreMessage.textContent = 'Perfect. You are routing hardware through the lifecycle with professional judgment.'
  } else if (percent >= 67) {
    scoreMessage.textContent = 'Strong pass. Review the weaker choices and tighten your reduce vs reuse decisions.'
  } else if (answered > 0) {
    scoreMessage.textContent = 'Keep going. The goal is to preserve use where possible and recycle only when recovery is the cleanest move.'
  } else {
    scoreMessage.textContent = 'Start with the first scenario and choose the strongest recovery path.'
  }
}

function init() {
  scenarios.forEach((scenario) => scenarioList.appendChild(renderScenarioCard(scenario)))
  updateScoreboard()
}

init()
