export type ChapterImage = {
  src: string
  alt: string
}

export type ChapterBlock =
  | {
      type: 'paragraph'
      content: string
      emphasis?: boolean
    }
  | {
      type: 'imageGrid'
      images: ChapterImage[]
      columns?: 'two' | 'three'
    }
  | {
      type: 'bulletList'
      items: string[]
    }
  | {
      type: 'numberedList'
      items: string[]
    }
  | {
      type: 'quote'
      content: string
      author?: string
    }
  | {
      type: 'video'
      title: string
      url: string
      note?: string
    }
  | {
      type: 'interactive3d'
      activityId:
        | 'hazard-xray'
        | 'device-autopsy'
        | 'urban-mine-valuator'
        | 'lifespan-lab'
        | 'upcycle-forge'
        | 'smelter-pipeline'
        | 'recycler-radar'
        | 'drive-simulator'
        | 'data-shredder'
        | 'india-policy-map'
      title: string
    }

export type ChapterPulse = {
  label: string
  value: string
}

export type RobotAssembly = {
  part: 'head' | 'torso' | 'mobility'
  title: string
  schematic: string
  summary: string
  reward: string
}

export type ChapterTab = {
  id: string
  label: string
  title: string
  summary: string
  robotNote: string
  heroImage?: string
  readingTime?: number
  accentColor?: string
  pulses: ChapterPulse[]
  blocks: ChapterBlock[]
}

export type CourseChapter = {
  id: string
  moduleLabel: string
  title: string
  strapline: string
  summary: string
  robotStatus: string
  scrapFact: string
  accentColor: string
  assembly: RobotAssembly
  tabs: ChapterTab[]
}

