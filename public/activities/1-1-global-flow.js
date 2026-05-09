import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --- DATA ---
const HOTSPOTS = [
    { id: 'ghana', name: 'Agbogbloshie, Ghana', region: 'Greater Accra', lat: 5.5, lon: -0.2, impact: 'Extreme', labor: '40k+', desc: 'Once the largest e-waste dump in Africa, known for hazardous open-air burning of cables to recover copper.' },
    { id: 'guiyu', name: 'Guiyu, China', region: 'Guangdong', lat: 23.3, lon: 116.3, impact: 'High', labor: '100k+', desc: 'A historic hub where millions of circuit boards were processed. Recent formalization has shifted much of the informal work.' },
    { id: 'delhi', name: 'Seelampur, India', region: 'New Delhi', lat: 28.6, lon: 77.2, impact: 'Very High', labor: '50k+', desc: 'Indias largest informal e-waste market, where thousands of people dismantle electronics by hand.' },
    { id: 'lagos', name: 'Lagos, Nigeria', region: 'Alaba International', lat: 6.5, lon: 3.4, impact: 'High', labor: '25k+', desc: 'A major port of entry for "second-hand" electronics, many of which are non-functional and end up in dumps.' }
];

const FLOWS = [
    { from: [37.7, -122.4], to: [5.5, -0.2], type: 'informal' }, // USA -> Ghana
    { from: [51.5, -0.1], to: [5.5, -0.2], type: 'formal' },   // UK -> Ghana
    { from: [37.7, -122.4], to: [23.3, 116.3], type: 'formal' },   // USA -> China
    { from: [35.6, 139.6], to: [23.3, 116.3], type: 'formal' },   // Japan -> China
    { from: [48.8, 2.3], to: [28.6, 77.2], type: 'informal' }, // EU -> India
    { from: [37.7, -122.4], to: [19.4, -99.1], type: 'formal' },   // USA -> Mexico
    { from: [52.5, 13.4], to: [6.5, 3.4], type: 'informal' }  // Germany -> Nigeria
];

// --- GLOBE PARAMS ---
const GLOBE_RADIUS = 100;
const ARC_HEIGHT = 20;

// --- THREE.JS SETUP ---
let scene, camera, renderer, controls, globe;
let hotspotsGroup = new THREE.Group();
let flowsGroup = new THREE.Group();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function init() {
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 350;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('globe-container').appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.minDistance = 200;
    controls.maxDistance = 600;

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x61b8ff, 3, 1000);
    pointLight.position.set(200, 200, 200);
    scene.add(pointLight);

    createGlobe();
    createHotspots();
    createFlows('all');

    scene.add(hotspotsGroup);
    scene.add(flowsGroup);

    window.addEventListener('resize', onWindowResize);
    renderer.domElement.addEventListener('click', onDocumentMouseDown);
    
    // Hide loader
    setTimeout(() => {
        document.getElementById('loader').style.opacity = '0';
        setTimeout(() => document.getElementById('loader').style.display = 'none', 500);
    }, 1000);

    animate();
}

