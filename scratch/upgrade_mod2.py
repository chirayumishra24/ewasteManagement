import os

base_dir = "public/activities"

# Activity 2.1: Battery Health Simulator (High-Fidelity)
battery_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Battery Health Simulator Pro | Skilizee E-Waste</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script type="importmap">
        {
            "imports": {
                "three": "https://unpkg.com/three@0.168.0/build/three.module.js",
                "three/addons/": "https://unpkg.com/three@0.168.0/examples/jsm/"
            }
        }
    </script>
    <style>
        :root {
            --page-bg: #f8fafc;
            --surface: #ffffff;
            --primary: #10b981;
            --primary-dark: #059669;
            --text-primary: #0f172a;
            --text-muted: #64748b;
        }
        body { background-color: var(--page-bg); color: var(--text-primary); font-family: 'Inter', sans-serif; overflow-x: hidden; }
        h1, h2, h3, h4 { font-family: 'Poppins', sans-serif; }
        code { font-family: 'JetBrains Mono', monospace; }
        
        #canvas-container {
            width: 100%; height: 500px;
            background: radial-gradient(circle at center, #1e293b 0%, #0f172a 100%);
            border-radius: 20px; position: relative; overflow: hidden;
            box-shadow: inset 0 0 40px rgba(0,0,0,0.5);
        }
        
        .glass-panel {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }
        
        .habit-btn {
            background: white; border: 2px solid #e2e8f0; border-radius: 12px;
            padding: 1rem; cursor: pointer; transition: all 0.3s ease;
            display: flex; align-items: center; gap: 1rem; text-align: left;
        }
        .habit-btn:hover { border-color: var(--primary); transform: translateY(-2px); }
        .habit-btn.active { border-color: #ef4444; background: #fef2f2; box-shadow: 0 4px 15px rgba(239, 68, 68, 0.15); }
        
        .metric-box { background: #f1f5f9; padding: 1rem; border-radius: 12px; text-align: center; }
        .metric-val { font-family: 'JetBrains Mono', monospace; font-size: 1.5rem; font-weight: 700; color: var(--primary-dark); }
        .metric-val.danger { color: #ef4444; }
        .metric-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); font-weight: 600; margin-top: 4px; }
        
        .fullscreen-btn {
            position: absolute; top: 16px; right: 16px; z-index: 50;
            width: 48px; height: 48px; border-radius: 50%;
            background: rgba(255,255,255,0.1); backdrop-filter: blur(8px);
            border: 1px solid rgba(255,255,255,0.2); color: white;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; transition: all 0.2s;
        }
        .fullscreen-btn:hover { background: rgba(255,255,255,0.2); transform: scale(1.05); }
        .is-embedded main { padding-top: 1rem; }
    </style>
</head>
<body>
    <main class="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <header class="text-center space-y-2">
            <span class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider">Module 2.1 • Reduce</span>
            <h1 class="text-3xl font-bold">Battery Degradation Lab</h1>
            <p class="text-slate-500 max-w-2xl mx-auto">Observe how daily charging habits trigger chemical stress inside a lithium-ion cell. Extending battery life is the most effective way to delay device replacement.</p>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
            <!-- 3D View -->
            <div class="relative group">
                <div id="canvas-container">
                    <button class="fullscreen-btn" id="fs-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
                    </button>
                    <!-- Overlay Stats -->
                    <div class="absolute bottom-6 left-6 flex gap-4 z-10">
                        <div class="bg-black/50 backdrop-blur-md border border-white/10 p-3 rounded-xl text-white">
                            <p class="text-[10px] text-white/50 uppercase font-bold tracking-wider mb-1">Core Temp</p>
                            <p class="font-mono text-xl" id="core-temp">25.0°C</p>
                        </div>
                        <div class="bg-black/50 backdrop-blur-md border border-white/10 p-3 rounded-xl text-white">
                            <p class="text-[10px] text-white/50 uppercase font-bold tracking-wider mb-1">Cell Stress</p>
                            <p class="font-mono text-xl" id="cell-stress">Low</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Side Panel -->
            <div class="glass-panel p-6 flex flex-col gap-6">
                <div>
                    <h3 class="text-lg font-bold mb-4">Degradation Metrics</h3>
                    <div class="grid grid-cols-2 gap-3">
                        <div class="metric-box">
                            <div class="metric-val" id="health-val">100%</div>
                            <div class="metric-label">Max Capacity</div>
                        </div>
                        <div class="metric-box">
                            <div class="metric-val" id="cycles-val">1000</div>
                            <div class="metric-label">Cycles Left</div>
                        </div>
                    </div>
                </div>
                
                <div class="flex-1">
                    <h3 class="text-lg font-bold mb-4">Toggle Stressors</h3>
                    <div class="space-y-3" id="habits-container">
                        <!-- Filled by JS -->
                    </div>
                </div>
                
                <div class="p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-800">
                    <strong>Insight:</strong> <span id="insight-text">A healthy battery stays cool and avoids 0% or 100% extremes.</span>
                </div>
            </div>
        </div>
    </main>

    <script type="module">
        import * as THREE from 'three';
        import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

        const HABITS = [
            { id: 'heat', icon: '🔥', label: 'Overheating (Gaming/Sun)', penalty: 15, temp: 18, desc: 'High temps destroy lithium cells faster than anything else. Swelling risk increases.' },
            { id: 'overcharge', icon: '⚡', label: 'Overnight 100% Charge', penalty: 8, temp: 5, desc: 'Holding a battery at 100% voltage causes continuous micro-stress on the anode.' },
            { id: 'deep', icon: '🪫', label: 'Deep Discharge (0%)', penalty: 10, temp: 2, desc: 'Draining to zero damages the battery\'s voltage regulators.' }
        ];

        let scene, camera, renderer, controls;
        let batteryCore, batteryShell, particles;
        let activeHabits = new Set();
        
        let state = { health: 100, temp: 25, cycles: 1000 };

        function init() {
            const container = document.getElementById('canvas-container');
            scene = new THREE.Scene();
            scene.fog = new THREE.FogExp2(0x0f172a, 0.05);

            camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
            camera.position.set(4, 2, 6);

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.2;
            container.appendChild(renderer.domElement);

            controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.autoRotate = true;
            controls.autoRotateSpeed = 1.0;
            controls.enablePan = false;

            // Lights
            scene.add(new THREE.AmbientLight(0xffffff, 0.2));
            const mainLight = new THREE.SpotLight(0xffffff, 5);
            mainLight.position.set(5, 10, 5);
            scene.add(mainLight);
            
            const backLight = new THREE.PointLight(0x10b981, 5, 20); // Green glow
            backLight.position.set(-2, 0, -2);
            scene.add(backLight);

            buildBattery();
            buildHabits();
            
            window.addEventListener('resize', () => {
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            });
            
            // Fullscreen
            document.getElementById('fs-btn').addEventListener('click', () => {
                if(!document.fullscreenElement) container.requestFullscreen();
                else document.exitFullscreen();
            });

            animate();
        }

        function buildBattery() {
            const group = new THREE.Group();

            // Shell (Glass)
            const shellGeo = new THREE.CylinderGeometry(1.2, 1.2, 3, 32);
            const shellMat = new THREE.MeshPhysicalMaterial({
                color: 0xffffff,
                metalness: 0.1,
                roughness: 0.1,
                transmission: 0.9, // glass effect
                thickness: 0.5,
                clearcoat: 1.0
            });
            batteryShell = new THREE.Mesh(shellGeo, shellMat);
            group.add(batteryShell);

            // Core (Electrolyte/Anode)
            const coreGeo = new THREE.CylinderGeometry(1.0, 1.0, 2.8, 32);
            const coreMat = new THREE.MeshStandardMaterial({
                color: 0x10b981, // Emerald Green
                emissive: 0x10b981,
                emissiveIntensity: 0.5,
                roughness: 0.4,
                metalness: 0.8
            });
            batteryCore = new THREE.Mesh(coreGeo, coreMat);
            group.add(batteryCore);

            // Caps
            const capMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.2 });
            const topCap = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.25, 0.2, 32), capMat);
            topCap.position.y = 1.6;
            group.add(topCap);
            const bottomCap = topCap.clone();
            bottomCap.position.y = -1.6;
            group.add(bottomCap);

            // Positive terminal
            const terminal = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.2, 32), capMat);
            terminal.position.y = 1.8;
            group.add(terminal);

            scene.add(group);
            
            // Particle system for stress
            const pGeo = new THREE.BufferGeometry();
            const pCount = 500;
            const pPos = new Float32Array(pCount * 3);
            for(let i=0; i<pCount; i++) {
                pPos[i*3] = (Math.random() - 0.5) * 2;
                pPos[i*3+1] = (Math.random() - 0.5) * 2.8;
                pPos[i*3+2] = (Math.random() - 0.5) * 2;
            }
            pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
            const pMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, transparent: true, opacity: 0 });
            particles = new THREE.Points(pGeo, pMat);
            scene.add(particles);
        }

        function buildHabits() {
            const container = document.getElementById('habits-container');
            HABITS.forEach(h => {
                const btn = document.createElement('button');
                btn.className = 'habit-btn';
                btn.innerHTML = `<span class="text-2xl">${h.icon}</span><span class="font-bold text-sm text-slate-700">${h.label}</span>`;
                btn.onclick = () => {
                    if (activeHabits.has(h.id)) {
                        activeHabits.delete(h.id);
                        btn.classList.remove('active');
                    } else {
                        activeHabits.add(h.id);
                        btn.classList.add('active');
                    }
                    document.getElementById('insight-text').textContent = activeHabits.size > 0 ? h.desc : 'A healthy battery stays cool and avoids 0% or 100% extremes.';
                    recalculate();
                };
                container.appendChild(btn);
            });
        }

        function recalculate() {
            let totalPen = 0;
            let tempAdd = 0;
            activeHabits.forEach(id => {
                const h = HABITS.find(x => x.id === id);
                totalPen += h.penalty;
                tempAdd += h.temp;
            });

            const targetHealth = Math.max(10, 100 - (totalPen * 2));
            const targetCycles = Math.max(100, 1000 - (totalPen * 25));
            const targetTemp = 25 + tempAdd;

            gsap.to(state, {
                health: targetHealth,
                cycles: targetCycles,
                temp: targetTemp,
                duration: 1.5,
                ease: 'power2.out',
                onUpdate: () => {
                    document.getElementById('health-val').textContent = `${Math.round(state.health)}%`;
                    document.getElementById('cycles-val').textContent = Math.round(state.cycles);
                    document.getElementById('core-temp').textContent = `${state.temp.toFixed(1)}°C`;
                    
                    const stressLvl = state.temp > 40 ? 'CRITICAL' : (state.temp > 30 ? 'ELEVATED' : 'NORMAL');
                    document.getElementById('cell-stress').textContent = stressLvl;
                    document.getElementById('cell-stress').className = `font-mono text-xl ${stressLvl==='CRITICAL'?'text-red-400':(stressLvl==='ELEVATED'?'text-orange-400':'text-emerald-400')}`;
                    
                    if(state.health < 60) document.getElementById('health-val').classList.add('danger');
                    else document.getElementById('health-val').classList.remove('danger');

                    // Visuals
                    const ratio = state.health / 100;
                    // Color shifts from Green -> Orange -> Red
                    const hColor = new THREE.Color().setHSL(ratio * 0.4, 1.0, 0.4);
                    batteryCore.material.color = hColor;
                    batteryCore.material.emissive = hColor;
                    
                    // Swelling
                    const swell = 1.0 + (Math.max(0, state.temp - 30) / 100);
                    batteryShell.scale.set(swell, 1, swell);
                    
                    // Particles (Gas buildup)
                    particles.material.opacity = (1 - ratio) * 0.8;
                    particles.material.color = new THREE.Color(state.temp > 35 ? 0xff4444 : 0xffaa00);
                }
            });
        }

        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            
            if (particles.material.opacity > 0) {
                const positions = particles.geometry.attributes.position.array;
                for(let i=1; i<positions.length; i+=3) {
                    positions[i] += 0.01;
                    if (positions[i] > 1.4) positions[i] = -1.4;
                }
                particles.geometry.attributes.position.needsUpdate = true;
            }
            
            renderer.render(scene, camera);
        }

        // Init
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('embedded') === 'true') document.body.classList.add('is-embedded');
        init();
    </script>
