// --- DATA ---
const METAL_YIELD = {
    phone:   { gold: 0.034, silver: 0.34, copper: 15.0,   palladium: 0.015 },
    laptop:  { gold: 0.25,  silver: 1.0,  copper: 500.0,  palladium: 0.08  },
    desktop: { gold: 0.20,  silver: 0.80, copper: 1500.0, palladium: 0.06  },
    tablet:  { gold: 0.015, silver: 0.20, copper: 30.0,   palladium: 0.01  }
};

const MARKET_PRICE = { gold: 7200, silver: 85, copper: 0.80, palladium: 3500 }; // ₹ per gram

const ENV_SAVINGS = {
    phone:   { co2: 1.2,  water: 18,  energy: 7,  landfill: 0.08 },
    laptop:  { co2: 4.8,  water: 120, energy: 42, landfill: 0.35 },
    desktop: { co2: 6.2,  water: 180, energy: 58, landfill: 0.55 },
    tablet:  { co2: 2.1,  water: 45,  energy: 15, landfill: 0.12 }
};

// Max values for bar scaling
const BAR_MAX = { gold: 50, silver: 200, copper: 30000, palladium: 20 };

// --- STATE ---
let devices = { phone: 0, laptop: 0, desktop: 0, tablet: 0 };

// --- DOM ---
const els = {
    totalDevices: document.getElementById('total-devices'),
    barGold: document.getElementById('bar-gold'),
    barSilver: document.getElementById('bar-silver'),
    barCopper: document.getElementById('bar-copper'),
    barPalladium: document.getElementById('bar-palladium'),
    valGold: document.getElementById('val-gold'),
    valSilver: document.getElementById('val-silver'),
    valCopper: document.getElementById('val-copper'),
    valPalladium: document.getElementById('val-palladium'),
    compDevices: document.getElementById('comp-devices'),
    compGoldFromDevices: document.getElementById('comp-gold-from-devices'),
    compOre: document.getElementById('comp-ore'),
    compSentence: document.getElementById('comp-sentence'),
    totalValue: document.getElementById('total-value'),
    valueBreakdown: document.getElementById('value-breakdown'),
    funComparison: document.getElementById('fun-comparison'),
    envCo2: document.getElementById('env-co2'),
    envWater: document.getElementById('env-water'),
    envEnergy: document.getElementById('env-energy'),
    envLandfill: document.getElementById('env-landfill')
};

// --- INIT ---
function init() {
    // Bind stepper buttons
    document.querySelectorAll('.stepper button').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.device-card');
            const input = card.querySelector('input');
            const device = input.dataset.input;
            const action = btn.dataset.action;
            let val = parseInt(input.value) || 0;

            if (action === 'inc') val = Math.min(500, val + 1);
            if (action === 'dec') val = Math.max(0, val - 1);

            input.value = val;
            devices[device] = val;
            card.classList.toggle('has-value', val > 0);
            recalculate();
        });
    });

    // Bind direct input
    document.querySelectorAll('.stepper input').forEach(input => {
        input.addEventListener('input', () => {
            const device = input.dataset.input;
            let val = parseInt(input.value) || 0;
            val = Math.max(0, Math.min(500, val));
            devices[device] = val;
            const card = input.closest('.device-card');
            card.classList.toggle('has-value', val > 0);
            recalculate();
        });
    });
}

