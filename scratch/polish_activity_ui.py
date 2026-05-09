import os
import re

dir_path = r'c:\Users\ASUS\OneDrive\Desktop\skilizee\E-waste\public\activities'

for filename in os.listdir(dir_path):
    if filename.endswith('.html'):
        file_path = os.path.join(dir_path, filename)
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # 1. Remove any empty style blocks or leftover header styles
        content = re.sub(r'header\s*\{\s*\}', '', content)
        
        # 2. Fix the messy .is-embedded lines
        content = re.sub(r'\.is-embedded\s+\.is-embedded', '.is-embedded', content)
        
        # 3. Ensure fullscreen button is NOT hidden in embedded mode
        content = re.sub(r'\.is-embedded\s+\.fullscreen-btn\s*\{\s*display:\s*none;\s*\}', '', content)
        
        # 4. Clean up .fullscreen-btn CSS to not conflict with our absolute positioning
        # We'll remove position: fixed if it exists in the CSS
        content = re.sub(r'position:\s*fixed;', '', content)
        
        # 5. Final polish on spacing
        content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Polished {filename}")
