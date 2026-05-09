import os
import re

dir_path = r'c:\Users\ASUS\OneDrive\Desktop\skilizee\E-waste\public\activities'

for filename in os.listdir(dir_path):
    if filename.endswith('.html'):
        file_path = os.path.join(dir_path, filename)
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # 1. Remove header CSS block
        content = re.sub(r'header\s*\{.*?\}', '', content, flags=re.DOTALL)
        
        # 2. Remove header tags if any remain
        content = re.sub(r'<header.*?>.*?</header>', '', content, flags=re.DOTALL)

        # 3. Handle Fullscreen Button
        # Extract the button HTML
        btn_match = re.search(r'(<button[^>]*id="toggle-fullscreen"[^>]*>.*?</button>)', content, flags=re.DOTALL)
        if btn_match:
            btn_html = btn_match.group(1)
            # Remove it from its current position
            content = content.replace(btn_html, '')
            
            # Clean up the button HTML to have standardized inline styles for positioning
            # Removing existing style attribute if it exists and adding our own
            btn_html = re.sub(r'style="[^"]*"', '', btn_html)
            btn_html = btn_html.replace('id="toggle-fullscreen"', 'id="toggle-fullscreen" style="position: absolute; top: 16px; right: 16px; z-index: 100;"')
            
            # Find insertion point: <main> or <div class="main-container">
            insertion_point = re.search(r'(<main[^>]*>|<div[^>]*class="main-container"[^>]*>)', content)
            if insertion_point:
                tag = insertion_point.group(1)
                content = content.replace(tag, tag + '\n    ' + btn_html)
                
                # Ensure the parent has relative positioning
                if 'relative' not in tag:
                    if 'class="' in tag:
                        content = content.replace(tag, tag.replace('class="', 'class="relative '))
                    else:
                        content = content.replace(tag, tag.replace('>', ' class="relative">'))

        # 4. Final CSS cleanups
        content = re.sub(r'\.is-embedded\s+header\s*,\s*', '.is-embedded ', content)
        content = re.sub(r'\.is-embedded\s+header\s*\{.*?\}', '', content, flags=re.DOTALL)

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Processed {filename}")
