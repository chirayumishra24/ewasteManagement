import os

base_dir = "public/activities"

# 3.1 Facility Finder Simulator
finder_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Facility Finder Pro | Skilizee E-Waste</title>
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
        :root { --primary: #61b8ff; }
        body { font-family: 'Inter', sans-serif; background: #f8fafc; overflow: hidden; }
        #canvas-container { height: 100vh; background: radial-gradient(circle, #f8fafc, #e2e8f0); position: relative; }
        .hud { position: absolute; top: 30px; left: 30px; z-index: 10; pointer-events: none; }
        .glass { background: rgba(255,255,255,0.8); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); border-radius: 20px; pointer-events: auto; }
        .dossier { position: absolute; right: 30px; top: 30px; bottom: 30px; width: 350px; transform: translateX(400px); transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        .dossier.open { transform: translateX(0); }
        .fullscreen-btn { position: absolute; top: 30px; right: 400px; z-index: 20; width: 50px; height: 50px; border-radius: 50%; background: #1e293b; color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.3s; }
        .fullscreen-btn:hover { transform: scale(1.1); }
    </style>
</head>
<body>
    <div id="canvas-container">
        <button class="fullscreen-btn" onclick="document.body.requestFullscreen()">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
        </button>
        <div class="hud space-y-4">
            <div class="glass p-6 w-80">
                <h1 class="text-2xl font-bold text-slate-800">Facility Scanner</h1>
                <p class="text-sm text-slate-500 mt-2">Scan the city block to identify certified e-waste facilities.</p>
            </div>
            <div class="glass p-4">
                <div class="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                    <span>Confidence</span>
                    <span id="conf-val">0%</span>
                </div>
                <div class="h-1 bg-slate-200 mt-2 rounded-full overflow-hidden">
                    <div id="conf-bar" class="h-full bg-blue-500 w-0"></div>
                </div>
            </div>
        </div>

        <div class="dossier glass p-8 flex flex-direction-column space-y-6" id="dossier">
            <div class="flex justify-between items-center">
                <h2 class="text-xl font-bold" id="fac-name">Building Alpha</h2>
                <button onclick="closeDossier()" class="text-slate-400 hover:text-slate-600">
                    <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>
                </button>
            </div>
            <div class="space-y-4">
                <div class="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <p class="text-xs font-bold text-blue-600 uppercase">Status</p>
                    <p class="font-bold text-slate-800" id="fac-status">Processing Center</p>
                </div>
                <div class="space-y-2">
                    <p class="text-xs font-bold text-slate-400 uppercase">Certification</p>
                    <ul class="space-y-2 text-sm text-slate-600" id="fac-certs"></ul>
                </div>
            </div>
            <div class="mt-auto pt-6 border-t border-slate-100">
                <button class="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 transition" id="action-btn">Verify Facility</button>
            </div>
        </div>
    </div>

    <script type="module">
        import * as THREE from 'three';
        import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

        let scene, camera, renderer, controls, raycaster, mouse;
        const buildings = [];

        function init() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(10, 10, 10);

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.shadowMap.enabled = true;
            document.getElementById('canvas-container').appendChild(renderer.domElement);

            controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.maxPolarAngle = Math.PI / 2.1;

            scene.add(new THREE.AmbientLight(0xffffff, 0.8));
            const sun = new THREE.DirectionalLight(0xffffff, 1);
            sun.position.set(5, 10, 5);
            sun.castShadow = true;
            scene.add(sun);

            // Grid Floor
            const grid = new THREE.GridHelper(20, 20, 0x000000, 0x000000);
            grid.material.opacity = 0.05;
            grid.material.transparent = true;
            scene.add(grid);

            // Generate Buildings
            for(let i=0; i<8; i++) {
                const h = 2 + Math.random() * 4;
                const mesh = new THREE.Mesh(
                    new THREE.BoxGeometry(1.5, h, 1.5),
                    new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.1, roughness: 0.8 })
                );
                mesh.position.set(Math.random() * 10 - 5, h/2, Math.random() * 10 - 5);
                mesh.userData = { 
                    name: `Node ${String.fromCharCode(65+i)}`, 
                    type: i % 2 === 0 ? 'Authorized Recycler' : 'Unverified Hub',
                    certs: i % 2 === 0 ? ['R2 Certified', 'ISO 14001', 'State Board Listed'] : ['No Active Permits']
                };
                scene.add(mesh);
                buildings.push(mesh);
            }

            raycaster = new THREE.Raycaster();
            mouse = new THREE.Vector2();

            window.addEventListener('click', onSelect);
            animate();
        }

        function onSelect(e) {
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(buildings);

            if(intersects.length > 0) {
                const data = intersects[0].object.userData;
                showDossier(data);
            }
        }

        function showDossier(data) {
            document.getElementById('fac-name').textContent = data.name;
            document.getElementById('fac-status').textContent = data.type;
            const certList = document.getElementById('fac-certs');
            certList.innerHTML = data.certs.map(c => `<li>• ${c}</li>`).join('');
            document.getElementById('dossier').classList.add('open');
            
            gsap.to('#conf-val', { innerText: 100, duration: 1, roundProps: 'innerText', onUpdate: () => {
                document.getElementById('conf-bar').style.width = document.getElementById('conf-val').innerText + '%';
            }});
        }

        window.closeDossier = () => {
            document.getElementById('dossier').classList.remove('open');
            gsap.to('#conf-val', { innerText: 0, duration: 0.5, roundProps: 'innerText', onUpdate: () => {
                document.getElementById('conf-bar').style.width = '0%';
            }});
        };

        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }

        init();
    </script>
