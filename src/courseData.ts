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
  | 'digital'

export type ChapterLayout = 'hub' | 'steps' | 'split' | 'bento' | 'dashboard' | 'atlas'

export type HeroVariant = 'spotlight' | 'signal' | 'diagnostic' | 'atlas' | 'abstract'

export type RobotAssembly = {
  part: 'head' | 'torso' | 'mobility' | 'arm_l'
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
  | { type: 'courseMap'; chapters: { id: string; title: string; status: 'done' | 'current' | 'locked' }[] }
  | { type: 'flipCard'; front: { image: string; label: string }; back: { title: string; facts: string[] } }
  | { type: 'liveTicker'; label: string; ratePerSecond: number; unit: string; startValue: number }
  | { type: 'dragSort'; prompt: string; items: { label: string; correct: 'left' | 'right'; image?: string }[]; leftBin: string; rightBin: string }
  | { type: 'explodedDiagram'; image: string; hotspots: { x: number; y: number; label: string; detail: string }[] }
  | { type: 'interactivePie'; title: string; segments: { label: string; value: number; color: string; detail: string }[] }
  | { type: 'valueCalculator'; materials: { name: string; perDevice: number; unit: string; pricePerUnit: number }[] }
  | { type: 'beforeAfter'; leftImage: string; rightImage: string; leftLabel: string; rightLabel: string }
  | { type: 'checklist'; title: string; items: { label: string; impact: string }[]; scoreLabel: string }
  | { type: 'sliderCalculator'; title: string; sliders: { label: string; min: number; max: number; unit: string; impactPerUnit: number }[]; resultLabel: string }
  | { type: 'ideaGenerator'; combinations: { device: string; purpose: string; steps: string[]; difficulty: 'easy' | 'medium' | 'hard' }[] }
  | { type: 'storyCarousel'; stories: { title: string; before: string; after: string; image: string; quote: string }[] }
  | { type: 'decisionTree'; root: { question: string; yes: DecisionNode; no: DecisionNode } }
  | { type: 'processSimulator'; stages: { title: string; description: string; icon: string; output: string }[] }
  | { type: 'quiz'; question: string; options: { label: string; correct: boolean; explanation: string }[]; reward: string }
  | { type: 'mapLocator'; points: { lat: number; lng: number; label: string; type: string }[] }
  | { type: 'campaignWizard'; steps: { title: string; prompt: string; options: string[] }[] }
  | { type: 'impactDashboard'; stats: { label: string; value: string; trend: 'up' | 'down'; detail: string }[] }
  | { type: 'dataWipeSim'; device: string; steps: { title: string; action: string; risk: string }[] }
  | { type: 'policyTimeline'; events: { year: string; title: string; impact: string; region: string }[] }

export type DecisionNode = {
  question?: string
  result?: string
  yes?: DecisionNode
  no?: DecisionNode
}

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
const stats = (...items: StatGridItem[]): ChapterBlock => ({ type: 'statGrid', items })
const timeline = (...items: TimelineItem[]): ChapterBlock => ({ type: 'timeline', items })
const compare = (...items: ComparisonItem[]): ChapterBlock => ({ type: 'comparison', items })
const callout = (title: string, content: string, tone: 'signal' | 'alert' | 'success' | 'neutral' = 'signal', eyebrow = 'Learning Corner 📚'): ChapterBlock => ({
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
  eyebrow = 'Cool Numbers 📊',
): ChapterBlock => ({
  type: 'lineChart',
  title,
  summary,
  labels,
  series,
  note,
  eyebrow,
})
const activity = (title: string, url: string, summary: string, ctaLabel = 'Play Now! 🚀'): ChapterBlock => ({
  type: 'activity',
  title,
  url,
  summary,
  ctaLabel,
})
const video = (title: string, url: string, note?: string): ChapterBlock => ({ type: 'video', title, url, note })
const courseMap = (chapters: { id: string; title: string; status: 'done' | 'current' | 'locked' }[]): ChapterBlock => ({ type: 'courseMap', chapters })
const flipCard = (front: { image: string; label: string }, back: { title: string; facts: string[] }): ChapterBlock => ({ type: 'flipCard', front, back })
const liveTicker = (label: string, ratePerSecond: number, unit: string, startValue: number): ChapterBlock => ({ type: 'liveTicker', label, ratePerSecond, unit, startValue })
const dragSort = (prompt: string, items: { label: string; correct: 'left' | 'right'; image?: string }[], leftBin: string, rightBin: string): ChapterBlock => ({ type: 'dragSort', prompt, items, leftBin, rightBin })
const explodedDiagram = (image: string, hotspots: { x: number; y: number; label: string; detail: string }[]): ChapterBlock => ({ type: 'explodedDiagram', image, hotspots })
const interactivePie = (title: string, segments: { label: string; value: number; color: string; detail: string }[]): ChapterBlock => ({ type: 'interactivePie', title, segments })
const valueCalculator = (materials: { name: string; perDevice: number; unit: string; pricePerUnit: number }[]): ChapterBlock => ({ type: 'valueCalculator', materials })
const beforeAfter = (leftImage: string, rightImage: string, leftLabel: string, rightLabel: string): ChapterBlock => ({ type: 'beforeAfter', leftImage, rightImage, leftLabel, rightLabel })
const checklist = (title: string, items: { label: string; impact: string }[], scoreLabel: string): ChapterBlock => ({ type: 'checklist', title, items, scoreLabel })
const sliderCalculator = (title: string, sliders: { label: string; min: number; max: number; unit: string; impactPerUnit: number }[], resultLabel: string): ChapterBlock => ({ type: 'sliderCalculator', title, sliders, resultLabel })
const ideaGenerator = (combinations: { device: string; purpose: string; steps: string[]; difficulty: 'easy' | 'medium' | 'hard' }[]): ChapterBlock => ({ type: 'ideaGenerator', combinations })
const decisionTree = (root: { question: string; yes: DecisionNode; no: DecisionNode }): ChapterBlock => ({ type: 'decisionTree', root })
const processSimulator = (stages: { title: string; description: string; icon: string; output: string }[]): ChapterBlock => ({ type: 'processSimulator', stages })
const quiz = (question: string, options: { label: string; correct: boolean; explanation: string }[], reward: string): ChapterBlock => ({ type: 'quiz', question, options, reward })
const mapLocator = (points: { lat: number; lng: number; label: string; type: string }[]): ChapterBlock => ({ type: 'mapLocator', points })
const campaignWizard = (steps: { title: string; prompt: string; options: string[] }[]): ChapterBlock => ({ type: 'campaignWizard', steps })
const impactDashboard = (stats: { label: string; value: string; trend: 'up' | 'down'; detail: string }[]): ChapterBlock => ({ type: 'impactDashboard', stats })
const dataWipeSim = (device: string, steps: { title: string; action: string; risk: string }[]): ChapterBlock => ({ type: 'dataWipeSim', device, steps })
const policyTimeline = (events: { year: string; title: string; impact: string; region: string }[]): ChapterBlock => ({ type: 'policyTimeline', events })

export const chapters: CourseChapter[] = [
  {
    id: '1-0',
    moduleLabel: 'Orientation',
    navLabel: 'Start',
    title: 'E-Waste Management: Tech Tidy-Up',
    strapline: 'Mission control for the full salvage campaign: what the course covers, how the robot rebuilds, and where each module takes you next.',
    summary:
      'Use orientation as the course hub. It frames the crisis, previews the learning path, and turns the final project into a concrete community action brief.',
    robotStatus: 'Hi there! Ready to be an E-Waste Hero? 🌟',
    scrapFact: 'Did you know? Every old phone is a treasure chest of cool materials!',
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
          courseMap([
            { id: '1-0', title: 'Orientation', status: 'current' },
            { id: '1-1', title: 'Defining E-Waste', status: 'locked' },
            { id: '1-2', title: 'Composition', status: 'locked' },
            { id: '1-3', title: 'Urban Mining', status: 'locked' },
            { id: '1-4', title: 'Toxic Chemicals', status: 'locked' },
            { id: '2-1', title: 'The First R: Reduce', status: 'locked' },
            { id: '2-2', title: 'The Second R: Reuse', status: 'locked' },
            { id: '2-3', title: 'The Third R: Recycle', status: 'locked' },
            { id: '3-1', title: 'Drop-off & Events', status: 'locked' },
            { id: '3-2', title: 'Awareness Campaign', status: 'locked' },
            { id: '3-3', title: 'Data Security', status: 'locked' },
            { id: '3-4', title: 'Policy & Innovation', status: 'locked' },
            { id: '4-1', title: 'Capstone: Project A', status: 'locked' },
            { id: '4-2', title: 'Capstone: Project B', status: 'locked' },
            { id: '4-3', title: 'Capstone: Project C', status: 'locked' },
          ]),
          resources(
            { label: 'Launch Module 1', href: '/1-1', description: 'Enter the hazard and materials chapters that establish the problem.' },
            { label: 'Urban Mining (1.3)', href: '/1-3', description: 'See the market value and material density inside the waste stream.' },
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
          liveTicker('E-Waste Generated Right Now', 1.9, 'kg', 0),
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
          dragSort('Sort the Tech!', [
            { label: 'Smartphone', correct: 'left', image: 'smartphone_modern_1778658711613.png' },
            { label: 'Old Laptop', correct: 'left' },
            { label: 'Banana Peel', correct: 'right' },
            { label: 'Cracked Tablet', correct: 'left' },
            { label: 'Plastic Bottle', correct: 'right' },
            { label: 'AA Battery', correct: 'left' },
          ], 'E-Waste', 'Other Waste'),
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
          flipCard(
            { image: 'lead_acid_battery_1778658558252.png', label: 'Lead-Acid Battery' },
            { title: 'The Toxic Truth', facts: ['Contains lead and sulfuric acid', 'Damages soil and groundwater', 'Affects human development'] }
          ),
          flipCard(
            { image: 'crt_monitor_1778658608296.png', label: 'Old CRT Monitor' },
            { title: 'Hidden Dangers', facts: ['Contains up to 4kg of lead', 'Phosphor coating is toxic', 'High voltage risk if broken'] }
          ),
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
          explodedDiagram('exploded_smartphone_1778658636240.png', [
            { x: 50, y: 30, label: 'Screen & Glass', detail: 'Contains indium tin oxide and glass-strengthening compounds.' },
            { x: 40, y: 50, label: 'Logic Board', detail: 'The value hub: gold, silver, palladium, and copper.' },
            { x: 60, y: 70, label: 'Battery', detail: 'Lithium, cobalt, and graphite. High fire risk if damaged.' },
            { x: 20, y: 40, label: 'Plastic Chassis', detail: 'Bulk material that can be recycled into new products.' },
          ]),
          bullets(
            'Large household appliances such as refrigerators and washing machines.',
            'Small appliances such as irons, vacuum cleaners, and kettles.',
            'IT and telecom equipment such as laptops, routers, and phones.',
            'Consumer electronics such as televisions, cameras, and audio gear.',
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
          interactivePie('What makes up the weight?', [
            { label: 'Iron & Steel', value: 48, color: '#94a3b8', detail: 'Chassis, screws, and motors.' },
            { label: 'Plastics', value: 21, color: '#4ade80', detail: 'Casings, insulation, and buttons.' },
            { label: 'Non-Ferrous Metals', value: 13, color: '#facc15', detail: 'Copper, aluminum, and brass.' },
            { label: 'Glass', value: 5, color: '#60a5fa', detail: 'Screens and lenses.' },
            { label: 'Other (PCB/Logic)', value: 13, color: '#f472b6', detail: 'Circuit boards and sensors.' },
          ]),
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
          valueCalculator([
            { name: 'Gold', perDevice: 0.034, unit: 'g', pricePerUnit: 65 },
            { name: 'Copper', perDevice: 15, unit: 'g', pricePerUnit: 0.009 },
            { name: 'Silver', perDevice: 0.35, unit: 'g', pricePerUnit: 0.8 },
          ]),
          q('Recovery begins when we stop describing electronics as dead objects and start describing them as stored materials.', 'Salvage brief'),
          beforeAfter('raw_ore_mine_1778658870536.png', 'urban_mine_recycling_1778658947185.png', 'Raw Ore Mine', 'Urban Mine'),
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
    id: '1-4',
    moduleLabel: 'Module 01',
    navLabel: '1.4',
    title: 'The Toxic Truth: Dangerous Chemicals',
    strapline: 'Step into the microscopic world of electronic toxins.',
    summary:
      'Hidden beneath the sleek glass and metal of our gadgets is a cocktail of elements that can persist in the environment for centuries.',
    robotStatus: 'Hazard detection at 100%. Scanning for persistent pollutants.',
    scrapFact: 'A single old computer monitor can contain up to 4kg of lead.',
    accentColor: '#ef4444',
    themeKey: 'hazard',
    layout: 'hub',
    featuredMetrics: [
      { label: 'Risk factor', value: 'High Toxicity', detail: 'Mercury, Lead, and Cadmium require specialized handling.' },
      { label: 'Impact', value: 'Local Soil', detail: 'Toxins leach into groundwater when dumped in open landfills.' },
      { label: 'Safeguard', value: 'Safe Disposal', detail: 'Certified recycling captures 99% of these hazardous materials.' },
    ],
    assembly: {
      part: 'head',
      title: 'Tox-Vision Pro',
      schematic: 'Multi-spectrum Chemical Scanner',
      summary: 'Upgrade your robot with the ability to detect invisible chemical signatures.',
      reward: 'Unlocks Global Hazard Map.',
    },
    tabs: [
      {
        id: 'chemical-scan',
        label: 'Chemical Scan',
        navLabel: 'Scan',
        title: 'Deep Scan: Heavy Metals',
        summary: 'Look inside a smartphone to see where the danger hides.',
        robotNote: 'R.U.S.T-01 is detecting high concentrations of neurotoxins in the battery and display units.',
        heroVariant: 'diagnostic',
        accentColor: '#dc2626',
        pulses: [
          { label: 'Mercury', value: 'Neurotoxic' },
          { label: 'Lead', value: 'Developmental' },
          { label: 'Cadmium', value: 'Carcinogenic' },
        ],
        blocks: [
          explodedDiagram('https://images.unsplash.com/photo-1556656793-062ff98782ea?auto=format&fit=crop&q=80&w=1200', [
            { x: 35, y: 30, label: 'LCD Backlight', detail: 'Older models contain Mercury vapor which is highly toxic if the screen breaks.' },
            { x: 65, y: 55, label: 'Logic Board Solder', detail: 'Traditionally uses Lead (Pb), a persistent heavy metal that affects brain development.' },
            { x: 50, y: 80, label: 'Li-ion Battery', detail: 'Contains Cobalt and Lithium. If crushed, it can leak corrosive and toxic electrolytes.' },
          ]),
          p('These materials are safe while sealed inside your phone, but become a "Toxic Truth" once they hit the open ground.', true),
          flipCard(
            { image: 'https://images.unsplash.com/photo-1590333746438-d81ff15560c3?auto=format&fit=crop&q=80&w=800', label: 'Lead (Pb)' },
            { title: 'The Silent Threat', facts: ['Found in CRT monitors and solder.', 'Causes irreversible brain damage in children.', 'Does not break down over time.'] },
          ),
          flipCard(
            { image: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&q=80&w=800', label: 'Mercury (Hg)' },
            { title: 'Liquid Poison', facts: ['Used in older flat-screen backlights.', 'Vaporizes at room temperature when broken.', 'Bioaccumulates in fish and food chains.'] },
          ),
          callout('Did you know?', 'Cadmium, found in rechargeable batteries, is classified as a Group 1 carcinogen by the WHO. Even tiny amounts can damage kidneys over time.', 'alert', 'Hazard Intel'),
        ],
      },
      {
        id: 'processing',
        label: 'Processing',
        navLabel: 'Safety',
        title: 'Safe vs. Unsafe Handling',
        summary: 'Compare how different processing methods impact the environment.',
        robotNote: 'The difference between a resource and a poison is how you handle it.',
        heroVariant: 'signal',
        accentColor: '#991b1b',
        pulses: [
          { label: 'Safe', value: 'Certified' },
          { label: 'Unsafe', value: 'Informal' },
          { label: 'Difference', value: 'Survival' },
        ],
        blocks: [
          compare({
            title: 'Material Lifecycle',
            leftLabel: 'Informal Burn',
            leftValue: 'Toxic smoke, soil leaching, worker health crisis.',
            rightLabel: 'Formal Recovery',
            rightValue: 'Closed-loop processing, chemical capture, safe jobs.',
            insight: 'Certified recycling is the only way to stop the toxic cycle.',
          }),
          p('Below is a stark visual comparison of the "Toxic Truth". Notice how formal recycling keeps materials contained and safe.', true),
          beforeAfter(
            '/s/articles/692814c49dee6d5d1eb46423/images/qqqq.png',
            '/s/articles/692814c49dee6d5d1eb46423/images/wwwwwww.png',
            'Informal Landfill',
            'Certified Recycling',
          ),
          stats(
            { label: 'Informal path', value: '90% lost', detail: 'Burning and dumping destroy recoverable value and spread contamination.' },
            { label: 'Formal path', value: '99% captured', detail: 'Certified facilities contain hazardous residues and recover clean material.' },
            { label: 'Worker safety', value: 'Critical gap', detail: 'Informal workers face direct exposure without protective equipment.' },
          ),
        ],
      },
      {
        id: 'impact',
        label: 'Impact',
        navLabel: 'Stats',
        title: 'Global Toxicity Trends',
        summary: 'Track the rising tide of hazardous materials in the waste stream.',
        robotNote: 'If current trends continue, the toxic load in our soil will double by 2040.',
        heroVariant: 'atlas',
        accentColor: '#7f1d1d',
        pulses: [
          { label: 'Soil', value: 'Contaminated' },
          { label: 'Water', value: 'At Risk' },
          { label: 'Future', value: 'Can change' },
        ],
        blocks: [
          lineChart(
            'Projected Toxic Load (2020–2040)',
            'This projection compares two scenarios: one where disposal habits stay unchanged, and one where a global recycling treaty redirects hazardous materials into formal recovery.',
            ['2020', '2025', '2030', '2035', '2040'],
            [
              { label: 'Business as Usual', values: [1.0, 1.4, 2.1, 2.9, 4.0], accentColor: '#ef4444', detail: 'Without intervention, cumulative toxic load from e-waste quadruples by 2040.', valueSuffix: 'x' },
              { label: 'Global Recycling Treaty', values: [1.0, 1.1, 0.9, 0.6, 0.4], accentColor: '#10b981', detail: 'A coordinated framework could cut toxic exposure by 60% within two decades.', valueSuffix: 'x' },
            ],
            'Environmental hazard factor over time (relative to 2020 levels).',
            'Hazard Forecast',
          ),
          p('Recycling is not just about saving gold — it is about preventing a legacy of poison.', true),
          dragSort('Sort by Risk Level', [
            { label: 'Open Burning', correct: 'left' },
            { label: 'Unlined Landfill', correct: 'left' },
            { label: 'Encapsulated Storage', correct: 'right' },
            { label: 'Certified Closed-Loop Recycling', correct: 'right' },
          ], 'High Risk ⚠️', 'Lower Risk ✅'),
          callout('Key takeaway', 'The path we choose now determines whether future generations inherit clean soil or a toxic legacy. Every device routed to formal recycling shifts the curve.', 'success', 'Mission Brief'),
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
        heroVariant: 'signal',
        accentColor: '#53d18d',
        pulses: [
          { label: 'Battery', value: 'Charge gently' },
          { label: 'Heat', value: 'Avoid overload' },
          { label: 'Protection', value: 'Prevent damage' },
        ],
        blocks: [
          checklist('Device Longevity Habits', [
            { label: 'Clean charging ports', impact: 'Prevents connector failure' },
            { label: 'Avoid extreme heat', impact: 'Protects battery chemistry' },
            { label: 'Optimize storage space', impact: 'Reduces SSD wear' },
            { label: 'Use screen protection', impact: 'Prevents physical scrap' },
          ], 'Habit Score'),
          callout('Reduction mindset', 'Maintenance is not glamorous, but it is one of the highest-impact ways to cut waste before recycling ever begins.', 'success'),
          activity('Battery Health Simulator', '/activities/2-1-battery-sim.html?embedded=true', 'Interact with a 3D lithium-ion cell and see how charging habits like overnight charging and heat accelerate chemical degradation.'),
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
          sliderCalculator('Lifespan Extension Calculator', [
            { label: 'Careful Battery Usage', min: 0, max: 1, unit: 'habit', impactPerUnit: 12 },
            { label: 'Physical Protection', min: 0, max: 1, unit: 'habit', impactPerUnit: 18 },
            { label: 'Component Repair', min: 0, max: 1, unit: 'habit', impactPerUnit: 24 },
          ], 'Estimated Life Added'),
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
          activity('Device Autopsy Lab', '/activities/2-1-device-autopsy.html?embedded=true', 'Diagnose hardware bottlenecks on a 3D motherboard and calculate the massive savings of repair over replacement.'),
        ],
      },
      {
        id: 'lifecycle',
        label: 'Lifecycle',
        navLabel: 'Handover',
        title: 'The Final Handover',
        summary: 'Know the moment when reduction ends and reuse or formal recycling should take over.',
        robotNote: 'If the mission cannot continue locally, the device should still leave service through a clean pathway.',
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
    strapline: 'One man\'s old phone is another system\'s high-performance controller.',
    summary:
      'Reuse is about reframing "obsolete" technology as functional building blocks. This chapter explores how to repurpose hardware for smart home, artistic, and utility tasks.',
    robotStatus: 'Inventory scanning complete. Identifying potential secondary missions.',
    scrapFact: 'Most "dead" laptops still have perfectly functional screens, keyboards, and processors ready for reuse.',
    accentColor: '#c17cff',
    themeKey: 'digital',
    layout: 'steps',
    featuredMetrics: [
      { label: 'Reuse rate', value: '15%', detail: 'Currently, only a fraction of viable tech is repurposed.' },
      { label: 'Secondary life', value: '4-7 years', detail: 'Repurposed devices can serve long utility lives.' },
      { label: 'Resource saved', value: '90%', detail: 'Reusing hardware avoids almost all mining and manufacturing costs.' },
    ],
    assembly: {
      part: 'arm_l',
      title: 'Versatility Joint',
      schematic: 'Multi-axis adaptive connector',
      summary: 'Reuse allows the robot to adapt its existing parts to new, unexpected missions.',
      reward: 'Unlocks upcycling toolkit.',
    },
    tabs: [
      {
        id: 'smartDevices',
        label: 'Smart Life',
        navLabel: 'Smart',
        title: 'The Second Life Workshop',
        summary: 'Turn old tablets and phones into smart home hubs and dedicated utility devices.',
        robotNote: 'A dedicated clock doesn\'t need a 5G modem. Use what you have.',
        heroVariant: 'signal',
        accentColor: '#c17cff',
        pulses: [
          { label: 'Hubs', value: 'Home automation' },
          { label: 'Display', value: 'Digital frames' },
          { label: 'Security', value: 'Camera nodes' },
        ],
        blocks: [
          decisionTree({
            question: 'Is the screen functional?',
            yes: {
              question: 'Is the battery reliable?',
              yes: { result: 'Repurpose as a Smart Home Hub or Digital Frame' },
              no: { result: 'Use as a fixed Security Camera or Server (plugged in)' }
            },
            no: {
              question: 'Does the motherboard work?',
              yes: { result: 'Use as a Headless Server or Media Controller' },
              no: { result: 'Route to Material Recovery (Recycle)' }
            }
          }),
          activity('Second Life Workshop', '/activities/2-2-second-life.html?embedded=true', 'Match retired hardware with new mission profiles like security nodes, media servers, and smart hubs.'),
        ],
      },
      {
        id: 'artistic',
        label: 'Artistic',
        navLabel: 'Art',
        title: 'Upcycle Blueprint Designer',
        summary: 'Extract beauty and utility from the physical components of e-waste.',
        robotNote: 'Components are textures. PCBs are patterns. Cables are structural.',
        heroVariant: 'abstract',
        accentColor: '#ff85e1',
        pulses: [
          { label: 'Input', value: 'PCB / Cable / Shell' },
          { label: 'Method', value: 'Upcycling' },
          { label: 'Output', value: 'Art / Jewelry' },
        ],
        blocks: [
          ideaGenerator([
            { device: 'Old Tablet', purpose: 'Smart Wall Clock', steps: ['Reset OS', 'Install Fullscreen Clock App', 'Mount with hidden cable'], difficulty: 'easy' },
            { device: 'Broken Phone', purpose: 'Macro Keyboard', steps: ['Install Touch Portal', 'Map shortcuts for PC', 'Connect via USB'], difficulty: 'medium' },
            { device: 'Laptop Screen', purpose: 'External Monitor', steps: ['Extract panel', 'Buy LVDS controller board', 'Build custom frame'], difficulty: 'hard' },
          ]),
          bullets(
            'Convert old CRT monitor shells into unique planters or pet beds.',
            'Transform retired circuit boards into high-tech jewelry and decorative wall art.',
            'Use mechanical keyboard components to build custom controllers or tactile interfaces.',
          ),
          activity('Upcycle Blueprint Designer', '/activities/2-2-upcycle-blueprint.html?embedded=true', 'Draft artistic blueprints using salvaged circuit boards, cables, and enclosures in a 3D workspace.'),
        ],
      },
      {
        id: 'computing',
        label: 'Computing',
        navLabel: 'Utility',
        title: 'The Repurpose Router',
        summary: 'Maximize computing power by shifting hardware to lighter operating systems.',
        robotNote: 'If Windows feels heavy, try the lightness of Linux. The hardware is still strong.',
        heroVariant: 'diagnostic',
        accentColor: '#85a9ff',
        pulses: [
          { label: 'Strategy', value: 'OS swap' },
          { label: 'Tool', value: 'Linux / ChromeOS' },
          { label: 'Outcome', value: 'Restored utility' },
        ],
        blocks: [
          compare(
            {
              title: 'OS Evolution',
              leftLabel: 'Original Bloat',
              leftValue: 'Heavy modern OS on old specs',
              rightLabel: 'Lite Utility',
              rightValue: 'Lightweight Linux / ChromeOS Flex',
              insight: 'Matching OS requirements to hardware capacity can restore 100% functionality.',
            },
          ),
          activity('The Repurpose Router', '/activities/2-2-repurpose-router.html?embedded=true', 'Input your old device specs and route them to the perfect lightweight operating system or utility role.'),
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
          activity('Urban Mine Explorer', '/activities/2-3-shredder.html?embedded=true', 'Witness the industrial precision of a vertical shredder and magnetic separator in 3D.'),
          activity('Hazardous Material Sort', '/activities/2-3-hazard-sort.html?embedded=true', 'Identify and isolate toxic components before they contaminate the recycling stream.'),
          processSimulator([
            { title: 'Triage', description: 'Manual sorting to remove batteries and hazard risks.', icon: '🔍', output: 'Clean waste stream' },
            { title: 'Shredding', description: 'Industrial shredders break devices into tiny pieces.', icon: '⚙️', output: 'Mixed material fractions' },
            { title: 'Separation', description: 'Magnets and eddy currents pull out metals.', icon: '🧲', output: 'Sorted metal streams' },
            { title: 'Refining', description: 'High-temp smelting purifies precious metals.', icon: '🔥', output: '99% Pure Raw Material' },
          ]),
          quiz('Which component MUST be removed before shredding?', [
            { label: 'The screen glass', correct: false, explanation: 'Glass is shredded with the chassis.' },
            { label: 'Lithium-Ion Battery', correct: true, explanation: 'Batteries can explode or cause fires in shredders.' },
            { label: 'Plastic Case', correct: false, explanation: 'Plastic is separated later in the process.' },
          ], 'Battery Handler Badge'),
          timeline(
            { step: '01', title: 'Collect and triage', detail: 'Remove batteries, reusable parts, and hazardous items before bulk processing.' },
            { step: '02', title: 'Dismantle and shred', detail: 'Break devices into fractions that mechanical systems can actually separate.' },
            { step: '03', title: 'Separate the streams', detail: 'Use magnetic, eddy-current, density, and manual techniques to isolate materials.' },
          ),
          activity('Lifecycle Decision Lab', '/activities/2-3-lifecycle-lab.html?embedded=true', 'Sort realistic device scenarios into Reduce, Reuse, or Recycle and see the environmental impact.'),
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
          activity('Facility Finder Simulator', '/activities/3-1-facility-finder.html?embedded=true', 'Evaluate recycling facilities against a certification checklist in a 3D city block.'),
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
          activity('Drive Calendar Planner', '/activities/3-1-drive-calendar.html?embedded=true', 'Plan an optimal yearly e-waste collection schedule considering awareness dates and local constraints.'),
        ],
      },
      {
        id: 'resellers',
        label: 'Resellers',
        navLabel: 'Resellers',
        title: 'The Reseller Network',
        summary: 'Explore the regional network of authorized e-waste resellers and collection nodes across Rajasthan.',
        robotNote: 'Resellers are the critical first link in the formal recovery chain. Locating them is step one.',
        heroVariant: 'atlas',
        accentColor: '#2bc1a6',
        pulses: [
          { label: 'Region', value: 'Rajasthan' },
          { label: 'Nodes', value: 'Authorized Resellers' },
          { label: 'Focus', value: 'Local Collection' },
        ],
        blocks: [
          activity(
            'Rajasthan Reseller Map', 
            'https://chirayumishra24.github.io/Map/rajasthan-ewaste-map.html', 
            'Interactive dashboard for locating certified resellers, dismantlers, and collection points across the state.',
            'Launch Map Explorer'
          ),
          mapLocator([
            { lat: 26.9124, lng: 75.7873, label: 'Jaipur Central Hub', type: 'Collection Center' },
            { lat: 26.2389, lng: 73.0243, label: 'Jodhpur E-Waste Park', type: 'Recycling Plant' },
            { lat: 24.5854, lng: 73.7125, label: 'Udaipur Smart Collection', type: 'Drop-off Point' },
            { lat: 28.1487, lng: 75.3871, label: 'Jhunjhunu Recovery Node', type: 'Dismantler' },
          ]),
          q('Visibility is the enemy of informal dumping. When authorized routes are mapped, they become the default.', 'Network protocol'),
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
          campaignWizard([
            { title: 'Audience', prompt: 'Who are we reaching?', options: ['Students & Faculty', 'Local Neighborhood', 'Corporate Park'] },
            { title: 'Goal', prompt: 'What is the main target?', options: ['Small Gadgets (Phones/Tablets)', 'Cables & Accessories', 'Old Laptops & PCs'] },
            { title: 'Partner', prompt: 'Who will handle recovery?', options: ['Authorized Recycler', 'Local Tech NGO', 'Municipal Collection'] },
          ]),
          activity('Outreach Message Builder', '/activities/3-2-outreach-builder.html?embedded=true', 'Assemble awareness campaign materials and score messaging clarity for different target audiences.'),
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
          impactDashboard([
            { label: 'Diversion Rate', value: '450kg', trend: 'up', detail: 'Weight diverted from local landfills this month.' },
            { label: 'Participation', value: '120+', trend: 'up', detail: 'Unique households contributing to the drive.' },
            { label: 'Material Value', value: '₹12k', trend: 'up', detail: 'Estimated recovery value of sorted metals.' },
            { label: 'Carbon Saved', value: '1.2t', trend: 'up', detail: 'Equivalent CO2 reduction from circular sourcing.' },
          ]),
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
          dataWipeSim('Android Smartphone', [
            { title: 'Cloud Sync', action: 'Unsync all Google and Cloud accounts.', risk: 'Personal data remains accessible in the cloud.' },
            { title: 'Encryption', action: 'Check if device encryption is ON.', risk: 'Data can be recovered even after deletion.' },
            { title: 'Factory Reset', action: 'Perform a Secure Factory Reset.', risk: 'Leftover files might be accessible to new users.' },
            { title: 'SD Card', action: 'Physically remove or format the SD card.', risk: 'Stored photos and media stay on the storage card.' },
          ]),
          activity('Privacy Fortress Builder', '/activities/3-3-privacy-fortress.html?embedded=true', 'Build a digital fortress by enabling security layers on a 3D shield model.'),
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
          activity('Digital Footprint Tracker', '/activities/3-3-footprint-tracker.html?embedded=true', 'Assess your digital habits and watch your 3D shadow figure grow or shrink.'),
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
          activity('Phishing Detective', '/activities/3-3-phishing-detective.html?embedded=true', 'Examine simulated messages and identify phishing attempts in a detective-style challenge.'),
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
          activity('India E-Waste Atlas', '/activities/3-4-india-atlas.html?embedded=true', 'Explore e-waste generation hotspots on a 3D extruded map of India.'),
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
          policyTimeline([
            { year: '2011', title: 'First E-Waste Rules', impact: 'Formal definitions and recycler registration started.', region: 'India' },
            { year: '2016', title: 'EPR Introduction', impact: 'Producers held responsible for collection targets.', region: 'India' },
            { year: '2022', title: 'New E-Waste Management Rules', impact: 'Strict digitized tracking and expanded device scope.', region: 'India' },
            { year: '2025', title: 'Circular Economy Focus', impact: 'Integration of informal workers into formal parks.', region: 'India' },
          ]),
          activity('EPR Policy Simulator', '/activities/3-4-epr-simulator.html?embedded=true', 'Adjust policy levers and simulate the impact of EPR rules on formal recycling rates.'),
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
          activity('Innovation Showcase', '/activities/3-4-innovation-showcase.html?embedded=true', 'Explore emerging recovery technologies in a 3D diorama gallery.'),
        ],
      },
    ],
  },
  {
    id: '4-1',
    moduleLabel: 'Module 04',
    navLabel: '4.1',
    title: 'Capstone: E-Waste Warriors Website',
    strapline: 'Your mission comes together here. Build an awareness platform and propose your innovative solution.',
    summary:
      'Project A focuses on communication: framing the e-waste crisis, explaining material logic, and presenting a concrete local innovation to your community.',
    robotStatus: 'Creativity modules engaged. Synthesis logic running.',
    scrapFact: 'Awareness is the first step toward building a reliable recovery chain.',
    accentColor: '#A78BFA',
    themeKey: 'digital',
    layout: 'bento',
    featuredMetrics: [
      { label: 'Project type', value: 'Awareness Web', detail: 'Creating a high-impact digital presence for local change.' },
      { label: 'Scope', value: '5-7 Sections', detail: 'From problem framing to innovative solution pitch.' },
      { label: 'Core Goal', value: 'Behavior Change', detail: 'Motivating safer disposal through better understanding.' },
    ],
    assembly: {
      part: 'head',
      title: 'Synthesis Core',
      schematic: 'Advanced neural link',
      summary: 'Project A allows the robot to broadcast its findings to the world.',
      reward: 'Unlocks digital outreach capability.',
    },
    tabs: [
      {
        id: 'guide',
        label: 'Website Guide',
        navLabel: 'Guide',
        title: 'Project A: Build "Aware India"',
        summary: 'Your mission is to design a high-impact website that guides others through the e-waste crisis.',
        robotNote: 'Information is the first layer of recovery. Without awareness, the stream stays broken.',
        heroVariant: 'signal',
        accentColor: '#A78BFA',
        pulses: [
          { label: 'Format', value: '5-7 Sections' },
          { label: 'Focus', value: 'Awareness + Solution' },
          { label: 'Output', value: 'Live Link' },
        ],
        blocks: [
          callout('Mission Statement', '"Your Old Tech Is Harming the Planet. Let\'s Fix It Together."', 'success', 'Project A'),
          timeline(
            { step: '01', title: 'Home Page', detail: 'The E-Waste Problem: Big headlines and local stats.' },
            { step: '02', title: 'Definitions', detail: 'What exactly is E-Waste? Show them the 10 classes.' },
            { step: '03', title: 'The Hazards', detail: 'The Toxic Truth: Why chemicals matter to health.' },
            { step: '04', title: 'The Value', detail: 'Hidden Treasure: Why recycling is urban mining.' },
            { step: '05', title: 'The Action', detail: 'The 3Rs: How to Reduce, Reuse, and Recycle.' },
            { step: '06', title: 'Disposal Guide', detail: 'Disposal Map: Where to drop off tech in your city.' },
          ),
          stats(
            { label: 'India Stat', value: '3.8 MMT', detail: 'Total e-waste generated annually across the nation.' },
            { label: 'Global Rank', value: '3rd Place', detail: 'India is one of the world\'s largest e-waste generators.' },
            { label: 'Recovery Gap', value: '<25%', detail: 'Only a fraction enters formal recycling channels.' },
          ),
          checklist('Website Section Tracker', [
            { label: 'Home page with problem stats', impact: 'Sets the tone and urgency' },
            { label: 'E-Waste definitions and classes', impact: 'Builds foundational knowledge' },
            { label: 'Toxic chemicals section', impact: 'Shows health consequences' },
            { label: 'Urban mining and value', impact: 'Reframes waste as resource' },
            { label: '3Rs action guide', impact: 'Provides practical steps' },
            { label: 'Local disposal map', impact: 'Enables immediate action' },
          ], 'Website Completion'),
        ],
      },
      {
        id: 'innovation',
        label: 'The Solution',
        navLabel: 'Ideas',
        title: 'Innovate: The Big Solution',
        summary: 'Propose a specific, actionable idea to solve e-waste in your community.',
        robotNote: 'R.U.S.T-01 simulation shows 40% higher recovery with incentivized drop-off points.',
        heroVariant: 'diagnostic',
        accentColor: '#10b981',
        pulses: [
          { label: 'Type', value: 'Innovation' },
          { label: 'Goal', value: 'Collection' },
          { label: 'Metric', value: 'Volume' },
        ],
        blocks: [
          callout('Featured Idea: E-Waste ATM', 'A smart kiosk where you deposit tech & earn school rewards.', 'success', 'Innovation Lab'),
          explodedDiagram('https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=800', [
            { x: 50, y: 30, label: 'Touch Screen', detail: 'Users scan their ID and track their recycling points.' },
            { x: 30, y: 60, label: 'Drop Bin', detail: 'Internal sensors classify the device for safe storage.' },
            { x: 70, y: 70, label: 'Reward Dispenser', detail: 'Prints coupons or syncs with a school credit app.' },
          ]),
          compare({
            title: 'Impact Analysis',
            leftLabel: 'Current Path',
            leftValue: 'Devices are stored in drawers or dumped in trash.',
            rightLabel: 'ATM Path',
            rightValue: 'Convenient, incentivized, and traceable recovery.',
            insight: 'Lowering the barrier to entry is the fastest way to increase recycling rates.',
          }),
          ideaGenerator([
            { device: 'School Corridor', purpose: 'E-Waste ATM Kiosk', steps: ['Install smart deposit bin', 'Link to student ID system', 'Track & reward monthly'], difficulty: 'medium' },
            { device: 'Apartment Complex', purpose: 'E-Waste Bank', steps: ['Set up collection shelf', 'Partner with local recycler', 'Monthly pickup schedule'], difficulty: 'easy' },
            { device: 'Local Market', purpose: 'Tech Trade-In Counter', steps: ['Partner with repair shops', 'Offer discount coupons', 'Certify recycling chain'], difficulty: 'hard' },
          ]),
        ],
      },
    ],
  },
  {
    id: '4-2',
    moduleLabel: 'Module 04',
    navLabel: '4.2',
    title: 'Capstone: Reflection & Pitch',
    strapline: 'Reflect on your journey and pitch your solution to the world.',
    summary:
      'Project B focuses on the human element: personal reflection and a 2-minute pitch to persuade others to take action.',
    robotStatus: 'Communication link stable. Recording ready.',
    scrapFact: 'A powerful story is as important as a powerful machine.',
    accentColor: '#FBBF24',
    themeKey: 'action',
    layout: 'bento',
    featuredMetrics: [
      { label: 'Submission 1', value: 'Reflection Doc', detail: 'Personal insights on your learning journey.' },
      { label: 'Submission 2', value: 'Pitch Video', detail: 'A 2-minute persuasive presentation of your solution.' },
      { label: 'Deadline', value: 'End of Week', detail: 'Upload links to your Google Drive and submit via LMS.' },
    ],
    assembly: {
      part: 'arm_l',
      title: 'Capstone Module',
      schematic: 'Voice Modulator + Recording Link',
      summary: 'This final chapter focuses on persuasive communication and personal reflection.',
      reward: 'Unlocks Capstone Completion Badge.',
    },
    tabs: [
      {
        id: 'reflection',
        label: 'Reflection',
        navLabel: 'Reflect',
        title: 'Reflection & Impact',
        summary: 'Look back on what you have learned and how your perspective has changed.',
        robotNote: 'Data points are useful, but human commitment is what drives the machine.',
        heroVariant: 'spotlight',
        accentColor: '#FBBF24',
        pulses: [
          { label: 'Task', value: 'Writing' },
          { label: 'Focus', value: 'Growth' },
          { label: 'Format', value: 'Google Doc' },
        ],
        blocks: [
          callout('Reflection Prompt', 'Think about the shift from seeing "trash" to seeing "treasure". How has this course changed your perspective?', 'signal', 'Project B'),
          q('What was the single most surprising thing you learned about e-waste?', 'Reflection #1'),
          q('How will you change your own tech-disposal habits after this course?', 'Reflection #2'),
          checklist('Reflection Checklist', [
            { label: 'Created a Google Doc with detailed reflections', impact: 'Foundation of your submission' },
            { label: 'Included specific examples from Module 1, 2, and 3', impact: 'Shows depth of learning' },
            { label: 'Described personal behavior changes', impact: 'Demonstrates real impact' },
            { label: 'Shared the "Viewer" link via LMS portal', impact: 'Enables assessment' },
          ], 'Completion Score'),
        ],
      },
      {
        id: 'pitch',
        label: 'The Pitch',
        navLabel: 'Pitch',
        title: 'Pitch Your Big Solution',
        summary: 'Record a 2-minute video to persuade your school or community to adopt your Project A idea.',
        robotNote: 'A clear pitch is the most powerful tool in the e-waste warrior kit.',
        heroVariant: 'signal',
        accentColor: '#FB923C',
        pulses: [
          { label: 'Length', value: '120 Seconds' },
          { label: 'Goal', value: 'Persuasion' },
          { label: 'Status', value: 'Record Link' },
        ],
        blocks: [
          timeline(
            { step: '0:00', title: 'The Hook', detail: 'Grab attention with a shocking stat (like the 3.8 MMT e-waste problem).' },
            { step: '0:30', title: 'The Pain', detail: 'Explain why the current way of dumping tech is hurting our health.' },
            { step: '1:00', title: 'The Vision', detail: 'Present your "Big Solution" and how it solves the problem.' },
            { step: '1:45', title: 'The Call', detail: 'Tell people exactly what to do next to join your movement.' },
          ),
          q('"My name is [Name], and I believe we can turn India\'s e-waste crisis into a resource revolution."', 'Pitch Hook Sample'),
          callout('Recording Tip', 'Record in a quiet place with good lighting. Use your phone or webcam. Keep it under 2 minutes.', 'success', 'Pro Tips'),
          compare({
            title: 'Pitch Quality',
            leftLabel: 'Weak Pitch',
            leftValue: 'Reads facts from a script with no personal connection.',
            rightLabel: 'Strong Pitch',
            rightValue: 'Tells a story, shows passion, and gives a clear call to action.',
            insight: 'The best pitches make the audience feel something, not just know something.',
          }),
        ],
      },
    ],
  },
  {
    id: '4-3',
    moduleLabel: 'Module 04',
    navLabel: '4.3',
    title: 'Community E-Waste Survey',
    strapline: 'Understand the Problem. Listen to People. Create Change.',
    summary: 'Conduct a survey in your community to understand e-waste habits and raise awareness.',
    robotStatus: 'Social sensors online. Community mapping active.',
    scrapFact: 'Surveys are powerful tools to uncover hidden waste and change behavior.',
    accentColor: '#2563eb',
    themeKey: 'action',
    layout: 'hub',
    featuredMetrics: [
      { label: 'Goal', value: '50 responses', detail: 'Aim for a diverse sample of your local community.' },
      { label: 'Outcome', value: 'Actionable data', detail: 'Use findings to design better collection drives.' },
      { label: 'Skill', value: 'Research', detail: 'Learn to collect and analyze social data.' },
    ],
    assembly: {
      part: 'arm_l',
      title: 'Outreach Module',
      schematic: 'Community Link + Data Grid',
      summary: 'This module helps the robot communicate with humans and organize local efforts.',
      reward: 'Unlocks community leader status.',
    },
    tabs: [
      {
        id: 'mission',
        label: 'Mission',
        navLabel: 'Mission',
        title: 'Project C: Community E-Waste Survey',
        summary: 'Understand the Problem. Listen to People. Create Change.',
        robotNote: 'R.U.S.T-01 is ready to help you analyze community data.',
        heroVariant: 'spotlight',
        accentColor: '#2563eb',
        pulses: [
          { label: 'Format', value: 'Survey' },
          { label: 'Audience', value: 'Community' },
          { label: 'Goal', value: 'Data gathering' },
        ],
        blocks: [
          callout('Research Question', 'How do people in your neighborhood handle their old electronics — and do they know where the nearest safe drop-off is?', 'signal', 'Project C'),
          p('The goal of this project is to understand how people in your community handle their old electronics. Are they storing them in drawers? Throwing them in the trash? Do they know where the nearest recycling center is?'),
          timeline(
            { step: '01', title: 'Prepare', detail: 'Design your survey questions (or use our template). Keep questions short and clear.' },
            { step: '02', title: 'Collect', detail: 'Share your survey with neighbors, family, and friends. Aim for at least 50 responses.' },
            { step: '03', title: 'Analyze', detail: 'Look for patterns in the responses. What surprises you?' },
            { step: '04', title: 'Report', detail: 'Present your findings and propose a local solution based on the data.' },
          ),
          stats(
            { label: 'Target Sample', value: '50+', detail: 'More responses means more reliable patterns.' },
            { label: 'Key Metric', value: 'Awareness %', detail: 'What percentage know about safe disposal options?' },
            { label: 'Action Item', value: 'Local Proposal', detail: 'Use data to recommend a specific improvement.' },
          ),
        ],
      },
      {
        id: 'design',
        label: 'Survey Design',
        navLabel: 'Design',
        title: 'Crafting Effective Questions',
        summary: 'Learn how to design questions that produce useful, honest data.',
        robotNote: 'Good data starts with good questions. Bias in, bias out.',
        heroVariant: 'signal',
        accentColor: '#3b82f6',
        pulses: [
          { label: 'Questions', value: '8-12' },
          { label: 'Format', value: 'Mixed' },
          { label: 'Time', value: '5 min' },
        ],
        blocks: [
          callout('Golden Rule', 'Never ask leading questions. "Don\'t you think e-waste is bad?" is biased. "How do you dispose of old electronics?" is neutral.', 'alert', 'Research Ethics'),
          checklist('Question Categories', [
            { label: 'Demographics: age group, area', impact: 'Helps segment your analysis' },
            { label: 'Current habits: where do old devices go?', impact: 'Reveals baseline behavior' },
            { label: 'Awareness: have they heard of e-waste?', impact: 'Measures knowledge gaps' },
            { label: 'Access: do they know a drop-off point?', impact: 'Identifies infrastructure gaps' },
            { label: 'Willingness: would they recycle if easy?', impact: 'Gauges motivation levels' },
          ], 'Survey Readiness'),
          p('Once your survey is ready, test it on 3-5 people first. Fix any confusing questions before the full rollout.', true),
          callout('Submission', 'Upload your survey results and analysis to your LMS portal. Include at least one chart or graph summarizing key findings.', 'success', 'Final Step'),
        ],
      },
    ],
  },
]

export function toSkillizeeImageUrl(path: string) {
  const skillizeeAssetPrefix = 'https://login.skillizee.io'
  const skillizeeArticleImagePrefix = `${skillizeeAssetPrefix}/s/articles/69f4527b41e01b23b9093dae/images/`

  if (path.startsWith('http') || path.startsWith('/images/') || path.startsWith('/local/')) {
    return path
  }

  if (path.startsWith('/')) {
    return `${skillizeeAssetPrefix}${path}`
  }

  return `${skillizeeArticleImagePrefix}${path}`
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
