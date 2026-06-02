import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --- COMPONENT DATA ---
const COMPONENTS = {
    screen: {
        name: 'OLED Display Assembly',
        desc: 'Ultra-thin layers of glass, digitizers, and LEDs.',
        valuable: ['Indium', 'Aluminum', 'Glass'],
        hazardous: ['Arsenic (in some older LEDs)', 'Mercury'],
        basePos: 0.15,
        color: 0x111111,
        metalness: 0.9,
        roughness: 0.1
    },
    battery: {
        name: 'Lithium-Ion Battery',
        desc: 'Energy storage containing rare earth metals.',
        valuable: ['Lithium', 'Cobalt', 'Nickel', 'Copper'],
        hazardous: ['Lithium (Reactive)', 'Cobalt (Toxic)'],
        basePos: 0,
        color: 0x222222,
        metalness: 0.5,
        roughness: 0.5
    },
    logic: {
        name: 'Main Logic Board',
        desc: 'The brains of the device, dense with precious metals.',
        valuable: ['Gold', 'Silver', 'Tantalum', 'Copper', 'Platinum'],
        hazardous: ['Lead (Solder)', 'Brominated Flame Retardants'],
        basePos: -0.1,
        color: 0x1a4a35,
        metalness: 0.8,
        roughness: 0.4
    },
    housing: {
        name: 'Rear Chassis',
        desc: 'Structural frame made of high-grade alloys.',
        valuable: ['Aluminum', 'Magnesium', 'Rare Earth Magnets'],
        hazardous: ['None'],
        basePos: -0.25,
        color: 0xdddddd,
        metalness: 0.9,
        roughness: 0.2
    }
};

// --- THREE.JS SETUP ---
let scene, camera, renderer, controls;
let phoneGroup = new THREE.Group();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const groups = {};

function init() {
    scene = new THREE.Scene();
    scene.background = null;

    const container = document.getElementById('canvas-container');
    const width = container.clientWidth || window.innerWidth || 1;
    const height = container.clientHeight || window.innerHeight || 1;

    camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(4, 3, 5);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 4;
    controls.maxDistance = 10;

    // Lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 5, 5);
    dirLight.castShadow = true;
    scene.add(dirLight);

    createPhone();
    scene.add(phoneGroup);

    window.addEventListener('resize', onWindowResize);

    const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
            const { width: w, height: h } = entry.contentRect;
            if (w > 0 && h > 0) {
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
                renderer.setSize(w, h);
            }
        }
    });
    resizeObserver.observe(container);

    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('click', onClick);
    
    document.getElementById('explode-slider').oninput = updateExplosion;

    animate();
}

