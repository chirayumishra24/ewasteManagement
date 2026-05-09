import os

base_dir = "public/activities"

# 2.1 Lifespan Extender Dashboard
lifespan_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lifespan Extender Pro | Skilizee E-Waste</title>
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
        :root { --primary: #10b981; --primary-dark: #059669; }
        body { font-family: 'Inter', sans-serif; background: #f8fafc; }
        .glass-panel { background: rgba(255,255,255,0.9); backdrop-filter: blur(12px); border-radius: 20px; border: 1px solid rgba(0,0,0,0.05); }
        #canvas-container { height: 400px; background: #0f172a; border-radius: 20px; position: relative; overflow: hidden; }
        .action-btn { background: white; border: 2px solid #e2e8f0; border-radius: 12px; padding: 1rem; transition: all 0.2s; text-align: left; cursor: pointer; }
        .action-btn:hover { border-color: var(--primary); transform: translateY(-2px); }
        .action-btn.active { border-color: var(--primary); background: #f0fdf4; box-shadow: 0 4px 12px rgba(16,185,129,0.1); }
        .fullscreen-btn { position: absolute; top: 16px; right: 16px; z-index: 50; width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.1); color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; }
    </style>
</head>
<body class="p-6">
    <div class="max-w-6xl mx-auto space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
            <div id="canvas-container">
                <button class="fullscreen-btn" onclick="document.getElementById('canvas-container').requestFullscreen()">
                    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
                </button>
                <div class="absolute bottom-6 left-6 text-white">
                    <p class="text-xs font-bold opacity-50 uppercase">Projected Lifespan</p>
                    <p class="text-4xl font-bold" id="life-val">2.0 Years</p>
                </div>
            </div>
            <div class="glass-panel p-6 space-y-4">
                <h3 class="font-bold text-lg">Maintenance Actions</h3>
                <div class="space-y-2" id="actions-list">
                    <button class="action-btn w-full" data-val="0.5">Physical Case (Add 0.5y)</button>
                    <button class="action-btn w-full" data-val="1.5">Battery Care (Add 1.5y)</button>
                    <button class="action-btn w-full" data-val="1.0">Software Cleanup (Add 1.0y)</button>
                </div>
            </div>
        </div>
    </div>
    <script type="module">
        import * as THREE from 'three';
        let scene, camera, renderer, bar;
        let baseLife = 2.0, addedLife = 0;
        function init() {
            const container = document.getElementById('canvas-container');
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(45, container.clientWidth/container.clientHeight, 0.1, 1000);
            camera.position.set(0, 0, 10);
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            container.appendChild(renderer.domElement);
            const light = new THREE.DirectionalLight(0xffffff, 1); light.position.set(5, 5, 5); scene.add(light);
            bar = new THREE.Mesh(new THREE.BoxGeometry(1, 4, 1), new THREE.MeshStandardMaterial({ color: 0x10b981 }));
            scene.add(bar);
            animate();
        }
        function animate() { requestAnimationFrame(animate); bar.rotation.y += 0.01; renderer.render(scene, camera); }
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.onclick = () => {
                btn.classList.toggle('active');
                let total = 0;
                document.querySelectorAll('.action-btn.active').forEach(b => total += parseFloat(b.dataset.val));
                gsap.to(bar.scale, { y: (baseLife + total), duration: 0.5 });
                document.getElementById('life-val').textContent = (baseLife + total).toFixed(1) + " Years";
            };
        });
        init();
    </script>
</body>
</html>"""

# 2.1 Device Autopsy Lab
autopsy_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Device Autopsy Pro | Skilizee E-Waste</title>
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
        body { font-family: 'Inter', sans-serif; background: #0f172a; color: white; }
        #canvas-container { height: 500px; width: 100%; position: relative; border-radius: 20px; overflow: hidden; background: radial-gradient(circle, #1e293b, #0f172a); }
        .info-card { position: absolute; bottom: 20px; right: 20px; background: rgba(0,0,0,0.6); backdrop-filter: blur(10px); padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); width: 300px; }
        .node { cursor: pointer; }
    </style>
</head>
<body class="p-6">
    <div class="max-w-6xl mx-auto space-y-6">
        <header class="text-center">
            <h1 class="text-3xl font-bold">Hardware Autopsy Lab</h1>
            <p class="text-slate-400">Identify the bottleneck module and repair it instead of replacing the entire unit.</p>
        </header>
        <div id="canvas-container">
            <div class="info-card">
                <h3 class="font-bold text-lg mb-2" id="node-name">Select Component</h3>
                <p class="text-sm text-slate-300" id="node-desc">Click on a hardware module to diagnose its health.</p>
            </div>
        </div>
    </div>
    <script type="module">
        import * as THREE from 'three';
        import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
        let scene, camera, renderer, controls;
        const nodes = [
            { name: 'Logic Board', pos: [0, 0, 0], desc: 'The brain. Often healthy even when software feels slow.' },
            { name: 'Lithium Battery', pos: [0, -1.5, 0], desc: 'The #1 bottleneck. Replacing this saves the device.' },
            { name: 'Storage Module', pos: [1, 0, 0], desc: 'Can be wiped or swapped to restore speed.' }
        ];
        function init() {
            const container = document.getElementById('canvas-container');
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(45, container.clientWidth/container.clientHeight, 0.1, 1000);
            camera.position.set(5, 5, 5);
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            container.appendChild(renderer.domElement);
            controls = new OrbitControls(camera, renderer.domElement);
            scene.add(new THREE.AmbientLight(0xffffff, 0.8));
            nodes.forEach(n => {
                const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), new THREE.MeshStandardMaterial({ color: 0x61b8ff }));
                mesh.position.set(...n.pos);
                mesh.userData = n;
                scene.add(mesh);
            });
            window.addEventListener('click', onPick);
            animate();
        }
        function onPick(e) {
            const mouse = new THREE.Vector2((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(scene.children);
            if(intersects.length > 0) {
                const node = intersects[0].object.userData;
                document.getElementById('node-name').textContent = node.name;
                document.getElementById('node-desc').textContent = node.desc;
            }
        }
        function animate() { requestAnimationFrame(animate); controls.update(); renderer.render(scene, camera); }
        init();
    </script>
</body>
</html>"""

# 2.2 Upcycle Blueprint Designer
blueprint_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Upcycle Blueprint Pro | Skilizee E-Waste</title>
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
        body { font-family: 'Inter', sans-serif; background: #fdfaf7; }
        #canvas-container { height: 500px; background: #1e1b4b; border-radius: 20px; position: relative; overflow: hidden; }
        .blueprint-card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem; cursor: pointer; transition: all 0.2s; }
        .blueprint-card:hover { transform: scale(1.02); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    </style>
</head>
<body class="p-6">
    <div class="max-w-6xl mx-auto space-y-6">
        <h1 class="text-3xl font-bold text-center">Upcycle Blueprint Designer</h1>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div id="canvas-container" class="lg:col-span-2"></div>
            <div class="space-y-4">
                <div class="blueprint-card" data-type="planter">
                    <h4 class="font-bold">CRT monitor Planter</h4>
                    <p class="text-xs text-slate-500">Transform old monitor shells into unique planters.</p>
                </div>
                <div class="blueprint-card" data-type="jewelry">
                    <h4 class="font-bold">PCB Jewelry</h4>
                    <p class="text-xs text-slate-500">Turn circuit boards into earrings and necklaces.</p>
                </div>
            </div>
        </div>
    </div>
    <script type="module">
        import * as THREE from 'three';
        let scene, camera, renderer, currentObj;
        function init() {
            const container = document.getElementById('canvas-container');
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(45, container.clientWidth/container.clientHeight, 0.1, 1000);
            camera.position.set(0, 0, 5);
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            container.appendChild(renderer.domElement);
            scene.add(new THREE.AmbientLight(0xffffff, 1));
            animate();
        }
        function animate() { requestAnimationFrame(animate); if(currentObj) currentObj.rotation.y += 0.01; renderer.render(scene, camera); }
        document.querySelectorAll('.blueprint-card').forEach(card => {
            card.onclick = () => {
                if(currentObj) scene.remove(currentObj);
                const type = card.dataset.type;
                const geo = type === 'planter' ? new THREE.BoxGeometry(2, 2, 2) : new THREE.TorusGeometry(1, 0.1, 16, 100);
                currentObj = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0xc17cff }));
                scene.add(currentObj);
            };
        });
        init();
    </script>
</body>
</html>"""

# Writing files
os.makedirs(base_dir, exist_ok=True)
with open(os.path.join(base_dir, "2-1-lifespan-extender.html"), "w", encoding="utf-8") as f:
    f.write(lifespan_html)
with open(os.path.join(base_dir, "2-1-device-autopsy.html"), "w", encoding="utf-8") as f:
    f.write(autopsy_html)
with open(os.path.join(base_dir, "2-2-upcycle-blueprint.html"), "w", encoding="utf-8") as f:
    f.write(blueprint_html)

print("Batch 1 (of 2) for Module 2 Upgrades complete.")