</body>
</html>"""

# Activity 2.2: Second Life Workshop (High-Fidelity Carousel)
second_life_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Second Life Workshop | Skilizee E-Waste</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script type="importmap">
        {
            "imports": {
                "three": "https://unpkg.com/three@0.168.0/build/three.module.js",
                "three/addons/": "https://unpkg.com/three@0.168.0/examples/jsm/"
            }
        }
    </script>
    <style>
        :root {
            --page-bg: #faf5ff;
            --surface: #ffffff;
            --primary: #a855f7;
            --primary-dark: #7e22ce;
            --text-primary: #1e293b;
        }
        body { background-color: var(--page-bg); color: var(--text-primary); font-family: 'Inter', sans-serif; overflow-x: hidden; }
        h1, h2, h3, h4 { font-family: 'Poppins', sans-serif; }
        
        #canvas-container {
            width: 100%; height: 450px;
            background: radial-gradient(circle at center, #2e1065 0%, #0f172a 100%);
            border-radius: 20px; position: relative; overflow: hidden;
            box-shadow: 0 20px 40px rgba(168, 85, 247, 0.15);
        }
        
        .glass-panel {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255,255,255,0.4);
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.03);
        }
        
        .mission-btn {
            background: white; border: 2px solid transparent; border-radius: 16px;
            padding: 1.5rem; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.02);
        }
        .mission-btn:hover { transform: translateY(-4px); box-shadow: 0 12px 20px rgba(168, 85, 247, 0.1); }
        .mission-btn.active { border-color: var(--primary); background: #faf5ff; }
        
        .nav-arrow {
            position: absolute; top: 50%; transform: translateY(-50%);
            width: 48px; height: 48px; background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2); border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            color: white; cursor: pointer; z-index: 20; backdrop-filter: blur(4px);
            transition: background 0.2s;
        }
        .nav-arrow:hover { background: rgba(255,255,255,0.2); }
        .nav-left { left: 20px; } .nav-right { right: 20px; }

        .fullscreen-btn {
            position: absolute; top: 16px; right: 16px; z-index: 50;
            width: 48px; height: 48px; border-radius: 50%;
            background: rgba(255,255,255,0.1); backdrop-filter: blur(8px);
            border: 1px solid rgba(255,255,255,0.2); color: white;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; transition: all 0.2s;
        }
        .fullscreen-btn:hover { background: rgba(255,255,255,0.2); transform: scale(1.05); }
    </style>
</head>
<body>
    <main class="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <header class="text-center space-y-2">
            <span class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold uppercase tracking-wider">Module 2.2 • Reuse</span>
            <h1 class="text-3xl font-bold">Second Life Workshop</h1>
            <p class="text-slate-500 max-w-2xl mx-auto">Retired hardware is not junk. It is computing power waiting for a new purpose. Match old devices with new "missions" to unlock massive carbon savings.</p>
        </header>

        <div id="canvas-container" class="group">
            <button class="fullscreen-btn" id="fs-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
            </button>
            <button class="nav-arrow nav-left" id="prev-btn">←</button>
            <button class="nav-arrow nav-right" id="next-btn">→</button>
            
            <div class="absolute bottom-6 w-full text-center pointer-events-none z-10">
                <h2 class="text-3xl font-bold text-white tracking-wide" id="device-name">Smartphone</h2>
                <p class="text-purple-300 font-mono text-sm mt-1" id="device-spec">Snapdragon 845 • 6GB RAM</p>
            </div>
        </div>

        <div class="glass-panel p-8">
            <h3 class="text-xl font-bold mb-6 text-center">Assign New Mission</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6" id="missions-grid">
                <!-- JS Filled -->
            </div>
            
            <div id="outcome-box" class="mt-8 p-6 bg-purple-50 rounded-xl border border-purple-100 hidden">
                <h4 class="text-lg font-bold text-purple-900 flex items-center gap-2"><span id="outcome-icon">✨</span> <span id="outcome-title">Mission Assigned</span></h4>
                <p class="text-purple-700 mt-2" id="outcome-desc">Description</p>
                <div class="mt-4 flex gap-4">
                    <span class="px-3 py-1 bg-white rounded-full text-sm font-bold text-green-600 shadow-sm" id="outcome-save">Saves ₹2500</span>
                    <span class="px-3 py-1 bg-white rounded-full text-sm font-bold text-emerald-600 shadow-sm" id="outcome-co2">-70kg CO₂</span>
                </div>
            </div>
        </div>
    </main>

    <script type="module">
        import * as THREE from 'three';
        import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

        const DEVICES = [
            { id: 'phone', name: 'Retired Smartphone', spec: 'OLED Display • WiFi • Internal UPS (Battery)', geo: [0.7, 1.4, 0.05], color: 0x111111 },
            { id: 'tablet', name: 'Old Tablet', spec: '10" Screen • Bluetooth • Wall-mountable', geo: [1.4, 1.0, 0.06], color: 0x222222 },
            { id: 'laptop', name: 'Broken Screen Laptop', spec: 'Core i5 • 8GB RAM • SATA Ports', geo: [1.6, 0.05, 1.1], color: 0x444444 }
        ];

        const MISSIONS = [
            { id: 'cam', icon: '📹', title: 'Security Camera Node', desc: 'A smartphone camera and battery out-perform most dedicated IP cameras. Install Alfred or Haven.', save: '₹3,000', co2: '-12kg CO₂' },
            { id: 'hub', icon: '🏠', title: 'Smart Home Dashboard', desc: 'Wall-mount a tablet to run Home Assistant. It becomes a central premium interface for your home.', save: '₹8,000', co2: '-35kg CO₂' },
            { id: 'nas', icon: '🗄️', title: 'Home Server (NAS)', desc: 'A screen-less laptop is a perfect silent server. Connect an external drive to run OpenMediaVault.', save: '₹15,000', co2: '-110kg CO₂' }
        ];

        let scene, camera, renderer, controls;
        let deviceGroup = new THREE.Group();
        let currentIndex = 0;
        let isAnimating = false;

        function init() {
            const container = document.getElementById('canvas-container');
            scene = new THREE.Scene();

            camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
            camera.position.set(0, 0, 4);

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            container.appendChild(renderer.domElement);

            controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.enableZoom = false;
            controls.enablePan = false;

            // Lights
            scene.add(new THREE.AmbientLight(0xffffff, 0.5));
            const spotLight = new THREE.SpotLight(0xc084fc, 10);
            spotLight.position.set(0, 5, 5);
            scene.add(spotLight);

            scene.add(deviceGroup);
            
            // Build devices
            DEVICES.forEach((dev, i) => {
                const mesh = new THREE.Mesh(
                    new THREE.BoxGeometry(...dev.geo),
                    new THREE.MeshStandardMaterial({ color: dev.color, metalness: 0.8, roughness: 0.2 })
                );
                // "Screen" glow
                const screen = new THREE.Mesh(
                    new THREE.PlaneGeometry(dev.geo[0]*0.9, dev.geo[1]*0.9),
                    new THREE.MeshBasicMaterial({ color: 0x1e1b4b })
                );
                screen.position.z = dev.geo[2]/2 + 0.001;
                mesh.add(screen);
                mesh.userData = { screenMat: screen.material };
                
                mesh.position.x = i * 5; // Spaced out horizontally
                deviceGroup.add(mesh);
            });

            buildMissions();
            updateUI();

            document.getElementById('prev-btn').onclick = () => rotate(-1);
            document.getElementById('next-btn').onclick = () => rotate(1);
            
            document.getElementById('fs-btn').onclick = () => {
                if(!document.fullscreenElement) container.requestFullscreen();
                else document.exitFullscreen();
            };

            window.addEventListener('resize', () => {
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            });

            animate();
        }

        function rotate(dir) {
            if(isAnimating) return;
            isAnimating = true;
            
            currentIndex = (currentIndex + dir + DEVICES.length) % DEVICES.length;
            
            gsap.to(deviceGroup.position, {
                x: -currentIndex * 5,
                duration: 0.8,
                ease: "power3.inOut",
                onComplete: () => isAnimating = false
            });
            
            // Reset rotation
            gsap.to(deviceGroup.children[currentIndex].rotation, { x: 0, y: 0, z: 0, duration: 0.5 });
            
            updateUI();
            
            // Hide outcome
            document.getElementById('outcome-box').classList.add('hidden');
            document.querySelectorAll('.mission-btn').forEach(b => b.classList.remove('active'));
            
            // Reset screens
            deviceGroup.children.forEach(c => gsap.to(c.userData.screenMat.color, {r:0.1, g:0.1, b:0.3, duration:0.5}));
        }

        function updateUI() {
            const dev = DEVICES[currentIndex];
            document.getElementById('device-name').textContent = dev.name;
            document.getElementById('device-spec').textContent = dev.spec;
        }

        function buildMissions() {
            const grid = document.getElementById('missions-grid');
            MISSIONS.forEach((m, i) => {
                const btn = document.createElement('button');
                btn.className = 'mission-btn';
                btn.innerHTML = `<div class="text-4xl mb-3">${m.icon}</div><h4 class="font-bold">${m.title}</h4>`;
                btn.onclick = () => {
                    document.querySelectorAll('.mission-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    const box = document.getElementById('outcome-box');
                    box.classList.remove('hidden');
                    document.getElementById('outcome-icon').textContent = m.icon;
                    document.getElementById('outcome-title').textContent = m.title;
                    document.getElementById('outcome-desc').textContent = m.desc;
                    document.getElementById('outcome-save').textContent = 'Saves ' + m.save;
                    document.getElementById('outcome-co2').textContent = m.co2;
                    
                    gsap.from(box, { opacity: 0, y: 10, duration: 0.4 });
                    
                    // Hologram screen effect
                    const screenMat = deviceGroup.children[currentIndex].userData.screenMat;
                    gsap.to(screenMat.color, { r:0.6, g:0.3, b:1.0, duration: 0.5 });
                };
                grid.appendChild(btn);
            });
        }

        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            
            // Float effect for active device
            if(!isAnimating) {
                const activeMesh = deviceGroup.children[currentIndex];
                activeMesh.position.y = Math.sin(Date.now() * 0.002) * 0.1;
                activeMesh.rotation.y = Math.sin(Date.now() * 0.001) * 0.1;
            }
            
            renderer.render(scene, camera);
        }

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('embedded') === 'true') document.body.classList.add('is-embedded');
        init();
    </script>
</body>
</html>"""

