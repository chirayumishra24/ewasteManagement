import fs from 'fs';

const filePath = 'c:\\Users\\ASUS\\OneDrive\\Desktop\\skilizee\\E-waste\\public\\activities\\3-4-india-atlas.html';
let content = fs.readFileSync(filePath, 'utf8');

// Replacement 1: Styling
const targetStyle = `        .ui-layer {
            position: absolute;
            inset: 0;
            z-index: 10;
            pointer-events: none;
        }

        .panel {
            pointer-events: auto;
            position: absolute;
            background: var(--panel-bg);
            border: 1px solid var(--panel-border);
            border-radius: 28px;
            box-shadow: var(--shadow);
            backdrop-filter: blur(18px);
        }

        .header-panel {
            top: 28px;
            left: 28px;
            width: min(430px, calc(100vw - 56px));
            padding: 28px 30px;
        }

        .city-panel {
            top: 248px;
            left: 28px;
            width: min(430px, calc(100vw - 56px));
            padding: 28px 30px;
        }

        .focus-panel {
            top: 40px;
            right: 36px;
            width: min(310px, calc(100vw - 72px));
            padding: 22px 24px;
        }

        .purpose-panel {
            right: 36px;
            bottom: 36px;
            width: min(360px, calc(100vw - 72px));
            padding: 22px 24px;
            background: rgba(255, 237, 213, 0.68);
        }`;

const replacementStyle = `        .ui-layer {
            position: absolute;
            inset: 0;
            z-index: 10;
            pointer-events: none;
            display: flex;
            justify-content: space-between;
            padding: 24px;
            gap: 24px;
        }

        .sidebar-left,
        .sidebar-right {
            display: flex;
            flex-direction: column;
            gap: 20px;
            width: min(430px, 40%);
            height: calc(100vh - 48px);
            overflow-y: auto;
            pointer-events: none;
            scrollbar-width: none; /* Hide scrollbar for clean comic styling */
        }
        .sidebar-left::-webkit-scrollbar,
        .sidebar-right::-webkit-scrollbar {
            display: none;
        }

        .sidebar-right {
            width: min(380px, 35%);
        }

        .panel {
            pointer-events: auto;
            background: var(--panel-bg);
            border: 2px solid var(--accent);
            border-radius: 28px;
            box-shadow: var(--shadow);
            backdrop-filter: blur(18px);
            padding: 24px 28px;
            width: 100%;
        }

        .purpose-panel {
            background: rgba(255, 237, 213, 0.88);
        }`;

// Replacement 2: Media Queries
const targetMedia = `        @media (max-width: 1080px) {
            .header-panel,
            .city-panel {
                width: min(360px, calc(100vw - 40px));
            }

            .focus-panel,
            .purpose-panel {
                right: 20px;
            }
        }

        @media (max-width: 860px) {
            html,
            body {
                overflow: auto;
            }

            #map {
                position: fixed;
            }

            .ui-layer {
                position: relative;
                min-height: 100vh;
                padding: 18px;
            }

            .panel {
                position: relative;
                top: auto;
                left: auto;
                right: auto;
                bottom: auto;
                width: 100%;
                margin-bottom: 16px;
            }

            .header-panel,
            .city-panel,
            .focus-panel,
            .purpose-panel {
                width: 100%;
            }

            .city-card:hover,
            .city-card:focus-visible {
                transform: none;
            }
        }`;

const replacementMedia = `        @media (max-width: 1080px) {
            .sidebar-left {
                width: min(360px, 45%);
            }
            .sidebar-right {
                width: min(320px, 40%);
            }
        }

        @media (max-width: 860px) {
            html,
            body {
                overflow: auto;
            }

            #map {
                position: fixed;
                height: 45vh;
                top: 0;
                left: 0;
                right: 0;
            }

            .ui-layer {
                display: block;
                margin-top: 45vh;
                padding: 16px;
                height: auto;
                position: relative;
            }

            .sidebar-left,
            .sidebar-right {
                width: 100%;
                height: auto;
                overflow-y: visible;
                gap: 16px;
                margin-bottom: 16px;
            }

            .panel {
                margin-bottom: 0;
            }

            .city-card:hover,
            .city-card:focus-visible {
                transform: none;
            }
        }`;

