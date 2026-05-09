const DEVICES = {
    phone: {
        name: 'Smartphone',
        icon: '📱',
        baseLifespan: 2.0,  // years
        weight: 0.18,        // kg
        mfgCO2: 70,          // kg CO2
        mfgEnergy: 270,      // kWh
        replaceCost: 15000,  // ₹
    },
    laptop: {
        name: 'Laptop',
        icon: '💻',
        baseLifespan: 3.0,
        weight: 2.0,
        mfgCO2: 350,
        mfgEnergy: 1200,
        replaceCost: 45000,
    },
    tablet: {
        name: 'Tablet',
        icon: '📟',
        baseLifespan: 2.5,
        weight: 0.45,
        mfgCO2: 120,
        mfgEnergy: 400,
        replaceCost: 20000,
    },
};

const MAINTENANCE_ACTIONS = [
    { id: 'case',     icon: '🛡️', name: 'Use a Case',           months: 6,  tip: 'Physical protection prevents 40% of premature replacements.' },
    { id: 'battery',  icon: '🔋', name: 'Battery Care',          months: 8,  tip: 'Avoid deep discharge cycles and extreme heat.' },
    { id: 'storage',  icon: '💾', name: 'Clean Storage',         months: 4,  tip: 'Remove unused apps and clear cache regularly.' },
    { id: 'display',  icon: '🖥️', name: 'Screen Protector',      months: 6,  tip: 'A cracked screen is the #1 reason people replace phones.' },
    { id: 'os',       icon: '⚙️', name: 'OS Optimization',       months: 5,  tip: 'Disable bloatware and limit background processes.' },
    { id: 'repair',   icon: '🔧', name: 'Component Repair',      months: 9,  tip: 'Replacing a battery costs 10x less than a new device.' },
];

let selectedDeviceId = 'phone';
let activeActions = new Set();

function init() {
    renderActions();
    updateUI();

    // Device selection listeners
    document.querySelectorAll('.device-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.device-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedDeviceId = btn.dataset.device;
            updateUI();
        });
    });
}

function renderActions() {
    const grid = document.getElementById('action-grid');
    grid.innerHTML = '';
    
    MAINTENANCE_ACTIONS.forEach(action => {
        const card = document.createElement('button');
        card.className = 'action-card';
        card.dataset.action = action.id;
        card.innerHTML = `
            <div class="toggle-switch"><div class="toggle-dot"></div></div>
            <div class="flex-1">
                <p class="font-bold flex items-center gap-2"><span>${action.icon}</span> ${action.name}</p>
                <p class="text-xs text-muted">+${action.months} months life</p>
            </div>
        `;
        
        card.addEventListener('click', () => {
            if (activeActions.has(action.id)) {
                activeActions.delete(action.id);
                card.classList.remove('active');
            } else {
                activeActions.add(action.id);
                card.classList.add('active');
            }
            document.getElementById('action-tip').textContent = action.tip;
            updateUI();
        });
        
        grid.appendChild(card);
    });
}

function updateUI() {
    const device = DEVICES[selectedDeviceId];
    let addedMonths = 0;
    
    activeActions.forEach(actionId => {
        const action = MAINTENANCE_ACTIONS.find(a => a.id === actionId);
        addedMonths += action.months;
    });
    
    const addedYears = addedMonths / 12;
    const totalLifespan = device.baseLifespan + addedYears;
    
    // Update lifespan display
    document.getElementById('current-lifespan').innerHTML = `${totalLifespan.toFixed(1)} <span class="text-lg">yrs</span>`;
    document.getElementById('lifespan-bonus').textContent = `+${addedYears.toFixed(1)} years added`;
    
    // Update timeline bars (scale to 10 years max)
    const baseWidth = (device.baseLifespan / 10) * 100;
    const extendedWidth = (totalLifespan / 10) * 100;
    
    gsap.to('#bar-base', { width: `${baseWidth}%`, duration: 0.6 });
    gsap.to('#bar-extended', { width: `${extendedWidth}%`, duration: 0.8, ease: 'back.out(1.2)' });
    
    // Calculate Impacts
    // CO2 saved: proportion of manufacturing footprint saved by NOT buying a new device sooner
    const co2Saved = (addedYears / device.baseLifespan) * device.mfgCO2;
    // Energy saved: similar logic
    const energySaved = (addedYears / device.baseLifespan) * device.mfgEnergy;
    // Waste delayed: device weight
    const wasteDelayed = addedYears > 0 ? device.weight : 0;
    // Money saved: proportion of replacement cost
    const moneySaved = (addedYears / device.baseLifespan) * device.replaceCost;
    
    animateValue('stat-co2', co2Saved, 1);
    animateValue('stat-waste', wasteDelayed, 2);
    animateValue('stat-energy', energySaved, 0);
    document.getElementById('stat-money').textContent = `₹${Math.round(moneySaved).toLocaleString()}`;
}

function animateValue(id, targetValue, decimals = 0) {
    const el = document.getElementById(id);
    const startValue = parseFloat(el.textContent) || 0;
    
    const obj = { val: startValue };
    gsap.to(obj, {
        val: targetValue,
        duration: 0.8,
        onUpdate: () => {
            el.textContent = obj.val.toFixed(decimals);
        }
    });
}

init();