</body>
</html>"""

# 3.1 Drive Calendar Planner
calendar_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Temporal Orbit | Skilizee E-Waste</title>
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
        body { font-family: 'Inter', sans-serif; background: #fffbeb; overflow: hidden; margin: 0; }
        #canvas-container { height: 100vh; position: relative; }
        .overlay { position: absolute; top: 40px; left: 40px; z-index: 10; pointer-events: none; }
        .glass { background: rgba(255,255,255,0.7); backdrop-filter: blur(12px); border-radius: 24px; padding: 2rem; border: 1px solid rgba(255,255,255,0.3); pointer-events: auto; }
        .event-card { cursor: pointer; transition: 0.3s; }
        .event-card:hover { transform: translateY(-4px); }
        .fullscreen-btn { position: absolute; top: 40px; right: 40px; z-index: 20; width: 56px; height: 56px; border-radius: 50%; background: #f3a44a; color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; }
    </style>
</head>
<body>
    <div id="canvas-container">
        <button class="fullscreen-btn" onclick="document.body.requestFullscreen()">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
        </button>
        <div class="overlay w-96 space-y-6">
            <div class="glass">
                <h1 class="text-3xl font-bold text-amber-900">Temporal Orbit</h1>
                <p class="text-amber-800/60 mt-2">Pin collection events to the yearly orbit. Timing awareness drives participation.</p>
            </div>
            <div class="space-y-3">
                <div class="glass p-4 flex items-center gap-4 event-card" onclick="pinEvent('Intl E-Waste Day', 0xff6b6b)">
                    <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">📅</div>
                    <div><h3 class="font-bold">Intl E-Waste Day</h3><p class="text-xs opacity-60">Global Outreach (Oct 14)</p></div>
                </div>
                <div class="glass p-4 flex items-center gap-4 event-card" onclick="pinEvent('School Drive', 0x4dabf7)">
                    <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">🏫</div>
                    <div><h3 class="font-bold">School Drive</h3><p class="text-xs opacity-60">Mid-Term Cycle</p></div>
                </div>
            </div>
        </div>
    </div>

    <script type="module">
        import * as THREE from 'three';
        import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

        let scene, camera, renderer, ring, center;
        const pins = [];

        function init() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
            camera.position.set(0, 5, 10);

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.getElementById('canvas-container').appendChild(renderer.domElement);

            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;

            // Lights
            scene.add(new THREE.AmbientLight(0xffffff, 0.8));
            const pLight = new THREE.PointLight(0xffffff, 1); pLight.position.set(0, 10, 0); scene.add(pLight);

            // Orbit Ring
            const ringGeo = new THREE.TorusGeometry(4, 0.05, 16, 100);
            const ringMat = new THREE.MeshStandardMaterial({ color: 0xf3a44a, transparent: true, opacity: 0.3 });
            ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = Math.PI / 2;
            scene.add(ring);

            center = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshStandardMaterial({ color: 0xf3a44a }));
            scene.add(center);

            animate();
        }

        window.pinEvent = (name, color) => {
            const angle = Math.random() * Math.PI * 2;
            const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.05, 1), new THREE.MeshStandardMaterial({ color }));
            pin.position.set(Math.cos(angle) * 4, 0.5, Math.sin(angle) * 4);
            scene.add(pin);
            gsap.from(pin.scale, { x:0, y:0, z:0, duration: 0.5, ease: "back.out" });
        };

        function animate() {
            requestAnimationFrame(animate);
            ring.rotation.z += 0.002;
            renderer.render(scene, camera);
        }
        init();
    </script>
</body>
</html>"""