function createPhone() {
    const w = 2, h = 4, d = 0.1;

    // 1. Screen Group
    const screen = new THREE.Group();
    screen.position.z = COMPONENTS.screen.basePos;
    screen.userData = { id: 'screen' };

    // Procedural screen texture for UI/diagnostic data
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 512;
    screenCanvas.height = 1024;
    const screenCtx = screenCanvas.getContext('2d');
    
    screenCtx.fillStyle = '#09090b'; // dark bezel
    screenCtx.fillRect(0, 0, 512, 1024);
    
    const border = 24;
    screenCtx.fillStyle = '#040815'; // deep dark indigo screen background
    screenCtx.fillRect(border, border, 512 - border * 2, 1024 - border * 2);
    
    // Glowing cyan grid
    screenCtx.strokeStyle = 'rgba(14, 165, 233, 0.15)';
    screenCtx.lineWidth = 1;
    const gridSize = 40;
    for (let x = border; x < 512 - border; x += gridSize) {
        screenCtx.beginPath();
        screenCtx.moveTo(x, border);
        screenCtx.lineTo(x, 1024 - border);
        screenCtx.stroke();
    }
    for (let y = border; y < 1024 - border; y += gridSize) {
        screenCtx.beginPath();
        screenCtx.moveTo(border, y);
        screenCtx.lineTo(512 - border, y);
        screenCtx.stroke();
    }
    
    // Glowing tech curves
    screenCtx.strokeStyle = '#0ea5e9';
    screenCtx.shadowBlur = 15;
    screenCtx.shadowColor = '#38bdf8';
    screenCtx.lineWidth = 3;
    
    screenCtx.beginPath();
    screenCtx.moveTo(100, 250);
    screenCtx.lineTo(256, 406);
    screenCtx.lineTo(412, 250);
    screenCtx.stroke();
    
    screenCtx.beginPath();
    screenCtx.arc(256, 512, 120, 0, Math.PI * 2);
    screenCtx.stroke();
    
    screenCtx.shadowBlur = 0;
    
    // Text labels
    screenCtx.fillStyle = '#38bdf8';
    screenCtx.font = 'bold 36px sans-serif';
    screenCtx.fillText('HARDWARE ANATOMY LAB', 50, 120);
    
    screenCtx.fillStyle = '#34d399';
    screenCtx.font = '24px monospace';
    screenCtx.fillText('SYSTEM STATUS: OK', 80, 480);
    screenCtx.fillText('MATERIAL ANALYSIS: ACTIVE', 80, 520);
    screenCtx.fillText('Pb-FREE COMPLIANT', 80, 560);
    
    screenCtx.fillStyle = '#ffffff';
    screenCtx.font = '20px sans-serif';
    screenCtx.fillText('100%', 400, 60);
    screenCtx.fillRect(455, 45, 25, 15);
    
    // Recycling emblem
    screenCtx.strokeStyle = '#10b981';
    screenCtx.lineWidth = 4;
    screenCtx.beginPath();
    screenCtx.moveTo(256, 750);
    screenCtx.lineTo(316, 850);
    screenCtx.lineTo(196, 850);
    screenCtx.closePath();
    screenCtx.stroke();
    screenCtx.fillStyle = '#10b981';
    screenCtx.font = 'bold 20px sans-serif';
    screenCtx.fillText('RECYCLE FOR RECOVERY', 140, 890);

    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    
    // Glass materials
    const glassMat = new THREE.MeshPhysicalMaterial({ 
        color: 0x111115,
        map: screenTexture,
        metalness: 0.1, 
        roughness: 0.05,
        transmission: 0.75,
        thickness: 0.05,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05
    });
    
    const glassSidesMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.1 });
    const screenMaterials = [
        glassSidesMat, // px
        glassSidesMat, // nx
        glassSidesMat, // py
        glassSidesMat, // ny
        glassMat,      // pz
        glassSidesMat  // nz
    ];

    const mainScreen = new THREE.Mesh(new THREE.BoxGeometry(w, h, d * 0.8), screenMaterials);
    mainScreen.castShadow = true;
    mainScreen.receiveShadow = true;
    screen.add(mainScreen);

    // Bezel screen frame
    const bezelMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.8 });
    const bezel = new THREE.Mesh(new THREE.BoxGeometry(w * 1.02, h * 1.01, d * 0.25), bezelMat);
    bezel.position.set(0, 0, -d * 0.4);
    screen.add(bezel);

    // Notch
    const notch = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.1, 0.04), new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.5, roughness: 0.6 }));
    notch.position.set(0, h/2 - 0.15, d * 0.41);
    screen.add(notch);

    // Selfie camera lens
    const selfieLens = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.01, 16), new THREE.MeshPhysicalMaterial({ color: 0x2e1065, metalness: 0.9, roughness: 0.05, transmission: 0.5 }));
    selfieLens.rotation.x = Math.PI / 2;
    selfieLens.position.set(-0.15, h/2 - 0.15, d * 0.42);
    screen.add(selfieLens);

    // Speaker mesh
    const speakerMesh = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.02, 0.01), new THREE.MeshStandardMaterial({ color: 0x71717a, metalness: 0.8 }));
    speakerMesh.position.set(0, h/2 - 0.12, d * 0.42);
    screen.add(speakerMesh);

    // Ribbon flex cable
    const screenFlex = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.5, 0.02), new THREE.MeshStandardMaterial({ color: 0xb58c2b, metalness: 0.9, roughness: 0.3 }));
    screenFlex.position.set(-0.2, -h/2 + 0.3, -d * 0.5);
    screen.add(screenFlex);

    groups.screen = screen;
    phoneGroup.add(screen);

    // 2. Battery Group
    const battery = new THREE.Group();
    battery.position.set(0, -0.5, COMPONENTS.battery.basePos);
    battery.userData = { id: 'battery' };

    // Battery warnings and serial labels canvas
    const battCanvas = document.createElement('canvas');
    battCanvas.width = 512;
    battCanvas.height = 512;
    const battCtx = battCanvas.getContext('2d');
    
    battCtx.fillStyle = '#1c1917'; // dark grey
    battCtx.fillRect(0, 0, 512, 512);
    
    // Warning stripe
    battCtx.fillStyle = '#f59e0b';
    battCtx.fillRect(30, 0, 25, 512);
    
    // Texts
    battCtx.fillStyle = '#ffffff';
    battCtx.font = 'bold 24px sans-serif';
    battCtx.fillText('LITHIUM-ION BATTERY', 80, 80);
    
    battCtx.fillStyle = '#a8a29e';
    battCtx.font = '16px monospace';
    battCtx.fillText('Model: SZ-3820-LiPo', 80, 120);
    battCtx.fillText('Capacity: 4120mAh (15.94Wh)', 80, 150);
    battCtx.fillText('Nominal Voltage: 3.87V', 80, 180);
    
    battCtx.fillStyle = '#ef4444';
    battCtx.font = 'bold 16px sans-serif';
    battCtx.fillText('WARNING / DANGER', 80, 260);
    battCtx.fillStyle = '#e7e5e4';
    battCtx.font = '12px sans-serif';
    battCtx.fillText('Do not disassemble, crush, heat above 60°C.', 80, 290);
    battCtx.fillText('Li-ion cells contain toxic metals. Recycle properly.', 80, 315);
    
    // Recycling symbol
    battCtx.strokeStyle = '#3b82f6';
    battCtx.lineWidth = 4;
    battCtx.strokeRect(80, 370, 70, 70);
    battCtx.fillStyle = '#3b82f6';
    battCtx.font = 'bold 14px sans-serif';
    battCtx.fillText('Li-ion', 95, 410);
    
    // Barcode
    battCtx.fillStyle = '#ffffff';
    for (let x = 280; x < 460; x += Math.random() * 8 + 4) {
        battCtx.fillRect(x, 370, Math.random() * 4 + 1, 50);
    }

    const battTexture = new THREE.CanvasTexture(battCanvas);
    const labelMat = new THREE.MeshStandardMaterial({ map: battTexture, roughness: 0.4, metalness: 0.1 });
    const metalSidesMat = new THREE.MeshStandardMaterial({ color: 0x292524, metalness: 0.8, roughness: 0.3 });
    
    const battMaterials = [
        metalSidesMat, // px
        metalSidesMat, // nx
        metalSidesMat, // py
        metalSidesMat, // ny
        labelMat,      // pz
        metalSidesMat  // nz
    ];

    const mainBatt = new THREE.Mesh(new THREE.BoxGeometry(w * 0.8, h * 0.5, d * 0.8), battMaterials);
    mainBatt.castShadow = true;
    mainBatt.receiveShadow = true;
    battery.add(mainBatt);
    
    const bracketMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });
    const topBracket = new THREE.Mesh(new THREE.BoxGeometry(w * 0.82, 0.08, d * 0.9), bracketMat);
    topBracket.position.set(0, h * 0.25, 0);
    const bottomBracket = new THREE.Mesh(new THREE.BoxGeometry(w * 0.82, 0.08, d * 0.9), bracketMat);
    bottomBracket.position.set(0, -h * 0.25, 0);
    battery.add(topBracket, bottomBracket);
    
    // Flex connector
    const flexCable = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.3, 0.02), new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 }));
    flexCable.position.set(w * 0.25, h * 0.3, d * 0.4);
    const connectorHead = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.06, 0.06), new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 1.0 }));
    connectorHead.position.set(w * 0.25, h * 0.43, d * 0.4);
    battery.add(flexCable, connectorHead);

    groups.battery = battery;
    phoneGroup.add(battery);

    // 3. Logic Board Group
    const logic = new THREE.Group();
    logic.position.set(0, 1.2, COMPONENTS.logic.basePos);
    logic.userData = { id: 'logic' };

    // Procedural PCB circuit texture
    const pcbCanvas = document.createElement('canvas');
    pcbCanvas.width = 512;
    pcbCanvas.height = 512;
    const pcbCtx = pcbCanvas.getContext('2d');
    
    pcbCtx.fillStyle = '#064e3b'; // dark green board
    pcbCtx.fillRect(0, 0, 512, 512);
    
    // Draw gold trace lines
    pcbCtx.strokeStyle = '#d4af37';
    pcbCtx.lineWidth = 2.5;
    for (let i = 0; i < 12; i++) {
        const y = 30 + i * 40;
        pcbCtx.beginPath();
        pcbCtx.moveTo(10, y);
        pcbCtx.lineTo(200, y);
        pcbCtx.lineTo(260, y + 40);
        pcbCtx.lineTo(500, y + 40);
        pcbCtx.stroke();
    }
    
    // Draw vias
    pcbCtx.fillStyle = '#d4af37';
    for (let i = 0; i < 40; i++) {
        pcbCtx.beginPath();
        pcbCtx.arc(Math.random() * 512, Math.random() * 512, 3, 0, Math.PI * 2);
        pcbCtx.fill();
    }
    
    // Silkscreen markings
    pcbCtx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    pcbCtx.strokeRect(100, 100, 120, 120);
    pcbCtx.strokeRect(260, 100, 100, 100);
    pcbCtx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    pcbCtx.font = '10px monospace';
    pcbCtx.fillText('SKILIZEE_CPU_V5', 110, 140);
    pcbCtx.fillText('NAND_FLASH', 270, 140);

    const pcbTexture = new THREE.CanvasTexture(pcbCanvas);
    const pcbMat = new THREE.MeshStandardMaterial({ map: pcbTexture, roughness: 0.5, metalness: 0.2 });
    const pcbSideMat = new THREE.MeshStandardMaterial({ color: 0x022c22, roughness: 0.7 });

    const pcbMaterials = [
        pcbSideMat, // px
        pcbSideMat, // nx
        pcbSideMat, // py
        pcbSideMat, // ny
        pcbMat,      // pz
        pcbMat       // nz
    ];

    // L-shaped configuration
    const board1 = new THREE.Mesh(new THREE.BoxGeometry(w * 0.8, h * 0.15, d * 0.2), pcbMaterials);
    board1.position.set(0, h * 0.05, 0);
    board1.castShadow = true;
    board1.receiveShadow = true;
    logic.add(board1);
    
    const board2 = new THREE.Mesh(new THREE.BoxGeometry(w * 0.35, h * 0.35, d * 0.2), pcbMaterials);
    board2.position.set(-w * 0.225, -h * 0.1, 0);
    board2.castShadow = true;
    board2.receiveShadow = true;
    logic.add(board2);

    // CPU chip
    const cpuCanvas = document.createElement('canvas');
    cpuCanvas.width = 256;
    cpuCanvas.height = 256;
    const cpuCtx = cpuCanvas.getContext('2d');
    cpuCtx.fillStyle = '#0c0a09';
    cpuCtx.fillRect(0, 0, 256, 256);
    cpuCtx.strokeStyle = '#d4af37';
    cpuCtx.lineWidth = 6;
    cpuCtx.strokeRect(15, 15, 226, 226);
    cpuCtx.fillStyle = '#d4af37';
    cpuCtx.font = 'bold 26px sans-serif';
    cpuCtx.fillText('SKILIZEE', 60, 80);
    cpuCtx.fillStyle = '#ffffff';
    cpuCtx.font = '20px sans-serif';
    cpuCtx.fillText('A20 PROCESSOR', 45, 130);
    cpuCtx.fillStyle = '#78716c';
    cpuCtx.font = '14px monospace';
    cpuCtx.fillText('GOLD/PALLADIUM INC.', 40, 180);

    const cpuTexture = new THREE.CanvasTexture(cpuCanvas);
    const cpu = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.06), new THREE.MeshStandardMaterial({ map: cpuTexture, roughness: 0.3, metalness: 0.2 }));
    cpu.position.set(w * 0.12, h * 0.05, d * 0.12);
    logic.add(cpu);

    // RAM chip
    const ram = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.05), new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.5 }));
    ram.position.set(-w * 0.18, h * 0.05, d * 0.12);
    logic.add(ram);

    // NAND Flash
    const nandFlash = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.4, 0.05), new THREE.MeshStandardMaterial({ color: 0x0c0a09, roughness: 0.4 }));
    nandFlash.position.set(-w * 0.225, -h * 0.12, d * 0.12);
    logic.add(nandFlash);
    
    // Silver shielding
    const shield = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 0.08), new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.2 }));
    shield.position.set(-w * 0.225, -h * 0.12, -d * 0.12);
    logic.add(shield);

    // Micro SMT components
    const goldPinMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 1.0, roughness: 0.1 });
    const silverCapMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.8, roughness: 0.2 });
    const darkResMat = new THREE.MeshStandardMaterial({ color: 0x0369a1, roughness: 0.5 }); // Blue component

    for (let i = 0; i < 15; i++) {
        const x = (Math.random() - 0.5) * (w * 0.7);
        const y = h * 0.05 + (Math.random() - 0.5) * (h * 0.1);
        const size = Math.random() * 0.04 + 0.02;
        const compMat = Math.random() > 0.5 ? silverCapMat : darkResMat;
        const comp = new THREE.Mesh(new THREE.BoxGeometry(size, size * 0.6, 0.04), compMat);
        comp.position.set(x, y, d * 0.11);
        logic.add(comp);
    }
    
    for (let i = 0; i < 15; i++) {
        const x = -w * 0.225 + (Math.random() - 0.5) * (w * 0.28);
        const y = -h * 0.1 + (Math.random() - 0.5) * (h * 0.28);
        const size = Math.random() * 0.03 + 0.015;
        const compMat = Math.random() > 0.6 ? goldPinMat : (Math.random() > 0.5 ? silverCapMat : darkResMat);
        const comp = new THREE.Mesh(new THREE.BoxGeometry(size, size * 0.7, 0.04), compMat);
        comp.position.set(x, y, d * 0.11);
        logic.add(comp);
    }

    // Rear camera unit (fits inside rear chassis openings)
    const cameraHousing = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.48, 0.35), new THREE.MeshStandardMaterial({ color: 0x1c1917, metalness: 0.8, roughness: 0.2 }));
    cameraHousing.position.set(-w * 0.2, h * 0.2, -d * 0.15);
    const camGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.02, 16), new THREE.MeshPhysicalMaterial({ color: 0x030712, transmission: 0.9, roughness: 0.1 }));
    camGlass.rotation.x = Math.PI / 2;
    camGlass.position.set(-w * 0.2, h * 0.2, -d * 0.15 - 0.18);
    logic.add(cameraHousing, camGlass);

    groups.logic = logic;
    phoneGroup.add(logic);

    // 4. Housing Group
    const housing = new THREE.Group();
    housing.position.z = COMPONENTS.housing.basePos;
    housing.userData = { id: 'housing' };
    
    // Backplate
    const backplateGeo = new THREE.BoxGeometry(w * 1.05, h * 1.02, d * 0.5);
    const backplateMat = new THREE.MeshPhysicalMaterial({
        color: COMPONENTS.housing.color,
        metalness: COMPONENTS.housing.metalness,
        roughness: COMPONENTS.housing.roughness,
        clearcoat: 0.8,
        clearcoatRoughness: 0.1
    });
    const backplate = new THREE.Mesh(backplateGeo, backplateMat);
    backplate.castShadow = true;
    backplate.receiveShadow = true;
    housing.add(backplate);

    // Raised outer shell edges
    const edgeThick = 0.05;
    const edgeHeight = d * 1.5;
    const leftEdge = new THREE.Mesh(new THREE.BoxGeometry(edgeThick, h * 1.02, edgeHeight), backplateMat);
    leftEdge.position.set(-w * 1.05 / 2 + edgeThick/2, 0, edgeHeight/2);
    const rightEdge = new THREE.Mesh(new THREE.BoxGeometry(edgeThick, h * 1.02, edgeHeight), backplateMat);
    rightEdge.position.set(w * 1.05 / 2 - edgeThick/2, 0, edgeHeight/2);
    const topEdge = new THREE.Mesh(new THREE.BoxGeometry(w * 1.05, edgeThick, edgeHeight), backplateMat);
    topEdge.position.set(0, h * 1.02 / 2 - edgeThick/2, edgeHeight/2);
    const bottomEdge = new THREE.Mesh(new THREE.BoxGeometry(w * 1.05, edgeThick, edgeHeight), backplateMat);
    bottomEdge.position.set(0, -h * 1.02 / 2 + edgeThick/2, edgeHeight/2);
    housing.add(leftEdge, rightEdge, topEdge, bottomEdge);

    // Camera bump
    const camBump = new THREE.Mesh(new THREE.BoxGeometry(w * 0.45, w * 0.45, 0.1), backplateMat);
    camBump.position.set(-w * 0.25, h * 0.32, -d * 0.3);
    housing.add(camBump);

    // Camera lenses
    const lensRingMat = new THREE.MeshStandardMaterial({ color: 0x27272a, metalness: 0.9, roughness: 0.1 });
    const lensGlassMat = new THREE.MeshPhysicalMaterial({ color: 0x09090b, metalness: 0.9, roughness: 0.05, transmission: 0.8, thickness: 0.05 });
    
    // Lens 1
    const lens1Ring = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.04, 32), lensRingMat);
    lens1Ring.rotation.x = Math.PI / 2;
    lens1Ring.position.set(-w * 0.33, h * 0.4, -d * 0.35);
    const lens1Glass = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.01, 32), lensGlassMat);
    lens1Glass.rotation.x = Math.PI / 2;
    lens1Glass.position.set(-w * 0.33, h * 0.4, -d * 0.375);
    housing.add(lens1Ring, lens1Glass);

    // Lens 2
    const lens2Ring = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.04, 32), lensRingMat);
    lens2Ring.rotation.x = Math.PI / 2;
    lens2Ring.position.set(-w * 0.17, h * 0.4, -d * 0.35);
    const lens2Glass = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.01, 32), lensGlassMat);
    lens2Glass.rotation.x = Math.PI / 2;
    lens2Glass.position.set(-w * 0.17, h * 0.4, -d * 0.375);
    housing.add(lens2Ring, lens2Glass);

    // Lens 3
    const lens3Ring = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.04, 32), lensRingMat);
    lens3Ring.rotation.x = Math.PI / 2;
    lens3Ring.position.set(-w * 0.25, h * 0.26, -d * 0.35);
    const lens3Glass = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.01, 32), lensGlassMat);
    lens3Glass.rotation.x = Math.PI / 2;
    lens3Glass.position.set(-w * 0.25, h * 0.26, -d * 0.375);
    housing.add(lens3Ring, lens3Glass);

    // Flash light
    const flash = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.01, 16), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
    flash.rotation.x = Math.PI / 2;
    flash.position.set(-w * 0.35, h * 0.26, -d * 0.355);
    housing.add(flash);

    // LiDAR
    const lidar = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.01, 16), new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.8, roughness: 0.2 }));
    lidar.rotation.x = Math.PI / 2;
    lidar.position.set(-w * 0.15, h * 0.26, -d * 0.355);
    housing.add(lidar);

    // Wireless charging coil (Valuable Copper Recovery detail!)
    const copperMat = new THREE.MeshStandardMaterial({ color: 0xca8a04, metalness: 1.0, roughness: 0.1 });
    const coilCenter = new THREE.Vector3(0, -0.2, d * 0.1);
    for (let r = 0.2; r < 0.65; r += 0.06) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.02, 8, 48), copperMat);
        ring.position.copy(coilCenter);
        housing.add(ring);
    }
    
    // Ferrite shield disk
    const coilBacking = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.01, 32), new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.8 }));
    coilBacking.rotation.x = Math.PI / 2;
    coilBacking.position.copy(coilCenter);
    coilBacking.position.z -= 0.01;
    housing.add(coilBacking);

    // USB-C socket at bottom frame
    const port = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.12, 0.2), new THREE.MeshStandardMaterial({ color: 0x71717a, metalness: 0.9, roughness: 0.2 }));
    port.position.set(0, -h * 1.02 / 2 + 0.1, d * 0.25);
    const pin = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.02, 0.1), new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 1.0 }));
    pin.position.set(0, -h * 1.02 / 2 + 0.1, d * 0.25);
    housing.add(port, pin);

    // Taptic Engine box
    const tapticEngine = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.15), new THREE.MeshStandardMaterial({ color: 0x52525b, metalness: 0.8, roughness: 0.3 }));
    tapticEngine.position.set(-w * 0.25, -h * 0.4, d * 0.25);
    const tapticLabel = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, 0.02), new THREE.MeshStandardMaterial({ color: 0x71717a, metalness: 0.8 }));
    tapticLabel.position.set(0, 0, 0.08);
    tapticEngine.add(tapticLabel);
    
    // Speaker module box
    const speakerModule = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.3, 0.2), new THREE.MeshStandardMaterial({ color: 0x09090b, metalness: 0.3, roughness: 0.7 }));
    speakerModule.position.set(w * 0.25, -h * 0.4, d * 0.25);
    housing.add(tapticEngine, speakerModule);

    groups.housing = housing;
    phoneGroup.add(housing);
}

