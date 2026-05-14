import os

files_to_fix = [
    r"c:\Users\ASUS\OneDrive\Desktop\skilizee\E-waste\src\App.tsx",
    r"c:\Users\ASUS\OneDrive\Desktop\skilizee\E-waste\src\courseData.ts",
    r"c:\Users\ASUS\OneDrive\Desktop\skilizee\E-waste\src\App.css",
    r"c:\Users\ASUS\OneDrive\Desktop\skilizee\E-waste\src\components\cards\Cards.css"
]

replacements = {
    "ΓÜá": "⚠️",
    "Γå╗": "↻",
    "Γå║": "↺",
    "ΓÖ╗": "♻️",
    "Γ¢Å": "⛏️",
    "Γåö": "↔️",
    "Γ£ô": "✓",
    "ΓåÆ": "→",
    "ΓåÉ": "←",
    "Γåæ": "↑",
    "Γåô": "↓",
    "Γ£à": "✅",
    "Γ£ª": "✨",
    "≡ƒî▒": "🌱",
    "≡ƒöï": "🔋",
    "≡ƒûÑ": "🖥️",
    "≡ƒô▒": "📱",
    "≡ƒÆ╗": "💻",
    "≡ƒº╛": "📱",
    "≡ƒº┤": "🥤",
    "≡ƒìî": "🍌",
    "≡ƒôª": "📦",
    "≡ƒº║": "🗑️",
    "≡ƒÄ¿": "🎨",
    "≡ƒÄü": "🎁",
    "≡ƒÆí": "💡",
    "≡ƒÄ«": "🎮",
    "≡ƒô║": "📺",
    "≡ƒñû": "🤖",
    "≡ƒ¢á∩╕Å": "🛠️",
    "≡ƒ¢á∩╗╢ Å": "🛠️ ",
    "ΓÇÖ": "'",
    "ΓÇ£": '"',
    "ΓÇ¥": '"',
    "ΓÇô": "-",
    "ΓÇö": "--",
    "ΓÇª": "...",
}

for file_path in files_to_fix:
    if not os.path.exists(file_path):
        print(f"Skipping {file_path} - not found.")
        continue
    
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    changed = False
    for k, v in replacements.items():
        if k in content:
            content = content.replace(k, v)
            changed = True
    
    if changed:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed encoding in {file_path}")
    else:
        print(f"No changes needed for {file_path}")

print("Encoding fix complete.")
