import os
import re

dir_path = r'c:\Users\ASUS\OneDrive\Desktop\skilizee\E-waste\public\activities'

fullscreen_js = """
    <script>
        // Fullscreen functionality
        document.getElementById('toggle-fullscreen')?.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else {
                document.exitFullscreen();
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

        # Check if toggle-fullscreen logic already exists
        if 'toggle-fullscreen' not in content or 'requestFullscreen' not in content:
            # Inject before </body>
            new_content = content.replace('</body>', fullscreen_js + '</body>')
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Injected fullscreen JS into {filename}")
        else:
            # If it exists, make sure the ID matches our button ID
            # In some cases the old code might be using a different ID
            print(f"Fullscreen JS already exists in {filename}")

print("Done.")
