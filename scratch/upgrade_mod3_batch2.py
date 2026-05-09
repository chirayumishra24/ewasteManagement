import os

base_dir = "public/activities"

# 3.2 Outreach Message Builder
outreach_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Campaign Hologram | Skilizee E-Waste</title>
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
        body { font-family: 'Inter', sans-serif; background: #fdf4ff; overflow: hidden; }
        #canvas-container { height: 100vh; position: relative; background: radial-gradient(circle, #fdf4ff, #fae8ff); }
        .hud { position: absolute; top: 40px; left: 40px; z-index: 10; width: 320px; }
        .glass { background: rgba(255,255,255,0.7); backdrop-filter: blur(12px); border-radius: 24px; padding: 24px; border: 1px solid rgba(255,255,255,0.3); }
        .fullscreen-btn { position: absolute; top: 40px; right: 40px; z-index: 20; width: 56px; height: 56px; border-radius: 50%; background: #c17cff; color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .msg-input { width: 100%; background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; margin-top: 8px; font-size: 14px; }
    </style>
</head>
<body>
    <div id="canvas-container">
        <button class="fullscreen-btn" onclick="document.body.requestFullscreen()">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
        </button>
        <div class="hud space-y-4">
            <div class="glass">
                <h1 class="text-2xl font-bold text-purple-900">Campaign Hologram</h1>
                <p class="text-sm text-purple-800/60 mt-2">Craft your message and broadcast it to the community.</p>
            </div>
            <div class="glass">
                <label class="text-xs font-bold text-purple-400 uppercase">Message Body</label>
                <textarea id="msg-text" class="msg-input h-24" placeholder="Enter drive details..."></textarea>
                <button class="w-full bg-purple-600 text-white mt-4 p-3 rounded-xl font-bold" id="broadcast-btn">Broadcast Now</button>
            </div>
        </div>
    </div>

    <script type="module">
        import * as THREE from 'three';
        import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

        let scene, camera, renderer, holoPlane;

        function init() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
            camera.position.set(0, 2, 5);

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.getElementById('canvas-container').appendChild(renderer.domElement);

            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;

            scene.add(new THREE.AmbientLight(0xffffff, 0.8));
            
            const floor = new THREE.GridHelper(10, 10, 0xd8b4fe, 0xf3e8ff);
            scene.add(floor);

            // Hologram Plane
            const geo = new THREE.PlaneGeometry(3, 2);
            const mat = new THREE.MeshStandardMaterial({ 
                color: 0xc17cff, 
                transparent: true, 
                opacity: 0.3, 
                emissive: 0xc17cff, 
                emissiveIntensity: 0.5,
                side: THREE.DoubleSide
            });
            holoPlane = new THREE.Mesh(geo, mat);
            holoPlane.position.y = 1.5;
            scene.add(holoPlane);

            animate();
        }

        document.getElementById('broadcast-btn').onclick = () => {
            gsap.to(holoPlane.material, { opacity: 0.8, duration: 0.2, yoyo: true, repeat: 5 });
            gsap.to(holoPlane.scale, { x: 1.1, y: 1.1, duration: 0.1, yoyo: true, repeat: 5 });
        };

        function animate() {
            requestAnimationFrame(animate);
            holoPlane.rotation.y += 0.005;
            renderer.render(scene, camera);
        }
        init();
    </script>
</body>
</html>"""

# 3.2 Collection Drive Planner
planner_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Site Blueprint | Skilizee E-Waste</title>
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
        body { font-family: 'Inter', sans-serif; background: #fff1f2; overflow: hidden; }
        #canvas-container { height: 100vh; position: relative; background: #f8fafc; }
        .hud { position: absolute; top: 40px; left: 40px; z-index: 10; width: 300px; }
        .glass { background: rgba(255,255,255,0.8); backdrop-filter: blur(12px); border-radius: 20px; padding: 24px; border: 1px solid rgba(0,0,0,0.05); }
        .asset-btn { width: 100%; background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; text-align: left; transition: 0.2s; }
        .asset-btn:hover { border-color: #ff6f61; transform: translateX(4px); }
        .fullscreen-btn { position: absolute; top: 40px; right: 40px; z-index: 20; width: 56px; height: 56px; border-radius: 50%; background: #ff6f61; color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; }
    </style>
</head>
<body>
    <div id="canvas-container">
        <button class="fullscreen-btn" onclick="document.body.requestFullscreen()">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
        </button>
        <div class="hud space-y-4">
            <div class="glass">
                <h1 class="text-2xl font-bold text-slate-800">Site Blueprint</h1>
                <p class="text-xs text-slate-500 mt-1">Design the layout of your collection drive site.</p>
            </div>
            <div class="glass space-y-2">
                <p class="text-xs font-bold text-slate-400 uppercase">Place Assets</p>
                <button class="asset-btn flex items-center gap-3" onclick="addAsset('bin')">
                    <span class="w-8 h-8 bg-orange-100 text-orange-600 rounded flex items-center justify-center">🗑️</span>
                    <span>Collection Bin</span>
                </button>
                <button class="asset-btn flex items-center gap-3" onclick="addAsset('table')">
                    <span class="w-8 h-8 bg-blue-100 text-blue-600 rounded flex items-center justify-center">🪑</span>
                    <span>Intake Table</span>
                </button>
            </div>
        </div>
    </div>

    <script type="module">
        import * as THREE from 'three';
        import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

        let scene, camera, renderer;
        const assets = [];

        function init() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
            camera.position.set(10, 10, 10);

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.getElementById('canvas-container').appendChild(renderer.domElement);

            const controls = new OrbitControls(camera, renderer.domElement);
            scene.add(new THREE.AmbientLight(0xffffff, 0.8));
            const light = new THREE.DirectionalLight(0xffffff, 1); light.position.set(5, 10, 5); scene.add(light);

            const grid = new THREE.GridHelper(20, 20, 0xccd6e0, 0xe2e8f0);
            scene.add(grid);

            animate();
        }

        window.addAsset = (type) => {
            const geo = type === 'bin' ? new THREE.BoxGeometry(1, 1.2, 1) : new THREE.BoxGeometry(2, 0.8, 1);
            const mat = new THREE.MeshStandardMaterial({ color: type === 'bin' ? 0xff6f61 : 0x61b8ff });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(Math.random() * 10 - 5, 0.5, Math.random() * 10 - 5);
            scene.add(mesh);
            assets.push(mesh);
            gsap.from(mesh.scale, { x:0, y:0, z:0, duration: 0.5, ease: "back.out" });
        };

        function animate() { requestAnimationFrame(animate); renderer.render(scene, camera); }
        init();
    </script>
</body>
</html>"""

# 3.2 Impact Dashboard Simulator
impact_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Material Waterfall | Skilizee E-Waste</title>
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
        body { font-family: 'Inter', sans-serif; background: #ecfdf5; overflow: hidden; }
        #canvas-container { height: 100vh; position: relative; background: radial-gradient(circle, #f0fdf4, #dcfce7); }
        .hud { position: absolute; bottom: 40px; right: 40px; z-index: 10; width: 350px; }
        .glass { background: rgba(255,255,255,0.7); backdrop-filter: blur(12px); border-radius: 24px; padding: 24px; border: 1px solid rgba(255,255,255,0.3); }
        .fullscreen-btn { position: absolute; top: 40px; right: 40px; z-index: 20; width: 56px; height: 56px; border-radius: 50%; background: #2bc1a6; color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; }
    </style>
</head>
<body>
    <div id="canvas-container">
        <button class="fullscreen-btn" onclick="document.body.requestFullscreen()">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
        </button>
        <div class="hud space-y-4">
            <div class="glass">
                <h1 class="text-2xl font-bold text-teal-900">Material Recovery</h1>
                <p class="text-sm text-teal-800/60 mt-1">Visualize how collected weight converts into pure resources.</p>
                <div class="mt-6 space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="text-xs font-bold uppercase text-teal-600">Gold Recovered</span>
                        <span class="font-bold" id="gold-val">0.00g</span>
                    </div>
                    <div class="h-2 bg-teal-100 rounded-full overflow-hidden">
                        <div id="gold-bar" class="h-full bg-yellow-400 w-0"></div>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-xs font-bold uppercase text-teal-600">Copper Recovered</span>
                        <span class="font-bold" id="copper-val">0.00kg</span>
                    </div>
                    <div class="h-2 bg-teal-100 rounded-full overflow-hidden">
                        <div id="copper-bar" class="h-full bg-orange-400 w-0"></div>
                    </div>
                </div>
                <button class="w-full bg-teal-600 text-white mt-6 p-4 rounded-xl font-bold" onclick="simulateRecovery()">Run Recovery Sim</button>
            </div>
        </div>
    </div>

    <script type="module">
        import * as THREE from 'three';
        let scene, camera, renderer, particles;

        function init() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
            camera.position.set(0, 5, 10);
            camera.lookAt(0, 0, 0);

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.getElementById('canvas-container').appendChild(renderer.domElement);

            const geo = new THREE.BufferGeometry();
            const pos = new Float32Array(500 * 3);
            for(let i=0; i<500*3; i++) pos[i] = (Math.random() - 0.5) * 10;
            geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
            particles = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0x2bc1a6, size: 0.05 }));
            scene.add(particles);

            animate();
        }

        window.simulateRecovery = () => {
            gsap.to('#gold-val', { innerText: 12.45, duration: 2, snap: { innerText: 0.01 }, onUpdate: function() {
                document.getElementById('gold-val').textContent = this.targets()[0].innerText + 'g';
                document.getElementById('gold-bar').style.width = (this.progress() * 80) + '%';
            }});
            gsap.to('#copper-val', { innerText: 45.2, duration: 2, snap: { innerText: 0.1 }, onUpdate: function() {
                document.getElementById('copper-val').textContent = this.targets()[0].innerText + 'kg';
                document.getElementById('copper-bar').style.width = (this.progress() * 95) + '%';
            }});
        };

        function animate() {
            requestAnimationFrame(animate);
            particles.rotation.y += 0.002;
            renderer.render(scene, camera);
        }
        init();
    </script>
</body>
</html>"""

# Writing files
os.makedirs(base_dir, exist_ok=True)
with open(os.path.join(base_dir, "3-2-outreach-builder.html"), "w", encoding="utf-8") as f:
    f.write(outreach_html)
with open(os.path.join(base_dir, "3-2-drive-planner.html"), "w", encoding="utf-8") as f:
    f.write(planner_html)
with open(os.path.join(base_dir, "3-2-impact-dashboard.html"), "w", encoding="utf-8") as f:
    f.write(impact_html)

print("Batch 2 for Module 3 complete.")