function createGlobe() {
    // Main Sphere with Procedural Grid Shader
    const geometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 }
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vNormal;
            void main() {
                vUv = uv;
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec2 vUv;
            varying vec3 vNormal;
            uniform float time;
            void main() {
                float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
                vec3 atmosphere = vec3(0.3, 0.6, 1.0) * intensity;
                
                vec2 grid = abs(fract(vUv * 50.0 - 0.5) - 0.5) / fwidth(vUv * 50.0);
                float line = min(grid.x, grid.y);
                float gridVal = 1.0 - min(line, 1.0);
                
                vec3 color = vec3(0.05, 0.1, 0.2);
                color += gridVal * vec3(0.1, 0.3, 0.5) * 0.5;
                
                gl_FragColor = vec4(color + atmosphere, 1.0);
            }
        `,
        transparent: true
    });

    globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    // Glow effect
    const glowGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.15, 64, 64);
    const glowMat = new THREE.ShaderMaterial({
        vertexShader: `
            varying vec3 vNormal;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec3 vNormal;
            void main() {
                float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 6.0);
                gl_FragColor = vec4(0.38, 0.72, 1.0, 1.0) * intensity;
            }
        `,
        side: THREE.BackSide,
        transparent: true,
        blending: THREE.AdditiveBlending
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    scene.add(glow);
}

function latLonToVector3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);

    return new THREE.Vector3(x, y, z);
}

function createHotspots() {
    HOTSPOTS.forEach(spot => {
        const pos = latLonToVector3(spot.lat, spot.lon, GLOBE_RADIUS);
        
        // Marker mesh
        const markerGeo = new THREE.SphereGeometry(2, 16, 16);
        const markerMat = new THREE.MeshBasicMaterial({ color: 0xff6f61 });
        const marker = new THREE.Mesh(markerGeo, markerMat);
        marker.position.copy(pos);
        marker.userData = spot;
        hotspotsGroup.add(marker);

        // Ring
        const ringGeo = new THREE.RingGeometry(3, 5, 32);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xff6f61, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.copy(pos);
        ring.lookAt(new THREE.Vector3(0,0,0));
        hotspotsGroup.add(ring);
        
        gsap.to(ring.scale, { x: 2, y: 2, duration: 2, repeat: -1, ease: 'sine.out' });
        gsap.to(ringMat, { opacity: 0, duration: 2, repeat: -1, ease: 'sine.out' });
    });
}

function createFlows(filter) {
    flowsGroup.clear();
    
    FLOWS.forEach(flow => {
        if (filter !== 'all' && flow.type !== filter) return;

        const start = latLonToVector3(flow.from[0], flow.from[1], GLOBE_RADIUS);
        const end = latLonToVector3(flow.to[0], flow.to[1], GLOBE_RADIUS);

        // Calculate control point for arc
        const mid = start.clone().lerp(end, 0.5).normalize().multiplyScalar(GLOBE_RADIUS + ARC_HEIGHT);
        const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
        
        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        const color = flow.type === 'informal' ? 0xff6f61 : 0x61b8ff;
        const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.6 });
        
        const line = new THREE.Line(geometry, material);
        flowsGroup.add(line);

        // Animated particle on flow
        const dotGeo = new THREE.SphereGeometry(0.8, 8, 8);
        const dotMat = new THREE.MeshBasicMaterial({ color });
        const dot = new THREE.Mesh(dotGeo, dotMat);
        flowsGroup.add(dot);

        gsap.to({}, {
            duration: 3 + Math.random() * 2,
            repeat: -1,
            onUpdate: function() {
                const p = curve.getPoint(this.progress());
                dot.position.copy(p);
            }
        });
    });
}

function onDocumentMouseDown(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(hotspotsGroup.children);

    if (intersects.length > 0) {
        const spot = intersects[0].object.userData;
        if (spot) showInfo(spot);
    }
}

function showInfo(spot) {
    const panel = document.getElementById('info-panel');
    document.getElementById('info-title').textContent = spot.name;
    document.getElementById('info-region').textContent = spot.region;
    document.getElementById('info-desc').textContent = spot.desc;
    document.getElementById('stat-impact').textContent = spot.impact;
    document.getElementById('stat-labor').textContent = spot.labor;
    
    panel.classList.add('active');
    controls.autoRotate = false;
    
    // Smooth camera transition to spot
    const pos = latLonToVector3(spot.lat, spot.lon, 250);
    gsap.to(camera.position, {
        x: pos.x,
        y: pos.y,
        z: pos.z,
        duration: 1.5,
        ease: 'power2.inOut',
        onUpdate: () => camera.lookAt(0,0,0)
    });
}

document.getElementById('close-info').onclick = () => {
    document.getElementById('info-panel').classList.remove('active');
    controls.autoRotate = true;
};

document.querySelectorAll('.control-btn').forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll('.control-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        createFlows(btn.dataset.flow);
    };
});

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    if (globe) globe.material.uniforms.time.value += 0.01;
    renderer.render(scene, camera);
}

init();