export const chapters: CourseChapter[] = [
  {
    id: '1-0',
    moduleLabel: 'Orientation',
    title: 'E-Waste Management: Tech Tidy-Up',
    strapline: 'System initialization. Review the mission parameters and the blueprint for regional recovery.',
    summary:
      'This orientation phase establishes the core objectives of the Tech Tidy-Up mission, outlining the roadmap from understanding the crisis to executing a community-wide action plan.',
    robotStatus: 'Core systems loading. Objective matrix synchronized.',
    scrapFact: 'Every successful mission starts with a clear schematic. Your goal is to recover 100% of the knowledge stream.',
    accentColor: '#3498db',
    assembly: {
      part: 'head',
      title: 'Neural Processor',
      schematic: 'Logic Core + Memory',
      summary: 'Establishing the mission goal allows the robot to synchronize its objective matrix and prioritize recovery tasks.',
      reward: 'Unlocks the Course Syllabus and Final Project blueprint.',
    },
    tabs: [
      {
        id: 'overview',
        label: 'Mission',
        title: 'The Mission Goal',
        summary: 'Defining the purpose of our tech recovery operation.',
        robotNote: 'Mission parameters locked: Educate on environmental and economic impacts. Develop actionable strategies for resource recovery.',
        accentColor: '#3498db',
        pulses: [
          { label: 'Priority', value: 'Environmental Impact' },
          { label: 'Objective', value: 'Resource Recovery' },
          { label: 'Status', value: 'Initializing' },
        ],
        blocks: [
          {
            type: 'paragraph',
            content:
              'Welcome to the Tech Tidy-Up initiative. Our primary objective is to educate you on the severe environmental and economic impacts of electronic waste.',
            emphasis: true,
          },
          {
            type: 'paragraph',
            content:
              'Through this course, you will develop actionable strategies for responsible device disposal and resource recovery, transforming "junk" back into valuable components.',
          },
          {
            type: 'quote',
            content:
              'By the end of this mission, you will have the knowledge to organize and lead e-waste awareness in your own community.',
            author: 'Command Protocol',
          },
        ],
      },
      {
        id: 'syllabus',
        label: 'Roadmap',
        title: 'The Recovery Roadmap',
        summary: 'A breakdown of the three core modules ahead.',
        robotNote: 'Scanning module structures. 10 chapters identified. Total resource recovery projected at 98%.',
        accentColor: '#2980b9',
        pulses: [
          { label: 'Module 1', value: 'The Problem' },
          { label: 'Module 2', value: 'The 3Rs' },
          { label: 'Module 3', value: 'Action Plan' },
        ],
        blocks: [
          {
            type: 'numberedList',
            items: [
              'Module 1: The E-Waste Problem - Defining the dump, toxic chemicals, and precious metal value.',
              'Module 2: Reduce, Reuse, Recycle - Strategies for lifecycle extension and industrial recovery methods.',
              'Module 3: Action for Change - Local resources, community collection drives, and digital citizenship.',
            ],
          },
        ],
      },
      {
        id: 'project',
        label: 'Final Project',
        title: 'The E-Waste Action Plan',
        summary: 'Your capstone mission to educate others.',
        robotNote: 'Final output: A campaign to educate the sector. Format options: Video, Presentation, or Infographic.',
        accentColor: '#1abc9c',
        pulses: [
          { label: 'Format', value: 'Multi-Media' },
          { label: 'Target', value: 'Peer Network' },
          { label: 'Goal', value: 'Awareness' },
        ],
        blocks: [
          {
            type: 'paragraph',
            content:
              'Your final project is the creation of a comprehensive E-Waste Action Plan. This is your chance to take everything you’ve learned and use it to educate your peers.',
          },
          {
            type: 'bulletList',
            items: [
              'Identify a specific community target (school, neighborhood, or family).',
              'Choose your medium: Create a high-impact video, a detailed presentation, or an engaging infographic.',
              'Focus on proper handling: Teach others how to identify, sort, and dispose of e-waste safely.',
            ],
          },
          {
            type: 'paragraph',
            content:
              'Course Outcome: By mastering these strategies, you will contribute to global resource recovery and protect the ecosystem from toxic electronic pollution.',
            emphasis: true,
          },
        ],
      },
    ],
  },
  {
    id: '1-1',
    moduleLabel: 'Module 01',
    title: 'The Digital Dump: Defining E-Waste',
    strapline: 'Wake the robot and identify what counts as electronic waste before it poisons the yard.',
    summary:
      'This chapter frames e-waste as both a hazardous waste stream and a stockpile of reusable materials. It sets the baseline for why careless disposal is dangerous and why recovery matters.',
    robotStatus: 'Optics cracked, hazard sensors online.',
    scrapFact: 'Global e-waste keeps rising by roughly 3-4% every year.',
    accentColor: '#f26b3a',
    assembly: {
      part: 'head',
      title: 'Vision Module',
      schematic: 'Head + optics',
      summary: 'Learners identify what e-waste is, so the robot earns its eyes, sensor brow, and first live scan.',
      reward: 'Unlocks toxic-material detection.',
    },
    tabs: [
      {
        id: 'overview',
        label: 'Overview',
        title: 'The Rise of the Digital Dump',
        summary:
          'Define e-waste clearly, then show why discarded electronics are both a toxin source and a material bank.',
        robotNote: 'RUST-01 flags every broken device as a split identity: threat on the outside, resources on the inside.',
        heroImage: '/images/ewaste_overview_hero.png',
        readingTime: 3,
        accentColor: '#f26b3a',
        pulses: [
          { label: 'Growth', value: '3-4% each year' },
          { label: 'Core tension', value: 'Toxic + valuable' },
          { label: 'Mission', value: 'Name the waste stream' },
        ],
        blocks: [
          {
            type: 'paragraph',
            content:
              'Electronic waste, or e-waste, refers to discarded electrical or electronic devices that have reached the end of their useful life or become obsolete. It is one of the fastest-growing waste streams in the world, driven by rapid technological shifts and constant upgrades.',
            emphasis: true,
          },
          {
            type: 'paragraph',
            content:
              'Millions of tonnes of electronics are discarded every year. Many contain hazardous substances such as lead, mercury, cadmium, and chromium, which can leak into soil and water when devices are dumped or broken apart without control.',
          },
          {
            type: 'paragraph',
            content:
              'At the same time, e-waste is not just rubbish. Phones, computers, and appliances contain precious metals and rare materials that can be recovered and reused, cutting demand for fresh mining.',
          },
          {
            type: 'quote',
            content:
              'E-waste is the fastest-growing domestic waste stream in the world. We are essentially throwing away a gold mine every single day.',
            author: 'Global E-waste Monitor',
          },
        ],
      },
      {
        id: 'examples',
        label: 'Examples',
        title: 'From Pocket to Pile',
        summary:
          'Map the everyday devices that slide into the e-waste stream and show how normal upgrades create abnormal waste volume.',
        robotNote: 'The robot’s memory bank is full of dead screens, chargers, printers, mixers, and consoles. Waste starts at home long before the landfill.',
        heroImage: '/images/ewaste_examples_hero.png',
        accentColor: '#29a383',
        pulses: [
          { label: 'Source zones', value: 'Home + office' },
          { label: 'Common trigger', value: 'Obsolescence' },
          { label: 'Reality check', value: 'Not always broken' },
        ],
        blocks: [
          {
            type: 'video',
            title: 'What Is E-Waste?',
            url: 'https://youtu.be/HQZjouMTH08',
          },
          {
            type: 'paragraph',
            content:
              'Common electronics that contribute to the e-waste stream come from households, schools, offices, and service industries. They can be grouped by function and scale.',
          },
          {
            type: 'bulletList',
            items: [
              'IT and communication: computers, laptops, monitors, tablets, and smartphones.',
              'Consumer electronics: televisions, DVD players, gaming consoles, and audio systems.',
              'Large appliances: refrigerators, washing machines, air conditioners, and ovens.',
              'Small gadgets: microwaves, toasters, kettles, and hair dryers.',
              'Office equipment: printers, scanners, fax machines, and photocopiers.',
            ],
          },
          {
            type: 'paragraph',
            content:
              'Many of these items are thrown away because something newer appears, not because the original item has stopped working. Planned obsolescence and status-driven upgrades accelerate the pileup.',
          },
        ],
      },
      {
        id: 'impact',
        label: 'Impact',
        title: 'Toxic Legacy',
        summary:
          'Shift from identification to consequence: what exactly leaks, burns, or accumulates when e-waste is mishandled.',
        robotNote: 'RUST-01 runs a contamination scan: one bad dump site can push heavy metals into air, water, food, and bodies.',
        heroImage: '/images/ewaste_impact_hero.png',
        readingTime: 4,
        accentColor: '#d94d3f',
        pulses: [
          { label: 'Hazard class', value: 'Heavy metals' },
          { label: 'Failure mode', value: 'Dump or burn' },
          { label: 'Recovery path', value: 'Urban mining' },
        ],
        blocks: [
          {
            type: 'video',
            title: 'E-Waste Explained by a Sustainability Expert',
            url: 'https://youtu.be/_Y2ePj3wr8M',
            note: 'Watch 0:20 to 1:14.',
          },
          {
            type: 'paragraph',
            content:
              'Improper e-waste disposal causes lasting environmental damage. When electronics are buried or burned, toxic compounds move into groundwater, soil, and air.',
            emphasis: true,
          },
          {
            type: 'bulletList',
            items: [
              'Lead: found in older monitors and solder, linked to neurological damage.',
              'Mercury: present in some displays, able to bioaccumulate through food chains.',
              'Cadmium: used in batteries and chips, highly toxic and carcinogenic.',
              'Brominated flame retardants: found in plastic casings and linked to hormonal disruption.',
            ],
          },
          {
            type: 'paragraph',
            content:
              'Formal recycling and urban mining can recover a large share of the materials inside devices, reducing both pollution and pressure on virgin extraction.',
          },
          {
            type: 'interactive3d',
            activityId: 'hazard-xray',
            title: 'Hazard X-Ray Scanner',
          },
        ],
      },
    ],
  },
  {
    id: '1-2',
    moduleLabel: 'Module 01',
    title: 'Types and Composition of E-Waste',
    strapline: 'Open the robot chassis and sort the scrap by category, scale, and material makeup.',
    summary:
      'This chapter breaks e-waste into classes and compositions so learners can see what kinds of devices exist and what each device is actually made of.',
    robotStatus: 'Chest plate open, sorting arm responsive.',
    scrapFact: 'A single electronic device can contain dozens of different elements.',
    accentColor: '#2f7fbe',
    assembly: {
      part: 'torso',
      title: 'Sorting Core',
      schematic: 'Torso + arms',
      summary: 'Learners sort devices and decode their material layers, so the robot gets its chest core and repair arms.',
      reward: 'Unlocks classifying and dismantling mode.',
    },
    tabs: [
      {
        id: 'categories',
        label: 'Categories',
        title: 'The 10 Classes of Electronic Waste',
        summary:
          'Sort devices by use case so the pile becomes legible instead of chaotic.',
        robotNote: 'The broken robot can only rebuild if it sorts first. Classification is the first repair tool.',
        heroImage: '/images/ewaste_categories_hero.png',
        accentColor: '#2f7fbe',
        pulses: [
          { label: 'Sorting lens', value: 'Function + scale' },
          { label: 'Device span', value: 'Appliances to tools' },
          { label: 'Use case', value: 'Collection systems' },
        ],
        blocks: [
          {
            type: 'paragraph',
            content:
              'International bodies classify e-waste in slightly different ways, but a common system groups devices by how they are used and where they appear in daily life.',
          },
          {
            type: 'numberedList',
            items: [
              'Large household appliances, such as refrigerators and washing machines.',
              'Small household appliances, such as vacuum cleaners and irons.',
              'IT and telecommunications equipment, such as computers and phones.',
              'Consumer equipment, such as televisions and cameras.',
              'Lighting equipment, such as lamps and LED units.',
              'Electrical and electronic tools, such as drills and saws.',
              'Toys, leisure, and sports equipment, such as consoles and gym devices.',
              'Medical devices, such as ventilators and dialysis machines.',
              'Monitoring and control instruments, such as smoke detectors and thermostats.',
              'Automatic dispensers, such as vending machines.',
            ],
          },
        ],
      },
      {
        id: 'composition',
        label: 'Composition',
        title: 'What Is Inside the Scrap?',
        summary:
          'Move from the outside shell to the material DNA: bulk matter, precious metals, and toxic compounds.',
        robotNote: 'Every cracked gadget is a layered inventory sheet. The trick is seeing materials, not just shapes.',
        accentColor: '#df9d2f',
        readingTime: 5,
        pulses: [
          { label: 'Element count', value: 'Up to 60' },
          { label: 'Value layer', value: 'Gold and palladium' },
          { label: 'Risk layer', value: 'Lead and mercury' },
        ],
        blocks: [
          {
            type: 'paragraph',
            content:
              'A single piece of electronic waste can contain up to 60 different elements from the periodic table. Those elements can be grouped into three broad buckets.',
          },
          {
            type: 'bulletList',
            items: [
              'Bulk materials, including iron, aluminum, plastics, and glass.',
              'Precious metals, such as gold, silver, palladium, and platinum.',
              'Hazardous substances, including lead, mercury, arsenic, and cadmium.',
            ],
          },
          {
            type: 'paragraph',
            content:
              'Urban mining recovers these materials with far less energy than conventional extraction. In some cases, recycling electronics is more resource-efficient than digging new ore from the ground.',
          },
          {
            type: 'interactive3d',
            activityId: 'device-autopsy',
            title: '3D Device Autopsy',
          },
        ],
      },
    ],
  },
  {
    id: '1-3',
    moduleLabel: 'Module 01',
    title: 'Urban Mining: The Value of Waste',
    strapline: 'Turn the scrapyard into a resource map and show why the broken robot is worth salvaging.',
    summary:
      'This chapter reframes e-waste from burden to opportunity by focusing on recoverable metals, circular design, and the economic logic of urban mining.',
    robotStatus: 'Core reactor visible, salvage protocol armed.',
    scrapFact: 'Old electronics can hold metal concentrations richer than many mined ores.',
    accentColor: '#3c8f73',
    assembly: {
      part: 'mobility',
      title: 'Salvage Drive',
      schematic: 'Legs + wheel base',
      summary: 'Learners see value in the waste stream, so the robot earns movement and becomes ready to work the yard.',
      reward: 'Unlocks full salvage deployment.',
    },
    tabs: [
      {
        id: 'metals',
        label: 'Metals',
        title: 'Hidden Gold in Everyday Devices',
        summary:
          'Show that high-value materials are already concentrated inside the gadgets people throw away.',
        robotNote: 'The robot looks ruined from the outside, but its circuits still hide premium metals worth recovering.',
        accentColor: '#df9d2f',
        pulses: [
          { label: 'Key hook', value: 'Phones as ore' },
          { label: 'Value signal', value: 'High concentration' },
          { label: 'Lesson', value: 'Waste is inventory' },
        ],
        blocks: [
          {
            type: 'paragraph',
            content:
              'Modern electronics are concentrated material systems. A tonne of smartphones can contain more gold than a tonne of gold ore, which makes discarded devices economically important as well as environmentally important.',
            emphasis: true,
          },
          {
            type: 'paragraph',
            content:
              'That hidden density of valuable metals is what makes urban mining viable. E-waste is not just something to remove; it is something to process with precision.',
          },
          {
            type: 'quote',
            content:
              'The city’s trash stream is often richer than the mine. Recovery begins when we stop treating devices as dead objects.',
            author: 'Salvage brief',
          },
        ],
      },
      {
        id: 'value',
        label: 'Value',
        title: 'Why Recycled Tech Is Worth Billions',
        summary:
          'Connect resource recovery to economics, jobs, and the circular economy so the chapter lands beyond environmental messaging.',
        robotNote: 'RUST-01 projects the balance sheet: what looks like a dump is also a market, a labor system, and a design problem.',
        accentColor: '#3c8f73',
        pulses: [
          { label: 'Global value', value: '$62.5B yearly' },
          { label: 'System gap', value: 'Low formal recovery' },
          { label: 'Design horizon', value: 'Circular economy' },
        ],
        blocks: [
          {
            type: 'paragraph',
            content:
              'The global value of e-waste is estimated at more than $62.5 billion each year, but only a fraction is recovered through formal systems. That means the world is losing both materials and money.',
          },
          {
            type: 'bulletList',
            items: [
              'Circular economy: design products so they can be disassembled, repaired, and recovered more easily.',
              'Resource security: reduce dependence on volatile mining supply chains.',
              'Job creation: formal recycling creates skilled work in collection, sorting, dismantling, and processing.',
            ],
          },
          {
            type: 'paragraph',
            content:
              'Urban mining is strongest when collection, design, and policy work together. Recovery is not just a technical act; it is a systems decision.',
          },
          {
            type: 'interactive3d',
            activityId: 'urban-mine-valuator',
            title: 'Urban Mine Valuator',
          },
        ],
      },
    ],
  },
  {
    id: '2-1',
    moduleLabel: 'Module 02',
    title: 'The First R: Reduce!',
    strapline: 'Extend the mission life of every component. Maintenance is the ultimate survival protocol.',
    summary:
      'Strategies for device longevity, mindful hardware management, and responsible disposal to minimize the growing e-waste footprint.',
    robotStatus: 'Durability protocols active. Battery health optimized.',
    scrapFact: 'Keeping a smartphone for 5 years instead of 2 can reduce its carbon footprint by roughly 50%.',
    accentColor: '#2ecc71',
    assembly: {
      part: 'torso',
      title: 'Longevity Plating',
      schematic: 'Reinforced Torso',
      summary: 'Learners apply maintenance protocols, so the robot gets reinforced plating and heat sinks.',
      reward: 'Unlocks durability scan.',
    },
    tabs: [
      {
        id: 'longevity',
        label: 'Longevity',
        title: 'Extending the Life of Your Devices',
        summary: 'Physical and habitual strategies to keep hardware running longer.',
        robotNote: 'R.U.S.T-01 survives on maintenance. A clean circuit is a long-lived circuit.',
        heroImage: '/s/articles/69f4527b41e01b23b9093dae/images/image-20260507102318-1.png',
        accentColor: '#2ecc71',
        pulses: [
          { label: 'Battery', value: '20-80% rule' },
          { label: 'Cleaning', value: 'Dust prevention' },
          { label: 'Protection', value: 'Cases & screens' },
        ],
        blocks: [
          {
            type: 'paragraph',
            content:
              'Strategies for extending the life of devices and resisting unnecessary upgrades include regular physical maintenance and smart usage habits.',
            emphasis: true,
          },
          {
            type: 'bulletList',
            items: [
              'Regular Maintenance: Keep devices clean, avoid overheating, and protect them with cases and screen protectors to physically extend lifespan.',
              'Smart Usage Habits: Avoid intensive continuous use that strains devices. Take breaks and manage workload to prevent overheating and wear.',
              'Good Charging Practices: Use optimized charging modes, avoid overcharging/unplug when fully charged, and keep battery levels between 20%-80%.',
            ],
          },
          {
            type: 'interactive3d',
            activityId: 'lifespan-lab',
            title: 'Device Lifespan Simulator',
          },
        ],
      },
      {
        id: 'optimization',
        label: 'Optimization',
        title: 'Software & Hardware Upgrades',
        summary: 'How to keep performance high without replacing the entire unit.',
        robotNote: 'Don’t scrap the core just because the shell is scratched. Upgrade the internals instead.',
        accentColor: '#3498db',
        pulses: [
          { label: 'OS Care', value: 'Mindful updates' },
          { label: 'Storage', value: 'Clear unused apps' },
          { label: 'Hardware', value: 'RAM & Battery' },
        ],
        blocks: [
          {
            type: 'video',
            title: 'E-Waste Explained By A Sustainability Expert',
            url: 'https://youtu.be/_Y2ePj3wr8M',
            note: 'Watch 5:41 to 6:23; 6:29 to 6:45; 6:49 to 7:21 for expert 3R strategies.',
          },
          {
            type: 'paragraph',
            content:
              'Mindful software management and targeted hardware upgrades can breathe new life into older machines.',
          },
          {
            type: 'bulletList',
            items: [
              'Mindful Software Updates: Only update software when necessary to avoid overloading hardware; delete unused apps to free memory and improve performance.',
              'Repair and Upgrade: Repair broken components like screens or batteries, and upgrade parts such as RAM or storage instead of replacing the entire device.',
            ],
          },
        ],
      },
      {
        id: 'lifestyle',
        label: 'Lifecycle',
        title: 'The Final Handover',
        summary: 'What to do when a device finally reaches its end-of-life.',
        robotNote: 'When R.U.S.T-01 finally powers down, every bolt and wire should go back into the cycle.',
        heroImage: '/s/articles/69f4527b41e01b23b9093dae/images/image-20260507102318-2.png',
        accentColor: '#e67e22',
        pulses: [
          { label: 'Minimalism', value: 'Digital health' },
          { label: 'Donation', value: 'Functional reuse' },
          { label: 'Recycling', value: 'Certified centers' },
        ],
        blocks: [
          {
            type: 'paragraph',
            content:
              'Adopting a sustainable digital lifestyle means knowing when to donate and how to recycle responsibly.',
            emphasis: true,
          },
          {
            type: 'bulletList',
            items: [
              'Sustainable Digital Lifestyle: Adopt digital minimalism by limiting unnecessary digital consumption, reducing screen time, and avoiding habitual upgrades.',
              'Donation and Recycling: Donate functional devices for reuse or recycle responsibly when devices reach end-of-life to reduce waste.',
            ],
          },
        ],
      },
    ],
  },
  {
    id: '2-2',
    moduleLabel: 'Module 02',
    title: 'The Second R: Reuse!',
    strapline: 'Don’t scrap it—reprogram it. Every dead device is a prototype for something new.',
    summary:
      'Innovative ways to give old electronic devices a new life through creative repurposing and DIY upcycling.',
    robotStatus: 'Creative sub-processors online. Aesthetic sensors calibrated.',
    scrapFact: 'Repurposing electronics can prevent thousands of tons of lead and mercury from entering landfills annually.',
    accentColor: '#9b59b6',
    assembly: {
      part: 'mobility',
      title: 'Adaptive Chassis',
      schematic: 'Multi-tool limb',
      summary: 'Learners repurpose old tech, so the robot gets a multi-tool attachment for diverse tasks.',
      reward: 'Unlocks upcycling toolkit.',
    },
    tabs: [
      {
        id: 'smartDevices',
        label: 'Smart Devices',
        title: 'Phones & Tablets',
        summary: 'Turning yesterday’s mobile tech into today’s utility tools.',
        robotNote: 'A phone with a cracked screen can still see. Use its eyes for security.',
        heroImage: '/s/articles/69f4527b41e01b23b9093dae/images/image-20260507102408-3.png',
        accentColor: '#9b59b6',
        pulses: [
          { label: 'Security', value: 'Cam repurpose' },
          { label: 'Kitchen', value: 'Digital recipes' },
          { label: 'Learning', value: 'Kids tools' },
        ],
        blocks: [
          {
            type: 'paragraph',
            content:
              'Old smartphones and tablets are highly capable computers that can be repurposed for specific home tasks.',
            emphasis: true,
          },
          {
            type: 'bulletList',
            items: [
              'Old smartphones can be turned into home security cameras, digital photo frames, or DIY projectors.',
              'Tablets make excellent digital recipe books, educational tools for kids, or art canvases when mounted or used creatively.',
            ],
          },
        ],
      },
      {
        id: 'computing',
        label: 'Computing',
        title: 'Laptops & Infrastructure',
        summary: 'Repurposing heavier hardware for specialized server and media tasks.',
        robotNote: 'Old laptops have built-in UPS (batteries) and screens. They make perfect dedicated stations.',
        accentColor: '#3498db',
        pulses: [
          { label: 'Media', value: 'Home center' },
          { label: 'Gaming', value: 'Retro console' },
          { label: 'Network', value: 'Internet radio' },
        ],
        blocks: [
          {
            type: 'paragraph',
            content:
              'Laptops and routers often have years of life left in them if used as dedicated devices.',
          },
          {
            type: 'bulletList',
            items: [
              'Old laptops can be repurposed as media centers, retro gaming consoles, digital signage, or dedicated music stations.',
              'Wireless routers can be modified into internet radios.',
            ],
          },
        ],
      },
      {
        id: 'artistic',
        label: 'Artistic Upcycling',
        title: 'Tech to Art',
        summary: 'Using the physical components of electronics for aesthetic and functional decor.',
        robotNote: 'The beauty of a circuit board isn’t just in its logic, but in its geometry.',
        accentColor: '#e74c3c',
        pulses: [
          { label: 'Jewelry', value: 'Circuit boards' },
          { label: 'Furniture', value: 'CRT pet beds' },
          { label: 'Gardening', value: 'Speaker planters' },
        ],
        blocks: [
          {
            type: 'paragraph',
            content:
              'Creative reuse and upcycling approaches reduce e-waste, encourage sustainability, and allow for fun DIY projects.',
            emphasis: true,
          },
          {
            type: 'bulletList',
            items: [
              'Circuit boards and keyboard keys can be reused for art, jewelry, clocks, or decorative pieces.',
              'CRT monitors can become fish tanks or pet beds after careful dismantling.',
              'Broken speakers can be upcycled into planters, and floppy disks can be reused as retro notebook covers.',
            ],
          },
          {
            type: 'interactive3d',
            activityId: 'upcycle-forge',
            title: 'Upcycle Forge',
          },
        ],
      },
    ],
  },
  {
    id: '2-3',
    moduleLabel: 'Module 02',
    title: 'The Third R: Recycle!',
    strapline: 'Complete the loop. Melt the past to forge the future.',
    summary:
      'The industrial process for recycling e-waste: safely recovering valuable materials through sorting, shredding, and smelting.',
    robotStatus: 'Recycling protocols engaged. Material recovery optimized.',
    scrapFact: 'Smelting e-waste at 1200°C allows for nearly 100% recovery of copper and precious metals.',
    accentColor: '#e74c3c',
    assembly: {
      part: 'mobility',
      title: 'Recycling Core',
      schematic: 'Smelting Unit',
      summary: 'Learners master industrial recycling, so the robot earns its high-temperature recovery core.',
      reward: 'Unlocks material separation mode.',
    },
    tabs: [
      {
        id: 'process',
        label: 'Process',
        title: 'Safe Disposal Methods',
        summary: 'The journey of e-waste through modern recycling facilities.',
        robotNote: 'The shredder is the start of a second life. Everything is sorted before it’s reborn.',
        heroImage: '/s/articles/69f4527b41e01b23b9093dae/images/image-20260507102449-4.png',
        accentColor: '#e67e22',
        pulses: [
          { label: 'Temp', value: '1200°C furnace' },
          { label: 'Sorting', value: 'Manual + Mech' },
          { label: 'Output', value: 'Resale metals' },
        ],
        blocks: [
          {
            type: 'video',
            title: 'I went down a rabbit hole trying to recycle all my tech waste',
            url: 'https://youtu.be/i03W6cdnlx8',
            note: 'Watch 1:32 to 2:09 and 5:00 to 14:25 for a deep dive into the recycling process.',
          },
          {
            type: 'paragraph',
            content:
              'The industrial process for recycling e-waste involves several key steps to safely recover valuable materials through smelting and separation.',
            emphasis: true,
          },
          {
            type: 'bulletList',
            items: [
              'Collection and Sorting: E-waste is collected then manually sorted to remove hazardous items like batteries. Reusable components are separated early.',
              'Dismantling and Shredding: Devices are dismantled; remaining e-waste is shredded into small pieces to facilitate material separation.',
              'Mechanical Separation: Magnetic separation extracts ferrous metals. Eddy current separation sorts copper and aluminum. Water separation distinguishes plastics.',
            ],
          },
        ],
      },
      {
        id: 'smelting',
        label: 'Smelting',
        title: 'High-Temp Refining',
        summary: 'Recovering pure metals from complex electronic scrap.',
        robotNote: 'Fire is the final purifier. Molten gold flows while the slag burns away.',
        heroImage: '/s/articles/69f4527b41e01b23b9093dae/images/image-20260507102449-5.jpeg',
        accentColor: '#c0392b',
        pulses: [
          { label: 'Furnace', value: '1200°C' },
          { label: 'Separation', value: 'Slag vs Metal' },
          { label: 'Purity', value: 'Electrolysis' },
        ],
        blocks: [
          {
            type: 'paragraph',
            content:
              'Smelting and Refining: Metal fractions are melted at high temperatures in furnaces. Plastics burn off as slag on top, while metals like copper settle below.',
          },
          {
            type: 'paragraph',
            content:
              'The molten metal is refined in converters to remove impurities. Precious metals like gold and silver are isolated through electrolysis and chemical processes.',
          },
        ],
      },
      {
        id: 'recovery',
        label: 'Recovery',
        title: 'Circular Economy & SDGs',
        summary: 'Final output and environmental protection protocols.',
        robotNote: 'Closing the loop is the ultimate goal. Every atom back in its place.',
        accentColor: '#16a085',
        pulses: [
          { label: 'Metals', value: 'Resale quality' },
          { label: 'Plastics', value: 'Pelletized' },
          { label: 'Byproducts', value: 'Safely captured' },
        ],
        blocks: [
          {
            type: 'paragraph',
            content:
              'This multi-stage process ensures toxic components are safely managed and valuable metals are efficiently recovered, supporting environmental protection.',
          },
          {
            type: 'bulletList',
            items: [
              'Material Recovery: Refined metals meet purity standards for resale or reuse in manufacturing.',
              'Plastics: Cleaned and pelletized for recycling.',
              'Hazardous Management: Toxic byproducts like cadmium are captured to avoid environmental contamination.',
            ],
          },
          {
            type: 'quote',
            content:
              'Formal recycling and urban mining are critical to achieving the UN Sustainable Development Goals (SDGs) for responsible consumption and production.',
            author: 'Global E-waste Monitor',
          },
          {
            type: 'interactive3d',
            activityId: 'smelter-pipeline',
            title: 'Recycling Smelter Pipeline',
          },
        ],
      },
    ],
  },
  {
    id: '3-1',
    moduleLabel: 'Module 03',
    title: 'Mapping Local Resources',
    strapline: 'Locate the nearest salvage node. The yard is only as clean as your last drop-off.',
    summary:
      'Practical ways to find certified local e-waste collection sites, authorized recyclers, and community collection events.',
    robotStatus: 'Satellite uplink active. Local coordinates acquired.',
    scrapFact: 'There are over 100 authorized e-waste recyclers in Rajasthan alone, providing professional salvage services.',
    accentColor: '#3498db',
    assembly: {
      part: 'head',
      title: 'Mapping Uplink',
      schematic: 'Advanced Sensor Array',
      summary: 'Learners find local drop-off points, so the robot earns a high-gain antenna and GPS module.',
      reward: 'Unlocks local facility lookup.',
    },
    tabs: [
      {
        id: 'directories',
        label: 'Directories',
        title: 'Authorized Recyclers',
        summary: 'How to use service platforms and government lists to find trusted recyclers.',
        robotNote: 'Don’t just dump the scrap in any yard. Use the authenticated map to find official processing zones.',
        heroImage: '/s/articles/69f4527b41e01b23b9093dae/images/image-20260507102537-6.png',
        accentColor: '#3498db',
        pulses: [
          { label: 'Network', value: 'Authorized only' },
          { label: 'Tools', value: 'Justdial & Official Lists' },
          { label: 'Region', value: 'Rajasthan focus' },
        ],
        blocks: [
          {
            type: 'paragraph',
            content:
              'To find certified local e-waste collection sites and authorized recyclers, you can use local directories and official government databases to ensure safe disposal.',
            emphasis: true,
          },
          {
            type: 'bulletList',
            items: [
              'Service Platforms: Use platforms like Justdial to find certified recyclers such as ETCO E-Waste Recycler or Refresh Technology in Jaipur offering authorized pick-up.',
              'Government Lists: Check environmental department websites (like the Rajasthan Environment Department) for updated lists of authorized dismantlers and refurbishers.',
            ],
          },
        ],
      },
      {
        id: 'events',
        label: 'Events',
        title: 'Drives & Drop-offs',
        summary: 'Participating in local campaigns and municipal disposal programs.',
        robotNote: 'October 14th is International E-Waste Day. It’s the peak maintenance window for the whole yard.',
        accentColor: '#e67e22',
        pulses: [
          { label: 'Event', value: 'Oct 14th E-Waste Day' },
          { label: 'Drop-off', value: 'Municipal facilities' },
          { label: 'Awareness', value: 'Regional campaigns' },
        ],
        blocks: [
          {
            type: 'paragraph',
            content:
              'Beyond permanent facilities, community drives and seasonal events offer convenient ways to dispose of small gadgets responsibly while raising awareness.',
          },
          {
            type: 'bulletList',
            items: [
              'Collection Drives: Look for events promoted around International E-Waste Day (October 14th) for convenient regional drop-off locations.',
              'Municipal Points: Contact local waste management authorities for permanent drop-off points at solid waste facilities or large electronic stores.',
            ],
          },
        ],
      },
      {
        id: 'interactive',
        label: 'Map Feed',
        title: 'Interactive Resource Map',
        summary: 'Live feed of authorized recyclers and dismantlers in the Rajasthan region.',
        robotNote: 'The map feed is live. Every blue dot is a potential portal for material recovery.',
        accentColor: '#27ae60',
        pulses: [
          { label: 'Map Link', value: 'Rajasthan authorized' },
          { label: 'Category', value: 'Recycler/Dismantler' },
          { label: 'Status', value: 'Certified' },
        ],
        blocks: [
          {
            type: 'paragraph',
            content:
              'Use the interactive Rajasthan E-Waste Map to find the nearest authorized recycler, dismantler, or refurbisher in your area.',
            emphasis: true,
          },
          {
            type: 'quote',
            content:
              'Always confirm the certification and environmental compliance of collection points before disposal. Trusted facilities ensure proper resource recovery.',
            author: 'Disposal Protocol',
          },
          {
            type: 'paragraph',
            content:
              'Access the authorized network feed here: https://chirayumishra24.github.io/Map/rajasthan-ewaste-map.html',
          },
          {
            type: 'interactive3d',
            activityId: 'recycler-radar',
            title: 'Recycler Radar',
          },
        ],
      },
    ],
  },
  {
    id: '3-2',
    moduleLabel: 'Module 03',
    title: 'The E-Waste Action Plan',
    strapline: 'Assemble your crew. It’s time to scale the salvage operations to the whole sector.',
    summary:
      'A concrete step-by-step blueprint for organizing e-waste collection drives in schools and communities.',
    robotStatus: 'Social protocols initialized. Community outreach sequence starting.',
    scrapFact: 'A single community drive can divert over 5,000kg of e-waste from landfills in just one weekend.',
    accentColor: '#9b59b6',
    assembly: {
      part: 'torso',
      title: 'Command Module',
      schematic: 'Multi-Terminal Hub',
      summary: 'The robot gains a central command unit to coordinate multiple salvage drones (volunteers).',
      reward: 'Unlocks community drive blueprint.',
    },
    tabs: [
      {
        id: 'prep',
        label: 'Preparation',
        title: 'Phase 1: Intel & Outreach',
        summary: 'Planning, research, and raising awareness before the collection begins.',
        robotNote: 'Intel is key. Research local protocols and partner with certified scrap-processing titans.',
        heroImage: '/s/articles/69f4527b41e01b23b9093dae/images/image-20260507103816-1.png',
        accentColor: '#9b59b6',
        pulses: [
          { label: 'Intel', value: 'Local Regs' },
          { label: 'Network', value: 'Certified Partners' },
          { label: 'Outreach', value: 'Flyers & Social' },
        ],
        blocks: [
          {
            type: 'video',
            title: 'Managing E-Waste',
            url: 'https://youtu.be/dGxU4w1MDco',
          },
          {
            type: 'paragraph',
            content:
              'Organizing a successful drive starts with clear goals and strong partnerships. You must identify your purpose and partner with certified management companies.',
          },
          {
            type: 'bulletList',
            items: [
              'Planning: Identify your goals and research local regulations for hazardous waste handling.',
              'Promotion: Create engaging materials explaining e-waste hazards to educate your participants.',
              'Workshops: Organize pre-event presentations to build momentum before the collection day.',
            ],
          },
        ],
      },
      {
        id: 'execution',
        label: 'Execution',
        title: 'Phase 2: The Collection',
        summary: 'Setting up the drop-off zone and executing the drive safely.',
        robotNote: 'Location matters. A high-traffic sector ensures maximum scrap intake.',
        accentColor: '#e74c3c',
        pulses: [
          { label: 'Zone', value: 'Accessible Site' },
          { label: 'Sorting', value: 'Categorized Bins' },
          { label: 'Crew', value: 'Volunteer Staff' },
        ],
        blocks: [
          {
            type: 'paragraph',
            content:
              'Success depends on a smooth drop-off experience. Ensure your site is accessible and your bins are clearly categorized for different waste types.',
          },
          {
            type: 'bulletList',
            items: [
              'Collection Setup: Arrange safe bins for specific types (batteries, electronics, cords) at a convenient location.',
              'Site Execution: Staff the site with volunteers to assist participants and maintain accurate intake records.',
              'Safe Storage: Ensure all collected items are stored securely for transport to the processing facility.',
            ],
          },
        ],
      },
      {
        id: 'impact',
        label: 'Impact',
        title: 'Phase 3: Post-Drive Metrics',
        summary: 'Reporting results and fostering ongoing engagement.',
        robotNote: 'Every kg diverted is a victory for the sector. Share the stats to boost morale for the next cycle.',
        accentColor: '#27ae60',
        pulses: [
          { label: 'Processing', value: 'Recycler Coord' },
          { label: 'Metrics', value: 'Impact Stats' },
          { label: 'Engagement', value: 'Sustained Action' },
        ],
        blocks: [
          {
            type: 'paragraph',
            content:
              'The drive doesn’t end when the bins are full. Processing the waste and reporting the impact ensures long-term community commitment.',
          },
          {
            type: 'bulletList',
            items: [
              'Data Processing: Calculate the total waste diverted from landfills and coordinate final transport with the recycler.',
              'Feedback: Share the impact results via social media or reports to thank your volunteers and partners.',
              'Sustained Change: Plan regular annual drives to create a permanent culture of responsible disposal.',
            ],
          },
          {
            type: 'quote',
            content:
              'This structured plan empowers schools and local groups to make a tangible environmental difference, fostering responsible consumption.',
            author: 'Action Lead',
          },
          {
            type: 'interactive3d',
            activityId: 'drive-simulator',
            title: 'Collection Drive Simulator',
          },
        ],
      },
    ],
  },
  {
    id: '3-3',
    moduleLabel: 'Module 03',
    title: 'Digital Citizenship',
    strapline: 'Secure your data stream. A responsible user protects both the planet and their digital ghost.',
    summary:
      'Mindful digital habits to lower your personal data footprint, enhance security, and become a responsible participant in the tech ecosystem.',
    robotStatus: 'Firewall active. Data encryption protocols engaged.',
    scrapFact: 'Every unused account and uncleaned cache is "digital e-waste"—consuming server energy and increasing your vulnerability.',
    accentColor: '#16a085',
    assembly: {
      part: 'mobility',
      title: 'Encryption Shield',
      schematic: 'Hardened Logic Gates',
      summary: 'The robot gains specialized shielding to protect its core data from external interference.',
      reward: 'Unlocks privacy protocols.',
    },
    tabs: [
      {
        id: 'security',
        label: 'Privacy',
        title: 'Hardening Your Digital Defenses',
        summary: 'Essential settings and tools for protecting your personal information.',
        robotNote: 'Tighten your privacy ports. A leak in the data stream is a vulnerability in the whole system.',
        heroImage: '/s/articles/69f4527b41e01b23b9093dae/images/image-20260507104024-2.png',
        accentColor: '#16a085',
        pulses: [
          { label: 'Defense', value: '2FA Enabled' },
          { label: 'Privacy', value: 'Settings Tightened' },
          { label: 'Sharing', value: 'Selective Only' },
        ],
        blocks: [
          {
            type: 'video',
            title: 'Digital Footprint & Security',
            url: 'https://youtu.be/8pkv_T0a80g',
          },
          {
            type: 'paragraph',
            content:
              'Being a responsible tech user starts with securing your own data. This reduces the energy consumption of data centers and protects your identity from digital pollution.',
          },
          {
            type: 'bulletList',
            items: [
              'Selective Sharing: Be selective with personal info online. Avoid oversharing address or phone details unless necessary.',
              'Privacy Settings: Regularly review and tighten privacy settings on social media platforms to limit profile visibility.',
              'Authentication: Use strong, unique passwords for all accounts and enable two-factor authentication for added security.',
            ],
          },
        ],
      },
      {
        id: 'footprint',
        label: 'Footprint',
        title: 'Minimizing Your Data Trace',
        summary: 'Mindful habits to reduce the amount of tracked data you leave behind.',
        robotNote: 'Delete the ghosts of unused accounts. Every byte saved is power preserved.',
        accentColor: '#34495e',
        pulses: [
          { label: 'Trace', value: 'Cookies Cleared' },
          { label: 'Tunnel', value: 'VPN Active' },
          { label: 'Ghosts', value: 'Accounts Deleted' },
        ],
        blocks: [
          {
            type: 'paragraph',
            content:
              'Your digital footprint is more than just social media. It includes every cookie, cache file, and unused account that consumes server resources.',
          },
          {
            type: 'bulletList',
            items: [
              'Account Maintenance: Delete or deactivate unused online accounts to reduce data exposure and server energy load.',
              'Connection Security: Use virtual private networks (VPNs) when browsing on public Wi-Fi to encrypt your connection.',
              'Data Hygiene: Clear cookies, cache, and browsing history regularly, or use incognito mode to avoid storing local history.',
            ],
          },
        ],
      },
      {
        id: 'mindfulness',
        label: 'Mindfulness',
        title: 'Responsible Participation',
        summary: 'Staying informed and cautious in the digital age.',
        robotNote: 'The sector is always evolving. Stay informed to keep your shielding optimized.',
        accentColor: '#2980b9',
        pulses: [
          { label: 'Permissions', value: 'Limited' },
          { label: 'Awareness', value: 'Phishing Check' },
          { label: 'Update', value: 'Mindful Habits' },
        ],
        blocks: [
          {
            type: 'paragraph',
            content:
              'A responsible citizen is an informed one. Staying cautious with links and permissions protects the integrity of the whole digital ecosystem.',
          },
          {
            type: 'bulletList',
            items: [
              'Phishing Caution: Be cautious when clicking links in emails or unfamiliar websites to avoid identity theft.',
              'App Permissions: Limit app permissions by only allowing access to necessary device functions like location or contacts.',
              'Stay Informed: Stay updated on privacy practices and adapt your habits to maintain control over your personal data.',
            ],
          },
          {
            type: 'quote',
            content:
              'By adopting these mindful digital habits, users can lower personal data traces, enhance security, and become responsible participants in the digital age.',
            author: 'Citizen Protocol',
          },
          {
            type: 'interactive3d',
            activityId: 'data-shredder',
            title: 'Secure Data Shredder',
          },
        ],
      },
    ],
  },
  {
    id: '3-4',
    moduleLabel: 'Module 03',
    title: 'E-Waste in India',
    strapline: 'Regional focus. The world’s third-largest salvage hub is undergoing a core system update.',
    summary:
      'Deep dive into India’s status as a top e-waste generator, the challenges of the informal sector, and the 2022 Management Rules.',
    robotStatus: 'Regional localization complete. Analyzing national grid protocols.',
    scrapFact: 'India generates over 3.8 million metric tonnes of e-waste annually—enough to fill 10,000 Olympic swimming pools.',
    accentColor: '#e67e22',
    assembly: {
      part: 'mobility',
      title: 'Framework Reinforcement',
      schematic: 'Industrial Grade Support',
      summary: 'The robot gains heavy-duty structural reinforcements to handle the massive volumes of regional scrap.',
      reward: 'Unlocks regional policy database.',
    },
    tabs: [
      {
        id: 'status',
        label: 'Status',
        title: 'A Global Scrap Giant',
        summary: 'Understanding the scale of e-waste generation in Indian cities and states.',
        robotNote: 'The volume is massive. 65 sectors contribute to over 60% of the total intake. We need high-capacity sorters.',
        heroImage: '/s/articles/69f4527b41e01b23b9093dae/images/image-20260507104106-3.png',
        accentColor: '#e67e22',
        pulses: [
          { label: 'Rank', value: '3rd Globally' },
          { label: 'Volume', value: '3.8 MMT/year' },
          { label: 'Source', value: '65 Major Cities' },
        ],
        blocks: [
          {
            type: 'video',
            title: 'India E-Waste Status',
            url: 'https://youtu.be/dGxU4w1MDco',
          },
          {
            type: 'paragraph',
            content:
              'India is now the world’s third-largest generator of e-waste, producing around 3.8 million metric tonnes annually. Rapid digital growth and increased device use have accelerated this trend.',
          },
          {
            type: 'bulletList',
            items: [
              'Geographic Concentration: 65 cities generate over 60% of total waste, with just 10 states contributing 70%.',
              'Sector Gap: Only about one-third is processed through formal channels. The rest is handled by the informal sector using unsafe methods.',
              'Health Risks: Informal processing involving acid leaching and open burning poses severe environmental and health hazards.',
            ],
          },
        ],
      },
      {
        id: 'rules',
        label: 'Policy',
        title: 'E-Waste Rules 2022',
        summary: 'EPR targets and the new framework for producers and recyclers.',
        robotNote: 'EPR (Extended Producer Responsibility) is a hard-coded directive. Manufacturers must track units from cradle to grave.',
        heroImage: '/s/articles/69f4527b41e01b23b9093dae/images/image-20260507104106-4.png',
        accentColor: '#d35400',
        pulses: [
          { label: 'Policy', value: 'Rules 2022' },
          { label: 'Mandate', value: 'EPR Targets' },
          { label: 'Tracking', value: 'Digitized' },
        ],
        blocks: [
          {
            type: 'paragraph',
            content:
              'The Government of India introduced the E-Waste (Management) Rules 2022, mandating Extended Producer Responsibility (EPR) to ensure producers meet strict recycling targets.',
          },
          {
            type: 'bulletList',
            items: [
              'Extended Responsibility: Producers are now legally responsible for ensuring their products reach certified recyclers.',
              'Integration: Public institutions are being integrated into the formal disposal network for better compliance.',
              'Enforcement Challenges: Lack of infrastructure, illegal imports, and low awareness still hinder effective management.',
            ],
          },
        ],
      },
      {
        id: 'innovation',
        label: 'Innovation',
        title: 'Eco-Parks & AI',
        summary: 'Using technology and infrastructure to bridge the formal-informal gap.',
        robotNote: 'AI sub-routines are coming online. Sorting efficiency is projected to increase by 40% with automated recognition.',
        accentColor: '#27ae60',
        pulses: [
          { label: 'Node', value: 'Eco-Parks' },
          { label: 'Clinic', value: 'Bhopal Pilot' },
          { label: 'Tech', value: 'AI Sorting' },
        ],
        blocks: [
          {
            type: 'video',
            title: 'Fixing India’s E-Waste',
            url: 'https://youtu.be/KxGbqRF3-_0',
          },
          {
            type: 'paragraph',
            content:
              'Efforts like the development of e-waste eco-parks, clinics (e.g., in Bhopal), and e-waste banks aim to improve accessibility and recycling efficiency.',
          },
          {
            type: 'imageGrid',
            images: [
              { src: '/s/articles/69f4527b41e01b23b9093dae/images/image-20260507104106-5.png', alt: 'E-Waste Clinic' },
              { src: '/s/articles/69f4527b41e01b23b9093dae/images/image-20260507104106-6.png', alt: 'Eco-Park Layout' },
            ],
          },
          {
            type: 'quote',
            content:
              'Addressing these challenges presents an opportunity for India to foster sustainable development and recover valuable resources.',
            author: 'Circular Economy Report',
          },
          {
            type: 'interactive3d',
            activityId: 'india-policy-map',
            title: 'India Policy Heatmap',
          },
        ],
      },
    ],
  },
]

export function toSkillizeeImageUrl(path: string) {
  const skillizeeAssetPrefix = 'https://login.skillizee.io'
  return path.startsWith('http') ? path : `${skillizeeAssetPrefix}${path}`
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