// --- CALCULATION ENGINE ---
function recalculate() {
    const total = devices.phone + devices.laptop + devices.desktop + devices.tablet;
    els.totalDevices.textContent = total;

    // Calculate yields
    const yield_ = { gold: 0, silver: 0, copper: 0, palladium: 0 };
    for (const [device, count] of Object.entries(devices)) {
        for (const metal of ['gold', 'silver', 'copper', 'palladium']) {
            yield_[metal] += METAL_YIELD[device][metal] * count;
        }
    }

    // Update yield bars
    updateYieldBar('gold', yield_.gold);
    updateYieldBar('silver', yield_.silver);
    updateYieldBar('copper', yield_.copper);
    updateYieldBar('palladium', yield_.palladium);

    // Update text values
    els.valGold.textContent = formatGrams(yield_.gold);
    els.valSilver.textContent = formatGrams(yield_.silver);
    els.valCopper.textContent = yield_.copper >= 1000 ? (yield_.copper / 1000).toFixed(2) + ' kg' : formatGrams(yield_.copper);
    els.valPalladium.textContent = formatGrams(yield_.palladium);

    // Mining comparison (gold-focused)
    const oreNeededKg = (yield_.gold / 5) * 1000; // 5g per tonne of ore
    els.compDevices.textContent = total;
    els.compGoldFromDevices.textContent = `containing ${formatGrams(yield_.gold)} of gold`;
    els.compOre.textContent = oreNeededKg >= 1000
        ? (oreNeededKg / 1000).toFixed(1) + ' tonnes'
        : oreNeededKg.toFixed(1) + ' kg';

    if (total > 0) {
        els.compSentence.innerHTML = `Your <strong>${total} devices</strong> yield <strong>${formatGrams(yield_.gold)}</strong> of gold. Traditional mining would need to dig through <strong>${els.compOre.textContent}</strong> of rock for the same amount.`;
    } else {
        els.compSentence.textContent = 'Add devices above to see the comparison.';
    }

    // Market value
    const values = {
        gold: yield_.gold * MARKET_PRICE.gold,
        silver: yield_.silver * MARKET_PRICE.silver,
        copper: yield_.copper * MARKET_PRICE.copper,
        palladium: yield_.palladium * MARKET_PRICE.palladium
    };
    const totalVal = values.gold + values.silver + values.copper + values.palladium;

    animateCounter(els.totalValue, totalVal);
    els.valueBreakdown.innerHTML = `
        <span>Au: ₹${Math.round(values.gold).toLocaleString('en-IN')}</span>
        <span>Ag: ₹${Math.round(values.silver).toLocaleString('en-IN')}</span>
        <span>Cu: ₹${Math.round(values.copper).toLocaleString('en-IN')}</span>
        <span>Pd: ₹${Math.round(values.palladium).toLocaleString('en-IN')}</span>
    `;

    // Fun comparison
    if (totalVal > 0) {
        const textbooks = Math.floor(totalVal / 500);
        const meals = Math.floor(totalVal / 80);
        if (textbooks > 0) {
            els.funComparison.textContent = `That's enough to buy ${textbooks} new textbooks 📚`;
        } else {
            els.funComparison.textContent = `That's worth about ${meals} school meals 🍱`;
        }
    } else {
        els.funComparison.textContent = 'Add devices to see what this could buy 📚';
    }

    // Environmental savings
    const env = { co2: 0, water: 0, energy: 0, landfill: 0 };
    for (const [device, count] of Object.entries(devices)) {
        env.co2 += ENV_SAVINGS[device].co2 * count;
        env.water += ENV_SAVINGS[device].water * count;
        env.energy += ENV_SAVINGS[device].energy * count;
        env.landfill += ENV_SAVINGS[device].landfill * count;
    }

    animateCounterText(els.envCo2, env.co2, 1);
    animateCounterText(els.envWater, env.water, 0);
    animateCounterText(els.envEnergy, env.energy, 0);
    animateCounterText(els.envLandfill, env.landfill, 1);
}

// --- HELPERS ---
function formatGrams(val) {
    if (val >= 1000) return (val / 1000).toFixed(2) + ' kg';
    if (val >= 1) return val.toFixed(2) + ' g';
    if (val >= 0.001) return val.toFixed(3) + ' g';
    return '0.000 g';
}

function updateYieldBar(metal, value) {
    const bar = els['bar' + metal.charAt(0).toUpperCase() + metal.slice(1)];
    const pct = Math.min(100, (value / BAR_MAX[metal]) * 100);
    bar.style.width = pct + '%';
}

function animateCounter(el, targetVal) {
    const currentText = el.textContent.replace(/[₹,\s]/g, '');
    const current = parseFloat(currentText) || 0;

    gsap.to({ val: current }, {
        val: targetVal,
        duration: 0.8,
        ease: 'power2.out',
        onUpdate: function () {
            const v = Math.round(this.targets()[0].val);
            el.textContent = '₹' + v.toLocaleString('en-IN');
        }
    });
}

function animateCounterText(el, targetVal, decimals) {
    const current = parseFloat(el.textContent.replace(/,/g, '')) || 0;

    gsap.to({ val: current }, {
        val: targetVal,
        duration: 0.8,
        ease: 'power2.out',
        onUpdate: function () {
            const v = this.targets()[0].val;
            el.textContent = decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString('en-IN');
        }
    });
}

// START
init();
