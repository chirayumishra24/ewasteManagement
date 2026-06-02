import fs from 'fs';
import path from 'path';

const srcDir = 'c:\\Users\\ASUS\\OneDrive\\Desktop\\skilizee\\E-waste\\src';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

function processCssFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Regex to match font-size declarations: font-size: <value>;
  // Support values like 12px, 0.85rem, 0.9em, 90%, etc.
  content = content.replace(/font-size\s*:\s*([^;!]+)(!important)?/g, (match, val, imp) => {
    val = val.trim();
    let isImportant = imp ? ' !important' : '';

    // Check pixels
    let pxMatch = val.match(/^([\d.]+)\s*px$/i);
    if (pxMatch) {
      let px = parseFloat(pxMatch[1]);
      if (px < 20) {
        return `font-size: 20px${isImportant}`;
      }
    }

    // Check rem
    let remMatch = val.match(/^([\d.]+)\s*rem$/i);
    if (remMatch) {
      let rem = parseFloat(remMatch[1]);
      if (rem < 1.25) {
        return `font-size: 1.25rem${isImportant}`;
      }
    }

    // Check em
    let emMatch = val.match(/^([\d.]+)\s*em$/i);
    if (emMatch) {
      let em = parseFloat(emMatch[1]);
      if (em < 1.25) {
        return `font-size: 1.25em${isImportant}`;
      }
    }

    // Check percent
    let percentMatch = val.match(/^([\d.]+)\s*%$/);
    if (percentMatch) {
      let percent = parseFloat(percentMatch[1]);
      if (percent < 125) {
        return `font-size: 125%${isImportant}`;
      }
    }

    // Check absolute size keywords
    if (['xx-small', 'x-small', 'small', 'medium', 'smaller'].includes(val.toLowerCase())) {
      return `font-size: 20px${isImportant}`;
    }

    return match;
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated CSS: ${filePath}`);
  }
}

function processJsxFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace tailwind class text-xs, text-sm, text-base, text-lg
  // Be careful with word boundaries, e.g. text-sm-semibold doesn't exist, but text-small-caps might.
  // We use word boundaries: \btext-(xs|sm|base|lg)\b
  content = content.replace(/\btext-(xs|sm|base|lg)\b/g, 'text-xl');

  // Replace text-[...] where px value is < 20
  content = content.replace(/\btext-\[(\d+)px\]/g, (match, val) => {
    let px = parseInt(val, 10);
    if (px < 20) {
      return `text-[20px]`;
    }
    return match;
  });

  // Replace text-[...] where rem/em value is < 1.25
  content = content.replace(/\btext-\[([\d.]+)rem\]/g, (match, val) => {
    let rem = parseFloat(val);
    if (rem < 1.25) {
      return `text-[20px]`;
    }
    return match;
  });
  content = content.replace(/\btext-\[([\d.]+)em\]/g, (match, val) => {
    let em = parseFloat(val);
    if (em < 1.25) {
      return `text-[20px]`;
    }
    return match;
  });

  // Replace inline styles fontSize: 10 to fontSize: 19
  content = content.replace(/\bfontSize\s*:\s*(\d+)\b/g, (match, val) => {
    let px = parseInt(val, 10);
    if (px < 20) {
      return `fontSize: 20`;
    }
    return match;
  });

  // Replace inline styles fontSize: "10px" to fontSize: "19px"
  content = content.replace(/\bfontSize\s*:\s*(['"`])([\d.]+)px\1/g, (match, quote, val) => {
    let px = parseFloat(val);
    if (px < 20) {
      return `fontSize: ${quote}20px${quote}`;
    }
    return match;
  });

  // Replace inline styles fontSize: "0.8rem" etc.
  content = content.replace(/\bfontSize\s*:\s*(['"`])([\d.]+)rem\1/g, (match, quote, val) => {
    let rem = parseFloat(val);
    if (rem < 1.25) {
      return `fontSize: ${quote}1.25rem${quote}`;
    }
    return match;
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated TSX/TS: ${filePath}`);
  }
}

walkDir(srcDir, filePath => {
  let ext = path.extname(filePath);
  if (ext === '.css') {
    processCssFile(filePath);
  } else if (ext === '.tsx' || ext === '.ts' || ext === '.js') {
    processJsxFile(filePath);
  }
});

console.log('Font correction process complete.');
