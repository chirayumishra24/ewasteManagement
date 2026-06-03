// --- DATA ---
const METALS = {
    gold: { name: 'Gold', symbol: 'Au', price: 6200, unit: 'g', color: '#facc15' },
    silver: { name: 'Silver', symbol: 'Ag', price: 75, unit: 'g', color: '#cbd5e1' },
    copper: { name: 'Copper', symbol: 'Cu', price: 0.8, unit: 'g', color: '#ea580c' },
    palladium: { name: 'Palladium', symbol: 'Pd', price: 4500, unit: 'g', color: '#a78bfa' }
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

const THREE_SCENES = {};

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
        const colorClass = change.startsWith('+') ? 'ticker-up' : 'ticker-down';
        return `<span class="ticker-item">${m.name} (${m.symbol}): <span class="ticker-price">₹${m.price.toLocaleString()}</span> <span class="${colorClass}">${change}</span></span>`;
    });
    ticker.innerHTML = items.join('') + items.join(''); // Double for seamless loop
}

function renderDeviceGrid() {
    const grid = document.getElementById('device-grid');
    grid.innerHTML = DEVICES.map(d => `
        <div class="device-card" id="card-${d.id}">
            <div class="device-canvas-container">
                <canvas id="canvas-${d.id}"></canvas>
                <div class="drag-hint">3D DRAG</div>
            </div>
            <p class="device-card-title">${d.name}</p>
            <div class="stepper">
                <button onclick="changeCount('${d.id}', -1)">−</button>
                <input type="number" id="input-${d.id}" value="0" min="0" onchange="setCount('${d.id}', this.value)">
                <button onclick="changeCount('${d.id}', 1)">+</button>
            </div>
        </div>
    `).join('');

    // Initialize 3D models
    DEVICES.forEach(d => {
        initDevice3DModel(d.id);
    });
}

function renderYieldList() {
    const list = document.getElementById('yield-list');
    list.innerHTML = Object.keys(METALS).map(key => `
        <div class="yield-item">
            <div class="yield-header">
                <span class="yield-label">${METALS[key].name} (${METALS[key].symbol})</span>
                <span class="yield-value" id="val-${key}">0.000 g</span>
            </div>
            <div class="yield-bar-track">
                <div class="yield-bar-fill" id="bar-${key}" style="background: ${METALS[key].color}"></div>
            </div>
        </div>
    `).join('');
}

