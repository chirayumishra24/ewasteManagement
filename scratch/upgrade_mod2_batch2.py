import os

base_dir = "public/activities"

# 2.2 Repurpose Router
router_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Repurpose Router Pro | Skilizee E-Waste</title>
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
        body { font-family: 'Inter', sans-serif; background: #faf5ff; }
        #canvas-container { height: 450px; background: #0f172a; border-radius: 20px; position: relative; overflow: hidden; }
        .spec-input { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; }
    </style>
</head>
<body class="p-6">
    <div class="max-w-6xl mx-auto space-y-6">
        <h1 class="text-3xl font-bold text-center">The Repurpose Router</h1>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div id="canvas-container"></div>
            <div class="spec-input space-y-4">
                <h3 class="font-bold">Input Device Specs</h3>
                <div>
                    <label class="text-xs font-bold text-slate-500 uppercase">CPU Class</label>
                    <select id="cpu" class="w-full mt-1 p-2 border rounded-lg">
                        <option value="low">Low Power (Atom/Celeron)</option>
                        <option value="med">Mid Range (i3/i5)</option>
                        <option value="high">High Performance (i7/Ryzen)</option>
                    </select>
                </div>
                <button id="route-btn" class="w-full bg-purple-600 text-white p-3 rounded-lg font-bold">Find New Mission</button>
                <div id="recommendation" class="p-4 bg-purple-50 text-purple-900 rounded-lg hidden">
                    <strong>Recommended:</strong> <span id="rec-text"></span>
                </div>
            </div>
        </div>
    </div>
    <script type="module">
        import * as THREE from 'three';
        let scene, camera, renderer, globe;
        function init() {
            const container = document.getElementById('canvas-container');
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(45, container.clientWidth/container.clientHeight, 0.1, 1000);
            camera.position.set(0, 0, 5);
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            container.appendChild(renderer.domElement);
            globe = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 32), new THREE.MeshStandardMaterial({ color: 0x85a9ff, wireframe: true }));
            scene.add(globe);
            scene.add(new THREE.AmbientLight(0xffffff, 1));
            animate();
        }
        function animate() { requestAnimationFrame(animate); globe.rotation.y += 0.005; renderer.render(scene, camera); }
        document.getElementById('route-btn').onclick = () => {
            const cpu = document.getElementById('cpu').value;
            const recs = { low: 'Lightweight Linux / Smart Hub', med: 'Home Media Server / NAS', high: 'Dedicated Render Node / Compile Bot' };
            document.getElementById('rec-text').textContent = recs[cpu];
            document.getElementById('recommendation').classList.remove('hidden');
            gsap.to(globe.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 0.3, yoyo: true, repeat: 1 });
        };
        init();
    </script>
</body>
</html>"""

# 2.3 Hazard Sort
hazard_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hazard Sort Pro | Skilizee E-Waste</title>
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
        body { font-family: 'Inter', sans-serif; background: #fff1f2; }
        #canvas-container { height: 500px; background: #450a0a; border-radius: 20px; position: relative; overflow: hidden; }
        .bin { border: 2px dashed #ef4444; border-radius: 12px; padding: 1rem; text-align: center; }
    </style>
</head>
<body class="p-6">
    <div class="max-w-6xl mx-auto space-y-6">
        <h1 class="text-3xl font-bold text-center text-red-900">Hazardous Material Sort</h1>
        <div id="canvas-container">
            <div class="absolute top-6 left-6 bg-red-600 text-white p-3 rounded-lg font-bold">Score: <span id="score">0</span></div>
        </div>
        <div class="grid grid-cols-2 gap-4">
            <div class="bin text-red-700 font-bold">TOXIC BIN</div>
            <div class="bin text-blue-700 font-bold" style="border-color: #3b82f6;">RECYCLABLE BIN</div>
        </div>
    </div>
    <script type="module">
        import * as THREE from 'three';
        let scene, camera, renderer, currentItem;
        let score = 0;
        function init() {
            const container = document.getElementById('canvas-container');
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(45, container.clientWidth/container.clientHeight, 0.1, 1000);
            camera.position.set(0, 0, 5);
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            container.appendChild(renderer.domElement);
            scene.add(new THREE.AmbientLight(0xffffff, 1));
            spawn();
            animate();
        }
        function spawn() {
            const items = [{ name: 'Battery', toxic: true, color: 0xef4444 }, { name: 'Alu Case', toxic: false, color: 0x3b82f6 }];
            const item = items[Math.floor(Math.random()*items.length)];
            currentItem = new THREE.Mesh(new THREE.IcosahedronGeometry(1), new THREE.MeshStandardMaterial({ color: item.color }));
            currentItem.userData = item;
            scene.add(currentItem);
        }
        function animate() { requestAnimationFrame(animate); if(currentItem) currentItem.rotation.y += 0.02; renderer.render(scene, camera); }
        window.addEventListener('keydown', (e) => {
            if(!currentItem) return;
            const toxic = e.key === 'ArrowLeft';
            if(toxic === currentItem.userData.toxic) { score++; document.getElementById('score').textContent = score; }
            scene.remove(currentItem); spawn();
        });
        init();
    </script>
</body>
</html>"""

