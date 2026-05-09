// --- DATA: Simplified World Map (Low-poly paths) ---
// For brevity, using a representative coordinate system for flows and hotspots.
const HOTSPOTS = [
    { id: 'ghana', name: 'Agbogbloshie, Ghana', region: 'Greater Accra', x: 485, y: 280, impact: 'Extreme', labor: '40k+', desc: 'Once the largest e-waste dump in Africa, known for hazardous open-air burning of cables to recover copper.' },
    { id: 'guiyu', name: 'Guiyu, China', region: 'Guangdong', x: 805, y: 195, impact: 'High', labor: '100k+', desc: 'A historic hub where millions of circuit boards were processed. Recent formalization has shifted much of the informal work.' },
    { id: 'delhi', name: 'Seelampur, India', region: 'New Delhi', x: 700, y: 205, impact: 'Very High', labor: '50k+', desc: 'Indias largest informal e-waste market, where thousands of people dismantle electronics by hand.' },
    { id: 'lagos', name: 'Lagos, Nigeria', region: 'Alaba International', x: 505, y: 275, impact: 'High', labor: '25k+', desc: 'A major port of entry for "second-hand" electronics, many of which are non-functional and end up in dumps.' }
];

const FLOWS = [
    { from: [200, 140], to: [485, 280], type: 'informal' }, // USA -> Ghana
    { from: [480, 110], to: [485, 280], type: 'formal' },   // EU -> Ghana
    { from: [200, 140], to: [805, 195], type: 'formal' },   // USA -> China
    { from: [850, 150], to: [805, 195], type: 'formal' },   // Japan -> China
    { from: [480, 110], to: [700, 205], type: 'informal' }, // EU -> India
    { from: [200, 140], to: [280, 190], type: 'formal' },   // USA -> Mexico
    { from: [480, 110], to: [505, 275], type: 'informal' }  // EU -> Nigeria
];

// --- DATA: Simplified World Map (Low-poly paths) ---
const WORLD_PATH = "M204,117 L216,117 L226,127 L226,137 L216,147 L196,147 L186,137 L186,127 Z M470,100 L500,100 L510,110 L510,140 L490,160 L460,160 L450,140 L450,110 Z M460,250 L490,250 L510,270 L510,310 L490,330 L460,330 L440,310 L440,270 Z M650,180 L730,180 L750,200 L750,240 L730,260 L650,260 L630,240 L630,200 Z M780,180 L840,180 L860,200 L860,240 L840,260 L780,260 L760,240 L760,200 Z"; // Simplified placeholder paths for continents

async function loadMap() {
    const countriesGroup = document.getElementById('map-countries');
    
    // Instead of fetch, we use a slightly more robust way to render the landmasses
    // In a real app, you'd use a full GeoJSON, but for this activity, we prioritize stability.
    const continents = [
        { name: 'Americas', d: "M50,100 L250,100 L300,200 L250,450 L150,450 L100,300 Z" },
        { name: 'Eurasia', d: "M350,50 L950,50 L980,250 L800,400 L400,400 L350,250 Z" },
        { name: 'Africa', d: "M400,220 L600,220 L620,450 L500,480 L420,400 Z" },
        { name: 'Australia', d: "M800,350 L950,350 L950,450 L800,450 Z" }
    ];

    continents.forEach(c => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('class', 'land');
        path.setAttribute('d', c.d);
        countriesGroup.appendChild(path);
    });

    renderHotspots();
    animateFlow();
}

function renderHotspots() {
    const group = document.getElementById('hotspots');
    HOTSPOTS.forEach(spot => {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('class', 'hotspot');
        g.onclick = () => showInfo(spot);

        const pulse = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        pulse.setAttribute('cx', spot.x); pulse.setAttribute('cy', spot.y);
        pulse.setAttribute('r', '8');
        pulse.setAttribute('class', 'hotspot-pulse');
        
        const core = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        core.setAttribute('cx', spot.x); core.setAttribute('cy', spot.y);
        core.setAttribute('r', '4');
        core.setAttribute('class', 'hotspot-core');

        g.appendChild(pulse);
        g.appendChild(core);
        group.appendChild(g);

        // Animate pulse
        gsap.to(pulse, {
            r: 15,
            opacity: 0,
            duration: 2,
            repeat: -1,
            ease: 'power1.out'
        });
    });
}

function animateFlow(filter = 'all') {
    const group = document.getElementById('flow-lines');
    group.innerHTML = '';

    FLOWS.forEach((flow, i) => {
        if (filter !== 'all' && flow.type !== filter) return;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('class', `flow-line ${flow.type}`);
        
        // Quadratic curve for arc effect
        const mx = (flow.from[0] + flow.to[0]) / 2;
        const my = Math.min(flow.from[1], flow.to[1]) - 50;
        const d = `M${flow.from[0]},${flow.from[1]} Q${mx},${my} ${flow.to[0]},${flow.to[1]}`;
        
        path.setAttribute('d', d);
        group.appendChild(path);

        gsap.to(path, {
            strokeDashoffset: 0,
            duration: 2,
            delay: i * 0.2,
            ease: 'power2.inOut'
        });
    });
}

function showInfo(spot) {
    const panel = document.getElementById('info-panel');
    document.getElementById('info-title').textContent = spot.name;
    document.getElementById('info-region').textContent = spot.region;
    document.getElementById('info-desc').textContent = spot.desc;
    document.getElementById('stat-impact').textContent = spot.impact;
    document.getElementById('stat-labor').textContent = spot.labor;
    
    panel.classList.add('active');
}

// --- CONTROLS ---
document.querySelectorAll('.control-btn[data-flow]').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.control-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        animateFlow(btn.dataset.flow);
    });
});

// START
loadMap();
