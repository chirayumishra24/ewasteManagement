import os
import re

dir_path = r'c:\Users\ASUS\OneDrive\Desktop\skilizee\E-waste\public\activities'

fullscreen_js = """
    <script>
        // Robust Fullscreen functionality
        document.getElementById('toggle-fullscreen')?.addEventListener('click', async () => {
            try {
                if (!document.fullscreenElement && !document.webkitFullscreenElement) {
                    const el = document.documentElement;
                    if (el.requestFullscreen) await el.requestFullscreen();
                    else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
                    else if (el.msRequestFullscreen) await el.msRequestFullscreen();
                } else {
                    if (document.exitFullscreen) await document.exitFullscreen();
                    else if (document.webkitExitFullscreen) await document.webkitExitFullscreen();
                    else if (document.msExitFullscreen) await document.msExitFullscreen();
                }
            } catch (err) {
                console.warn("Fullscreen request failed. This usually happens if the activity is embedded and permissions are blocked.", err);
            }
        });

        // Embedded mode detection
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('embedded') === 'true') {
            document.body.classList.add('is-embedded');
        }
    </script>
"""

for filename in os.listdir(dir_path):
    if filename.endswith('.html'):
        file_path = os.path.join(dir_path, filename)
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # We will OVERWRITE any existing injected script or add it if missing
        # To avoid multiple injections, we first strip the old one if it looks like ours
        content = re.sub(r'<script>\s*// Fullscreen functionality.*?</script>', '', content, flags=re.DOTALL)
        content = re.sub(r'<script>\s*// Robust Fullscreen functionality.*?</script>', '', content, flags=re.DOTALL)
        
        # Inject before </body>
        new_content = content.replace('</body>', fullscreen_js + '</body>')
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated fullscreen JS in {filename}")

print("Done.")
