import os
import re

dir_path = r'c:\Users\ASUS\OneDrive\Desktop\skilizee\E-waste\public\activities'

for filename in os.listdir(dir_path):
    if filename.endswith('.html'):
        file_path = os.path.join(dir_path, filename)
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # The polish script removed ALL "position: fixed;" from CSS,
        # but some elements like #scroll-progress NEED position: fixed.
        # 
        # The fullscreen button already has inline style="position: absolute; ..."
        # so the CSS .fullscreen-btn rule doesn't need position at all.
        #
        # Fix: restore "position: fixed;" in #scroll-progress CSS block
        # Look for "#scroll-progress {" and add position: fixed back
        content = re.sub(
            r'(#scroll-progress\s*\{[^}]*?)(\s*top:\s*0;)',
            r'\1 position: fixed;\2',
            content
        )

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed {filename}")