function updateExplosion(e) {
    const val = e.target.value / 100;
    document.getElementById('offset-val').textContent = e.target.value + '%';
    
    // Animate layers outwards with wider comprehensive offsets
    gsap.to(groups.screen.position, { z: COMPONENTS.screen.basePos + (val * 2.2), duration: 0.5 });
    gsap.to(groups.battery.position, { z: COMPONENTS.battery.basePos + (val * 0.75), duration: 0.5 });
    gsap.to(groups.logic.position, { z: COMPONENTS.logic.basePos - (val * 0.75), duration: 0.5 });
    gsap.to(groups.housing.position, { z: COMPONENTS.housing.basePos - (val * 2.2), duration: 0.5 });
}

function onMouseMove(e) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(phoneGroup.children, true);

    if (intersects.length > 0) {
        let obj = intersects[0].object;
        while(obj.parent && !obj.userData.id) obj = obj.parent;
        
        if (obj.userData.id) {
            const data = COMPONENTS[obj.userData.id];
            const tag = document.getElementById('part-tag');
            tag.style.display = 'block';
            tag.style.left = e.clientX + 'px';
            tag.style.top = (e.clientY - 30) + 'px';
            tag.textContent = data.name;
            document.body.style.cursor = 'pointer';
            return;
        }
    }
    
    document.getElementById('part-tag').style.display = 'none';
    document.body.style.cursor = 'default';
}

function onClick() {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(phoneGroup.children, true);

    if (intersects.length > 0) {
        let obj = intersects[0].object;
        while(obj.parent && !obj.userData.id) obj = obj.parent;
        
        if (obj.userData.id) {
            showInfo(obj.userData.id);
        }
    }
}

function showInfo(id) {
    const data = COMPONENTS[id];
    const panel = document.getElementById('component-info');
    
    document.getElementById('part-name').textContent = data.name;
    document.getElementById('part-desc').textContent = data.desc;
    
    const valList = document.getElementById('valuable-list');
    valList.innerHTML = data.valuable.map(v => `<span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-[9px] font-bold">${v}</span>`).join('');
    
    const hazList = document.getElementById('hazard-list');
    hazList.innerHTML = data.hazardous.map(h => `<span class="px-2 py-1 bg-red-100 text-red-700 rounded text-[9px] font-bold">${h}</span>`).join('');
    
    panel.classList.add('active');
}

function onWindowResize() {
    const container = document.getElementById('canvas-container');
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    phoneGroup.rotation.y += 0.005;
    renderer.render(scene, camera);
}

init();
