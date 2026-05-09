import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

// --- DATA: Layers and Elements ---
const LAYER_DATA = [
    {
        name: "Screen Glass",
        thickness: 0.06,
        color: 0xc8dff0,
        opacity: 0.6,
        metalness: 0.0,
        roughness: 0.1,
        elements: [
            { name: "Silicon Dioxide", symbol: "SiO₂", category: "bulk", fact: "The primary ingredient in glass." },
            { name: "Aluminium Oxide", symbol: "Al₂O₃", category: "bulk", fact: "Adds strength and scratch resistance." },
            { name: "Potassium Oxide", symbol: "K₂O", category: "bulk", fact: "Used in ion-exchange for toughened glass." }
        ]
    },
    {
        name: "Display Panel",
        thickness: 0.04,
        color: 0x1a1a2e,
        opacity: 1.0,
        metalness: 0.2,
        roughness: 0.5,
        elements: [
            { name: "Indium", symbol: "In", category: "valuable", fact: "Essential for transparent conducting films." },
            { name: "Tin", symbol: "Sn", category: "bulk", fact: "Works with Indium for the screen electrodes." },
            { name: "Gallium", symbol: "Ga", category: "valuable", fact: "Used in LED backlighting." },
            { name: "Yttrium", symbol: "Y", category: "valuable", fact: "Produces red colors in the display." }
        ]
    },
    {
        name: "Circuit Board",
        thickness: 0.08,
        color: 0x2d6b3e,
        opacity: 1.0,
        metalness: 0.3,
        roughness: 0.8,
        elements: [
            { name: "Gold", symbol: "Au", category: "valuable", fact: "Excellent, non-corroding conductor." },
            { name: "Silver", symbol: "Ag", category: "valuable", fact: "The best electrical conductor known." },
            { name: "Copper", symbol: "Cu", category: "valuable", fact: "Forms the bulk of the circuitry wiring." },
            { name: "Palladium", symbol: "Pd", category: "valuable", fact: "Crucial for multi-layer ceramic capacitors." },
            { name: "Platinum", symbol: "Pt", category: "valuable", fact: "Used in high-end sensors and hard drives." },
            { name: "Lead", symbol: "Pb", category: "hazardous", fact: "Found in older solder; toxic to nerves." },
            { name: "Nickel", symbol: "Ni", category: "bulk", fact: "Used in plating and battery connectors." },
            { name: "Antimony", symbol: "Sb", category: "hazardous", fact: "Flame retardant additive; toxic." },
            { name: "Brominated FR", symbol: "BFR", category: "hazardous", fact: "Prevents fire but persists in nature." }
        ]
    },
    {
        name: "Battery",
        thickness: 0.25,
        color: 0x505560,
        opacity: 1.0,
        metalness: 0.6,
        roughness: 0.4,
        elements: [
            { name: "Lithium", symbol: "Li", category: "valuable", fact: "The core charge-carrier in phone batteries." },
            { name: "Cobalt", symbol: "Co", category: "valuable", fact: "Critical for battery stability and capacity." },
            { name: "Graphite", symbol: "C", category: "bulk", fact: "Used as the anode material." },
            { name: "Manganese", symbol: "Mn", category: "bulk", fact: "Increases power and safety." },
            { name: "Nickel", symbol: "Ni", category: "bulk", fact: "Boosts energy density." }
        ]
    },
    {
        name: "Back Casing",
        thickness: 0.05,
        color: 0xb8bcc0,
        opacity: 1.0,
        metalness: 0.7,
        roughness: 0.3,
        elements: [
            { name: "Aluminium", symbol: "Al", category: "bulk", fact: "Lightweight and fully recyclable." },
            { name: "Magnesium", symbol: "Mg", category: "bulk", fact: "Often alloyed with Al for strength." },
            { name: "Polycarbonate", symbol: "PC", category: "bulk", fact: "High-impact plastic for internal frames." },
            { name: "Chromium", symbol: "Cr", category: "hazardous", fact: "Used for shiny plating; toxic in some forms." }
        ]
    }
];

// --- APP STATE ---
let scene, camera, renderer, controls;
let phoneLayers = [];
let peeledCount = 0;
let discoveredElements = new Set();
let stats = { valuable: 0, hazardous: 0, bulk: 0 };

const container = document.getElementById('three-canvas-container');
const loadingScreen = document.getElementById('canvas-loading');
const layerButtons = document.querySelectorAll('.btn-layer');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const grid = document.getElementById('materials-grid');
const emptyState = document.getElementById('empty-state');

const countValuable = document.getElementById('count-valuable');
const countHazardous = document.getElementById('count-hazardous');
const countBulk = document.getElementById('count-bulk');

// --- INITIALIZATION ---
function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f7f3);

    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(4, 3, 6);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 4;
    controls.maxDistance = 12;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(5, 10, 7.5);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.3);
    scene.add(hemisphereLight);

    createPhone();
    animate();

    // Event Listeners
    window.addEventListener('resize', onWindowResize);
    layerButtons.forEach(btn => btn.addEventListener('click', () => toggleLayer(parseInt(btn.dataset.layer))));
    document.getElementById('btn-peel-all').addEventListener('click', peelAll);
    document.getElementById('btn-reset').addEventListener('click', resetAll);

    loadingScreen.style.display = 'none';
}

