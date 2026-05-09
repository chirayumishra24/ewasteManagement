import os
import re

dir_path = r'c:\Users\ASUS\OneDrive\Desktop\skilizee\E-waste\public\activities'

for filename in os.listdir(dir_path):
    if filename.endswith('.html'):
        file_path = os.path.join(dir_path, filename)
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Fix visibility: find .fade-in CSS rule and force opacity: 1 and no transform
        # We also want to remove the opacity: 0 and transform: translateY(20px)
        
        # Replace the .fade-in { opacity: 0; transform: translateY(20px); } with a visible version
        # Or just remove the properties inside the braces
        new_content = re.sub(
            r'\.fade-in\s*\{\s*opacity:\s*0;\s*transform:\s*translateY\(20px\);\s*\}',
            '.fade-in { opacity: 1; transform: translateY(0); }',
            content
        )
        
        # Sometimes it's slightly different
        new_content = re.sub(
            r'\.fade-in\s*\{\s*opacity:\s*0;\s*\}',
            '.fade-in { opacity: 1; }',
            new_content
        )

        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Fixed visibility for {filename}")

print("Done.")