// --- PROCEDURAL TEXTURES FOR VISUAL FIDELITY ---
function createProceduralScreenTexture(id) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    if (id === 'phone') {
        // Light theme phone UI
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(0, 0, 256, 256);
        
        // Status bar
        ctx.fillStyle = '#1A1A2E';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('10:42', 15, 25);
        
        // Signal / battery icons
        ctx.fillRect(195, 14, 4, 12);
        ctx.fillRect(203, 11, 4, 15);
        ctx.fillRect(211, 8, 4, 18);
        ctx.fillRect(221, 8, 16, 18);
        
        // App icons grid
        const colors = ['#1e40af', '#15803d', '#f59e0b', '#7c3AED', '#ea580c', '#b91c1c'];
        let idx = 0;
        for (let y = 50; y < 200; y += 50) {
            for (let x = 25; x < 230; x += 55) {
                ctx.fillStyle = colors[idx % colors.length];
                ctx.beginPath();
                ctx.arc(x + 20, y + 20, 18, 0, Math.PI * 2);
                ctx.fill();
                idx++;
            }
        }
        
        // Navigation gesture bar
        ctx.fillStyle = '#1A1A2E';
        ctx.fillRect(60, 240, 136, 6);
    } 
    else if (id === 'laptop') {
        // Code editor screen
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, 256, 256);
        
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 13px monospace';
        ctx.fillText('class UrbanMiner {', 15, 30);
        ctx.fillText('  constructor() {', 15, 50);
        ctx.fillText('    this.yield = 100;', 15, 70);
        ctx.fillText('  }', 15, 90);
        
        ctx.fillStyle = '#a78bfa';
        ctx.fillText('  extractGold() {', 15, 120);
        ctx.fillText('    return "0.034g";', 15, 140);
        ctx.fillText('  }', 15, 160);
        ctx.fillText('}', 15, 180);
        
        // Little terminal output at bottom
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(10, 200, 236, 45);
        ctx.fillStyle = '#4ade80';
        ctx.fillText('> extraction ready...', 20, 228);
    } 
    else if (id === 'desktop') {
        // Dashboard / charts
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, 256, 256);
        
        // Header
        ctx.fillStyle = '#1E40AF';
        ctx.fillRect(0, 0, 256, 50);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('RECOVERY MONITOR', 15, 32);
        
        // Chart bars
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(30, 80, 45, 130);
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(90, 110, 45, 100);
        ctx.fillStyle = '#ea580c';
        ctx.fillRect(150, 60, 45, 150);
        ctx.fillStyle = '#a78bfa';
        ctx.fillRect(210, 130, 30, 80);
        
        // X axis line
        ctx.fillStyle = '#1A1A2E';
        ctx.fillRect(15, 210, 226, 4);
    } 
    else if (id === 'tablet') {
        // Drawing canvas
        ctx.fillStyle = '#FFFDF7';
        ctx.fillRect(0, 0, 256, 256);
        
        // Draw green circuit paths
        ctx.strokeStyle = '#2bc1a6';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.beginPath();
        ctx.moveTo(40, 50);
        ctx.lineTo(120, 50);
        ctx.lineTo(160, 110);
        ctx.lineTo(160, 180);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(120, 50);
        ctx.lineTo(80, 110);
        ctx.lineTo(80, 200);
        ctx.stroke();
        
        // Draw circular nodes
        ctx.fillStyle = '#FACC15';
        ctx.strokeStyle = '#1A1A2E';
        ctx.lineWidth = 3;
        
        const nodes = [[40, 50], [160, 180], [80, 200]];
        nodes.forEach(n => {
            ctx.beginPath();
            ctx.arc(n[0], n[1], 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        });
    } 
    else if (id === 'watch') {
        // Circular smartwatch face
        ctx.fillStyle = '#1A1A2E';
        ctx.fillRect(0, 0, 256, 256);
        
        ctx.fillStyle = '#FACC15';
        ctx.font = 'bold 50px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('10:42', 128, 115);
        
        ctx.fillStyle = '#2bc1a6';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText('ACTIVE', 128, 155);
        
        // Progress circular ring
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.arc(128, 128, 90, -Math.PI / 2, Math.PI);
        ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}

function createKeyboardTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#2D2D44'; // Base keyboard gray
    ctx.fillRect(0, 0, 256, 128);
    
    ctx.fillStyle = '#1A1A2E'; // Keycap color
    const rows = 5;
    const cols = 15;
    const kw = 12;
    const kh = 14;
    const gap = 4;
    
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            ctx.fillRect(10 + c * (kw + gap), 10 + r * (kh + gap), kw, kh);
        }
    }
    
    return new THREE.CanvasTexture(canvas);
}

