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

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(4, 3, 5);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    document.getElementById('canvas-container').appendChild(renderer.domElement);

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
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('click', onClick);
    
    document.getElementById('explode-slider').oninput = updateExplosion;

    animate();
}

function createPhone() {
    const w = 2, h = 4, d = 0.1;

    // 1. Screen
    const screenGeo = new THREE.BoxGeometry(w, h, d);
    const screenMat = new THREE.MeshPhysicalMaterial({ 
        color: COMPONENTS.screen.color, 
        metalness: COMPONENTS.screen.metalness, 
        roughness: COMPONENTS.screen.roughness,
        transmission: 0.2,
        thickness: 0.1
    });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.z = COMPONENTS.screen.basePos;
    screen.userData = { id: 'screen' };
    groups.screen = screen;
    phoneGroup.add(screen);

    // 2. Battery
    const battGeo = new THREE.BoxGeometry(w * 0.8, h * 0.5, d * 0.8);
    const battMat = new THREE.MeshStandardMaterial({ color: COMPONENTS.battery.color });
    const battery = new THREE.Mesh(battGeo, battMat);
    battery.position.set(0, -0.5, COMPONENTS.battery.basePos);
    battery.userData = { id: 'battery' };
    groups.battery = battery;
    phoneGroup.add(battery);

    // 3. Logic Board
    const logicGeo = new THREE.BoxGeometry(w * 0.8, h * 0.3, d * 0.5);
    const logicMat = new THREE.MeshStandardMaterial({ color: COMPONENTS.logic.color });
    const logic = new THREE.Mesh(logicGeo, logicMat);
    logic.position.set(0, 1.2, COMPONENTS.logic.basePos);
    
    // Add "chips" to logic board
    for(let i=0; i<4; i++) {
        const chip = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.05), new THREE.MeshStandardMaterial({color: 0x333333}));
        chip.position.set((Math.random()-0.5)*1, (Math.random()-0.5)*0.8, 0.05);
        logic.add(chip);
    }
    
    logic.userData = { id: 'logic' };
    groups.logic = logic;
    phoneGroup.add(logic);

    // 4. Housing
    const houseGeo = new THREE.BoxGeometry(w * 1.05, h * 1.02, d * 1.5);
    const houseMat = new THREE.MeshPhysicalMaterial({ 
        color: COMPONENTS.housing.color,
        metalness: COMPONENTS.housing.metalness,
        roughness: COMPONENTS.housing.roughness
    });
    const housing = new THREE.Mesh(houseGeo, houseMat);
    housing.position.z = COMPONENTS.housing.basePos;
    housing.userData = { id: 'housing' };
    groups.housing = housing;
    phoneGroup.add(housing);
}

function updateExplosion(e) {
    const val = e.target.value / 100;
    document.getElementById('offset-val').textContent = e.target.value + '%';
    
    // Animate layers outwards
    gsap.to(groups.screen.position, { z: COMPONENTS.screen.basePos + (val * 2), duration: 0.5 });
    gsap.to(groups.battery.position, { z: COMPONENTS.battery.basePos + (val * 0.5), duration: 0.5 });
    gsap.to(groups.logic.position, { z: COMPONENTS.logic.basePos - (val * 0.5), duration: 0.5 });
    gsap.to(groups.housing.position, { z: COMPONENTS.housing.basePos - (val * 2), duration: 0.5 });
}

function onMouseMove(e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

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
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    phoneGroup.rotation.y += 0.005;
    renderer.render(scene, camera);
}

init();
