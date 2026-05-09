import os

base_dir = "public/activities"

# 3.4 India E-Waste Atlas
atlas_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>India E-Waste Atlas | Skilizee E-Waste</title>
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
        body { font-family: 'Inter', sans-serif; background: #fff7ed; overflow: hidden; }
        #canvas-container { height: 100vh; position: relative; background: radial-gradient(circle, #fff7ed, #ffedd5); }
        .hud { position: absolute; top: 40px; left: 40px; z-index: 10; width: 320px; }
        .glass { background: rgba(255,255,255,0.7); backdrop-filter: blur(12px); border-radius: 24px; padding: 24px; border: 1px solid rgba(255,255,255,0.3); }
        .city-btn { width: 100%; background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; text-align: left; transition: 0.2s; margin-top: 8px; }
        .city-btn:hover { border-color: #f3a44a; transform: translateX(4px); }
        .fullscreen-btn { position: absolute; top: 40px; right: 40px; z-index: 20; width: 56px; height: 56px; border-radius: 50%; background: #f3a44a; color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; }
    </style>
</head>
<body>
    <div id="canvas-container">
        <button class="fullscreen-btn" onclick="document.body.requestFullscreen()">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
        </button>
        <div class="hud space-y-4">
            <div class="glass">
                <h1 class="text-2xl font-bold text-orange-900">National Atlas</h1>
                <p class="text-sm text-orange-800/60 mt-2">Explore e-waste hotspots across India's urban landscape.</p>
            </div>
            <div class="glass">
                <button class="city-btn" onclick="highlightCity('Delhi', 5)">Delhi NCR</button>
                <button class="city-btn" onclick="highlightCity('Mumbai', 4.5)">Mumbai</button>
                <button class="city-btn" onclick="highlightCity('Bangalore', 3.8)">Bangalore</button>
            </div>
        </div>
    </div>

    <script type="module">
        import * as THREE from 'three';
        import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

        let scene, camera, renderer, map;
        const bars = [];

        function init() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
            camera.position.set(10, 10, 10);

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.getElementById('canvas-container').appendChild(renderer.domElement);

            const controls = new OrbitControls(camera, renderer.domElement);
            scene.add(new THREE.AmbientLight(0xffffff, 0.8));
            
            // Base Map
            map = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshStandardMaterial({ color: 0xf3a44a, transparent: true, opacity: 0.2 }));
            map.rotation.x = -Math.PI / 2;
            scene.add(map);

            animate();
        }

        window.highlightCity = (name, val) => {
            const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, val), new THREE.MeshStandardMaterial({ color: 0xea580c }));
            bar.position.set(Math.random() * 6 - 3, val/2, Math.random() * 6 - 3);
            scene.add(bar);
            gsap.from(bar.scale, { y: 0, duration: 1, ease: "power2.out" });
        };

        function animate() { requestAnimationFrame(animate); renderer.render(scene, camera); }
        init();
    </script>