# 2.3 Lifecycle Decision Lab
decision_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lifecycle Decision Lab Pro | Skilizee E-Waste</title>
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
        body { font-family: 'Inter', sans-serif; background: #f8fafc; }
        #canvas-container { height: 400px; background: #0f172a; border-radius: 20px; position: relative; overflow: hidden; }
        .choice-btn { background: white; border: 2px solid #e2e8f0; border-radius: 12px; padding: 1rem; cursor: pointer; transition: all 0.2s; }
        .choice-btn:hover { border-color: #3b82f6; transform: translateY(-2px); }
    </style>
</head>
<body class="p-6">
    <div class="max-w-6xl mx-auto space-y-6">
        <h1 class="text-3xl font-bold text-center">Lifecycle Decision Lab</h1>
        <div id="canvas-container"></div>
        <div class="grid grid-cols-3 gap-4">
            <button class="choice-btn" data-choice="reduce">REDUCE</button>
            <button class="choice-btn" data-choice="reuse">REUSE</button>
            <button class="choice-btn" data-choice="recycle">RECYCLE</button>
        </div>
        <div id="feedback" class="p-6 bg-white border rounded-xl hidden">
            <h3 class="font-bold text-xl" id="f-title"></h3>
            <p class="text-slate-500" id="f-desc"></p>
        </div>
    </div>
    <script type="module">
        import * as THREE from 'three';
        let scene, camera, renderer, sphere;
        function init() {
            const container = document.getElementById('canvas-container');
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(45, container.clientWidth/container.clientHeight, 0.1, 1000);
            camera.position.set(0, 0, 5);
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            container.appendChild(renderer.domElement);
            sphere = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 32), new THREE.MeshStandardMaterial({ color: 0x3b82f6 }));
            scene.add(sphere);
            scene.add(new THREE.AmbientLight(0xffffff, 1));
            animate();
        }
        function animate() { requestAnimationFrame(animate); sphere.rotation.y += 0.01; renderer.render(scene, camera); }
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.onclick = () => {
                const choice = btn.dataset.choice;
                const data = {
                    reduce: { title: 'Prevention First', desc: 'By maintaining your device, you avoided 100% of the recycling energy cost.', color: 0x10b981 },
                    reuse: { title: 'Resource Continuity', desc: 'Extending use to a second life saves 90% of raw material extraction.', color: 0xc17cff },
                    recycle: { title: 'Material Recovery', desc: 'Formal recycling recovers 98% of precious metals safely.', color: 0xea580c }
                };
                const info = data[choice];
                document.getElementById('f-title').textContent = info.title;
                document.getElementById('f-desc').textContent = info.desc;
                document.getElementById('feedback').classList.remove('hidden');
                gsap.to(sphere.material.color, { r: ((info.color >> 16) & 0xff)/255, g: ((info.color >> 8) & 0xff)/255, b: (info.color & 0xff)/255, duration: 0.5 });
            };
        });
        init();
    </script>
</body>
</html>"""

# Writing files
os.makedirs(base_dir, exist_ok=True)
with open(os.path.join(base_dir, "2-2-repurpose-router.html"), "w", encoding="utf-8") as f:
    f.write(router_html)
with open(os.path.join(base_dir, "2-3-hazard-sort.html"), "w", encoding="utf-8") as f:
    f.write(hazard_html)
with open(os.path.join(base_dir, "2-3-lifecycle-lab.html"), "w", encoding="utf-8") as f:
    f.write(decision_html)

print("Batch 2 (of 2) for Module 2 Upgrades complete.")