# 3.1 Resource Radar
radar_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sonar Triage | Skilizee E-Waste</title>
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
        body { font-family: 'Inter', sans-serif; background: #0f172a; overflow: hidden; }
        #canvas-container { height: 100vh; position: relative; }
        .scan-overlay { position: absolute; inset: 0; background: radial-gradient(circle, transparent 30%, rgba(0,0,0,0.4)); pointer-events: none; }
        .hud { position: absolute; bottom: 40px; left: 40px; z-index: 10; color: #22d3ee; font-family: monospace; }
        .glass { background: rgba(0,20,40,0.6); backdrop-filter: blur(10px); border: 1px solid rgba(34,211,238,0.2); border-radius: 12px; padding: 20px; }
        .fullscreen-btn { position: absolute; top: 40px; right: 40px; z-index: 20; width: 50px; height: 50px; border-radius: 50%; border: 1px solid #22d3ee; color: #22d3ee; display: flex; align-items: center; justify-content: center; cursor: pointer; }
    </style>
</head>
<body>
    <div id="canvas-container">
        <div class="scan-overlay"></div>
        <button class="fullscreen-btn" onclick="document.body.requestFullscreen()">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
        </button>
        <div class="hud space-y-4">
            <div class="glass">
                <div class="text-xl font-bold tracking-widest uppercase">Sonar Active</div>
                <div class="text-xs opacity-60">Scanning regional nodes...</div>
                <div class="mt-4 text-sm" id="radar-data">Nodes Found: 0</div>
            </div>
        </div>
    </div>

    <script type="module">
        import * as THREE from 'three';
        let scene, camera, renderer, scanRing;
        const nodes = [];

        function init() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
            camera.position.set(0, 10, 0);
            camera.lookAt(0,0,0);

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.getElementById('canvas-container').appendChild(renderer.domElement);

            // Grid
            const grid = new THREE.GridHelper(10, 10, 0x22d3ee, 0x1e293b);
            scene.add(grid);

            // Scanning Ring
            const ringGeo = new THREE.RingGeometry(0.1, 0.2, 32);
            const ringMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
            scanRing = new THREE.Mesh(ringGeo, ringMat);
            scanRing.rotation.x = Math.PI / 2;
            scene.add(scanRing);

            spawnNodes();
            animate();
        }

        function spawnNodes() {
            for(let i=0; i<5; i++) {
                const node = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshBasicMaterial({ color: 0x22d3ee }));
                node.position.set(Math.random() * 8 - 4, 0, Math.random() * 8 - 4);
                node.visible = false;
                scene.add(node);
                nodes.push(node);
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            scanRing.scale.x += 0.05;
            scanRing.scale.y += 0.05;
            scanRing.material.opacity -= 0.005;

            if(scanRing.scale.x > 50) {
                scanRing.scale.set(1,1,1);
                scanRing.material.opacity = 0.5;
            }

            nodes.forEach(n => {
                const dist = n.position.length();
                if(Math.abs(dist - (scanRing.scale.x * 0.15)) < 0.2) {
                    n.visible = true;
                }
            });

            document.getElementById('radar-data').textContent = `Nodes Found: ${nodes.filter(n => n.visible).length}`;
            renderer.render(scene, camera);
        }
        init();
    </script>
</body>
</html>"""

# Writing files
os.makedirs(base_dir, exist_ok=True)
with open(os.path.join(base_dir, "3-1-facility-finder.html"), "w", encoding="utf-8") as f:
    f.write(finder_html)
with open(os.path.join(base_dir, "3-1-drive-calendar.html"), "w", encoding="utf-8") as f:
    f.write(calendar_html)
with open(os.path.join(base_dir, "3-1-resource-radar.html"), "w", encoding="utf-8") as f:
    f.write(radar_html)

print("Batch 1 for Module 3 complete.")
