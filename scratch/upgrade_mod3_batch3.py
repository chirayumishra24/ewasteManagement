import os

base_dir = "public/activities"

# 3.3 Privacy Fortress Builder
fortress_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Fortress | Skilizee E-Waste</title>
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
        body { font-family: 'Inter', sans-serif; background: #f0fdf4; overflow: hidden; }
        #canvas-container { height: 100vh; position: relative; background: radial-gradient(circle, #f0fdf4, #dcfce7); }
        .hud { position: absolute; top: 40px; left: 40px; z-index: 10; width: 320px; }
        .glass { background: rgba(255,255,255,0.7); backdrop-filter: blur(12px); border-radius: 24px; padding: 24px; border: 1px solid rgba(255,255,255,0.3); }
        .layer-btn { width: 100%; background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; text-align: left; transition: 0.2s; margin-top: 8px; }
        .layer-btn:hover { border-color: #10b981; transform: translateX(4px); }
        .fullscreen-btn { position: absolute; top: 40px; right: 40px; z-index: 20; width: 56px; height: 56px; border-radius: 50%; background: #10b981; color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; }
    </style>
</head>
<body>
    <div id="canvas-container">
        <button class="fullscreen-btn" onclick="document.body.requestFullscreen()">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
        </button>
        <div class="hud space-y-4">
            <div class="glass">
                <h1 class="text-2xl font-bold text-teal-900">Privacy Fortress</h1>
                <p class="text-sm text-teal-800/60 mt-2">Harden your digital core with security layers.</p>
            </div>
            <div class="glass">
                <button class="layer-btn" onclick="addLayer(0x10b981)">Enable 2FA</button>
                <button class="layer-btn" onclick="addLayer(0x3b82f6)">Disk Encryption</button>
                <button class="layer-btn" onclick="addLayer(0xc17cff)">VPN Tunneling</button>
            </div>
        </div>
    </div>

    <script type="module">
        import * as THREE from 'three';
        let scene, camera, renderer, core;
        const layers = [];

        function init() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
            camera.position.set(0, 2, 5);

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.getElementById('canvas-container').appendChild(renderer.domElement);

            scene.add(new THREE.AmbientLight(0xffffff, 0.8));
            
            core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.5, 0), new THREE.MeshStandardMaterial({ color: 0x10b981, flatShading: true }));
            scene.add(core);

            animate();
        }

        window.addLayer = (color) => {
            const radius = 0.7 + (layers.length * 0.2);
            const layer = new THREE.Mesh(
                new THREE.SphereGeometry(radius, 32, 32),
                new THREE.MeshStandardMaterial({ color, transparent: true, opacity: 0.2, wireframe: true })
            );
            scene.add(layer);
            layers.push(layer);
            gsap.from(layer.scale, { x:0, y:0, z:0, duration: 1, ease: "elastic.out" });
        };

        function animate() {
            requestAnimationFrame(animate);
            core.rotation.y += 0.01;
            layers.forEach((l, i) => l.rotation.y += 0.005 * (i+1));
            renderer.render(scene, camera);
        }
        init();
    </script>
</body>
</html>"""

# 3.3 Digital Footprint Tracker
footprint_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Digital Shadow | Skilizee E-Waste</title>
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
        body { font-family: 'Inter', sans-serif; background: #f8fafc; overflow: hidden; }
        #canvas-container { height: 100vh; position: relative; background: #ffffff; }
        .hud { position: absolute; top: 40px; left: 40px; z-index: 10; width: 300px; }
        .glass { background: rgba(255,255,255,0.8); backdrop-filter: blur(12px); border-radius: 20px; padding: 24px; border: 1px solid rgba(0,0,0,0.05); }
        .habit-btn { width: 100%; background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; text-align: left; transition: 0.2s; margin-top: 8px; }
        .habit-btn:hover { border-color: #64748b; transform: scale(1.02); }
        .fullscreen-btn { position: absolute; top: 40px; right: 40px; z-index: 20; width: 56px; height: 56px; border-radius: 50%; background: #1e293b; color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; }
    </style>
</head>
<body>
    <div id="canvas-container">
        <button class="fullscreen-btn" onclick="document.body.requestFullscreen()">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
        </button>
        <div class="hud space-y-4">
            <div class="glass">
                <h1 class="text-2xl font-bold text-slate-800">Digital Shadow</h1>
                <p class="text-xs text-slate-500 mt-1">Watch your digital presence grow as you add online habits.</p>
            </div>
            <div class="glass">
                <button class="habit-btn" onclick="adjustShadow(0.5)">Accept All Cookies</button>
                <button class="habit-btn" onclick="adjustShadow(1.0)">Stay Logged In</button>
                <button class="habit-btn" onclick="adjustShadow(-0.8)">Clear Browser Cache</button>
            </div>
        </div>
    </div>

    <script type="module">
        import * as THREE from 'three';
        let scene, camera, renderer, shadow;

        function init() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
            camera.position.set(0, 2, 5);

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.getElementById('canvas-container').appendChild(renderer.domElement);

            scene.add(new THREE.AmbientLight(0xffffff, 0.8));
            
            shadow = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 1), new THREE.MeshStandardMaterial({ color: 0x1e293b, transparent: true, opacity: 0.8 }));
            scene.add(shadow);

            animate();
        }

        window.adjustShadow = (val) => {
            const target = Math.max(0.5, shadow.scale.x + val);
            gsap.to(shadow.scale, { x: target, y: target, z: target, duration: 1, ease: "power2.out" });
            gsap.to(shadow.material, { opacity: Math.min(1, 0.2 + (target * 0.2)), duration: 1 });
        };

        function animate() {
            requestAnimationFrame(animate);
            shadow.rotation.y += 0.005;
            renderer.render(scene, camera);
        }
        init();
    </script>
</body>
</html>"""