</body>
</html>"""

# 3.4 EPR Policy Simulator
epr_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EPR Policy Simulator | Skilizee E-Waste</title>
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
        #canvas-container { height: 100vh; position: relative; background: radial-gradient(circle, #fff1f2, #ffe4e6); }
        .hud { position: absolute; top: 40px; left: 40px; z-index: 10; width: 320px; }
        .glass { background: rgba(255,255,255,0.7); backdrop-filter: blur(12px); border-radius: 24px; padding: 24px; border: 1px solid rgba(255,255,255,0.3); }
        .slider { width: 100%; margin-top: 12px; accent-color: #ef4444; }
        .fullscreen-btn { position: absolute; top: 40px; right: 40px; z-index: 20; width: 56px; height: 56px; border-radius: 50%; background: #ef4444; color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; }
    </style>
</head>
<body>
    <div id="canvas-container">
        <button class="fullscreen-btn" onclick="document.body.requestFullscreen()">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
        </button>
        <div class="hud space-y-4">
            <div class="glass">
                <h1 class="text-2xl font-bold text-red-900">EPR Simulator</h1>
                <p class="text-sm text-red-800/60 mt-2">Adjust recovery targets to see the impact on formal recycling.</p>
            </div>
            <div class="glass">
                <label class="text-xs font-bold text-red-400 uppercase">Recovery Target (%)</label>
                <input type="range" class="slider" min="0" max="100" value="30" id="epr-range">
                <div class="mt-4 flex justify-between font-bold text-red-900">
                    <span>Formal Rate:</span>
                    <span id="rate-val">30%</span>
                </div>
            </div>
        </div>
    </div>

    <script type="module">
        import * as THREE from 'three';
        let scene, camera, renderer, scale;

        function init() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
            camera.position.set(0, 2, 5);

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.getElementById('canvas-container').appendChild(renderer.domElement);

            scene.add(new THREE.AmbientLight(0xffffff, 0.8));
            
            const beam = new THREE.Mesh(new THREE.BoxGeometry(4, 0.1, 0.2), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
            scene.add(beam);
            scale = beam;

            animate();
        }

        document.getElementById('epr-range').oninput = (e) => {
            const val = e.target.value;
            document.getElementById('rate-val').textContent = val + '%';
            gsap.to(scale.rotation, { z: (val - 50) / 100, duration: 0.5 });
        };

        function animate() { requestAnimationFrame(animate); renderer.render(scene, camera); }
        init();
    </script>
</body>
</html>"""

# 3.4 Innovation Showcase
showcase_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Tech Vault | Skilizee E-Waste</title>
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
        body { font-family: 'Inter', sans-serif; background: #f0fdfa; overflow: hidden; }
        #canvas-container { height: 100vh; position: relative; background: radial-gradient(circle, #f0fdfa, #ccfbf1); }
        .hud { position: absolute; top: 40px; right: 40px; z-index: 10; width: 320px; }
        .glass { background: rgba(255,255,255,0.7); backdrop-filter: blur(12px); border-radius: 24px; padding: 24px; border: 1px solid rgba(255,255,255,0.3); }
        .fullscreen-btn { position: absolute; top: 40px; left: 40px; z-index: 20; width: 56px; height: 56px; border-radius: 50%; background: #2bc1a6; color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; }
    </style>
</head>
<body>
    <div id="canvas-container">
        <button class="fullscreen-btn" onclick="document.body.requestFullscreen()">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
        </button>
        <div class="hud space-y-4">
            <div class="glass">
                <h1 class="text-2xl font-bold text-teal-900">The Tech Vault</h1>
                <p class="text-sm text-teal-800/60 mt-2">Emerging innovations in material recovery and sorting.</p>
                <div class="mt-6 p-4 bg-white rounded-xl border border-teal-100">
                    <h3 class="font-bold text-teal-700" id="tech-name">AI Sorting Robot</h3>
                    <p class="text-xs text-teal-600 mt-1" id="tech-desc">Computer vision driven material separation.</p>
                </div>
            </div>
        </div>
    </div>

    <script type="module">
        import * as THREE from 'three';
        let scene, camera, renderer, vault;

        function init() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
            camera.position.set(0, 2, 5);

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.getElementById('canvas-container').appendChild(renderer.domElement);

            scene.add(new THREE.AmbientLight(0xffffff, 0.8));
            
            const geo = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
            const mat = new THREE.MeshStandardMaterial({ color: 0x2bc1a6, metalness: 0.8, roughness: 0.2 });
            vault = new THREE.Mesh(geo, mat);
            scene.add(vault);

            animate();
        }

        function animate() { requestAnimationFrame(animate); vault.rotation.y += 0.01; renderer.render(scene, camera); }
        init();
    </script>
</body>
</html>"""

# Writing files
os.makedirs(base_dir, exist_ok=True)
with open(os.path.join(base_dir, "3-4-india-atlas.html"), "w", encoding="utf-8") as f:
    f.write(atlas_html)
with open(os.path.join(base_dir, "3-4-epr-simulator.html"), "w", encoding="utf-8") as f:
    f.write(epr_html)
with open(os.path.join(base_dir, "3-4-innovation-showcase.html"), "w", encoding="utf-8") as f:
    f.write(showcase_html)

print("Batch 4 for Module 3 complete.")
