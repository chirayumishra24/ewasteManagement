import os
import re

dir_path = r'c:\Users\ASUS\OneDrive\Desktop\skilizee\E-waste\public\activities'

for filename in os.listdir(dir_path):
    if filename.endswith('.html'):
        file_path = os.path.join(dir_path, filename)
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Remove header tag and its content
        # Matches <header>...</header> with any attributes and multi-line content
        new_content = re.sub(r'<header.*?>.*?</header>', '', content, flags=re.DOTALL)
        
        # Remove .is-embedded header { display: none; }
        new_content = re.sub(r'\.is-embedded\s+header\s*\{\s*display:\s*none;\s*\}', '', new_content)
        
        # Also handle variants like .is-embedded header, .is-embedded .fullscreen-btn { display: none; }
        new_content = re.sub(r'\.is-embedded\s+header\s*,', '.is-embedded ', new_content)

        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filename}")
        else:
            print(f"No changes for {filename}")
