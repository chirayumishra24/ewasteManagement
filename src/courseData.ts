export type ChapterImage = {
  src: string
  alt: string
}

export type ChapterPulse = {
  label: string
  value: string
}

export type ChapterMetric = {
  label: string
  value: string
  detail: string
}

export type ChapterThemeKey =
  | 'hub'
  | 'hazard'
  | 'diagnostic'
  | 'recovery'
  | 'maintenance'
  | 'upcycle'
  | 'recycling'
  | 'mapping'
  | 'action'
  | 'privacy'
  | 'policy'

export type ChapterLayout = 'hub' | 'steps' | 'split' | 'bento' | 'dashboard' | 'atlas'

export type HeroVariant = 'spotlight' | 'signal' | 'diagnostic' | 'atlas'

export type RobotAssembly = {
  part: 'head' | 'torso' | 'mobility'
  title: string
  schematic: string
  summary: string
  reward: string
}

export type StatGridItem = {
  label: string
  value: string
  detail: string
}

export type TimelineItem = {
  step: string
  title: string
  detail: string
}

export type ComparisonItem = {
  title: string
  leftLabel: string
  leftValue: string
  rightLabel: string
  rightValue: string
  insight: string
}

export type ResourceLink = {
  label: string
  href: string
  description: string
  external?: boolean
}

export type LineChartSeries = {
  label: string
  values: number[]
  accentColor: string
  detail: string
  valuePrefix?: string
  valueSuffix?: string
  decimals?: number
}

export type ChapterBlock =
  | { type: 'paragraph'; content: string; emphasis?: boolean }
  | { type: 'quote'; content: string; author?: string }
  | { type: 'bulletList'; items: string[] }
  | { type: 'numberedList'; items: string[] }
  | { type: 'imageGrid'; images: ChapterImage[]; columns?: 'one' | 'two' | 'three' }
  | { type: 'video'; url: string; title: string; note?: string }
  | { type: 'activity'; url: string; title: string; summary?: string; ctaLabel?: string }
  | { type: 'statGrid'; items: StatGridItem[] }
  | { type: 'timeline'; items: TimelineItem[] }
  | { type: 'comparison'; items: ComparisonItem[] }
  | { type: 'callout'; eyebrow?: string; title: string; content: string; tone?: 'signal' | 'alert' | 'success' | 'neutral' }
  | { type: 'resourceLinks'; items: ResourceLink[] }
  | { type: 'lineChart'; eyebrow?: string; title: string; summary: string; labels: string[]; series: LineChartSeries[]; note?: string }

export type ChapterTab = {
  id: string
  label: string
  navLabel: string
  title: string
  summary: string
  robotNote: string
  heroImage?: string
  heroVariant?: HeroVariant
  readingTime?: number
  accentColor?: string
  pulses: ChapterPulse[]
  blocks: ChapterBlock[]
}

export type CourseChapter = {
  id: string
  moduleLabel: string
  navLabel: string
  title: string
  strapline: string
  summary: string
  robotStatus: string
  scrapFact: string
  accentColor: string
  themeKey: ChapterThemeKey
  layout: ChapterLayout
  featuredMetrics: ChapterMetric[]
  assembly: RobotAssembly
  tabs: ChapterTab[]
}

const p = (content: string, emphasis = false): ChapterBlock => ({ type: 'paragraph', content, emphasis })
const q = (content: string, author?: string): ChapterBlock => ({ type: 'quote', content, author })
const bullets = (...items: string[]): ChapterBlock => ({ type: 'bulletList', items })
const steps = (...items: string[]): ChapterBlock => ({ type: 'numberedList', items })
const stats = (...items: StatGridItem[]): ChapterBlock => ({ type: 'statGrid', items })
const timeline = (...items: TimelineItem[]): ChapterBlock => ({ type: 'timeline', items })
const compare = (...items: ComparisonItem[]): ChapterBlock => ({ type: 'comparison', items })
const callout = (title: string, content: string, tone: 'signal' | 'alert' | 'success' | 'neutral' = 'signal', eyebrow = 'Salvage Lab'): ChapterBlock => ({
  type: 'callout',
  title,
  content,
  tone,
  eyebrow,
})
const resources = (...items: ResourceLink[]): ChapterBlock => ({ type: 'resourceLinks', items })
const lineChart = (
  title: string,
  summary: string,
  labels: string[],
  series: LineChartSeries[],
  note?: string,
  eyebrow = 'Trend Scan',
): ChapterBlock => ({
  type: 'lineChart',
  title,
  summary,
  labels,
  series,
  note,
  eyebrow,
})
const activity = (title: string, url: string, summary: string, ctaLabel = 'Launch Lab'): ChapterBlock => ({
  type: 'activity',
  title,
  url,
  summary,
  ctaLabel,
})
const video = (title: string, url: string, note?: string): ChapterBlock => ({ type: 'video', title, url, note })