// --- THREE.JS 3D MODELS ---
function initDevice3DModel(id) {
    const canvas = document.getElementById(`canvas-${id}`);
    if (!canvas) return;

    const width = canvas.clientWidth || 120;
    const height = canvas.clientHeight || 112;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10);
    camera.position.z = 4.8;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height, false);

    // Warm, comic style lights
    const ambientLight = new THREE.AmbientLight(0xfffdf7, 0.75); // Warm cream ambient light
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.9); // Main direct key light
    dirLight1.position.set(5, 8, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xfacc15, 0.35); // Warm yellow fill light for reflections
    dirLight2.position.set(-5, -3, -2);
    scene.add(dirLight2);

    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // Materials suited for light theme
    const metalMaterial = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.8, roughness: 0.18 });
    const goldAccent = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.85, roughness: 0.12 });
    const whiteGlossy = new THREE.MeshStandardMaterial({ color: 0xfbfbfb, metalness: 0.15, roughness: 0.1 });
    const darkPlastic = new THREE.MeshStandardMaterial({ color: 0x1A1A2E, metalness: 0.2, roughness: 0.35 });

    // Build the specific improved model geometries
    if (id === 'phone') {
        const phoneGroup = new THREE.Group();

        // Phone body chassis
        const bodyGeom = new THREE.BoxGeometry(1.3, 2.5, 0.12);
        const body = new THREE.Mesh(bodyGeom, metalMaterial);
        phoneGroup.add(body);

        // Screen display
        const screenGeom = new THREE.BoxGeometry(1.2, 2.38, 0.14);
        const screenMat = new THREE.MeshStandardMaterial({
            map: createProceduralScreenTexture('phone'),
            roughness: 0.15
        });
        const screen = new THREE.Mesh(screenGeom, screenMat);
        screen.position.z = 0.005;
        phoneGroup.add(screen);

        // Camera bump on the back
        const camBumpGeom = new THREE.BoxGeometry(0.45, 0.45, 0.04);
        const camBump = new THREE.Mesh(camBumpGeom, darkPlastic);
        camBump.position.set(-0.3, 0.8, -0.07);
        phoneGroup.add(camBump);

        // Camera lenses
        for (let i = 0; i < 2; i++) {
            const lensGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.02, 16);
            const lens = new THREE.Mesh(lensGeom, metalMaterial);
            lens.rotation.x = Math.PI / 2;
            lens.position.set(-0.3, 0.8 + (i === 0 ? 0.1 : -0.1), -0.09);
            phoneGroup.add(lens);
        }

        // Side buttons
        const btnGeom1 = new THREE.BoxGeometry(0.03, 0.3, 0.04);
        const powerBtn = new THREE.Mesh(btnGeom1, goldAccent);
        powerBtn.position.set(0.66, 0.5, 0);
        phoneGroup.add(powerBtn);

        const btnGeom2 = new THREE.BoxGeometry(0.03, 0.5, 0.04);
        const volBtn = new THREE.Mesh(btnGeom2, goldAccent);
        volBtn.position.set(-0.66, 0.6, 0);
        phoneGroup.add(volBtn);

        modelGroup.add(phoneGroup);
    } 
    else if (id === 'laptop') {
        const laptopGroup = new THREE.Group();

        // Base chassis
        const baseGeom = new THREE.BoxGeometry(2.3, 0.08, 1.6);
        const base = new THREE.Mesh(baseGeom, metalMaterial);
        base.position.y = -0.5;
        laptopGroup.add(base);

        // Keyboard plate
        const keyboardGeom = new THREE.BoxGeometry(2.1, 0.02, 0.9);
        const keyboardMat = new THREE.MeshStandardMaterial({
            map: createKeyboardTexture(),
            roughness: 0.4
        });
        const keyboard = new THREE.Mesh(keyboardGeom, keyboardMat);
        keyboard.position.set(0, -0.45, 0.15);
        laptopGroup.add(keyboard);

        // Trackpad
        const trackpadGeom = new THREE.BoxGeometry(0.6, 0.01, 0.4);
        const trackpad = new THREE.Mesh(trackpadGeom, metalMaterial);
        trackpad.position.set(0, -0.45, -0.45);
        laptopGroup.add(trackpad);

        // Screen Lid Group (hinged at bottom-rear edge)
        const lidGroup = new THREE.Group();
        lidGroup.position.set(0, -0.5, -0.75);

        // Lid plate
        const lidGeom = new THREE.BoxGeometry(2.3, 1.5, 0.06);
        const lid = new THREE.Mesh(lidGeom, metalMaterial);
        lid.position.y = 0.75;
        lid.position.z = 0.03;
        lidGroup.add(lid);

        // Display
        const screenGeom = new THREE.BoxGeometry(2.18, 1.38, 0.07);
        const screenMat = new THREE.MeshStandardMaterial({
            map: createProceduralScreenTexture('laptop'),
            roughness: 0.1
        });
        const screen = new THREE.Mesh(screenGeom, screenMat);
        screen.position.y = 0.75;
        screen.position.z = 0.04;
        lidGroup.add(screen);

        // Logo on outer lid
        const logoGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.02, 6);
        const logo = new THREE.Mesh(logoGeom, goldAccent);
        logo.rotation.x = Math.PI / 2;
        logo.position.set(0, 0.75, -0.01);
        lidGroup.add(logo);

        lidGroup.rotation.x = -Math.PI / 2.5; // Opened angle
        laptopGroup.add(lidGroup);

        modelGroup.add(laptopGroup);
        modelGroup.position.y = 0.15;
    }
    else if (id === 'desktop') {
        const desktopGroup = new THREE.Group();

        // Monitor Display Unit
        const monitorGroup = new THREE.Group();
        monitorGroup.position.y = 0.3;

        const monitorGeom = new THREE.BoxGeometry(2.6, 1.6, 0.1);
        const monitorBody = new THREE.Mesh(monitorGeom, metalMaterial);
        monitorGroup.add(monitorBody);

        const screenGeom = new THREE.BoxGeometry(2.48, 1.48, 0.12);
        const screenMat = new THREE.MeshStandardMaterial({
            map: createProceduralScreenTexture('desktop'),
            roughness: 0.15
        });
        const screen = new THREE.Mesh(screenGeom, screenMat);
        screen.position.z = 0.01;
        monitorGroup.add(screen);

        desktopGroup.add(monitorGroup);

        // Stand Neck
        const neckGeom = new THREE.CylinderGeometry(0.08, 0.1, 0.7, 12);
        const neck = new THREE.Mesh(neckGeom, metalMaterial);
        neck.position.y = -0.5;
        desktopGroup.add(neck);

        // Stand Base
        const standBaseGeom = new THREE.BoxGeometry(1.1, 0.05, 0.9);
        const standBase = new THREE.Mesh(standBaseGeom, darkPlastic);
        standBase.position.y = -0.85;
        desktopGroup.add(standBase);

        // CPU Box sitting beside monitor
        const cpuGroup = new THREE.Group();
        cpuGroup.position.set(1.4, -0.3, -0.2);

        const cpuGeom = new THREE.BoxGeometry(0.6, 1.1, 1.1);
        const cpuBody = new THREE.Mesh(cpuGeom, metalMaterial);
        cpuGroup.add(cpuBody);

        // CPU Front panel
        const cpuFrontGeom = new THREE.BoxGeometry(0.58, 1.08, 0.02);
        const cpuFront = new THREE.Mesh(cpuFrontGeom, darkPlastic);
        cpuFront.position.z = 0.55;
        cpuGroup.add(cpuFront);

        // CPU Power button
        const powerBtnGeom = new THREE.SphereGeometry(0.05, 8, 8);
        const powerBtn = new THREE.Mesh(powerBtnGeom, goldAccent);
        powerBtn.position.set(0, 0.4, 0.57);
        cpuGroup.add(powerBtn);

        // Glass side panel
        const glassSideGeom = new THREE.BoxGeometry(0.02, 0.98, 0.98);
        const glassSideMat = new THREE.MeshStandardMaterial({
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.3,
            roughness: 0.1
        });
        const glassSide = new THREE.Mesh(glassSideGeom, glassSideMat);
        glassSide.position.x = -0.3;
        cpuGroup.add(glassSide);

        // Internal green PCB
        const pcbGeom = new THREE.BoxGeometry(0.01, 0.8, 0.8);
        const pcbMat = new THREE.MeshStandardMaterial({ color: 0x166534 });
        const pcb = new THREE.Mesh(pcbGeom, pcbMat);
        pcb.position.set(-0.25, 0, 0);
        cpuGroup.add(pcb);

        // Internal chips
        for (let j = 0; j < 3; j++) {
            const chipGeom = new THREE.BoxGeometry(0.02, 0.15, 0.15);
            const chip = new THREE.Mesh(chipGeom, goldAccent);
            chip.position.set(-0.24, -0.2 + j * 0.22, -0.1 + j * 0.1);
            cpuGroup.add(chip);
        }

        desktopGroup.add(cpuGroup);

        modelGroup.add(desktopGroup);
        modelGroup.position.y = 0.25;
    }
    else if (id === 'tablet') {
        const tabletGroup = new THREE.Group();

        // Tablet body
        const bodyGeom = new THREE.BoxGeometry(1.8, 2.5, 0.1);
        const body = new THREE.Mesh(bodyGeom, metalMaterial);
        tabletGroup.add(body);

        // Screen
        const screenGeom = new THREE.BoxGeometry(1.68, 2.38, 0.12);
        const screenMat = new THREE.MeshStandardMaterial({
            map: createProceduralScreenTexture('tablet'),
            roughness: 0.1
        });
        const screen = new THREE.Mesh(screenGeom, screenMat);
        screen.position.z = 0.005;
        tabletGroup.add(screen);

        // Front Camera Dot
        const camGeom = new THREE.SphereGeometry(0.03, 8, 8);
        const cameraDot = new THREE.Mesh(camGeom, darkPlastic);
        cameraDot.position.set(0, 1.22, 0.06);
        tabletGroup.add(cameraDot);

        // Stylus on the side
        const stylusGroup = new THREE.Group();
        stylusGroup.position.set(0.96, 0, 0);

        const stylusGeom = new THREE.CylinderGeometry(0.04, 0.04, 1.8, 8);
        const stylus = new THREE.Mesh(stylusGeom, whiteGlossy);
        stylusGroup.add(stylus);

        // Tip
        const stylusTipGeom = new THREE.CylinderGeometry(0.04, 0.001, 0.1, 8);
        const stylusTip = new THREE.Mesh(stylusTipGeom, darkPlastic);
        stylusTip.position.y = -0.95;
        stylusGroup.add(stylusTip);

        tabletGroup.add(stylusGroup);

        modelGroup.add(tabletGroup);
    }
    else if (id === 'watch') {
        const watchGroup = new THREE.Group();

        // Watch casing
        const bodyGeom = new THREE.CylinderGeometry(0.65, 0.65, 0.2, 32);
        const body = new THREE.Mesh(bodyGeom, goldAccent);
        body.rotation.x = Math.PI / 2;
        watchGroup.add(body);

        // Watch face screen
        const faceGeom = new THREE.CylinderGeometry(0.58, 0.58, 0.22, 32);
        const faceMat = new THREE.MeshStandardMaterial({
            map: createProceduralScreenTexture('watch'),
            roughness: 0.1
        });
        const face = new THREE.Mesh(faceGeom, faceMat);
        face.rotation.x = Math.PI / 2;
        face.position.z = 0.01;
        watchGroup.add(face);

        // Digital dial button/crown
        const crownGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.1, 16);
        const crown = new THREE.Mesh(crownGeom, metalMaterial);
        crown.rotation.z = Math.PI / 2;
        crown.position.set(0.68, 0, 0);
        watchGroup.add(crown);

        // Circular wrist strap
        const strapGroup = new THREE.Group();
        const strapMat = darkPlastic;
        const radius = 0.95;
        const segmentCount = 14;

        for (let i = 0; i < segmentCount; i++) {
            const angle = (i / segmentCount) * Math.PI * 2;
            if (angle > -Math.PI / 5 && angle < Math.PI / 5) continue;
            
            const segmentGeom = new THREE.BoxGeometry(0.7, 0.08, 0.35);
            const segment = new THREE.Mesh(segmentGeom, strapMat);
            segment.position.set(0, Math.cos(angle) * radius, Math.sin(angle) * radius);
            segment.rotation.x = -angle;
            strapGroup.add(segment);
        }
        watchGroup.add(strapGroup);

        // Heart rate sensor on back
        const sensorGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.02, 16);
        const sensor = new THREE.Mesh(sensorGeom, metalMaterial);
        sensor.rotation.x = Math.PI / 2;
        sensor.position.z = -0.11;
        watchGroup.add(sensor);

        modelGroup.add(watchGroup);
    }
    else if (id === 'buds') {
        const budsGroup = new THREE.Group();

        // Case Base
        const caseGroup = new THREE.Group();
        caseGroup.position.set(0, -0.3, 0);

        const caseBaseGeom = new THREE.BoxGeometry(1.2, 0.8, 0.7);
        const caseBase = new THREE.Mesh(caseBaseGeom, whiteGlossy);
        caseGroup.add(caseBase);

        // Lid slightly open
        const caseLidGroup = new THREE.Group();
        caseLidGroup.position.set(0, 0.4, -0.35);

        const caseLidGeom = new THREE.BoxGeometry(1.2, 0.4, 0.7);
        const caseLid = new THREE.Mesh(caseLidGeom, whiteGlossy);
        caseLid.position.set(0, 0, 0.35);
        caseLidGroup.add(caseLid);
        caseLidGroup.rotation.x = -Math.PI / 6;
        caseGroup.add(caseLidGroup);

        // Charge LED
        const ledGeom = new THREE.SphereGeometry(0.04, 8, 8);
        const ledMat = new THREE.MeshBasicMaterial({ color: 0x2bc1a6 });
        const caseLed = new THREE.Mesh(ledGeom, ledMat);
        caseLed.position.set(0, -0.1, 0.36);
        caseGroup.add(caseLed);

        budsGroup.add(caseGroup);

        // Bud Left (inside the case)
        const budLGroup = new THREE.Group();
        budLGroup.position.set(-0.3, 0.15, 0.05);
        budLGroup.rotation.x = -Math.PI / 8;

        const budHeadL = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), whiteGlossy);
        const budTipL = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.08, 16), darkPlastic);
        budTipL.rotation.z = Math.PI / 2;
        budTipL.position.x = 0.12;

        const budStemL = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.4, 12), whiteGlossy);
        budStemL.position.y = -0.22;

        budLGroup.add(budHeadL);
        budLGroup.add(budTipL);
        budLGroup.add(budStemL);
        budsGroup.add(budLGroup);

        // Bud Right (resting outside the case)
        const budRGroup = new THREE.Group();
        budRGroup.position.set(0.6, -0.4, 0.3);
        budRGroup.rotation.set(Math.PI / 3, -Math.PI / 6, Math.PI / 4);

        const budHeadR = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), whiteGlossy);
        const budTipR = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.08, 16), darkPlastic);
        budTipR.rotation.z = Math.PI / 2;
        budTipR.position.x = 0.12;

        const budStemR = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.4, 12), whiteGlossy);
        budStemR.position.y = -0.22;

        const contactGeom = new THREE.BoxGeometry(0.02, 0.04, 0.04);
        const contact = new THREE.Mesh(contactGeom, goldAccent);
        contact.position.set(0, -0.4, 0.03);
        budRGroup.add(contact);

        budRGroup.add(budHeadR);
        budRGroup.add(budTipR);
        budRGroup.add(budStemR);
        budsGroup.add(budRGroup);

        modelGroup.add(budsGroup);
    }

    // Default viewing angle
    modelGroup.rotation.x = 0.2;
    modelGroup.rotation.y = -0.25;

    // Drag interactions
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    canvas.addEventListener('mousemove', (e) => {
        const deltaMove = {
            x: e.clientX - previousMousePosition.x,
            y: e.clientY - previousMousePosition.y
        };

        if (isDragging) {
            modelGroup.rotation.y += deltaMove.x * 0.01;
            modelGroup.rotation.x += deltaMove.y * 0.01;
        } else {
            // Hover tilt effect
            const rect = canvas.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            gsap.to(modelGroup.rotation, {
                y: x * 0.45 - 0.25,
                x: -y * 0.45 + 0.2,
                duration: 0.4,
                ease: 'power2.out'
            });
        }

        previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Touch support for mobile devices
    canvas.addEventListener('touchstart', (e) => {
        isDragging = true;
        if (e.touches[0]) {
            previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
    });

    canvas.addEventListener('touchmove', (e) => {
        if (!isDragging || !e.touches[0]) return;
        const deltaMove = {
            x: e.touches[0].clientX - previousMousePosition.x,
            y: e.touches[0].clientY - previousMousePosition.y
        };
        modelGroup.rotation.y += deltaMove.x * 0.015;
        modelGroup.rotation.x += deltaMove.y * 0.015;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    });

    canvas.addEventListener('touchend', () => {
        isDragging = false;
    });

    canvas.addEventListener('mouseleave', () => {
        if (!isDragging) {
            gsap.to(modelGroup.rotation, {
                x: 0.2,
                y: -0.25,
                duration: 0.8,
                ease: 'power2.out'
            });
        }
    });

    // Spinning interaction on click
    canvas.addEventListener('click', () => {
        gsap.to(modelGroup.rotation, {
            y: modelGroup.rotation.y + Math.PI * 2,
            duration: 1.0,
            ease: 'power2.inOut'
        });
        gsap.fromTo(modelGroup.scale, 
            { x: 1, y: 1, z: 1 },
            { x: 1.35, y: 1.35, z: 1.35, duration: 0.2, yoyo: true, repeat: 1, ease: 'back.out(1.8)' }
        );
    });

    // Maintain aspect ratio and sizes on container resizing
    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            const newWidth = entry.contentRect.width || canvas.clientWidth;
            const newHeight = entry.contentRect.height || canvas.clientHeight;
            if (newWidth > 0 && newHeight > 0) {
                camera.aspect = newWidth / newHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(newWidth, newHeight, false);
            }
        }
    });
    resizeObserver.observe(canvas);

    THREE_SCENES[id] = { scene, camera, renderer, modelGroup, id };

    // Continuous float and rotate animation
    let lastTime = 0;
    function animate(time) {
        requestAnimationFrame(animate);

        const delta = time - lastTime;
        lastTime = time;

        if (!isDragging) {
            const count = inventory[id] || 0;
            const spinFactor = count > 0 ? 3.5 : 1.0;
            modelGroup.rotation.y += 0.007 * spinFactor;

            // Small float oscillation
            const floatOffset = Math.sin(time * 0.0018) * 0.06;
            modelGroup.position.y = (id === 'laptop' ? 0.15 : id === 'desktop' ? 0.25 : 0) + floatOffset;
        }

        renderer.render(scene, camera);
    }
    requestAnimationFrame(animate);
}