# Activity 2.3: Urban Mine Shredder (High-Fidelity Physics/Sorting)
shredder_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Urban Mine Explorer Pro | Skilizee E-Waste</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script type="importmap">
        {
            "imports": {
                "three": "https://unpkg.com/three@0.168.0/build/three.module.js",
                "three/addons/": "https://unpkg.com/three@0.168.0/examples/jsm/"
            }
        }
    </script>
    <style>
        :root {
            --page-bg: #f1f5f9;
            --surface: #ffffff;
            --primary: #ea580c;
            --primary-dark: #c2410c;
            --text-primary: #0f172a;
        }
        body { background-color: var(--page-bg); color: var(--text-primary); font-family: 'Inter', sans-serif; overflow-x: hidden; }
        h1, h2, h3, h4 { font-family: 'Poppins', sans-serif; }
        
        #canvas-container {
            width: 100%; height: 550px;
            background: linear-gradient(180deg, #1e293b 0%, #020617 100%);
            border-radius: 20px; position: relative; overflow: hidden;
            box-shadow: inset 0 0 50px rgba(0,0,0,0.8);
        }
        
        .glass-panel {
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid rgba(0,0,0,0.05);
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }
        
        .action-btn {
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            color: white; font-family: 'JetBrains Mono', monospace; font-size: 1.2rem;
            padding: 1rem 2rem; border-radius: 12px; font-weight: 700; text-transform: uppercase;
            letter-spacing: 0.1em; transition: all 0.2s; border: none; cursor: pointer;
            box-shadow: 0 8px 20px rgba(234, 88, 12, 0.3);
            width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        .action-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 25px rgba(234, 88, 12, 0.4); }
        .action-btn:active { transform: translateY(2px); }
        
        .counter-display {
            font-family: 'JetBrains Mono', monospace; font-size: 2.5rem; font-weight: 700;
            color: #10b981; text-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
            background: #0f172a; padding: 0.5rem 1rem; border-radius: 8px; border: 1px solid #334155;
            display: inline-block; min-width: 150px; text-align: center;
        }

        .legend-dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
        
        .fullscreen-btn {
            position: absolute; top: 16px; right: 16px; z-index: 50;
            width: 48px; height: 48px; border-radius: 50%;
            background: rgba(255,255,255,0.1); backdrop-filter: blur(8px);
            border: 1px solid rgba(255,255,255,0.2); color: white;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; transition: all 0.2s;
        }
        .fullscreen-btn:hover { background: rgba(255,255,255,0.2); transform: scale(1.05); }
    </style>
