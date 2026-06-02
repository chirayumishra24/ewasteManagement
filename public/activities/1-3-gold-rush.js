// --- DATA ---
const METALS = {
    gold: { name: 'Gold', symbol: 'Au', price: 6200, unit: 'g', color: '#f59e0b' },
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
        const colorClass = change.startsWith('+') ? 'text-emerald-400' : 'text-red-400';
        return `<span class="mx-8">${m.name} (${m.symbol}): <span class="text-white">₹${m.price.toLocaleString()}</span> <span class="${colorClass}">${change}</span></span>`;
    });
    ticker.innerHTML = items.join('') + items.join(''); // Double for seamless loop
}

function renderDeviceGrid() {
    const grid = document.getElementById('device-grid');
    grid.innerHTML = DEVICES.map(d => `
        <div class="device-card flex flex-col justify-between" id="card-${d.id}">
            <div class="w-full h-28 relative mb-2 flex items-center justify-center overflow-hidden rounded-xl bg-slate-950/40 border border-white/5 shadow-inner transition-all duration-300">
                <canvas id="canvas-${d.id}" class="w-full h-full block cursor-grab active:cursor-grabbing"></canvas>
                <div class="absolute bottom-1 right-2 text-[20px] font-mono text-slate-500/80 pointer-events-none uppercase">3D DRAG</div>
            </div>
            <p class="text-[20px] font-bold text-[var(--muted)] uppercase mb-3">${d.name}</p>
            <div class="stepper mt-auto">
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
        <div class="space-y-2">
            <div class="flex justify-between items-end">
                <span class="text-xl font-bold uppercase tracking-wider text-[var(--muted)]">${METALS[key].name} (${METALS[key].symbol})</span>
                <span class="text-xl font-black" id="val-${key}">0.000 g</span>
            </div>
            <div class="yield-bar-track">
                <div class="yield-bar-fill" id="bar-${key}" style="background: ${METALS[key].color}"></div>
            </div>
        </div>
    `).join('');
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

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.85);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xa78bfa, 0.35); // Slight purple tint for futuristic tech look
    dirLight2.position.set(-5, -5, -2);
    scene.add(dirLight2);

    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // Materials
    const metalMaterial = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85, roughness: 0.2 });
    const goldAccent = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9, roughness: 0.15 });
    const screenMatPhone = new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x059669, emissiveIntensity: 0.7, roughness: 0.1 });
    const screenMatLaptop = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, emissive: 0x0284c7, emissiveIntensity: 0.6, roughness: 0.1 });
    const screenMatDesktop = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, emissive: 0x7c3aed, emissiveIntensity: 0.6, roughness: 0.1 });
    const screenMatTablet = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.6, roughness: 0.1 });
    const screenMatWatch = new THREE.MeshStandardMaterial({ color: 0xec4899, emissive: 0xdb2777, emissiveIntensity: 0.7, roughness: 0.1 });
    const whiteGlossy = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.2, roughness: 0.1 });
    const darkPlastic = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.3, roughness: 0.45 });

    // Build the specific model geometries
    if (id === 'phone') {
        const bodyGeom = new THREE.BoxGeometry(1.3, 2.5, 0.14);
        const body = new THREE.Mesh(bodyGeom, metalMaterial);
        modelGroup.add(body);

        const screenGeom = new THREE.BoxGeometry(1.2, 2.38, 0.16);
        const screen = new THREE.Mesh(screenGeom, screenMatPhone);
        screen.position.z = 0.01;
        modelGroup.add(screen);
    } 
    else if (id === 'laptop') {
        const laptopGroup = new THREE.Group();
        
        const baseGeom = new THREE.BoxGeometry(2.2, 0.08, 1.5);
        const base = new THREE.Mesh(baseGeom, metalMaterial);
        base.position.y = -0.5;
        laptopGroup.add(base);

        const keyboardGeom = new THREE.BoxGeometry(2.0, 0.09, 1.2);
        const keyboard = new THREE.Mesh(keyboardGeom, darkPlastic);
        keyboard.position.set(0, -0.49, 0.1);
        laptopGroup.add(keyboard);

        const lidGroup = new THREE.Group();
        lidGroup.position.set(0, -0.5, -0.7);

        const lidGeom = new THREE.BoxGeometry(2.2, 1.4, 0.06);
        const lid = new THREE.Mesh(lidGeom, metalMaterial);
        lid.position.y = 0.7;
        lid.position.z = 0.03;
        lidGroup.add(lid);

        const screenGeom = new THREE.BoxGeometry(2.08, 1.28, 0.07);
        const screen = new THREE.Mesh(screenGeom, screenMatLaptop);
        screen.position.y = 0.7;
        screen.position.z = 0.04;
        lidGroup.add(screen);

        lidGroup.rotation.x = -Math.PI / 2.6; // Open angle
        laptopGroup.add(lidGroup);
        modelGroup.add(laptopGroup);
        modelGroup.position.y = 0.15;
    }
    else if (id === 'desktop') {
        const desktopGroup = new THREE.Group();

        const screenGeom = new THREE.BoxGeometry(2.5, 1.5, 0.12);
        const screen = new THREE.Mesh(screenGeom, metalMaterial);
        screen.position.y = 0.3;
        desktopGroup.add(screen);

        const glassGeom = new THREE.BoxGeometry(2.38, 1.38, 0.14);
        const glass = new THREE.Mesh(glassGeom, screenMatDesktop);
        glass.position.y = 0.3;
        desktopGroup.add(glass);

        const standNeckGeom = new THREE.CylinderGeometry(0.1, 0.12, 0.6, 16);
        const standNeck = new THREE.Mesh(standNeckGeom, darkPlastic);
        standNeck.position.y = -0.65;
        desktopGroup.add(standNeck);

        const standBaseGeom = new THREE.BoxGeometry(1.0, 0.06, 0.8);
        const standBase = new THREE.Mesh(standBaseGeom, metalMaterial);
        standBase.position.y = -0.95;
        desktopGroup.add(standBase);

        modelGroup.add(desktopGroup);
        modelGroup.position.y = 0.25;
    }
    else if (id === 'tablet') {
        const bodyGeom = new THREE.BoxGeometry(1.8, 2.4, 0.1);
        const body = new THREE.Mesh(bodyGeom, metalMaterial);
        modelGroup.add(body);

        const screenGeom = new THREE.BoxGeometry(1.68, 2.28, 0.12);
        const screen = new THREE.Mesh(screenGeom, screenMatTablet);
        screen.position.z = 0.01;
        modelGroup.add(screen);
    }
    else if (id === 'watch') {
        const watchGroup = new THREE.Group();

        const strapGeom = new THREE.BoxGeometry(0.7, 0.06, 2.6);
        const strap = new THREE.Mesh(strapGeom, darkPlastic);
        watchGroup.add(strap);

        const bodyGeom = new THREE.BoxGeometry(1.0, 1.0, 0.22);
        const body = new THREE.Mesh(bodyGeom, goldAccent);
        body.position.z = 0.06;
        watchGroup.add(body);

        const faceGeom = new THREE.CylinderGeometry(0.4, 0.4, 0.24, 32);
        const face = new THREE.Mesh(faceGeom, screenMatWatch);
        face.rotation.x = Math.PI / 2;
        face.position.z = 0.07;
        watchGroup.add(face);

        modelGroup.add(watchGroup);
    }
    else if (id === 'buds') {
        const budsGroup = new THREE.Group();

        // Left earbud
        const leftGroup = new THREE.Group();
        const headL = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), whiteGlossy);
        const stemL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.5, 16), whiteGlossy);
        stemL.position.y = -0.24;
        leftGroup.add(headL);
        leftGroup.add(stemL);
        leftGroup.position.set(-0.35, 0.1, 0);
        leftGroup.rotation.z = Math.PI / 12;
        leftGroup.rotation.x = -Math.PI / 8;
        budsGroup.add(leftGroup);

        // Right earbud
        const rightGroup = new THREE.Group();
        const headR = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), whiteGlossy);
        const stemR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.5, 16), whiteGlossy);
        stemR.position.y = -0.24;
        rightGroup.add(headR);
        rightGroup.add(stemR);
        rightGroup.position.set(0.35, -0.1, 0.1);
        rightGroup.rotation.z = -Math.PI / 10;
        rightGroup.rotation.x = Math.PI / 6;
        budsGroup.add(rightGroup);

        modelGroup.add(budsGroup);
    }

    // Default angle for display
    modelGroup.rotation.x = 0.2;
    modelGroup.rotation.y = -0.25;

    // Track mouse / drag coordinates
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
            // Hover Tilt Effect
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

    // Touch events for mobile drag
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

    // Interaction on click
    canvas.addEventListener('click', () => {
        gsap.to(modelGroup.rotation, {
            y: modelGroup.rotation.y + Math.PI * 2,
            duration: 1.0,
            ease: 'power2.inOut'
        });
        gsap.fromTo(modelGroup.scale, 
            { x: 1, y: 1, z: 1 },
            { x: 1.25, y: 1.25, z: 1.25, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.out' }
        );
    });

    // ResizeObserver to ensure robust rendering when inside tabs / container resize
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

    // Animation loop
    let lastTime = 0;
    function animate(time) {
        requestAnimationFrame(animate);

        const delta = time - lastTime;
        lastTime = time;

        if (!isDragging) {
            const count = inventory[id] || 0;
            const spinFactor = count > 0 ? 3.5 : 1.0;
            modelGroup.rotation.y += 0.007 * spinFactor;

            // Small hovering float motion
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

    // Trigger visual feedback pulse on 3D model
    const sceneInfo = THREE_SCENES[id];
    if (sceneInfo) {
        gsap.to(sceneInfo.modelGroup.rotation, {
            y: sceneInfo.modelGroup.rotation.y + Math.PI * 2,
            duration: 1.0,
            ease: 'power2.out'
        });
        gsap.fromTo(sceneInfo.modelGroup.scale, 
            { x: 1, y: 1, z: 1 },
            { x: 1.3, y: 1.3, z: 1.3, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.out' }
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
