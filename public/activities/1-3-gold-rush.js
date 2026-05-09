// --- DATA ---
const METALS = {
    gold: { name: 'Gold', symbol: 'Au', price: 6200, unit: 'g', color: '#f59e0b' },
    silver: { name: 'Silver', symbol: 'Ag', price: 75, unit: 'g', color: '#94a3b8' },
    copper: { name: 'Copper', symbol: 'Cu', price: 0.8, unit: 'g', color: '#ea580c' },
    palladium: { name: 'Palladium', symbol: 'Pd', price: 4500, unit: 'g', color: '#8b5cf6' }
};

const DEVICES = [
    { id: 'phone', name: 'Smartphones', icon: '📱', gold: 0.034, silver: 0.35, copper: 16, palladium: 0.015, weight: 0.17 },
    { id: 'laptop', name: 'Laptops', icon: '💻', gold: 0.19, silver: 1.2, copper: 150, palladium: 0.06, weight: 2.2 },
    { id: 'desktop', name: 'Desktops', icon: '🖥️', gold: 0.5, silver: 3.5, copper: 500, palladium: 0.15, weight: 10 },
    { id: 'tablet', name: 'Tablets', icon: '📟', gold: 0.05, silver: 0.5, copper: 40, palladium: 0.02, weight: 0.5 },
    { id: 'watch', name: 'Smartwatches', icon: '⌚', gold: 0.01, silver: 0.1, copper: 5, palladium: 0.005, weight: 0.05 },
    { id: 'buds', name: 'Earbuds', icon: '🎧', gold: 0.005, silver: 0.05, copper: 2, palladium: 0.002, weight: 0.02 }
];

const ENV_FACTORS = {
    co2: 15,    // kg CO2 per kg e-waste saved
    water: 120, // Litres per kg
    energy: 8,  // kWh per kg
    landfill: 1 // kg per kg
};

const MILESTONES = [
    { threshold: 1, text: "Goal: Start your collection" },
    { threshold: 10, text: "Goal: Fill a small box" },
    { threshold: 50, text: "Goal: Urban Miner Apprentice" },
    { threshold: 100, text: "Goal: Enough gold for a wedding ring!" },
    { threshold: 500, text: "Goal: Extraction Specialist" },
    { threshold: 1000, text: "Goal: Regional Recovery Hub" }
];

// --- STATE ---
let inventory = {
    phone: 0, laptop: 0, desktop: 0, tablet: 0, watch: 0, buds: 0
};

// --- INITIALIZATION ---
function init() {
    renderTicker();
    renderDeviceGrid();
    renderYieldList();
    updateCalculations();
}

function renderTicker() {
    const ticker = document.getElementById('ticker');
    const items = Object.values(METALS).map(m => {
        const change = (Math.random() > 0.5 ? '+' : '-') + (Math.random() * 2).toFixed(2) + '%';
        const colorClass = change.startsWith('+') ? 'text-emerald-400' : 'text-red-400';
        return `<span class="mx-8">${m.name} (${m.symbol}): <span class="text-white">₹${m.price.toLocaleString()}</span> <span class="${colorClass}">${change}</span></span>`;
    });
    ticker.innerHTML = items.join('') + items.join(''); // Double for seamless loop
}

function renderDeviceGrid() {
    const grid = document.getElementById('device-grid');
    grid.innerHTML = DEVICES.map(d => `
        <div class="device-card" id="card-${d.id}">
            <span class="text-3xl block mb-2">${d.icon}</span>
            <p class="text-[10px] font-bold text-[var(--muted)] uppercase mb-3">${d.name}</p>
            <div class="stepper">
                <button onclick="changeCount('${d.id}', -1)">−</button>
                <input type="number" id="input-${d.id}" value="0" min="0" onchange="setCount('${d.id}', this.value)">
                <button onclick="changeCount('${d.id}', 1)">+</button>
            </div>
        </div>
    `).join('');
}

function renderYieldList() {
    const list = document.getElementById('yield-list');
    list.innerHTML = Object.keys(METALS).map(key => `
        <div class="space-y-2">
            <div class="flex justify-between items-end">
                <span class="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">${METALS[key].name} (${METALS[key].symbol})</span>
                <span class="text-sm font-black" id="val-${key}">0.000 g</span>
            </div>
            <div class="yield-bar-track">
                <div class="yield-bar-fill" id="bar-${key}" style="background: ${METALS[key].color}"></div>
            </div>
        </div>
    `).join('');
}

// --- LOGIC ---
window.changeCount = (id, delta) => {
    inventory[id] = Math.max(0, inventory[id] + delta);
    document.getElementById(`input-${id}`).value = inventory[inventory[id]]; // Fix: this was buggy, let's use the value
    syncUI(id);
    updateCalculations();
};

// Fixed changeCount
window.changeCount = (id, delta) => {
    const input = document.getElementById(`input-${id}`);
    let val = parseInt(input.value) || 0;
    val = Math.max(0, val + delta);
    input.value = val;
    inventory[id] = val;
    syncUI(id);
    updateCalculations();
};

window.setCount = (id, val) => {
    inventory[id] = Math.max(0, parseInt(val) || 0);
    syncUI(id);
    updateCalculations();
};

function syncUI(id) {
    const card = document.getElementById(`card-${id}`);
    if (inventory[id] > 0) card.classList.add('active');
    else card.classList.remove('active');
}

function updateCalculations() {
    let totals = { gold: 0, silver: 0, copper: 0, palladium: 0, weight: 0 };
    let totalDevices = 0;

    DEVICES.forEach(d => {
        const count = inventory[d.id];
        totalDevices += count;
        totals.gold += count * d.gold;
        totals.silver += count * d.silver;
        totals.copper += count * d.copper;
        totals.palladium += count * d.palladium;
        totals.weight += count * d.weight;
    });

    // Update Yields
    Object.keys(METALS).forEach(key => {
        const valEl = document.getElementById(`val-${key}`);
        const barEl = document.getElementById(`bar-${key}`);
        const val = totals[key];
        valEl.textContent = val.toFixed(key === 'copper' ? 1 : 3) + ' g';
        
        // Scale bar (normalized to a reasonable max)
        const max = key === 'copper' ? 5000 : 50;
        const pct = Math.min(100, (val / max) * 100);
        barEl.style.width = pct + '%';
    });

    // Update Value
    let totalValue = 0;
    const breakdown = Object.keys(METALS).map(key => {
        const val = totals[key] * METALS[key].price;
        totalValue += val;
        return `<span>${METALS[key].symbol}: ₹${Math.round(val).toLocaleString()}</span>`;
    });
    
    document.getElementById('total-value').textContent = '₹' + Math.round(totalValue).toLocaleString();
    document.getElementById('value-breakdown').innerHTML = breakdown.join('');

    // Update Env
    document.getElementById('env-co2').textContent = (totals.weight * ENV_FACTORS.co2).toFixed(1) + ' kg';
    document.getElementById('env-water').textContent = Math.round(totals.weight * ENV_FACTORS.water).toLocaleString() + ' L';
    document.getElementById('env-energy').textContent = Math.round(totals.weight * ENV_FACTORS.energy).toLocaleString() + ' kWh';
    document.getElementById('env-landfill').textContent = totals.weight.toFixed(1) + ' kg';

    // Update Milestones
    const milestone = [...MILESTONES].reverse().find(m => totalDevices >= m.threshold) || MILESTONES[0];
    document.getElementById('milestone-text').textContent = milestone.text;
}

document.getElementById('generate-cert').onclick = () => {
    alert("Impact Certificate Generated! (In a production app, this would download a high-res PDF summary of your environmental savings).");
};

init();