// Replacement 3: HTML Wrappers
const targetHtml = `    <div class="ui-layer">
        <section class="panel header-panel">
            <p class="eyebrow">Module 3.4 • National Overview</p>
            <h1 class="title">National E-Waste Atlas</h1>
            <p class="copy">This activity now uses a real Leaflet map of India with actual city coordinates, so learners can see where e-waste concentrates across the country.</p>
        </section>

        <section class="panel city-panel">
            <p class="section-title">Urban Hotspots (Annual MT)</p>
            <div id="city-list" class="city-list"></div>
        </section>

        <aside class="panel focus-panel">
            <h4 id="focus-name" class="focus-title">India Overview</h4>
            <p id="focus-stat" class="focus-stat">Select a city card or map marker to inspect its hotspot data and geographic coordinates.</p>
            <div class="focus-grid">
                <div class="focus-metric"><span>Coordinates</span><strong id="focus-coords">20.5937° N, 78.9629° E</strong></div>
                <div class="focus-metric"><span>City Rank</span><strong id="focus-rank">Top national view</strong></div>
                <div class="focus-metric"><span>Collection Pressure</span><strong id="focus-volume">National comparison</strong></div>
            </div>
            <div class="focus-bar-shell">
                <div id="focus-bar" class="focus-bar"></div>
            </div>
        </aside>

        <aside class="panel purpose-panel">
            <span class="purpose-label">Learning Purpose</span>
            <p class="purpose-copy">Urban e-waste clusters around the biggest commercial and IT centers. Mapping those hotspots geographically helps explain why formal collection systems need to be concentrated around major metros.</p>
        </aside>
    </div>`;

const replacementHtml = `    <div class="ui-layer">
        <div class="sidebar-left">
            <section class="panel header-panel">
                <p class="eyebrow">Module 3.4 • National Overview</p>
                <h1 class="title">National E-Waste Atlas</h1>
                <p class="copy">This activity now uses a real Leaflet map of India with actual city coordinates, so learners can see where e-waste concentrates across the country.</p>
            </section>

            <section class="panel city-panel">
                <p class="section-title">Urban Hotspots (Annual MT)</p>
                <div id="city-list" class="city-list"></div>
            </section>
        </div>

        <div class="sidebar-right">
            <aside class="panel focus-panel">
                <h4 id="focus-name" class="focus-title">India Overview</h4>
                <p id="focus-stat" class="focus-stat">Select a city card or map marker to inspect its hotspot data and geographic coordinates.</p>
                <div class="focus-grid">
                    <div class="focus-metric"><span>Coordinates</span><strong id="focus-coords">20.5937° N, 78.9629° E</strong></div>
                    <div class="focus-metric"><span>City Rank</span><strong id="focus-rank">Top national view</strong></div>
                    <div class="focus-metric"><span>Collection Pressure</span><strong id="focus-volume">National comparison</strong></div>
                </div>
                <div class="focus-bar-shell">
                    <div id="focus-bar" class="focus-bar"></div>
                </div>
            </aside>

            <aside class="panel purpose-panel">
                <span class="purpose-label">Learning Purpose</span>
                <p class="purpose-copy">Urban e-waste clusters around the biggest commercial and IT centers. Mapping those hotspots geographically helps explain why formal collection systems need to be concentrated around major metros.</p>
            </aside>
        </div>
    </div>`;

// Replacement 4: Leaflet init
const targetMap = `        const map = L.map("map", {
            zoomControl: true,
            minZoom: 4,
            maxZoom: 9,
            zoomSnap: 0.25,
            maxBounds: indiaBounds.pad(0.2),
            maxBoundsViscosity: 0.9,
            scrollWheelZoom: false,
            worldCopyJump: false
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors"
        }).addTo(map);

        map.fitBounds(indiaBounds, { padding: [40, 40] });`;

const replacementMap = `        const map = L.map("map", {
            zoomControl: false,
            minZoom: 4,
            maxZoom: 9,
            zoomSnap: 0.25,
            maxBounds: indiaBounds.pad(0.2),
            maxBoundsViscosity: 0.9,
            scrollWheelZoom: false,
            worldCopyJump: false
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors"
        }).addTo(map);

        L.control.zoom({ position: 'bottomleft' }).addTo(map);

        map.fitBounds(indiaBounds, { padding: [40, 40] });`;

// Standardize newlines before checking
content = content.replace(/\r\n/g, '\n');
const targets = [targetStyle, targetMedia, targetHtml, targetMap];
const replacements = [replacementStyle, replacementMedia, replacementHtml, replacementMap];

for (let i = 0; i < targets.length; i++) {
  const normTarget = targets[i].replace(/\r\n/g, '\n');
  if (content.includes(normTarget)) {
    content = content.replace(normTarget, replacements[i]);
    console.log(`Replaced block ${i + 1}`);
  } else {
    console.warn(`Block ${i + 1} NOT found in file!`);
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Finished updating atlas layout.');