</head>
<body>
    <main class="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <header class="flex justify-between items-end">
            <div>
                <span class="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-block">Module 2.3 • Recycle</span>
                <h1 class="text-3xl font-bold">Urban Mine Industrial Triage</h1>
            </div>
            <div class="text-right">
                <p class="text-xs text-slate-500 font-bold uppercase mb-1">Recovered Value</p>
                <div class="counter-display" id="value-counter">$0.00</div>
            </div>
        </header>

        <div class="relative group">
            <div id="canvas-container">
                <button class="fullscreen-btn" id="fs-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
                </button>
                <!-- UI Overlay in 3D Space -->
                <div class="absolute top-6 left-6 text-white bg-black/40 backdrop-blur border border-white/10 p-4 rounded-xl">
                    <h3 class="font-mono font-bold text-sm text-orange-400 mb-2">SYSTEM STATUS: <span class="text-green-400">ONLINE</span></h3>
                    <ul class="text-xs space-y-2 font-mono text-slate-300">
                        <li><span class="legend-dot bg-blue-500 mr-2"></span> FERROUS (Magnetic)</li>
                        <li><span class="legend-dot bg-orange-500 mr-2"></span> NON-FERROUS (Eddy)</li>
                        <li><span class="legend-dot bg-slate-400 mr-2"></span> PLASTICS (Residue)</li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="glass-panel p-6 md:col-span-1 flex flex-col justify-center">
                <p class="text-sm text-slate-500 mb-4">Introduce e-waste into the shredder. Magnets will automatically pull iron/steel upward, while copper/aluminum fall to the secondary bin.</p>
                <button class="action-btn" id="shred-btn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    ENGAGE SHREDDER
                </button>
            </div>
            
            <div class="glass-panel p-6 md:col-span-2">
                <h3 class="text-lg font-bold mb-3">The Process</h3>
                <div class="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div class="w-10 h-10 mx-auto bg-slate-100 rounded-full flex items-center justify-center font-bold mb-2">1</div>
                        <p class="text-xs font-bold">Primary Shred</p>
                        <p class="text-[10px] text-slate-500 mt-1">20mm fragments</p>
                    </div>
                    <div>
                        <div class="w-10 h-10 mx-auto bg-slate-100 rounded-full flex items-center justify-center font-bold mb-2">2</div>
                        <p class="text-xs font-bold">Magnetic Triage</p>
                        <p class="text-[10px] text-slate-500 mt-1">Lifts Ferrous metals</p>
                    </div>
                    <div>
                        <div class="w-10 h-10 mx-auto bg-slate-100 rounded-full flex items-center justify-center font-bold mb-2">3</div>
                        <p class="text-xs font-bold">Density Split</p>
                        <p class="text-[10px] text-slate-500 mt-1">Plastics vs Copper/Alu</p>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <script type="module">
        import * as THREE from 'three';
        import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

        let scene, camera, renderer, controls;
        let machineGroup = new THREE.Group();
        let rollers = [];
        let particles = [];
        let totalValue = 0;

        const MATS = {
            machine: new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.2 }),
            belt: new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 }),
            ferrous: new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 1.0, roughness: 0.2 }),
            nonferrous: new THREE.MeshStandardMaterial({ color: 0xf97316, metalness: 0.9, roughness: 0.3 }),
            plastic: new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.8 })
        };

        function init() {
            const container = document.getElementById('canvas-container');
            scene = new THREE.Scene();
            scene.fog = new THREE.FogExp2(0x020617, 0.04);

            camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
            camera.position.set(0, 8, 15);

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.shadowMap.enabled = true;
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            container.appendChild(renderer.domElement);

            controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.maxPolarAngle = Math.PI/2 - 0.1; // Don't go below ground

            // Lights
            scene.add(new THREE.AmbientLight(0xffffff, 0.3));
            const spot = new THREE.SpotLight(0xffffff, 100);
            spot.position.set(0, 15, 0);
            spot.angle = Math.PI/4;
            spot.penumbra = 0.5;
            spot.castShadow = true;
            scene.add(spot);
            
            const accent = new THREE.PointLight(0xea580c, 50, 10);
            accent.position.set(0, 2, 0);
            scene.add(accent);

            buildMachine();
            
            document.getElementById('shred-btn').onclick = triggerShred;
            
            document.getElementById('fs-btn').onclick = () => {
                if(!document.fullscreenElement) container.requestFullscreen();
                else document.exitFullscreen();
            };

            window.addEventListener('resize', () => {
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            });

            animate();
        }

        function buildMachine() {
            // Main Hopper
            const hopper = new THREE.Mesh(new THREE.CylinderGeometry(3, 1.5, 4, 4, 1, true), MATS.machine);
            hopper.position.y = 6;
            hopper.rotation.y = Math.PI/4;
            hopper.material.side = THREE.DoubleSide;
            machineGroup.add(hopper);
            
            // Rollers (Shredder blades)
            for(let i=0; i<2; i++) {
                const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 3, 8), MATS.machine);
                roller.rotation.z = Math.PI/2;
                roller.position.set(0, 3.5, i===0 ? -0.7 : 0.7);
                machineGroup.add(roller);
                rollers.push({ mesh: roller, dir: i===0 ? 1 : -1 });
            }

            // Magnetic Belt (Overhead)
            const magBelt = new THREE.Mesh(new THREE.BoxGeometry(4, 0.5, 2), new THREE.MeshStandardMaterial({color:0x334155, metalness:0.9}));
            magBelt.position.set(4, 2, 0);
            machineGroup.add(magBelt);
            
            // Lower Conveyor
            const conv = new THREE.Mesh(new THREE.BoxGeometry(10, 0.2, 3), MATS.belt);
            conv.position.set(2, 0, 0);
            machineGroup.add(conv);
            
            // Bins
            const binMat = new THREE.MeshStandardMaterial({color: 0x1e293b, transparent:true, opacity:0.8});
            const bin1 = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), binMat); // Ferrous
            bin1.position.set(6, -1, 3);
            machineGroup.add(bin1);
            
            const bin2 = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), binMat); // Non-Ferrous
            bin2.position.set(7, -1, 0);
            machineGroup.add(bin2);

            scene.add(machineGroup);
        }

        function triggerShred() {
            // Drop a chunk into hopper
            const chunk = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.5), MATS.machine);
            chunk.position.set(0, 9, 0);
            scene.add(chunk);
            
            gsap.to(chunk.position, {
                y: 4, duration: 0.5, ease: "power2.in",
                onComplete: () => {
                    scene.remove(chunk);
                    // Spawn particles
                    spawnParticles();
                    
                    // Shake camera slightly
                    gsap.fromTo(camera.position, 
                        {x: camera.position.x + 0.1}, 
                        {x: camera.position.x, duration: 0.1, yoyo: true, repeat: 3}
                    );
                }
            });
        }

        function spawnParticles() {
            const count = 30;
            const types = [
                { type: 'ferrous', mat: MATS.ferrous, val: 0.10 },
                { type: 'nonferrous', mat: MATS.nonferrous, val: 0.50 },
                { type: 'plastic', mat: MATS.plastic, val: 0.00 }
            ];
            
            for(let i=0; i<count; i++) {
                const t = types[Math.floor(Math.random() * types.length)];
                const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), t.mat);
                
                mesh.position.set((Math.random()-0.5)*1.5, 3.5, (Math.random()-0.5)*1.5);
                
                scene.add(mesh);
                particles.push({
                    mesh,
                    type: t.type,
                    val: t.val,
                    vel: new THREE.Vector3((Math.random()-0.5)*0.1, -0.2, (Math.random()-0.5)*0.1),
                    state: 'falling' // falling -> conveyor -> magnetic_lift -> falling_bin
                });
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            
            // Spin rollers
            rollers.forEach(r => r.mesh.rotation.x += 0.2 * r.dir);
            
            // Particle Physics
            for(let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                
                if (p.state === 'falling') {
                    p.vel.y -= 0.01; // Gravity
                    p.mesh.position.add(p.vel);
                    p.mesh.rotation.x += 0.1;
                    
                    if (p.mesh.position.y <= 0.2) {
                        p.mesh.position.y = 0.2;
                        p.state = 'conveyor';
                    }
                } 
                else if (p.state === 'conveyor') {
                    p.mesh.position.x += 0.08; // Move right
                    
                    // Magnetic Zone
                    if (p.mesh.position.x > 3 && p.mesh.position.x < 5 && p.type === 'ferrous') {
                        p.state = 'magnetic_lift';
                    }
                    
                    // End of conveyor
                    if (p.mesh.position.x > 7) {
                        p.state = 'falling_bin2';
                        p.vel.set(0.05, 0, 0);
                    }
                }
                else if (p.state === 'magnetic_lift') {
                    p.mesh.position.y += 0.1;
                    if(p.mesh.position.y > 1.8) {
                        p.mesh.position.y = 1.8;
                        p.mesh.position.z += 0.05; // Move towards bin 1
                        if(p.mesh.position.z > 3) {
                            p.state = 'falling_bin1';
                            p.vel.set(0, -0.1, 0);
                        }
                    }
                }
                else if (p.state === 'falling_bin1' || p.state === 'falling_bin2') {
                    p.vel.y -= 0.01;
                    p.mesh.position.add(p.vel);
                    if (p.mesh.position.y < -0.8) {
                        // Landed in bin
                        totalValue += p.val;
                        document.getElementById('value-counter').textContent = '$' + totalValue.toFixed(2);
                        
                        scene.remove(p.mesh);
                        particles.splice(i, 1);
                    }
                }
            }
            
            renderer.render(scene, camera);
        }

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('embedded') === 'true') document.body.classList.add('is-embedded');
        init();
    </script>
</body>
</html>"""

with open(os.path.join(base_dir, "2-1-battery-sim.html"), "w", encoding="utf-8") as f:
    f.write(battery_html)

with open(os.path.join(base_dir, "2-2-second-life.html"), "w", encoding="utf-8") as f:
    f.write(second_life_html)

with open(os.path.join(base_dir, "2-3-shredder.html"), "w", encoding="utf-8") as f:
    f.write(shredder_html)

print("Successfully generated high-fidelity Module 2 activities.")
