const plannerData = {
  venue: [
    { id: 'school-gate', title: 'School entrance plaza', detail: 'High visibility and easy discovery for families.', score: 22, quality: 'strong' },
    { id: 'classroom', title: 'Single classroom', detail: 'Easy to supervise but too hidden and too small for flow.', score: 10, quality: 'weak' },
    { id: 'market', title: 'Community market corner', detail: 'Accessible and public, but needs stronger volunteer control.', score: 18, quality: 'medium' },
  ],
  partner: [
    { id: 'certified', title: 'Certified recycler partner', detail: 'Clear handoff and safer downstream processing.', score: 24, quality: 'strong' },
    { id: 'unknown', title: 'Unverified scrap buyer', detail: 'Fast pickup but no confidence in safe processing.', score: 6, quality: 'weak' },
    { id: 'municipal', title: 'Municipal waste office', detail: 'Useful if it confirms accepted materials and pickup route.', score: 18, quality: 'medium' },
  ],
  bins: [
    { id: 'separated', title: 'Dedicated bins by category', detail: 'Separate batteries, cables, small electronics, and larger equipment.', score: 20, quality: 'strong' },
    { id: 'mixed', title: 'One mixed collection pile', detail: 'Fast to set up but increases damage and contamination.', score: 5, quality: 'weak' },
    { id: 'partial', title: 'Two broad categories', detail: 'Better than mixed collection, but still leaves some risk.', score: 14, quality: 'medium' },
  ],
  outreach: [
    { id: 'multi', title: 'Flyers + assemblies + social posts', detail: 'Multiple touchpoints raise turnout and understanding.', score: 18, quality: 'strong' },
    { id: 'poster', title: 'Single poster only', detail: 'Visible but too passive for strong participation.', score: 8, quality: 'weak' },
    { id: 'classroom', title: 'Teacher-led classroom briefings', detail: 'Good explanation, but needs wider public visibility too.', score: 14, quality: 'medium' },
  ],
  staff: [
    { id: 'trained', title: 'Dedicated volunteer team', detail: 'People assigned to greeting, sorting, logs, and storage.', score: 16, quality: 'strong' },
    { id: 'minimal', title: 'One or two helpers', detail: 'Not enough for traffic, sorting, and documentation.', score: 7, quality: 'weak' },
    { id: 'rotating', title: 'Rotating class roster', detail: 'Useful coverage, but quality depends on quick training.', score: 12, quality: 'medium' },
  ],
}

const selections = {
  venue: null,
  partner: null,
  bins: null,
  outreach: null,
  staff: null,
}

const grids = {
  venue: document.getElementById('venue-grid'),
  partner: document.getElementById('partner-grid'),
  bins: document.getElementById('bins-grid'),
  outreach: document.getElementById('outreach-grid'),
  staff: document.getElementById('staff-grid'),
}

const scoreValue = document.getElementById('score-value')
const scoreCopy = document.getElementById('score-copy')
const scoreMeter = document.getElementById('score-meter')
const summaryTitle = document.getElementById('summary-title')
const summaryCopy = document.getElementById('summary-copy')
const fixTitle = document.getElementById('fix-title')
const fixCopy = document.getElementById('fix-copy')
const launchStatus = document.getElementById('launch-status')

function renderChoice(sectionKey, option) {
  const button = document.createElement('button')
  button.className = 'choice-btn'
  button.dataset.section = sectionKey
  button.dataset.id = option.id
  button.innerHTML = `
    <span>${option.quality} fit</span>
    <strong>${option.title}</strong>
    <small>${option.detail}</small>
  `

  button.addEventListener('click', () => {
    selections[sectionKey] = option
    updateSection(sectionKey)
    updatePlanner()
  })

  return button
}

function updateSection(sectionKey) {
  grids[sectionKey].querySelectorAll('.choice-btn').forEach((button) => {
    button.classList.toggle('active', button.dataset.id === selections[sectionKey]?.id)
  })
}