export const chapters: CourseChapter[] = [
  {
    id: '1-0',
    moduleLabel: 'Orientation',
    navLabel: 'Start',
    title: 'E-Waste Management: Tech Tidy-Up',
    strapline: 'Mission control for the full salvage campaign: what the course covers, how the robot rebuilds, and where each module takes you next.',
    summary:
      'Use orientation as the course hub. It frames the crisis, previews the learning path, and turns the final project into a concrete community action brief.',
    robotStatus: 'Mission control calibrated. Salvage bay online.',
    scrapFact: 'A well-run recovery chain starts with classification, not collection.',
    accentColor: '#61b8ff',
    themeKey: 'hub',
    layout: 'hub',
    featuredMetrics: [
      { label: 'Course shape', value: '10 chapters', detail: 'From hazard mapping to action planning.' },
      { label: 'Core outcome', value: 'Local action', detail: 'Learners finish with a usable outreach plan.' },
      { label: 'System lens', value: 'Toxic + valuable', detail: 'Every device is both risk and resource.' },
    ],
    assembly: {
      part: 'head',
      title: 'Mission Core',
      schematic: 'Logic Core + Memory Grid',
      summary: 'Orientation synchronizes the robot with the full recovery brief before any dismantling begins.',
      reward: 'Unlocks the roadmap, launch links, and final project objective.',
    },
    tabs: [
      {
        id: 'overview',
        label: 'Mission',
        navLabel: 'Mission',
        title: 'Why This Course Exists',
        summary: 'Frame e-waste as a systems problem that connects materials, health, infrastructure, and design choices.',
        robotNote: 'R.U.S.T-01 boots with one instruction: stop valuable materials from becoming toxic liabilities.',
        heroVariant: 'spotlight',
        accentColor: '#61b8ff',
        pulses: [
          { label: 'Priority', value: 'Environmental safety' },
          { label: 'Operating mode', value: 'Salvage lab' },
          { label: 'Final output', value: 'Community action plan' },
        ],
        blocks: [
          callout('Mission brief', 'This course teaches learners how to identify e-waste, understand its material logic, and turn that knowledge into safer local action.'),
          p('Electronic waste is one of the fastest-growing waste streams in the world. The problem is not just volume. It is the combination of hazardous substances, rapid obsolescence, weak collection systems, and wasted recoverable materials.'),
          stats(
            { label: 'Hazard layer', value: 'Heavy metals', detail: 'Lead, mercury, cadmium, and brominated compounds create direct health risks.' },
            { label: 'Value layer', value: 'Urban mine', detail: 'Gold, copper, lithium, palladium, and aluminum are already concentrated inside devices.' },
            { label: 'Skill outcome', value: 'Actionable literacy', detail: 'Learners finish able to sort, explain, and mobilize others.' },
          ),
          q('The point is not only to throw less away. The point is to understand the system well enough to intervene in it.', 'Mission protocol'),
        ],
      },
      {
        id: 'roadmap',
        label: 'Roadmap',
        navLabel: 'Roadmap',
        title: 'Three Modules, One Recovery Chain',
        summary: 'See how the course moves from diagnosis to the 3Rs to real-world action.',
        robotNote: 'The robot only rebuilds if the work happens in sequence: identify, recover, then organize change.',
        heroVariant: 'signal',
        accentColor: '#2bc1a6',
        pulses: [
          { label: 'Module 1', value: 'Read the waste stream' },
          { label: 'Module 2', value: 'Extend, reuse, recycle' },
          { label: 'Module 3', value: 'Act locally' },
        ],
        blocks: [
          timeline(
            { step: '01', title: 'Map the problem', detail: 'Define e-waste, identify device categories, and understand toxic versus recoverable components.' },
            { step: '02', title: 'Work the 3Rs', detail: 'Reduce early disposal, reuse working hardware, and understand formal recycling pathways.' },
            { step: '03', title: 'Build local action', detail: 'Locate certified networks, organize collection drives, and translate policy into public practice.' },
          ),
          resources(
            { label: 'Launch Module 1', href: '/1-1', description: 'Enter the hazard and materials chapters that establish the problem.' },
            { label: 'Launch Module 2', href: '/2-1', description: 'Move into maintenance, reuse, and industrial recovery decisions.' },
            { label: 'Launch Module 3', href: '/3-1', description: 'Open the regional map, drive planning, and digital citizenship sequence.' },
          ),
        ],
      },
      {
        id: 'project',
        label: 'Final Project',
        navLabel: 'Project',
        title: 'The Community Action Build',
        summary: 'Turn course knowledge into a communication asset or small-scale local campaign.',
        robotNote: 'The robot is not fully rebuilt until the knowledge leaves the lab and changes behavior outside it.',
        heroVariant: 'signal',
        accentColor: '#f3a44a',
        pulses: [
          { label: 'Formats', value: 'Video / deck / infographic' },
          { label: 'Audience', value: 'School, family, neighborhood' },
          { label: 'Goal', value: 'Safer disposal behavior' },
        ],
        blocks: [
          compare(
            {
              title: 'Weak awareness campaign',
              leftLabel: 'Looks like',
              leftValue: 'Facts only, no clear next step',
              rightLabel: 'Stronger version',
              rightValue: 'Specific sorting, drop-off, and action instructions',
              insight: 'The project should reduce confusion, not just raise concern.',
            },
            {
              title: 'Weak event concept',
              leftLabel: 'Looks like',
              leftValue: 'A generic collection drive idea',
              rightLabel: 'Stronger version',
              rightValue: 'A drive with partners, bins, outreach, and reporting metrics',
              insight: 'Treat the final output as an operational plan, not only a poster.',
            },
          ),
          bullets(
            'Choose a real audience and define the behavior you want to change.',
            'Explain what counts as e-waste, why informal dumping is dangerous, and what certified recovery looks like.',
            'Include a practical action layer: where to store, sort, donate, repair, or drop off devices safely.',
          ),
          callout('Completion standard', 'A strong final project makes the local recovery chain feel possible, specific, and worth participating in.', 'success', 'Capstone'),
        ],
      },
    ],
  },
  {
    id: '1-1',
    moduleLabel: 'Module 01',
    navLabel: '1.1',
    title: 'The Digital Dump: Defining E-Waste',
    strapline: 'Start with recognition. If people cannot identify the waste stream, they cannot interrupt it.',
    summary:
      'This chapter introduces e-waste as both a hazard source and a material reserve, then follows its impact from household disposal to global trade routes.',
    robotStatus: 'Optics repaired. Hazard scan running.',
    scrapFact: 'Global e-waste generation continues to climb faster than formal recycling capacity.',
    accentColor: '#ff8b4d',
    themeKey: 'hazard',
    layout: 'steps',
    featuredMetrics: [
      { label: 'Waste trend', value: '3-4% annual rise', detail: 'Growth is driven by upgrades, obsolescence, and weak return systems.' },
      { label: 'Core tension', value: 'Toxic + valuable', detail: 'The same device can poison ecosystems and still hold premium materials.' },
      { label: 'Trade pattern', value: 'Cross-border flow', detail: 'Processing often shifts toward regions with weaker safeguards.' },
    ],
    assembly: {
      part: 'head',
      title: 'Vision Module',
      schematic: 'Head + optics',
      summary: 'This chapter gives the robot its first reliable scan of the waste stream.',
      reward: 'Unlocks contamination and trade-route detection.',
    },
    tabs: [
      {
        id: 'overview',
        label: 'Overview',
        navLabel: 'Overview',
        title: 'The Waste Stream Has a Name',
        summary: 'Define e-waste precisely and establish why disposal choices matter before recovery begins.',
        robotNote: 'A cracked phone is never only junk. It is a casing full of chemistry, labor, and value.',
        heroImage: '/images/ewaste_overview_hero.png',
        heroVariant: 'spotlight',
        readingTime: 3,
        accentColor: '#ff8b4d',
        pulses: [
          { label: 'Definition', value: 'Discarded electronics' },
          { label: 'Risk', value: 'Leak, burn, contaminate' },
          { label: 'Opportunity', value: 'Recover and reuse' },
        ],
        blocks: [
          p('Electronic waste includes electrical and electronic devices that are obsolete, broken, or discarded before their materials are safely recovered. That covers everything from chargers and phones to refrigerators and monitors.', true),
          callout('Why definition matters', 'If households treat electronics like ordinary trash, hazardous substances move into air, soil, and water long before formal recycling can intervene.', 'alert'),
          stats(
            { label: 'Toxic substances', value: 'Lead / mercury / cadmium', detail: 'Improper disposal creates persistent contamination pathways.' },
            { label: 'Material value', value: 'Gold / copper / rare inputs', detail: 'Recovery reduces pressure on virgin mining systems.' },
            { label: 'Behavior driver', value: 'Upgrade culture', detail: 'Many devices leave use while still technically functional.' },
          ),
          q('We are not only throwing away devices. We are throwing away concentrated materials and exporting risk.', 'Global E-waste framing'),
        ],
      },
      {
        id: 'examples',
        label: 'Examples',
        navLabel: 'Examples',
        title: 'From Pocket Gadget to Waste Pile',
        summary: 'Map the devices that most often enter the stream and the upgrade habits that keep the stream growing.',
        robotNote: 'The dump begins in ordinary rooms: desks, kitchens, classrooms, repair drawers, and forgotten shelves.',
        heroImage: '/images/ewaste_examples_hero.png',
        heroVariant: 'signal',
        accentColor: '#2bc1a6',
        pulses: [
          { label: 'Source zones', value: 'Home + office' },
          { label: 'Trigger', value: 'Obsolescence' },
          { label: 'Reminder', value: 'Not always broken' },
        ],
        blocks: [
          video('What Is E-Waste?', 'https://youtu.be/HQZjouMTH08'),
          bullets(
            'IT and communication devices such as phones, laptops, tablets, routers, and monitors.',
            'Consumer electronics such as televisions, cameras, speakers, and gaming consoles.',
            'Large and small appliances such as refrigerators, microwaves, kettles, and hair dryers.',
            'Office equipment such as printers, scanners, photocopiers, and backup hardware.',
          ),
          compare(
            {
              title: 'Why devices get discarded',
              leftLabel: 'Common story',
              leftValue: 'Broken beyond repair',
              rightLabel: 'More frequent reality',
              rightValue: 'Still usable but replaced by a newer model',
              insight: 'Obsolescence pressure is a major driver of e-waste volume.',
            },
          ),
        ],
      },
      {
        id: 'impact',
        label: 'Impact',
        navLabel: 'Impact',
        title: 'Toxic Legacy',
        summary: 'Follow the environmental and health consequences of dumping, dismantling, and open burning.',
        robotNote: 'Once the casing fails, heavy metals do not stay in the pile. They travel.',
        heroImage: '/images/ewaste_impact_hero.png',
        heroVariant: 'signal',
        readingTime: 4,
        accentColor: '#ff5e5e',
        pulses: [
          { label: 'Exposure', value: 'Air + water + soil' },
          { label: 'Hazard class', value: 'Heavy metals' },
          { label: 'Safer path', value: 'Formal recovery' },
        ],
        blocks: [
          video('E-Waste Explained by a Sustainability Expert', 'https://youtu.be/_Y2ePj3wr8M', 'Watch 0:20 to 1:14.'),
          bullets(
            'Lead from older displays and solder can damage nervous systems and development.',
            'Mercury and cadmium can move through water and food chains and remain hazardous for long periods.',
            'Open burning releases toxic fumes and pushes contamination directly into nearby communities.',
          ),
          callout('Recovery logic', 'Formal dismantling and urban mining reduce both contamination and demand for fresh extraction.', 'success'),
        ],
      },
      {
        id: 'global-flow',
        label: 'Global Flow',
        navLabel: 'Flow',
        title: 'The International Trade of E-Waste',
        summary: 'Trace how discarded electronics move from consumption centers into informal or poorly regulated processing hubs.',
        robotNote: 'Waste often follows the path of weakest enforcement. That is why trade routes matter as much as bins.',
        heroVariant: 'atlas',
        accentColor: '#61b8ff',
        pulses: [
          { label: 'Origins', value: 'High-consumption regions' },
          { label: 'Destinations', value: 'Processing hotspots' },
          { label: 'Risk mode', value: 'Informal channels' },
        ],
        blocks: [
          p('Cross-border movement is a defining feature of modern e-waste. Some shipments move through legal second-hand channels, but a substantial share still ends up in informal processing systems.'),
          activity('The Global Flow Map', '/activities/1-1-global-flow.html?embedded=true', 'Trace formal and shadow routes, inspect hotspots, and compare where risk accumulates in the trade network.', 'Open Flow Lab'),
          q('Where regulation is weak, the environmental cost of convenience is usually paid by someone else.', 'Trade-route note'),
        ],
      },
    ],
  },
  {
    id: '1-2',
    moduleLabel: 'Module 01',
    navLabel: '1.2',
    title: 'Types and Composition of E-Waste',
    strapline: 'Classification turns the pile into a system. Composition turns the system into a recovery map.',
    summary:
      'The chapter sorts devices into recognizable groups, then opens them up as layered material assemblies with different value and hazard profiles.',
    robotStatus: 'Sorting arm stable. Diagnostic visor online.',
    scrapFact: 'A single device can contain dozens of elements with radically different recovery pathways.',
    accentColor: '#61b8ff',
    themeKey: 'diagnostic',
    layout: 'split',
    featuredMetrics: [
      { label: 'Device classes', value: '10 broad groups', detail: 'Classification supports collection, storage, and policy design.' },
      { label: 'Element span', value: 'Up to 60 elements', detail: 'Phones and laptops are dense material stacks, not simple objects.' },
      { label: 'Recovery lens', value: 'Bulk / precious / hazardous', detail: 'Material categories shape recycling method and risk.' },
    ],
    assembly: {
      part: 'torso',
      title: 'Sorting Core',
      schematic: 'Torso + triage arm',
      summary: 'This chapter gives the robot a chassis-level understanding of what it is actually handling.',
      reward: 'Unlocks material-layer diagnostics.',
    },
    tabs: [
      {
        id: 'categories',
        label: 'Categories',
        navLabel: 'Classes',
        title: 'The 10 Classes of Electronic Waste',
        summary: 'Use device classing to support safer collection design and clearer public communication.',
        robotNote: 'Classification is not academic. It determines what can be stacked, stored, repaired, or dismantled together.',
        heroImage: '/images/ewaste_categories_hero.png',
        heroVariant: 'diagnostic',
        accentColor: '#61b8ff',
        pulses: [
          { label: 'System use', value: 'Collection design' },
          { label: 'Sorting logic', value: 'Function + scale' },
          { label: 'Outcome', value: 'Less chaos' },
        ],
        blocks: [
          p('International standards vary, but the most useful grouping system sorts electronics by use type and scale. That makes public education, pickup design, and safe storage easier.'),
          steps(
            'Large household appliances such as refrigerators and washing machines.',
            'Small appliances such as irons, vacuum cleaners, and kettles.',
            'IT and telecom equipment such as laptops, routers, and phones.',
            'Consumer electronics such as televisions, cameras, and audio gear.',
            'Lighting units, electrical tools, toys, medical devices, control instruments, and automatic dispensers.',
          ),
          callout('Operational benefit', 'When people understand the categories, collection points can separate hazards earlier and reduce damage to recoverable equipment.', 'signal'),
        ],
      },
      {
        id: 'composition',
        label: 'Composition',
        navLabel: 'Layers',
        title: 'What Is Inside the Scrap?',
        summary: 'Move from category to composition and treat each device like a layered inventory sheet.',
        robotNote: 'Every shell hides a stack: structure, circuitry, energy storage, rare inputs, and toxic residues.',
        heroVariant: 'diagnostic',
        readingTime: 5,
        accentColor: '#f3a44a',
        pulses: [
          { label: 'Bulk layer', value: 'Glass / plastic / aluminum' },
          { label: 'Value layer', value: 'Gold / silver / palladium' },
          { label: 'Risk layer', value: 'Lead / mercury / arsenic' },
        ],
        blocks: [
          stats(
            { label: 'Bulk materials', value: 'High volume', detail: 'Iron, aluminum, plastics, and glass dominate physical mass.' },
            { label: 'Precious metals', value: 'High value', detail: 'Gold, silver, palladium, and platinum drive urban mining economics.' },
            { label: 'Hazardous inputs', value: 'High risk', detail: 'Heavy metals and flame retardants require controlled handling.' },
          ),
          lineChart(
            'Toxic Load Rises as Global E-Waste Grows',
            'This trend tracks the size of the global e-waste stream, which matters because every additional wave of discarded electronics carries more lead, mercury, cadmium, and flame-retardant material into the handling system.',
            ['2010', '2019', '2022', '2030*'],
            [
              {
                label: 'Global e-waste generated',
                values: [34, 53.6, 62, 82],
                accentColor: '#61b8ff',
                detail: 'The higher the waste volume climbs, the larger the pool of toxic components that must be collected, depolluted, and processed safely.',
                valueSuffix: ' Mt',
                decimals: 1,
              },
            ],
            'Source context: ITU and UNITAR report 34 Mt in 2010, 62 Mt in 2022, and a projection of 82 Mt by 2030; WHO reports 53.6 Mt for 2019. The 2030 point is a projection, not an observed value.',
            'Hazard Scan',
          ),
          p('Urban mining works because electronics contain material concentrations that are often richer than natural ore bodies. The challenge is not scarcity of value. It is access, sorting, and safe extraction.'),
          activity('Inside the Machine: Layer Explorer', '/activities/1-2-layer-explorer.html?embedded=true', 'Peel a smartphone layer by layer and classify the materials hidden inside each component.', 'Open Diagnostic Lab'),
        ],
      },
    ],
  },
  {
    id: '1-3',
    moduleLabel: 'Module 01',
    navLabel: '1.3',
    title: 'Urban Mining: The Value of Waste',
    strapline: 'Once you see the material density inside discarded electronics, the dump starts to look like inventory.',
    summary:
      'Urban mining reframes e-waste as a resource system: concentrated metals, circular design, and economic value that is currently being lost.',
    robotStatus: 'Core reactor visible. Recovery math active.',
    scrapFact: 'Electronics can contain richer metal concentrations than many mined ores.',
    accentColor: '#2bc1a6',
    themeKey: 'recovery',
    layout: 'bento',
    featuredMetrics: [
      { label: 'Value signal', value: '$62.5B yearly', detail: 'The global e-waste stream contains massive unrecovered value.' },
      { label: 'Recovery gap', value: 'Low formal share', detail: 'Much of that value is still lost through informal or absent systems.' },
      { label: 'Design lesson', value: 'Waste is stock', detail: 'Recovery improves when devices are designed for disassembly.' },
    ],
    assembly: {
      part: 'mobility',
      title: 'Salvage Drive',
      schematic: 'Legs + wheel base',
      summary: 'This chapter gives the robot a reason to move: the pile is worth recovering.',
      reward: 'Unlocks salvage deployment mode.',
    },
    tabs: [
      {
        id: 'metals',
        label: 'Metals',
        navLabel: 'Metals',
        title: 'Hidden Gold in Everyday Devices',
        summary: 'Treat common electronics like compressed mineral deposits that already exist above ground.',
        robotNote: 'R.U.S.T-01 sees phones, laptops, and boards as pre-sorted ore with wires attached.',
        heroVariant: 'spotlight',
        accentColor: '#f3a44a',
        pulses: [
          { label: 'Hook', value: 'Phones as ore' },
          { label: 'Reason', value: 'High metal density' },
          { label: 'Implication', value: 'Waste is inventory' },
        ],
        blocks: [
          p('A tonne of smartphones can contain more gold than a tonne of mined gold ore. That is why urban mining matters: the material density is already concentrated by manufacturing.', true),
          q('Recovery begins when we stop describing electronics as dead objects and start describing them as stored materials.', 'Salvage brief'),
          compare(
            {
              title: 'Extraction logic',
              leftLabel: 'Traditional mining',
              leftValue: 'Dig new ore, move massive earth, refine low concentrations',
              rightLabel: 'Urban mining',
              rightValue: 'Recover from devices where materials are already concentrated',
              insight: 'The waste stream can often be a more efficient source than the ground.',
            },
          ),
        ],
      },
      {
        id: 'value',
        label: 'Value',
        navLabel: 'Value',
        title: 'Why Recycled Tech Is Worth Billions',
        summary: 'Connect the environmental argument to resource security, jobs, and circular design.',
        robotNote: 'The scrapyard has a balance sheet. Recovery is ecology plus economics plus labor design.',
        heroVariant: 'signal',
        accentColor: '#2bc1a6',
        pulses: [
          { label: 'Global value', value: '$62.5B / year' },
          { label: 'System loss', value: 'Under-recovered' },
          { label: 'Long-term model', value: 'Circular economy' },
        ],
        blocks: [
          bullets(
            'Formal recycling protects workers while recovering saleable metals and materials.',
            'Circular design lowers dependence on volatile raw-material supply chains.',
            'Repairability and disassembly decisions made at design stage determine how much value can be recovered later.',
          ),
          lineChart(
            'Annual Metal Price Motion in the Recovery Market',
            'Use the selector to compare World Bank annual averages for metals that strongly shape urban-mining economics.',
            ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
            [
              {
                label: 'Gold',
                values: [1269.2267, 1392.4983, 1770.2542, 1799.6292, 1800.6025, 1942.6658, 2387.7025, 3441.5058],
                accentColor: '#f3c969',
                detail: 'Gold remains the headline value metal in dense components such as boards and contacts, even when the physical quantity per device is small.',
                valuePrefix: '$',
                valueSuffix: '/toz',
                decimals: 2,
              },
              {
                label: 'Copper',
                values: [6529.7983, 6010.145, 6173.7708, 9317.05, 8822.3658, 8490.2908, 9142.14, 9947.305],
                accentColor: '#ff8b4d',
                detail: 'Copper is the bulk-recovery workhorse in wires, motors, and boards, so its market swings strongly affect large-volume recovery economics.',
                valuePrefix: '$',
                valueSuffix: '/mt',
                decimals: 2,
              },
              {
                label: 'Silver',
                values: [15.7137, 16.2176, 20.5366, 25.1646, 21.7944, 23.3986, 28.2692, 39.8047],
                accentColor: '#9fd6ff',
                detail: 'Silver matters in contacts and conductive paths, and its rising price still improves the case for formal recovery.',
                valuePrefix: '$',
                valueSuffix: '/toz',
                decimals: 2,
              },
              {
                label: 'Aluminum',
                values: [2108.475, 1794.4883, 1703.9867, 2472.8483, 2705.0192, 2255.7392, 2419.0167, 2631.6958],
                accentColor: '#2bc1a6',
                detail: 'Aluminum is lower-margin than precious metals, but its sheer volume makes it important in large-scale collection and dismantling streams.',
                valuePrefix: '$',
                valueSuffix: '/mt',
                decimals: 2,
              },
            ],
            'Source context: World Bank Commodity Price Data (The Pink Sheet), annual nominal averages, historical dataset updated January 6, 2026.',
            'Market Monitor',
          ),
          stats(
            { label: 'Jobs', value: 'Skilled recovery', detail: 'Collection, triage, dismantling, and materials processing all create formal work.' },
            { label: 'Security', value: 'Local material stock', detail: 'Recovered metals reduce pressure on imported virgin inputs.' },
            { label: 'Policy need', value: 'Collection + design + enforcement', detail: 'Value is lost when only one part of the chain is formalized.' },
          ),
          activity('Gold Rush Calculator', '/activities/1-3-gold-rush.html?embedded=true', 'Estimate the metals, market value, and environmental savings inside a local device collection.', 'Open Value Lab'),
        ],
      },
    ],
  },
  {
    id: '2-1',
    moduleLabel: 'Module 02',
    navLabel: '2.1',
    title: 'The First R: Reduce!',
    strapline: 'The cheapest e-waste to manage is the e-waste that never gets created in the first place.',
    summary:
      'This chapter treats reduction as a maintenance discipline: keep devices alive longer, optimize performance, and avoid unnecessary replacement cycles.',
    robotStatus: 'Durability plating active. Thermal load stable.',
    scrapFact: 'Extending a phone’s life from two years to five can dramatically lower its lifetime footprint.',
    accentColor: '#53d18d',
    themeKey: 'maintenance',
    layout: 'steps',
    featuredMetrics: [
      { label: 'Core principle', value: 'Delay disposal', detail: 'Every extra year of use lowers replacement demand.' },
      { label: 'User lever', value: 'Maintenance + upgrades', detail: 'Many replacements are preventable with care and minor repairs.' },
      { label: 'System outcome', value: 'Lower throughput', detail: 'Reducing new purchases shrinks future waste volume upstream.' },
    ],
    assembly: {
      part: 'torso',
      title: 'Longevity Plating',
      schematic: 'Reinforced torso shell',
      summary: 'Reduce gives the robot the discipline to survive longer before re-entering the recovery chain.',
      reward: 'Unlocks lifecycle extension mode.',
    },
    tabs: [
      {
        id: 'longevity',
        label: 'Longevity',
        navLabel: 'Care',
        title: 'Extending the Life of Your Devices',
        summary: 'Handle physical care as a climate and waste intervention, not just a convenience habit.',
        robotNote: 'A clean port, healthy battery, and cool operating temperature are anti-waste decisions.',
        heroImage: 'https://login.skillizee.io/s/articles/69f4527b41e01b23b9093dae/images/image-20260507102318-1.png',
        heroVariant: 'signal',
        accentColor: '#53d18d',
        pulses: [
          { label: 'Battery', value: 'Charge gently' },
          { label: 'Heat', value: 'Avoid overload' },
          { label: 'Protection', value: 'Prevent damage' },
        ],
        blocks: [
          timeline(
            { step: '01', title: 'Protect the shell', detail: 'Use cases, screen protection, and careful storage to reduce physical damage.' },
            { step: '02', title: 'Reduce thermal stress', detail: 'Avoid constant overheating, heavy charging strain, and blocked vents.' },
            { step: '03', title: 'Manage the battery', detail: 'Use optimized charging, avoid deep cycling when possible, and replace degraded batteries before replacing the device.' },
          ),
          callout('Reduction mindset', 'Maintenance is not glamorous, but it is one of the highest-impact ways to cut waste before recycling ever begins.', 'success'),
        ],
      },
      {
        id: 'optimization',
        label: 'Optimization',
        navLabel: 'Optimize',
        title: 'Software & Hardware Upgrades',
        summary: 'Use targeted upgrades and lighter software habits to delay full replacement.',
        robotNote: 'Do not scrap a chassis because one module slowed down. Replace the weak link first.',
        heroVariant: 'diagnostic',
        accentColor: '#61b8ff',
        pulses: [
          { label: 'Software', value: 'Remove drag' },
          { label: 'Repair', value: 'Swap weak parts' },
          { label: 'Upgrade', value: 'RAM / storage / battery' },
        ],
        blocks: [
          video('E-Waste Explained By A Sustainability Expert', 'https://youtu.be/_Y2ePj3wr8M', 'Watch 5:41 to 7:21 for practical reduce strategies.'),
          compare(
            {
              title: 'Performance drop',
              leftLabel: 'Default reaction',
              leftValue: 'Buy a new device',
              rightLabel: 'Smarter reaction',
              rightValue: 'Clean storage, update selectively, replace the failing component',
              insight: 'Optimization often restores usefulness without restarting the full manufacturing cycle.',
            },
          ),
        ],
      },
      {
        id: 'lifecycle',
        label: 'Lifecycle',
        navLabel: 'Handover',
        title: 'The Final Handover',
        summary: 'Know the moment when reduction ends and reuse or formal recycling should take over.',
        robotNote: 'If the mission cannot continue locally, the device should still leave service through a clean pathway.',
        heroImage: 'https://login.skillizee.io/s/articles/69f4527b41e01b23b9093dae/images/image-20260507102318-2.png',
        heroVariant: 'signal',
        accentColor: '#f3a44a',
        pulses: [
          { label: 'Donate', value: 'If functional' },
          { label: 'Repair first', value: 'If feasible' },
          { label: 'Recycle last', value: 'If irrecoverable' },
        ],
        blocks: [
          bullets(
            'Adopt digital minimalism and resist upgrade pressure that is driven by novelty rather than need.',
            'Donate or transfer functional devices into second-life use before classifying them as waste.',
            'When useful life genuinely ends, move the device into certified recycling instead of storage limbo or general trash.',
          ),
          callout('Decision rule', 'Reduce delays the waste stream. It does not justify hoarding dead devices forever.', 'neutral'),
        ],
      },
    ],
  },
  {
    id: '2-2',
    moduleLabel: 'Module 02',
    navLabel: '2.2',
    title: 'The Second R: Reuse!',
    strapline: 'A device does not need to return to its original job to stay useful.',
    summary:
      'Reuse reframes old electronics as adaptable tools: security cameras, media stations, creative hardware, and DIY components with second lives.',
    robotStatus: 'Adaptive chassis active. Creative pathways unlocked.',
    scrapFact: 'Reuse delays disposal while extracting more value from the energy and materials already invested in a device.',
    accentColor: '#c17cff',
    themeKey: 'upcycle',
    layout: 'bento',
    featuredMetrics: [
      { label: 'Reuse logic', value: 'Function shift', detail: 'The second life does not need to match the first one.' },
      { label: 'Best candidates', value: 'Still-usable hardware', detail: 'Older phones, tablets, laptops, and speakers often retain strong utility.' },
      { label: 'Skill gain', value: 'Creative salvage', detail: 'Learners practice seeing capability, not just age.' },
    ],
    assembly: {
      part: 'mobility',
      title: 'Adaptive Chassis',
      schematic: 'Multi-tool limb',
      summary: 'Reuse gives the robot new jobs instead of sending it straight to the furnace.',
      reward: 'Unlocks upcycling toolkit.',
    },
    tabs: [
      {
        id: 'smartDevices',
        label: 'Smart Devices',
        navLabel: 'Phones',
        title: 'Phones & Tablets',
        summary: 'Repurpose mobile hardware as fixed-function tools instead of letting it drift into drawers.',
        robotNote: 'A phone with a cracked shell can still see, display, stream, measure, and connect.',
        heroImage: 'https://login.skillizee.io/s/articles/69f4527b41e01b23b9093dae/images/image-20260507102408-3.png',
        heroVariant: 'spotlight',
        accentColor: '#c17cff',
        pulses: [
          { label: 'Security', value: 'Camera reuse' },
          { label: 'Home utility', value: 'Display station' },
          { label: 'Learning', value: 'Education device' },
        ],
        blocks: [
          bullets(
            'Turn older phones into security cameras, timers, media controllers, or digital photo frames.',
            'Convert tablets into recipe displays, reading devices, study tools, or dedicated art canvases.',
            'Reuse is strongest when the second-life task is narrow and dependable.',
          ),
          callout('Reuse rule', 'Pick jobs that suit the device’s remaining strengths rather than expecting it to perform like a new flagship device.', 'signal'),
        ],
      },
      {
        id: 'computing',
        label: 'Computing',
        navLabel: 'Laptops',
        title: 'Laptops & Infrastructure',
        summary: 'Use older computing hardware as dedicated stations instead of all-purpose daily machines.',
        robotNote: 'Old laptops already contain a screen, keyboard, and backup battery. That makes them excellent fixed-function terminals.',
        heroVariant: 'diagnostic',
        accentColor: '#61b8ff',
        pulses: [
          { label: 'Media', value: 'Playback station' },
          { label: 'Server use', value: 'Dedicated node' },
          { label: 'Network', value: 'Router hacks' },
        ],
        blocks: [
          compare(
            {
              title: 'Old laptop strategy',
              leftLabel: 'Bad fit',
              leftValue: 'Expect it to replace a modern workstation',
              rightLabel: 'Good fit',
              rightValue: 'Assign one role such as media center, signage, archive, or retro console',
              insight: 'Dedicated use extends relevance without demanding top performance.',
            },
          ),
          bullets(
            'Reuse heavier hardware as home media units, offline archives, school kiosks, signage, or low-intensity lab terminals.',
            'Older routers and audio hardware can still serve in niche networking and radio roles.',
          ),
        ],
      },
      {
        id: 'artistic',
        label: 'Artistic Upcycling',
        navLabel: 'Art',
        title: 'Tech to Art',
        summary: 'Use the physical material language of electronics in design, decor, and DIY projects.',
        robotNote: 'Circuit boards do not lose their geometry when they lose their software.',
        heroVariant: 'signal',
        accentColor: '#ff6f61',
        pulses: [
          { label: 'Circuit art', value: 'Jewelry + decor' },
          { label: 'Furniture', value: 'CRT repurpose' },
          { label: 'DIY culture', value: 'Visible salvage' },
        ],
        blocks: [
          bullets(
            'Turn circuit boards and keyboard keys into framed art, clocks, jewelry, or decorative objects.',
            'Reuse large casings carefully in furniture or planter projects after safe dismantling.',
            'Treat artistic reuse as a gateway habit that helps learners see discarded hardware as designed material, not only waste.',
          ),
        ],
      },
    ],
  },
  {
    id: '2-3',
    moduleLabel: 'Module 02',
    navLabel: '2.3',
    title: 'The Third R: Recycle!',
    strapline: 'When reuse ends, controlled recovery begins. Recycling is industrial precision, not symbolic disposal.',
    summary:
      'The chapter follows e-waste through formal recycling systems and adds a decision lab that helps learners sort scenarios into reduce, reuse, or recycle pathways.',
    robotStatus: 'Recovery furnace primed. Separation systems active.',
    scrapFact: 'Controlled separation and refining can recover large shares of copper and precious metals while containing toxic residues.',
    accentColor: '#ff6f61',
    themeKey: 'recycling',
    layout: 'dashboard',
    featuredMetrics: [
      { label: 'System path', value: 'Sort → shred → separate → refine', detail: 'Formal recycling is a chain, not a single act.' },
      { label: 'Critical filter', value: 'Remove hazards early', detail: 'Batteries and toxic components must leave the stream before bulk processing.' },
      { label: 'Decision skill', value: 'Pick the right R', detail: 'Not every device should go straight to the recycler.' },
    ],
    assembly: {
      part: 'mobility',
      title: 'Recycling Core',
      schematic: 'Smelting and separation unit',
      summary: 'This chapter gives the robot its formal end-of-life processing logic.',
      reward: 'Unlocks lifecycle decision lab.',
    },
    tabs: [
      {
        id: 'process',
        label: 'Process',
        navLabel: 'Process',
        title: 'Safe Disposal Methods',
        summary: 'Track the industrial chain that turns mixed electronic scrap into separated material streams.',
        robotNote: 'Formal recycling starts with triage. If hazardous items stay mixed in, the whole chain gets dirtier and more dangerous.',
        heroImage: 'https://login.skillizee.io/s/articles/69f4527b41e01b23b9093dae/images/image-20260507102449-4.png',
        heroVariant: 'signal',
        accentColor: '#f3a44a',
        pulses: [
          { label: 'Front end', value: 'Collection + sorting' },
          { label: 'Middle', value: 'Dismantle + shred' },
          { label: 'Back end', value: 'Separate + refine' },
        ],
        blocks: [
          video('I went down a rabbit hole trying to recycle all my tech waste', 'https://youtu.be/i03W6cdnlx8', 'Watch 1:32 to 2:09 and 5:00 to 14:25.'),
          timeline(
            { step: '01', title: 'Collect and triage', detail: 'Remove batteries, reusable parts, and hazardous items before bulk processing.' },
            { step: '02', title: 'Dismantle and shred', detail: 'Break devices into fractions that mechanical systems can actually separate.' },
            { step: '03', title: 'Separate the streams', detail: 'Use magnetic, eddy-current, density, and manual techniques to isolate materials.' },
          ),
          activity('Lifecycle Decision Lab', '/activities/2-3-lifecycle-lab.html?embedded=true', 'Sort realistic device scenarios into Reduce, Reuse, or Recycle and see the environmental and value impact of your choices.', 'Open Lifecycle Lab'),
        ],
      },
      {
        id: 'smelting',
        label: 'Smelting',
        navLabel: 'Smelting',
        title: 'High-Temp Refining',
        summary: 'Understand how mixed metal fractions become purified, market-ready outputs.',
        robotNote: 'The furnace is not the whole story. It only works because earlier sorting prevented the worst contamination from entering blindly.',
        heroImage: 'https://login.skillizee.io/s/articles/69f4527b41e01b23b9093dae/images/image-20260507102449-5.jpeg',
        heroVariant: 'spotlight',
        accentColor: '#ff6f61',
        pulses: [
          { label: 'Heat', value: '1200°C' },
          { label: 'Split', value: 'Metal vs slag' },
          { label: 'Refining', value: 'Purity upgrades' },
        ],
        blocks: [
          p('High-temperature processing separates recoverable metals from other fractions. Copper-rich material settles while lighter residues form slag and gases that must be controlled.'),
          p('Final purity often depends on downstream electrolysis and chemical refining, especially for precious metals such as gold and silver.'),
        ],
      },
      {
        id: 'recovery',
        label: 'Recovery',
        navLabel: 'Recovery',
        title: 'Circular Economy & SDGs',
        summary: 'Connect recycling outputs to broader environmental protection and responsible production goals.',
        robotNote: 'The loop only closes if recovered materials return to production instead of disappearing into weak markets or unsafe dumping.',
        heroVariant: 'signal',
        accentColor: '#2bc1a6',
        pulses: [
          { label: 'Outputs', value: 'Metals + plastics' },
          { label: 'Protection', value: 'Captured toxins' },
          { label: 'Goal', value: 'Closed loops' },
        ],
        blocks: [
          bullets(
            'Recovered metals re-enter manufacturing when purity standards and collection economics align.',
            'Cleaned plastics can be pelletized and reused in selected applications.',
            'Toxic residues must be contained so that recycling does not simply become another form of pollution transfer.',
          ),
          q('Formal recycling and urban mining are critical to responsible consumption because they convert disposal into a controlled material loop.', 'Global E-waste framing'),
        ],
      },
    ],
  },
  {
    id: '3-1',
    moduleLabel: 'Module 03',
    navLabel: '3.1',
    title: 'Mapping Local Resources',
    strapline: 'Knowledge becomes useful when learners can point to an actual drop-off, partner, or collection node nearby.',
    summary:
      'This chapter turns regional e-waste infrastructure into a practical dashboard: directories, events, and the Rajasthan map feed.',
    robotStatus: 'Mapping uplink locked. Regional scan active.',
    scrapFact: 'A trusted drop-off network is one of the biggest gaps between awareness and action.',
    accentColor: '#61b8ff',
    themeKey: 'mapping',
    layout: 'dashboard',
    featuredMetrics: [
      { label: 'User need', value: 'Specific destinations', detail: 'People dispose safely when they know exactly where and how.' },
      { label: 'Regional lens', value: 'Rajasthan focus', detail: 'The chapter keeps local examples visible instead of generic.' },
      { label: 'Action bridge', value: 'Map + contact + timing', detail: 'Awareness must convert into a reachable route.' },
    ],
    assembly: {
      part: 'head',
      title: 'Mapping Uplink',
      schematic: 'Sensor mast + GPS stack',
      summary: 'This chapter gives the robot a local map instead of a global abstraction.',
      reward: 'Unlocks facility lookup and event planning context.',
    },
    tabs: [
      {
        id: 'directories',
        label: 'Directories',
        navLabel: 'Directories',
        title: 'Authorized Recyclers',
        summary: 'Use public databases and service directories to find facilities that are actually certified.',
        robotNote: 'The nearest option is not automatically the safest option. Authentication matters.',
        heroImage: 'https://login.skillizee.io/s/articles/69f4527b41e01b23b9093dae/images/image-20260507102537-6.png',
        heroVariant: 'atlas',
        accentColor: '#61b8ff',
        pulses: [
          { label: 'Filter', value: 'Authorized only' },
          { label: 'Sources', value: 'Directories + govt lists' },
          { label: 'Need', value: 'Verification' },
        ],
        blocks: [
          resources(
            { label: 'Justdial recycler search', href: 'https://www.justdial.com', description: 'Use regional searches to locate pickup and authorized recycler listings.', external: true },
            { label: 'Rajasthan environment resources', href: 'https://environment.rajasthan.gov.in/', description: 'Check official networks and environmental references where available.', external: true },
            { label: 'Refresh local facility list', href: 'https://chirayumishra24.github.io/Map/rajasthan-ewaste-map.html', description: 'Open the linked map feed for a fast Rajasthan scan.', external: true },
          ),
          callout('Verification rule', 'Before disposal, confirm certification, accepted device categories, and whether batteries or data-bearing devices need special handling.', 'alert'),
        ],
      },
      {
        id: 'events',
        label: 'Events',
        navLabel: 'Events',
        title: 'Drives & Drop-offs',
        summary: 'Use seasonal campaigns and municipal points to lower the friction of safe disposal.',
        robotNote: 'A collection drive is strongest when timing, signage, and partner credibility all align.',
        heroVariant: 'signal',
        accentColor: '#f3a44a',
        pulses: [
          { label: 'Peak date', value: 'Oct 14' },
          { label: 'Sites', value: 'Municipal + school' },
          { label: 'Function', value: 'Convenience + awareness' },
        ],
        blocks: [
          timeline(
            { step: '01', title: 'Watch seasonal campaigns', detail: 'International E-Waste Day and local civic drives create visible drop-off windows.' },
            { step: '02', title: 'Confirm accepted materials', detail: 'Different drives may separate batteries, cables, large appliances, and data-bearing devices.' },
            { step: '03', title: 'Publicize clearly', detail: 'Participation rises when people know where, when, and what to bring.' },
          ),
        ],
      },
      {
        id: 'interactive',
        label: 'Map Feed',
        navLabel: 'Map',
        title: 'Interactive Resource Map',
        summary: 'Use the Rajasthan map feed as a practical interface for regional action.',
        robotNote: 'A blue dot on a map is only useful if the learner understands what kind of facility it represents.',
        heroVariant: 'atlas',
        accentColor: '#2bc1a6',
        pulses: [
          { label: 'Region', value: 'Rajasthan' },
          { label: 'Nodes', value: 'Recycler / dismantler' },
          { label: 'Use', value: 'Nearest certified route' },
        ],
        blocks: [
          p('The map feed gives the chapter a live operational layer. Use it to compare distance, facility type, and local feasibility before recommending a disposal path.'),
          resources(
            { label: 'Open Rajasthan map feed', href: 'https://chirayumishra24.github.io/Map/rajasthan-ewaste-map.html', description: 'Browse authorized nodes and identify the nearest practical option.', external: true },
          ),
          q('Local trust matters. Safe disposal starts when the last mile is visible and verified.', 'Disposal protocol'),
        ],
      },
    ],
  },
  {
    id: '3-2',
    moduleLabel: 'Module 03',
    navLabel: '3.2',
    title: 'The E-Waste Action Plan',
    strapline: 'Awareness scales when logistics are real. This chapter turns concern into an executable community drive.',
    summary:
      'The action plan chapter is a practical operations playbook for planning, running, and reporting an e-waste collection drive.',
    robotStatus: 'Command lattice active. Outreach channels open.',
    scrapFact: 'A well-run local drive can divert large amounts of waste in a very short time if the logistics are clear.',
    accentColor: '#c17cff',
    themeKey: 'action',
    layout: 'steps',
    featuredMetrics: [
      { label: 'Planning lens', value: 'Before / during / after', detail: 'Strong drives are structured in phases, not improvised on the day.' },
      { label: 'Critical inputs', value: 'Bins + partner + messaging', detail: 'Collection quality depends on operational design.' },
      { label: 'Proof of impact', value: 'Metrics matter', detail: 'Reporting is how a one-time event becomes a repeatable program.' },
    ],
    assembly: {
      part: 'torso',
      title: 'Command Module',
      schematic: 'Coordination hub',
      summary: 'This chapter gives the robot the ability to coordinate people, not just materials.',
      reward: 'Unlocks drive-planning simulator.',
    },
    tabs: [
      {
        id: 'prep',
        label: 'Preparation',
        navLabel: 'Prep',
        title: 'Phase 1: Intel & Outreach',
        summary: 'Define the purpose, partner network, and communications before the first item is collected.',
        robotNote: 'A drive fails early when the partner, rules, or message are fuzzy.',
        heroImage: 'https://login.skillizee.io/s/articles/69f4527b41e01b23b9093dae/images/image-20260507103816-1.png',
        heroVariant: 'signal',
        accentColor: '#c17cff',
        pulses: [
          { label: 'Research', value: 'Local regulations' },
          { label: 'Partner', value: 'Certified recycler' },
          { label: 'Outreach', value: 'Clear message' },
        ],
        blocks: [
          video('Managing E-Waste', 'https://youtu.be/dGxU4w1MDco'),
          timeline(
            { step: '01', title: 'Set the objective', detail: 'Choose the audience, the waste categories, and the event scope.' },
            { step: '02', title: 'Secure the recycler', detail: 'Confirm pickup, accepted materials, and compliance needs before promotion begins.' },
            { step: '03', title: 'Build awareness', detail: 'Use flyers, announcements, workshops, and short explainers to make the drive feel concrete.' },
          ),
        ],
      },
      {
        id: 'execution',
        label: 'Execution',
        navLabel: 'Run Day',
        title: 'Phase 2: The Collection',
        summary: 'Run the drop-off day like an operations system: layout, flow, labeling, staff, and storage.',
        robotNote: 'Good logistics reduce contamination, queues, confusion, and damage to salvageable items.',
        heroVariant: 'signal',
        accentColor: '#ff6f61',
        pulses: [
          { label: 'Site', value: 'Accessible + visible' },
          { label: 'Sorting', value: 'Category bins' },
          { label: 'Crew', value: 'Trained volunteers' },
        ],
        blocks: [
          bullets(
            'Choose a high-traffic, easy-to-find site with enough space for intake and temporary storage.',
            'Separate waste categories clearly so batteries, small devices, and cables do not become one mixed pile.',
            'Assign volunteers to greeting, sorting, queue flow, and intake logging.',
          ),
          activity('Collection Drive Planner', '/activities/3-2-drive-planner.html?embedded=true', 'Assemble a collection site, partner, outreach channel, and staffing plan until the drive reaches launch readiness.', 'Open Planning Console'),
        ],
      },
      {
        id: 'impact',
        label: 'Impact',
        navLabel: 'Aftermath',
        title: 'Phase 3: Post-Drive Metrics',
        summary: 'Process the material, report the results, and turn one event into a repeatable local habit.',
        robotNote: 'Without reporting, a drive becomes a memory instead of a model.',
        heroVariant: 'signal',
        accentColor: '#2bc1a6',
        pulses: [
          { label: 'Transport', value: 'Recycler handoff' },
          { label: 'Reporting', value: 'Impact metrics' },
          { label: 'Future cycle', value: 'Repeatable plan' },
        ],
        blocks: [
          stats(
            { label: 'Diversion total', value: 'kg collected', detail: 'The clearest metric for landfill avoidance and community participation.' },
            { label: 'Participation', value: 'People or households', detail: 'Shows whether outreach worked beyond the core volunteer circle.' },
            { label: 'Continuity', value: 'Next date / next partner step', detail: 'Locks the event into a longer-term local rhythm.' },
          ),
          q('A drive becomes culture when the community can see what changed and what happens next.', 'Action lead'),
        ],
      },
    ],
  },
  {
    id: '3-3',
    moduleLabel: 'Module 03',
    navLabel: '3.3',
    title: 'Digital Citizenship',
    strapline: 'Responsible tech use is not only about devices. It is also about the data habits that surround them.',
    summary:
      'This chapter frames digital citizenship as privacy, account hygiene, and responsible participation that reduces risk and needless digital overhead.',
    robotStatus: 'Privacy shield deployed. Data ports hardened.',
    scrapFact: 'Unused accounts, excessive cloud clutter, and weak security habits all create hidden operational waste.',
    accentColor: '#2bc1a6',
    themeKey: 'privacy',
    layout: 'split',
    featuredMetrics: [
      { label: 'Privacy baseline', value: '2FA + strong passwords', detail: 'Simple controls prevent large classes of account compromise.' },
      { label: 'Data hygiene', value: 'Delete what you do not need', detail: 'Unused accounts and clutter expand risk without adding value.' },
      { label: 'Citizen role', value: 'Mindful participation', detail: 'Responsible users lower both exposure and wasteful digital behavior.' },
    ],
    assembly: {
      part: 'mobility',
      title: 'Encryption Shield',
      schematic: 'Hardened logic gates',
      summary: 'Digital citizenship gives the robot a shield for the data layer around the hardware story.',
      reward: 'Unlocks privacy control checklist.',
    },
    tabs: [
      {
        id: 'security',
        label: 'Privacy',
        navLabel: 'Privacy',
        title: 'Hardening Your Digital Defenses',
        summary: 'Treat basic security settings as part of responsible technology use.',
        robotNote: 'A device that is physically maintained but digitally exposed is still vulnerable.',
        heroImage: 'https://login.skillizee.io/s/articles/69f4527b41e01b23b9093dae/images/image-20260507104024-2.png',
        heroVariant: 'diagnostic',
        accentColor: '#2bc1a6',
        pulses: [
          { label: 'Defense', value: '2FA' },
          { label: 'Visibility', value: 'Privacy settings' },
          { label: 'Discipline', value: 'Selective sharing' },
        ],
        blocks: [
          video('Digital Footprint & Security', 'https://youtu.be/8pkv_T0a80g'),
          bullets(
            'Use strong, unique passwords and enable two-factor authentication on core accounts.',
            'Review privacy settings regularly instead of accepting broad default exposure.',
            'Share personal information only when there is a clear reason and trusted context.',
          ),
        ],
      },
      {
        id: 'footprint',
        label: 'Footprint',
        navLabel: 'Footprint',
        title: 'Minimizing Your Data Trace',
        summary: 'Reduce unnecessary data accumulation the same way you reduce unnecessary hardware churn.',
        robotNote: 'Digital clutter is not harmless just because it is invisible.',
        heroVariant: 'signal',
        accentColor: '#7e8fa3',
        pulses: [
          { label: 'Trace', value: 'Cookies + cache' },
          { label: 'Accounts', value: 'Delete unused' },
          { label: 'Network', value: 'Secure connections' },
        ],
        blocks: [
          compare(
            {
              title: 'Digital cleanup',
              leftLabel: 'Passive habit',
              leftValue: 'Keep old accounts and browsing clutter forever',
              rightLabel: 'Responsible habit',
              rightValue: 'Deactivate unused accounts, clear stored junk, and protect public browsing sessions',
              insight: 'Data hygiene mirrors hardware hygiene: remove what no longer serves a purpose.',
            },
          ),
        ],
      },
      {
        id: 'mindfulness',
        label: 'Mindfulness',
        navLabel: 'Mindfulness',
        title: 'Responsible Participation',
        summary: 'Stay cautious with links, permissions, and platform behavior as the digital environment keeps shifting.',
        robotNote: 'The ecosystem changes. Responsible users adapt instead of assuming yesterday’s safe habit still works.',
        heroVariant: 'signal',
        accentColor: '#61b8ff',
        pulses: [
          { label: 'Phishing', value: 'Check links' },
          { label: 'Apps', value: 'Limit permissions' },
          { label: 'Awareness', value: 'Stay updated' },
        ],
        blocks: [
          bullets(
            'Approach unexpected links, attachments, and urgent messages with suspicion.',
            'Grant apps only the permissions they genuinely need to function.',
            'Keep learning how privacy norms and platform settings change over time.',
          ),
          q('Responsible participation means protecting both your own data and the broader trustworthiness of the digital environment.', 'Citizen protocol'),
        ],
      },
    ],
  },
  {
    id: '3-4',
    moduleLabel: 'Module 03',
    navLabel: '3.4',
    title: 'E-Waste in India',
    strapline: 'Regional scale changes the problem. India is a major generator, a major recovery site, and a major policy laboratory.',
    summary:
      'This chapter studies India’s e-waste landscape through three lenses: national scale, the 2022 rules, and emerging infrastructure such as eco-parks and AI-assisted sorting.',
    robotStatus: 'Regional framework loaded. Policy atlas active.',
    scrapFact: 'India is one of the largest e-waste generators in the world, with vast gaps between formal systems and informal handling.',
    accentColor: '#f3a44a',
    themeKey: 'policy',
    layout: 'atlas',
    featuredMetrics: [
      { label: 'Global rank', value: 'Top-tier generator', detail: 'India’s rapid digital expansion has made e-waste a major infrastructure challenge.' },
      { label: 'System gap', value: 'Formal vs informal', detail: 'A large share of material still moves through unsafe informal channels.' },
      { label: 'Policy lever', value: 'EPR rules 2022', detail: 'Producer responsibility is central to the current framework.' },
    ],
    assembly: {
      part: 'mobility',
      title: 'Framework Reinforcement',
      schematic: 'Industrial-grade support',
      summary: 'This chapter gives the robot a national policy context for the recovery work it has been learning.',
      reward: 'Unlocks regional policy atlas.',
    },
    tabs: [
      {
        id: 'status',
        label: 'Status',
        navLabel: 'Status',
        title: 'A Global Scrap Giant',
        summary: 'Understand the scale, geography, and health burden of India’s e-waste stream.',
        robotNote: 'At national scale, the challenge is no longer only awareness. It is throughput, infrastructure, and enforcement.',
        heroImage: 'https://login.skillizee.io/s/articles/69f4527b41e01b23b9093dae/images/image-20260507104106-3.png',
        heroVariant: 'atlas',
        accentColor: '#f3a44a',
        pulses: [
          { label: 'Rank', value: '3rd globally' },
          { label: 'Volume', value: '3.8 MMT/year' },
          { label: 'Concentration', value: '65 major cities' },
        ],
        blocks: [
          video('India E-Waste Status', 'https://youtu.be/dGxU4w1MDco'),
          stats(
            { label: 'Urban concentration', value: '65 cities', detail: 'A large share of the stream is concentrated in high-population centers.' },
            { label: 'Processing gap', value: 'Formal share limited', detail: 'Much of the stream still escapes regulated recovery.' },
            { label: 'Health burden', value: 'Informal exposure', detail: 'Acid leaching and burning create severe local hazards.' },
          ),
        ],
      },
      {
        id: 'rules',
        label: 'Policy',
        navLabel: 'Rules',
        title: 'E-Waste Rules 2022',
        summary: 'Read the current framework through the lens of accountability, digitized tracking, and enforcement friction.',
        robotNote: 'Extended Producer Responsibility is the rule that tries to pull the entire chain into view.',
        heroImage: 'https://login.skillizee.io/s/articles/69f4527b41e01b23b9093dae/images/image-20260507104106-4.png',
        heroVariant: 'atlas',
        accentColor: '#ff6f61',
        pulses: [
          { label: 'Policy', value: 'Rules 2022' },
          { label: 'Mandate', value: 'EPR targets' },
          { label: 'Challenge', value: 'Compliance gap' },
        ],
        blocks: [
          timeline(
            { step: '01', title: 'Producer responsibility', detail: 'Manufacturers must ensure products reach authorized recyclers instead of disappearing after sale.' },
            { step: '02', title: 'Tracking and targets', detail: 'Digitized systems aim to make compliance measurable instead of symbolic.' },
            { step: '03', title: 'Enforcement challenge', detail: 'Infrastructure gaps, illegal movement, and low awareness still weaken outcomes.' },
          ),
        ],
      },
      {
        id: 'innovation',
        label: 'Innovation',
        navLabel: 'Innovation',
        title: 'Eco-Parks & AI',
        summary: 'Look at the infrastructure and technology experiments trying to formalize and scale the recovery chain.',
        robotNote: 'Innovation matters when it connects access, worker safety, and material efficiency all at once.',
        heroVariant: 'atlas',
        accentColor: '#2bc1a6',
        pulses: [
          { label: 'Infrastructure', value: 'Eco-parks' },
          { label: 'Pilot model', value: 'Clinics + banks' },
          { label: 'Tech layer', value: 'AI sorting' },
        ],
        blocks: [
          video('Fixing India’s E-Waste', 'https://youtu.be/KxGbqRF3-_0'),
          {
            type: 'imageGrid',
            columns: 'two',
            images: [
              { src: 'https://login.skillizee.io/s/articles/69f4527b41e01b23b9093dae/images/image-20260507104106-5.png', alt: 'E-waste clinic concept' },
              { src: 'https://login.skillizee.io/s/articles/69f4527b41e01b23b9093dae/images/image-20260507104106-6.png', alt: 'Eco-park layout reference' },
            ],
          },
          callout('Strategic opportunity', 'India’s scale makes the challenge difficult, but it also makes successful formal recovery systems globally significant.', 'success'),
        ],
      },
    ],
  },
]

export function toSkillizeeImageUrl(path: string) {
  const skillizeeAssetPrefix = 'https://login.skillizee.io'
  return path.startsWith('http') || path.startsWith('/images/') ? path : `${skillizeeAssetPrefix}${path}`
}

export function toYouTubeEmbedUrl(url: string) {
  const patterns = [
    /youtu\.be\/([^?&/]+)/,
    /youtube\.com\/watch\?v=([^?&/]+)/,
    /youtube\.com\/embed\/([^?&/]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match?.[1]) {
      return `https://www.youtube.com/embed/${match[1]}`
    }
  }

  return url
}