// --- LOGIC ---
window.changeCount = (id, delta) => {
    const input = document.getElementById(`input-${id}`);
    let val = parseInt(input.value) || 0;
    val = Math.max(0, val + delta);
    input.value = val;
    inventory[id] = val;
    syncUI(id);
    updateCalculations();

    // Trigger visual spin/shake feedback on model & card
    const sceneInfo = THREE_SCENES[id];
    if (sceneInfo) {
        gsap.to(sceneInfo.modelGroup.rotation, {
            y: sceneInfo.modelGroup.rotation.y + Math.PI * 2,
            duration: 1.0,
            ease: 'power2.out'
        });
        gsap.fromTo(sceneInfo.modelGroup.scale, 
            { x: 1, y: 1, z: 1 },
            { x: 1.45, y: 1.45, z: 1.45, duration: 0.15, yoyo: true, repeat: 1, ease: 'back.out(2)' }
        );
    }

    const card = document.getElementById(`card-${id}`);
    if (card) {
        gsap.fromTo(card, 
            { rotation: -2, scale: 0.95 },
            { rotation: 0, scale: 1, duration: 0.25, ease: 'elastic.out(1.2, 0.4)' }
        );
    }
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

    // Update Extraction Yields
    Object.keys(METALS).forEach(key => {
        const valEl = document.getElementById(`val-${key}`);
        const barEl = document.getElementById(`bar-${key}`);
        const val = totals[key];
        valEl.textContent = val.toFixed(key === 'copper' ? 1 : 3) + ' g';
        
        // Scale yield bar relative to maximum range
        const max = key === 'copper' ? 5000 : 50;
        const pct = Math.min(100, (val / max) * 100);
        barEl.style.width = pct + '%';
    });

    // Update Market Value and its breakdown
    let totalValue = 0;
    const breakdown = Object.keys(METALS).map(key => {
        const val = totals[key] * METALS[key].price;
        totalValue += val;
        return `<span class="breakdown-item">${METALS[key].symbol}: ₹${Math.round(val).toLocaleString()}</span>`;
    });
    
    document.getElementById('total-value').textContent = '₹' + Math.round(totalValue).toLocaleString();
    document.getElementById('value-breakdown').innerHTML = breakdown.join('');

    // Update Environmental Stats
    document.getElementById('env-co2').textContent = (totals.weight * ENV_FACTORS.co2).toFixed(1) + ' kg';
    document.getElementById('env-water').textContent = Math.round(totals.weight * ENV_FACTORS.water).toLocaleString() + ' L';
    document.getElementById('env-energy').textContent = Math.round(totals.weight * ENV_FACTORS.energy).toLocaleString() + ' kWh';
    document.getElementById('env-landfill').textContent = totals.weight.toFixed(1) + ' kg';

    // Update gamification milestones
    const milestone = [...MILESTONES].reverse().find(m => totalDevices >= m.threshold) || MILESTONES[0];
    document.getElementById('milestone-text').textContent = milestone.text;
}

document.getElementById('generate-cert').onclick = () => {
    alert("Impact Certificate Generated! (In a production app, this would download a high-res PDF summary of your environmental savings).");
};

init();