function strongestMissingSelection() {
  const missing = Object.entries(selections).find(([, value]) => value === null)
  if (missing) {
    const [sectionKey] = missing
    return {
      title: `Select a ${sectionKey} option`,
      copy: 'A complete drive needs one concrete choice in every planning lane before launch readiness can be evaluated properly.',
    }
  }

  const weakest = Object.entries(selections).reduce((lowest, entry) => {
    const [, option] = entry
    if (!lowest || option.score < lowest.score) return option
    return lowest
  }, null)

  if (!weakest) {
    return {
      title: 'Awaiting selections',
      copy: 'The console will identify the biggest missing piece after each change.',
    }
  }

  return {
    title: `Upgrade: ${weakest.title}`,
    copy: weakest.detail,
  }
}

function updatePlanner() {
  const chosen = Object.values(selections).filter(Boolean)
  const total = chosen.reduce((sum, option) => sum + option.score, 0)
  const percent = Math.min(100, total)
  const allSelected = chosen.length === Object.keys(selections).length
  const weakCount = chosen.filter((option) => option.quality === 'weak').length

  scoreValue.textContent = `${total} / 100`
  scoreMeter.style.width = `${percent}%`

  if (!allSelected) {
    scoreCopy.textContent = 'Keep filling the missing planning lanes until the blueprint is complete.'
  } else if (total >= 85 && weakCount === 0) {
    scoreCopy.textContent = 'This plan is launch-ready. The logistics, visibility, and recycler handoff are well aligned.'
  } else if (total >= 65) {
    scoreCopy.textContent = 'The plan is viable but still has weak spots that could reduce trust or collection quality.'
  } else {
    scoreCopy.textContent = 'The event concept is still fragile. Strengthen the operational choices before launch.'
  }

  if (!allSelected) {
    summaryTitle.textContent = 'Partial blueprint'
    summaryCopy.textContent = `${chosen.length} of ${Object.keys(selections).length} planning lanes are filled.`
  } else {
    const venue = selections.venue.title
    const partner = selections.partner.title
    const outreach = selections.outreach.title
    summaryTitle.textContent = `${venue} + ${partner}`
    summaryCopy.textContent = `Current plan uses ${venue.toLowerCase()}, ${partner.toLowerCase()}, and ${outreach.toLowerCase()} to drive turnout.`
  }

  const fix = strongestMissingSelection()
  fixTitle.textContent = fix.title
  fixCopy.textContent = fix.copy

  if (!allSelected) {
    launchStatus.innerHTML = `
      <div class="eyebrow">Status Feed</div>
      <h3>Draft mode</h3>
      <p>Your plan is still incomplete. Aim for a visible site, trusted recycler, separated bins, active outreach, and enough volunteers to guide participants.</p>
    `
    return
  }

  if (total >= 85 && weakCount === 0) {
    launchStatus.innerHTML = `
      <div class="eyebrow">Status Feed</div>
      <h3>Launch-ready configuration</h3>
      <p>This drive is operationally strong. The site is accessible, the partner is credible, the materials are separated, and the staffing pattern can handle participant flow.</p>
    `
    return
  }

  if (total >= 65) {
    launchStatus.innerHTML = `
      <div class="eyebrow">Status Feed</div>
      <h3>Usable but exposed</h3>
      <p>The event can run, but at least one weak choice may reduce turnout, sorting quality, or post-collection trust. Upgrade the weakest lane before launch day if possible.</p>
    `
    return
  }

  launchStatus.innerHTML = `
    <div class="eyebrow">Status Feed</div>
    <h3>High-risk setup</h3>
    <p>The blueprint still leans on weak operational choices. Rework the recycler, bins, or venue before calling this a public collection drive.</p>
  `
}

function init() {
  Object.entries(plannerData).forEach(([sectionKey, options]) => {
    options.forEach((option) => {
      grids[sectionKey].appendChild(renderChoice(sectionKey, option))
    })
  })

  updatePlanner()
}

init()