function createPhone() {
    let currentZ = 0;
    const spacing = 0.01;

    LAYER_DATA.forEach((data, index) => {
        const geometry = new RoundedBoxGeometry(3.2, 6.4, data.thickness, 4, 0.15);
        const material = new THREE.MeshPhysicalMaterial({
            color: data.color,
            transparent: data.opacity < 1,
            opacity: data.opacity,
            metalness: data.metalness,
            roughness: data.roughness,
            envMapIntensity: 1
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.z = currentZ + data.thickness / 2;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        mesh.userData = { 
            index: index, 
            originalZ: mesh.position.z,
            peeled: false 
        };

        scene.add(mesh);
        phoneLayers.push(mesh);

        currentZ += data.thickness + spacing;
    });

    // Center the phone
    const offset = currentZ / 2;
    phoneLayers.forEach(layer => {
        layer.position.z -= offset;
        layer.userData.originalZ -= offset;
    });
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

// --- LOGIC ---
function toggleLayer(index) {
    const layer = phoneLayers[index];
    const button = layerButtons[index];

    if (!layer.userData.peeled) {
        peelLayer(index);
    } else {
        restoreLayer(index);
    }
}

function peelLayer(index) {
    const layer = phoneLayers[index];
    const button = layerButtons[index];
    
    if (layer.userData.peeled) return;

    layer.userData.peeled = true;
    button.classList.add('active', 'peeled');

    gsap.to(layer.position, {
        x: -4,
        z: (index - 2) * 2, // Spread them out in 3D
        duration: 1.2,
        ease: "power3.out"
    });

    gsap.to(layer.rotation, {
        y: -Math.PI / 4,
        duration: 1.2,
        ease: "power3.out"
    });

    discoverMaterials(index);
}

function restoreLayer(index) {
    const layer = phoneLayers[index];
    const button = layerButtons[index];

    if (!layer.userData.peeled) return;

    layer.userData.peeled = false;
    button.classList.remove('active');

    gsap.to(layer.position, {
        x: 0,
        z: layer.userData.originalZ,
        duration: 1.0,
        ease: "power3.inOut"
    });

    gsap.to(layer.rotation, {
        y: 0,
        duration: 1.0,
        ease: "power3.inOut"
    });
}

function discoverMaterials(layerIndex) {
    const elements = LAYER_DATA[layerIndex].elements;
    
    if (emptyState) {
        emptyState.remove();
    }

    elements.forEach((el, i) => {
        if (!discoveredElements.has(el.name)) {
            discoveredElements.add(el.name);
            stats[el.category]++;
            
            // Create Card
            const card = document.createElement('div');
            card.className = `material-card border-l-4 ${getBorderClass(el.category)} fade-in`;
            card.innerHTML = `
                <div class="flex justify-between items-start mb-2">
                    <span class="text-xs font-bold px-2 py-0.5 rounded ${getPillClass(el.category)}">${el.symbol}</span>
                    <span class="w-2 h-2 rounded-full ${getDotClass(el.category)}"></span>
                </div>
                <h5 class="font-bold text-sm mb-1">${el.name}</h5>
                <p class="text-[10px] leading-tight text-muted">${el.fact}</p>
            `;
            
            grid.appendChild(card);
            
            // Animate In
            gsap.to(card, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                delay: i * 0.1,
                ease: "power2.out"
            });
        }
    });

    updateUI();
}

function updateUI() {
    const total = 25;
    const current = discoveredElements.size;
    const percent = (current / total) * 100;

    progressFill.style.width = `${percent}%`;
    progressText.innerText = `${current} / ${total} Elements Found`;

    countValuable.innerText = stats.valuable;
    countHazardous.innerText = stats.hazardous;
    countBulk.innerText = stats.bulk;
}

function peelAll() {
    LAYER_DATA.forEach((_, i) => {
        setTimeout(() => peelLayer(i), i * 200);
    });
}

function resetAll() {
    phoneLayers.forEach((_, i) => restoreLayer(i));
    // We don't reset discovered elements/grid to allow students to keep their progress 
    // unless they refresh, but we could clear them if preferred.
}

// Helpers
function getBorderClass(cat) {
    if (cat === 'valuable') return 'border-emerald-500';
    if (cat === 'hazardous') return 'border-red-500';
    return 'border-amber-500';
}

function getPillClass(cat) {
    if (cat === 'valuable') return 'pill-valuable';
    if (cat === 'hazardous') return 'pill-hazardous';
    return 'pill-bulk';
}

function getDotClass(cat) {
    if (cat === 'valuable') return 'bg-emerald-500';
    if (cat === 'hazardous') return 'bg-red-500';
    return 'bg-amber-500';
}

// START
init();