# 3.3 Phishing Detective
phishing_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Detective's Desk | Skilizee E-Waste</title>
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
        body { font-family: 'Inter', sans-serif; background: #1e1b4b; overflow: hidden; }
        #canvas-container { height: 100vh; position: relative; background: radial-gradient(circle, #312e81, #1e1b4b); }
        .hud { position: absolute; bottom: 40px; left: 40px; z-index: 10; width: 350px; }
        .glass { background: rgba(255,255,255,0.1); backdrop-filter: blur(12px); border-radius: 20px; padding: 24px; border: 1px solid rgba(255,255,255,0.1); color: white; }
        .fullscreen-btn { position: absolute; top: 40px; right: 40px; z-index: 20; width: 56px; height: 56px; border-radius: 50%; background: #4f46e5; color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; }
    </style>
</head>
<body>
    <div id="canvas-container">
        <button class="fullscreen-btn" onclick="document.body.requestFullscreen()">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
        </button>
        <div class="hud space-y-4">
            <div class="glass">
                <h1 class="text-2xl font-bold">Detective's Desk</h1>
                <p class="text-sm opacity-60 mt-1">Examine digital evidence to spot phishing attempts.</p>
                <div class="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                    <p class="text-xs font-bold uppercase opacity-40">Active Case</p>
                    <p class="text-lg font-bold mt-1" id="case-name">Urgent Bank Alert</p>
                    <p class="text-sm opacity-80 mt-2" id="case-desc">"Your account is locked. Click here to verify now: bit.ly/bank-secure"</p>
                </div>
                <div class="grid grid-cols-2 gap-4 mt-6">
                    <button class="bg-red-600 p-3 rounded-xl font-bold" onclick="solve('phish')">PHISH</button>
                    <button class="bg-teal-600 p-3 rounded-xl font-bold" onclick="solve('safe')">SAFE</button>
                </div>
            </div>
        </div>
    </div>

    <script type="module">
        import * as THREE from 'three';
        let scene, camera, renderer, phone;

        function init() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
            camera.position.set(0, 2, 5);

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.getElementById('canvas-container').appendChild(renderer.domElement);

            scene.add(new THREE.AmbientLight(0xffffff, 0.5));
            const light = new THREE.PointLight(0xffffff, 1); light.position.set(5, 5, 5); scene.add(light);

            phone = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 0.2), new THREE.MeshStandardMaterial({ color: 0x334155 }));
            phone.rotation.x = Math.PI / 6;
            scene.add(phone);

            animate();
        }

        window.solve = (choice) => {
            const isPhish = true; // For this demo case
            if((choice === 'phish') === isPhish) {
                gsap.to(phone.material.color, { r: 0, g: 1, b: 0, duration: 0.5 });
            } else {
                gsap.to(phone.material.color, { r: 1, g: 0, b: 0, duration: 0.5 });
            }
        };

        function animate() {
            requestAnimationFrame(animate);
            phone.rotation.y += 0.005;
            renderer.render(scene, camera);
        }
        init();
    </script>
</body>
</html>"""

# Writing files
os.makedirs(base_dir, exist_ok=True)
with open(os.path.join(base_dir, "3-3-privacy-fortress.html"), "w", encoding="utf-8") as f:
    f.write(fortress_html)
with open(os.path.join(base_dir, "3-3-footprint-tracker.html"), "w", encoding="utf-8") as f:
    f.write(footprint_html)
with open(os.path.join(base_dir, "3-3-phishing-detective.html"), "w", encoding="utf-8") as f:
    f.write(phishing_html)

print("Batch 3 for Module 3 complete.")
