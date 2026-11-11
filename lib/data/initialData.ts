export interface ServiceData {
  slug: string;
  title: string;
  category: string;
  shortDesc: string;
  fullDesc: string;
  icon: string;
  featuredImage: string;
  images: string[];
  features: string[];
  benefits: string[];
  seoTitle: string;
  seoDesc: string;
  orderIndex: number;
}

export interface ProjectData {
  slug: string;
  title: string;
  category: string;
  client: string;
  location: string;
  completedDate: string;
  area: string;
  shortDesc: string;
  description: string;
  featuredImage: string;
  beforeImage: string;
  afterImage: string;
  isFeatured: boolean;
  orderIndex: number;
  galleryImages: { imageUrl: string; caption: string }[];
}

export interface GalleryCategoryData {
  slug: string;
  name: string;
  orderIndex: number;
}

export interface GalleryItemData {
  title: string;
  categorySlug: string;
  imageUrl: string;
  isFeatured: boolean;
  orderIndex: number;
}

export interface TestimonialData {
  clientName: string;
  clientRole: string;
  clientLocation: string;
  rating: number;
  reviewText: string;
  orderIndex: number;
}

export const INITIAL_SERVICES: ServiceData[] = [
  {
    slug: "interior-design",
    title: "Interior Design",
    category: "Interior",
    shortDesc: "End-to-end luxury architectural interior design tailored for bespoke residential and executive lifestyle environments.",
    fullDesc: "MA Carpenter and Interior delivers world-class interior design services for luxury apartments, villas, and commercial spaces across Noida and the NCR. From architectural spatial layout and 3D photorealistic renderings to lighting schematics and curated material selection, we blend timeless craftsmanship with contemporary ergonomics to build spaces that reflect your prestige.",
    icon: "Compass",
    featuredImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80",
    images: [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    ],
    features: [
      "Architectural 3D & 2D Layouts",
      "Bespoke Material & Finish Palette",
      "Curated Ambient & Accent Lighting",
      "Turnkey Project Management",
      "Budget Estimation & Timeline Tracking"
    ],
    benefits: [
      "Optimized spatial efficiency and fluid circulation",
      "Substantial increase in property market value",
      "Single-point turnkey accountability",
      "Exclusive access to factory-grade carpentry finishes"
    ],
    seoTitle: "Luxury Interior Design Services in Noida | MA Carpenter & Interior",
    seoDesc: "Transform your living space with bespoke luxury interior design services by MA Carpenter and Interior in Sector 120, Noida.",
    orderIndex: 1
  },
  {
    slug: "modular-kitchen",
    title: "Modular Kitchen",
    category: "Kitchen",
    shortDesc: "German and Italian inspired ergonomic modular kitchens engineered with marine-grade waterproof ply and luxury acrylic/PU finishes.",
    fullDesc: "Cooking becomes an art form in our ergonomically planned modular kitchens. MA Carpenter and Interior builds modular kitchen layouts including Island, L-Shape, Parallel, and U-Shape configs. We use high-density waterproof plywood, quartz/granite stone countertops, Blum and Hettich soft-close hardware, and scratch-resistant acrylic and lacquered glass finishes.",
    icon: "Utensils",
    featuredImage: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80",
    images: [
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80"
    ],
    features: [
      "Waterproof BWP Marine Grade Core",
      "Premium Blum & Hettich Hydraulic Hardware",
      "Smart Pull-Out Pantries & Corner Magic Carousels",
      "Scratch & Heat-Resistant Quartz Slabs",
      "Integrated Microwave & Appliance Enclosures"
    ],
    benefits: [
      "Maximum storage efficiency in compact footprints",
      "Seamless soft-close quiet operation for decades",
      "Effortless cleaning with anti-fingerprint coatings",
      "10-Year hardware and structural warranty"
    ],
    seoTitle: "Modular Kitchen Design in Noida | MA Carpenter and Interior",
    seoDesc: "Discover custom modular kitchens in Noida with waterproof ply, premium acrylic finishes, and soft-close hardware.",
    orderIndex: 2
  },
  {
    slug: "bedroom-interior",
    title: "Bedroom Interior",
    category: "Interior",
    shortDesc: "Sanctuaries of relaxation featuring acoustic wall paneling, integrated headboards, mood lighting, and concealed wardrobe systems.",
    fullDesc: "Your master bedroom should be an intimate haven of serenity. We design complete bedroom interiors including upholstered acoustic wall paneling, custom floating platform beds with hydraulic storage, bespoke nightstands, hidden dressing areas, and ambient layered LED profile illumination.",
    icon: "BedDouble",
    featuredImage: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1600&q=80",
    images: [
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
    ],
    features: [
      "Velvet & Leatherette Upholstered Headboards",
      "Acoustic Fluted Wooden Wall Louvers",
      "Concealed Walk-In Closets & Dressers",
      "Warm Cove & Recessed Reading Illumination",
      "Solid Teak & Engineered Hardwood Beds"
    ],
    benefits: [
      "Restful sound-dampened sleep environment",
      "Clutter-free storage beneath pneumatic bed frames",
      "Warm golden aesthetic for high-end boutique hotel comfort"
    ],
    seoTitle: "Master Bedroom Interior Design Noida | MA Carpenter & Interior",
    seoDesc: "Elevate your private sanctuary with luxury bedroom interiors and bespoke master suites by MA Carpenter in Noida.",
    orderIndex: 3
  },
  {
    slug: "living-room-interior",
    title: "Living Room Interior",
    category: "Interior",
    shortDesc: "Grand salon aesthetics with Italian marble backdrops, fluted wooden cladding, champagne gold trims, and bespoke modular seating.",
    fullDesc: "Create an unforgettable first impression for your guests. MA Carpenter and Interior specializes in grand living room architecture featuring book-matched Italian marble TV consoles, CNC-cut metallic lattice screens, fluted charcoal and gold accent louvers, and bespoke sectional seating arrangements.",
    icon: "Armchair",
    featuredImage: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80",
    images: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    ],
    features: [
      "Book-Matched Italian Marble Feature Walls",
      "Custom Media Walls with Gold Reveal Trims",
      "Architectural Floating False Ceiling Lighting",
      "Bespoke Center & Console Accent Tables",
      "Motorized Curtains & Acoustic Drapes"
    ],
    benefits: [
      "Showstopper luxury living that wows every guest",
      "Clean wire-free concealed entertainment consoles",
      "Harmonious flow connecting living and dining areas"
    ],
    seoTitle: "Luxury Living Room Interior Design Noida | MA Carpenter",
    seoDesc: "Transform your living room into an architectural masterpiece with custom marble, wood paneling, and golden accents.",
    orderIndex: 4
  },
  {
    slug: "custom-furniture",
    title: "Custom Furniture",
    category: "Carpentry",
    shortDesc: "Handcrafted solid teak, sheesham, and engineered hardwood furniture made to measure by seasoned master artisans.",
    fullDesc: "Say goodbye to mass-produced furniture that fails within two years. Our in-house carpenters craft solid wood dining tables, artisanal credenzas, custom ergonomic desks, and statement accent chairs tailored to your exact measurements, fabric selections, and finish tastes.",
    icon: "Hammer",
    featuredImage: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1600&q=80",
    images: [
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80"
    ],
    features: [
      "Seasoned Grade-A Solid Teak & Walnut",
      "Traditional Mortise & Tenon Joinery",
      "Custom PU & Italian Polyurethane Polish",
      "Export-Quality Brass & Gold Metal Accents",
      "Endless Fabric Options: Velvet, Suede, Linen"
    ],
    benefits: [
      "Generational durability built to last decades",
      "Exact size precision for awkward corners and niches",
      "Exclusive one-of-a-kind design not found in stores"
    ],
    seoTitle: "Custom Handcrafted Furniture Noida | MA Carpenter and Interior",
    seoDesc: "Order custom solid wood furniture, bespoke dining sets, and artisanal wood work from MA Carpenter in Sector 120 Noida.",
    orderIndex: 5
  },
  {
    slug: "wardrobe-design",
    title: "Wardrobe Design",
    category: "Carpentry",
    shortDesc: "Floor-to-ceiling modular sliding, lacquered glass, walk-in closets, and hinged wardrobes with interior sensor illumination.",
    fullDesc: "Organize your life with high-fashion wardrobe designs. We fabricate walk-in dressing suites, tinted reflective glass wardrobes with aluminum gold profiles, floor-to-ceiling sliding sliders, and velvet-lined jewelry drawers that elevate your daily routine.",
    icon: "Sparkles",
    featuredImage: "/images/services/wardrobe-design.jpg",
    images: [
      "/images/services/wardrobe-design.jpg",
      "/images/gallery/rose-gold-wardrobe.jpg",
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80"
    ],
    features: [
      "Tinted Fluted Glass with Rose Gold Aluminum Frames",
      "Concealed LED Strip Lighting with Door Sensors",
      "Pneumatic Pull-Down Garment Hanger Rods",
      "Bespoke Velvet-Lined Watch & Accessory Organizers",
      "Full-Length Heated De-Misting Mirrors"
    ],
    benefits: [
      "100% maximized ceiling-height storage",
      "Smooth soft-glide sliding doors with no derailment",
      "Sophisticated boutique display aesthetic"
    ],
    seoTitle: "Luxury Modular Wardrobes Noida | MA Carpenter and Interior",
    seoDesc: "Explore custom sliding, walk-in, and lacquered glass wardrobes in Noida by MA Carpenter and Interior.",
    orderIndex: 6
  },
  {
    slug: "tv-unit-design",
    title: "TV Unit Design",
    category: "Interior",
    shortDesc: "Statement entertainment media walls combining fluted panels, backlit onyx/marble, and floating storage drawers.",
    fullDesc: "Upgrade your entertainment experience with custom television consoles and media feature walls. We integrate acoustic back-panels, concealed conduit cable management, floating consoles, and dimmable accent lighting for theater-grade elegance.",
    icon: "Tv",
    featuredImage: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1600&q=80",
    images: [
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    ],
    features: [
      "Backlit Translucent Onyx & Italian Marble",
      "Charcoal & Champagne Gold Fluted Louvers",
      "Flush Push-to-Open Hidden Storage Compartments",
      "Surround Sound Speaker Recesses",
      "Zero-Cable Visible Management Guarantee"
    ],
    benefits: [
      "Clean clutter-free focal point for the living room",
      "Houses soundbars, gaming consoles, and routers discreetly",
      "Durable heat-resistant materials"
    ],
    seoTitle: "Modern TV Unit Design Noida | MA Carpenter and Interior",
    seoDesc: "Discover custom TV unit designs, marble feature walls, and floating media consoles in Noida.",
    orderIndex: 7
  },
  {
    slug: "office-interior",
    title: "Office Interior",
    category: "Interior",
    shortDesc: "Productive, executive office environments, CEO cabins, and corporate conference rooms designed to impress clients.",
    fullDesc: "Impress your corporate visitors and empower team productivity with MA Carpenter and Interior's corporate and home-office solutions. From sleek CEO desks with brass inlays to acoustic meeting pods and ergonomic workstations, we craft commercial prestige.",
    icon: "Briefcase",
    featuredImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80"
    ],
    features: [
      "Executive Solid Hardwood Desk Suites",
      "Sound-Dampened Acoustic Wall Cladding",
      "Cable Raceway & Conference AV Integration",
      "Reception Feature Louvers with 3D Brass Brand Logos",
      "LED Anti-Glare Workstation Task Lighting"
    ],
    benefits: [
      "Enhanced employee focus and professional morale",
      "Memorable brand presence for prospective clients",
      "Fast-track handover ensuring zero business downtime"
    ],
    seoTitle: "Commercial & Office Interior Design Noida | MA Carpenter",
    seoDesc: "Design premium corporate offices, conference suites, and executive cabins in Noida with MA Carpenter and Interior.",
    orderIndex: 8
  },
  {
    slug: "false-ceiling",
    title: "False Ceiling",
    category: "Interior",
    shortDesc: "Architectural Gyproc POP false ceilings with magnetic track lighting, cove illumination, and wooden rafters.",
    fullDesc: "Ceilings are your room's fifth wall. We install precision Saint-Gobain Gyproc false ceilings with recessed magnetic track lights, perimeter warm white cove lighting, acoustic wooden rafters, and zero-crack seamless finishes.",
    icon: "Layers",
    featuredImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
    ],
    features: [
      "Original Saint-Gobain Gyproc Sheets & Framing",
      "Modern Magnetic Low-Voltage Track Lights",
      "Warm White & RGB Dimmable Hidden Coves",
      "Decorative Teak Wood Ceiling Rafters",
      "Crack-Resistant Anti-Sagging Guarantee"
    ],
    benefits: [
      "Thermal insulation that lowers AC electricity bills",
      "Conceals ugly wiring, beams, and ductwork effortlessly",
      "Creates dramatic luxury ambiance with layered lighting"
    ],
    seoTitle: "Modern False Ceiling Contractor Noida | MA Carpenter",
    seoDesc: "Install premium POP false ceilings, wooden rafters, and magnetic track lights in Noida with MA Carpenter.",
    orderIndex: 9
  },
  {
    slug: "complete-home-interior",
    title: "Complete Home Interior",
    category: "Interior",
    shortDesc: "Comprehensive end-to-end turnkey interior transformation from bare shell to luxury move-in ready residence.",
    fullDesc: "Experience seamless peace of mind with our turnkey home interior package. We take full responsibility for civil alterations, false ceilings, plumbing, electricals, modular kitchen, wardrobes, custom carpentry, painting, wallpaper, and final deep-cleaning.",
    icon: "Home",
    featuredImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80"
    ],
    features: [
      "Dedicated On-Site Project Architect",
      "Fixed Pricing with Zero Hidden Surprises",
      "Weekly Video & Photo Progress Milestone Reports",
      "Material Authenticity Certifications Provided",
      "Complimentary Post-Handover Deep Cleaning"
    ],
    benefits: [
      "Save 100+ hours of dealing with multiple contractors",
      "Guaranteed on-time 45 to 60 day completion",
      "Consistent luxury design language throughout all rooms"
    ],
    seoTitle: "Turnkey Complete Home Interiors Noida | MA Carpenter and Interior",
    seoDesc: "Turnkey home interiors in Noida. From 2BHK to luxury villas, get complete end-to-end design and execution.",
    orderIndex: 10
  },
  {
    slug: "carpenter-services",
    title: "Carpenter Services",
    category: "Carpentry",
    shortDesc: "On-site master carpentry for door frame fixing, structural partitions, repair, hardware alignment, and fitting.",
    fullDesc: "Backed by years of heritage carpentry in Noida, our experienced wood artisans offer professional carpentry services. We repair jammed doors, align sagging modular hinges, replace damaged laminates, install heavy main doors, and construct custom room dividers.",
    icon: "Wrench",
    featuredImage: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=1600&q=80",
    images: [
      "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=1200&q=80"
    ],
    features: [
      "Door Frame & Heavy Entrance Teak Door Installation",
      "Laminate Replacement & Edge-Banding",
      "Hettich & Blum Hardware Fitting & Realignment",
      "Lock, Handle, & Hydraulic Damper Fixing",
      "Prompt On-Demand Technician Visits in Noida"
    ],
    benefits: [
      "Fix irritating squeaks, misalignments, and loose hinges",
      "Expert diagnosis preventing costly furniture replacement",
      "Transparent upfront material & labor pricing"
    ],
    seoTitle: "Professional Carpenter Services in Noida | MA Carpenter",
    seoDesc: "Need an expert carpenter in Sector 120 Noida? Call 8714114418 for door fittings, repairs, and master woodwork.",
    orderIndex: 11
  },
  {
    slug: "wooden-work",
    title: "Wooden Work",
    category: "Carpentry",
    shortDesc: "Fine architectural woodwork, fluted wooden columns, wood wall cladding, intricate jali partitions, and pergolas.",
    fullDesc: "Add organic warmth and grandeur with bespoke architectural woodwork. From solid wood pergolas on terraces to intricate CNC wood jali dividers and fluted wood accent columns, MA Carpenter and Interior crafts wood into pure art.",
    icon: "Box",
    featuredImage: "/images/services/wooden-work.jpg",
    images: [
      "/images/services/wooden-work.jpg"
    ],
    features: [
      "CNC Cut Geometric Wooden Jali Screens",
      "Fluted Solid Wood & Veneer Wall Cladding",
      "Bespoke Wooden Mandirs & Prayer Niches",
      "Terrace & Balcony Hardwood Pergolas",
      "Melamine & PU Clear Matte/Gloss Coatings"
    ],
    benefits: [
      "Rich timeless aesthetic that synthetic materials cannot match",
      "Natural warmth and acoustic dampening",
      "Custom stained to match existing flooring and doors"
    ],
    seoTitle: "Architectural Wooden Work & Jali Noida | MA Carpenter",
    seoDesc: "Custom wooden panelling, CNC jali dividers, and exterior wood pergolas by MA Carpenter and Interior Noida.",
    orderIndex: 12
  }
];

export const INITIAL_PROJECTS: ProjectData[] = [
  {
    slug: "the-grand-regal-living-room",
    title: "The Grand Regal Living Room",
    category: "Living Room",
    client: "Dr. Alok Srivastava",
    location: "Sector 120, Noida",
    completedDate: "October 2026",
    area: "650 sq.ft",
    shortDesc: "Opulent salon with book-matched Italian marble, fluted charcoal wood paneling, and champagne gold trim.",
    description: "Designed for a distinguished physician family in Sector 120 Noida, this living room was completely overhauled from an empty concrete shell into a grand entertaining hall. The centerpiece is a 12-foot book-matched Statuario marble television wall flanked by vertical fluted louvers finished in deep charcoal and illuminated with recessed 3000K warm gold LED profiles. The false ceiling features nested floating steps with integrated magnetic track fixtures.",
    featuredImage: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80",
    beforeImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    afterImage: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
    isFeatured: true,
    orderIndex: 1,
    galleryImages: [
      { imageUrl: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80", caption: "Main salon overview showing bookmatched marble feature wall" },
      { imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80", caption: "Custom ceiling detail with gold cove lighting" },
      { imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80", caption: "Bespoke velvet lounge furniture and fluted coffee tables" }
    ]
  },
  {
    slug: "serenity-master-suite",
    title: "Serenity Master Suite & Dressing",
    category: "Bedroom",
    client: "Mr. & Mrs. Kapoor",
    location: "Sector 137, Noida",
    completedDate: "September 2026",
    area: "420 sq.ft",
    shortDesc: "Acoustic fluted wood headboard, floating platform king bed, and glass walk-in wardrobe.",
    description: "A tranquil sanctuary designed for restful sleep and effortless mornings. Featuring an uninterrupted 14-foot wide acoustic fluted wooden headboard wall with integrated bronze reading sconces, a custom hydraulic platform bed crafted from seasoned hardwood, and a walk-in wardrobe enclosed by rose-gold tinted fluted glass sliders with internal sensor-activated illumination.",
    featuredImage: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1600&q=80",
    beforeImage: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
    afterImage: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80",
    isFeatured: true,
    orderIndex: 2,
    galleryImages: [
      { imageUrl: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80", caption: "Master king bed with integrated floating nightstands" },
      { imageUrl: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80", caption: "Acoustic wood panel detail and soft amber lighting" },
      { imageUrl: "/images/services/wardrobe-design.jpg", caption: "Walk-in wardrobe with velvet-lined organizers" }
    ]
  },
  {
    slug: "the-aurum-island-kitchen",
    title: "The Aurum Island Modular Kitchen",
    category: "Modular Kitchen",
    client: "Vikram Malhotra",
    location: "Sector 74, Noida",
    completedDate: "August 2026",
    area: "280 sq.ft",
    shortDesc: "German-engineered modular kitchen featuring Calacatta gold quartz and matte black acrylic cabinetry.",
    description: "Engineered for a culinary enthusiast, this modular kitchen pairs high-gloss and matte anti-fingerprint acrylic finishes with imported Calacatta Gold quartz countertops with waterfall edges. Complete with Blum touch-to-open servo drawers, an expansive breakfast island with under-counter storage, and seamless integrated kitchen appliances.",
    featuredImage: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80",
    beforeImage: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80",
    afterImage: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
    isFeatured: true,
    orderIndex: 3,
    galleryImages: [
      { imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80", caption: "Central prep island with waterfall quartz" },
      { imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80", caption: "Soft-close Blum hydraulic lift-up overhead cabinets" }
    ]
  },
  {
    slug: "the-executive-study-library",
    title: "The Executive Study & Home Library",
    category: "Study Room",
    client: "Advocate Rajesh Verma",
    location: "Sector 50, Noida",
    completedDate: "July 2026",
    area: "320 sq.ft",
    shortDesc: "Floor-to-ceiling solid walnut bookshelves with warm LED illumination and executive leather desk.",
    description: "Designed for a Senior Advocate, this private study and home office exudes intellectual gravitas. Features floor-to-ceiling custom solid walnut cabinetry, illuminated book cubbies, a handcrafted executive desk with concealed power grommets, and sound-absorbing herringbone wall slats.",
    featuredImage: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80",
    beforeImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    afterImage: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
    isFeatured: true,
    orderIndex: 4,
    galleryImages: [
      { imageUrl: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80", caption: "Custom library wall with integrated warm lighting" },
      { imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80", caption: "Artisanal walnut executive desk" }
    ]
  },
  {
    slug: "tech-corp-headquarters",
    title: "TechCorp Executive Corporate Suite",
    category: "Office Interior",
    client: "TechCorp Global Solutions",
    location: "Sector 62, Noida",
    completedDate: "June 2026",
    area: "3,200 sq.ft",
    shortDesc: "Modern corporate interior with geometric acoustic ceilings, reception feature wall, and glass conference suites.",
    description: "A turnkey office transformation delivering 40 ergonomic workstations, 3 executive director cabins, a 16-seater boardroom with integrated motorized display lifts, and a striking black-and-gold reception foyer featuring the company's laser-cut brass emblem.",
    featuredImage: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1600&q=80",
    beforeImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    afterImage: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80",
    isFeatured: false,
    orderIndex: 5,
    galleryImages: [
      { imageUrl: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80", caption: "Open plan collaboration zone with acoustic baffles" }
    ]
  },
  {
    slug: "bespoke-handcrafted-furniture-collection",
    title: "Artisanal Teak & Brass Furniture Suite",
    category: "Furniture",
    client: "Mrs. Sunita Goel",
    location: "Sector 128, Noida",
    completedDate: "May 2026",
    area: "Turnkey Furniture",
    shortDesc: "Handcrafted 8-seater live-edge dining table, credenza with brass inlays, and accent armchairs.",
    description: "Custom commissioned furniture collection crafted in our Noida carpentry facility. Highlights include an 8-seater dining table from seasoned single-slab teakwood, a cocktail credenza with fluted doors and brushed gold handles, and velvet occasional chairs.",
    featuredImage: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1600&q=80",
    beforeImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
    afterImage: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80",
    isFeatured: false,
    orderIndex: 6,
    galleryImages: [
      { imageUrl: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80", caption: "Solid wood detail with golden accents" }
    ]
  },
  {
    slug: "the-palm-springs-penthouse-turnkey",
    title: "The Palm Springs 4BHK Penthouse",
    category: "Complete Home Interior",
    client: "Arun & Neha Singhania",
    location: "Expressway Sector 137, Noida",
    completedDate: "April 2026",
    area: "3,800 sq.ft",
    shortDesc: "Full turnkey luxury transformation across 4 bedrooms, drawing room, modular kitchen, and terrace deck.",
    description: "A complete turnkey residence executed in 55 days from empty shell to keys-in-hand luxury. Includes complete electrical rewiring, Gyproc designer false ceilings, Italian marble flooring polishing, bespoke modular kitchen with quartz counter, 4 custom bedroom suites with walk-in wardrobes, and an outdoor wooden pergola terrace deck.",
    featuredImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    beforeImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    afterImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    isFeatured: true,
    orderIndex: 7,
    galleryImages: [
      { imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", caption: "Grand double-height foyer with champagne gold accents" }
    ]
  }
];

export const INITIAL_GALLERY_CATEGORIES: GalleryCategoryData[] = [
  { slug: "living-room", name: "Living Room", orderIndex: 1 },
  { slug: "bedroom", name: "Bedroom", orderIndex: 2 },
  { slug: "modular-kitchen", name: "Modular Kitchen", orderIndex: 3 },
  { slug: "study-room", name: "Study Room", orderIndex: 4 },
  { slug: "luxury-wardrobes", name: "Luxury Wardrobes", orderIndex: 5 },
  { slug: "custom-woodwork", name: "Custom Woodwork", orderIndex: 6 }
];

export const INITIAL_GALLERY_ITEMS: GalleryItemData[] = [
  {
    title: "Modern Minimalist Living Room with Golden Accents",
    categorySlug: "living-room",
    imageUrl: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80",
    isFeatured: true,
    orderIndex: 1
  },
  {
    title: "Executive Master Bedroom Suite with Fluted Wood Paneling",
    categorySlug: "bedroom",
    imageUrl: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1600&q=80",
    isFeatured: true,
    orderIndex: 2
  },
  {
    title: "Luxury Island Modular Kitchen with Quartz Breakfast Bar",
    categorySlug: "modular-kitchen",
    imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80",
    isFeatured: true,
    orderIndex: 3
  },
  {
    title: "Warm Wood Executive Study & Custom Library Shelf",
    categorySlug: "study-room",
    imageUrl: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80",
    isFeatured: true,
    orderIndex: 4
  },
  {
    title: "Rose Gold Profile Tinted Glass Walk-In Wardrobe",
    categorySlug: "luxury-wardrobes",
    imageUrl: "/images/gallery/rose-gold-wardrobe.jpg",
    isFeatured: true,
    orderIndex: 5
  },
  {
    title: "Handcrafted Teakwood Console & Brass Joinery",
    categorySlug: "custom-woodwork",
    imageUrl: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1600&q=80",
    isFeatured: true,
    orderIndex: 6
  },
  {
    title: "Grand Drawing Room with Italian Statuario TV Wall",
    categorySlug: "living-room",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    isFeatured: false,
    orderIndex: 7
  },
  {
    title: "Boutique Hotel-Style Master Bedroom with Cove Lighting",
    categorySlug: "bedroom",
    imageUrl: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1600&q=80",
    isFeatured: false,
    orderIndex: 8
  },
  {
    title: "Sleek Handleless Modular Kitchen with Built-in Appliances",
    categorySlug: "modular-kitchen",
    imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1600&q=80",
    isFeatured: false,
    orderIndex: 9
  },
  {
    title: "Home Office Pod with Hidden Wire Concealment",
    categorySlug: "study-room",
    imageUrl: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1600&q=80",
    isFeatured: false,
    orderIndex: 10
  },
  {
    title: "Floor-to-Ceiling High Gloss Sliding Wardrobe Suite",
    categorySlug: "luxury-wardrobes",
    imageUrl: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1600&q=80",
    isFeatured: false,
    orderIndex: 11
  },
  {
    title: "Artisanal Wooden Wall Paneling & Architectural Louvers",
    categorySlug: "custom-woodwork",
    imageUrl: "/images/services/wooden-work.jpg",
    isFeatured: false,
    orderIndex: 12
  }
];

export const INITIAL_TESTIMONIALS: TestimonialData[] = [
  {
    clientName: "Er. Rahul Mathur",
    clientRole: "Senior Tech Director, Amrapali Zodiac",
    clientLocation: "Sector 120, Noida",
    rating: 5,
    reviewText: "MA Carpenter and Interior transformed our 3BHK into an absolute dream home. Monish and his carpentry team delivered flawless modular kitchen finishes and living room marble work ahead of schedule. The golden and charcoal accents look like a 5-star hotel!",
    orderIndex: 1
  },
  {
    clientName: "Pooja & Sameer Khanna",
    clientRole: "Homeowners, Prateek Laurel",
    clientLocation: "Sector 120, Noida",
    rating: 5,
    reviewText: "Finding genuine, honest master carpenters in Noida was tough until we met MA Carpenter. From custom hydraulic beds to walk-in glass wardrobes, every drawer slide and soft-close hinge operates like clockwork. Extremely transparent and reliable.",
    orderIndex: 2
  },
  {
    clientName: "Dr. Arvind Saxena",
    clientRole: "Consultant Physician",
    clientLocation: "Sector 50, Noida",
    rating: 5,
    reviewText: "Their attention to woodwork details, wood grain alignment, and Gyproc false ceiling perfection is unmatched. The 3D designs they presented were executed with 100% precision. Strongly recommended for turnkey luxury home interiors.",
    orderIndex: 3
  },
  {
    clientName: "Meenakshi Bhatnagar",
    clientRole: "Interior Architect",
    clientLocation: "Sector 137, Noida",
    rating: 5,
    reviewText: "As an architect, I am very picky with carpenter joinery and edge banding. MA Carpenter and Interior's workshop has the precision of high-end factory fabrication with the care of true artisanal woodworking. Remarkable service!",
    orderIndex: 4
  }
];

export const INITIAL_SEO_SETTINGS = [
  {
    pageRoute: "/",
    metaTitle: "MA Carpenter and Interior | Luxury Interior Design & Custom Woodwork Noida",
    metaDesc: "Discover premium interior design, modular kitchens, custom woodwork, and complete home interior solutions in Sector 120, Noida by MA Carpenter and Interior.",
    keywords: "interior design noida, carpenter noida, modular kitchen sector 120, custom furniture noida, luxury home interior, MA carpenter and interior"
  },
  {
    pageRoute: "/about",
    metaTitle: "About Us | MA Carpenter and Interior Noida",
    metaDesc: "Learn about MA Carpenter and Interior's heritage in luxury interior architecture, master carpentry, and turnkey home renovations in Noida.",
    keywords: "about MA carpenter, interior design company noida, master carpenter sector 120, turnkey home interior"
  },
  {
    pageRoute: "/services",
    metaTitle: "Our Services | MA Carpenter and Interior",
    metaDesc: "Explore our 12 premium interior design and carpentry services: modular kitchens, custom furniture, wardrobes, TV units, false ceilings, and turnkey homes.",
    keywords: "interior design services, modular kitchen noida, wardrobe design, carpenter services noida"
  },
  {
    pageRoute: "/projects",
    metaTitle: "Interior Design Portfolio & Projects | MA Carpenter and Interior",
    metaDesc: "Browse our luxury interior design and carpentry project portfolio across Noida and Delhi NCR with before/after transformations.",
    keywords: "interior portfolio, living room projects, modular kitchen photos, before after interior"
  },
  {
    pageRoute: "/gallery",
    metaTitle: "Interior Gallery | MA Carpenter and Interior",
    metaDesc: "Explore high-resolution photography of luxury living rooms, bedrooms, modular kitchens, and custom woodwork by MA Carpenter and Interior.",
    keywords: "interior gallery, interior design photos noida, bedroom designs, kitchen layouts"
  },
  {
    pageRoute: "/contact",
    metaTitle: "Contact Us & Free Consultation | MA Carpenter and Interior Noida",
    metaDesc: "Get in touch with MA Carpenter and Interior at Shop No. 6, Sector 120, Noida. Call 8714114418 for free site consultation and 3D estimates.",
    keywords: "contact interior designer noida, carpenter phone number noida, sector 120 carpenter"
  },
  {
    pageRoute: "/blogs",
    metaTitle: "Interior & Carpentry Design Blogs | MA Carpenter and Interior Noida",
    metaDesc: "Read expert guides, modular kitchen layouts, wardrobe trends, and woodworking advice from master artisans at MA Carpenter & Interior.",
    keywords: "interior design blog noida, modular kitchen tips, wardrobe design ideas, carpentry advice"
  }
];

export interface BlogData {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  author: string;
  readTime: string;
  publishedAt: string;
  isPublished: boolean;
  tags: string[];
}

export const INITIAL_BLOGS: BlogData[] = [
  {
    id: "blog-1",
    slug: "top-modular-kitchen-layouts-noida",
    title: "Top Modular Kitchen Layouts for 3BHK Apartments in Noida",
    excerpt: "Discover how L-shaped, parallel, and island modular kitchen layouts maximize culinary ergonomics and storage in Noida high-rise residences.",
    content: `When designing a kitchen for modern 3BHK apartments in Noida (such as in Sector 120, Sector 137, or Sector 78), homeowners often struggle to balance storage capacity with open floor movement. 

### 1. The Parallel Galley Layout
For apartments with long, narrow kitchen footprints, the parallel layout is unmatched. It creates an intuitive 'work triangle' between the sink, refrigerator, and cooking hob. Using Blum or Hettich tandem boxes ensures that every centimeter of depth is easily accessible.

### 2. The L-Shaped Modular Kitchen
The L-shape remains the most versatile layout for open-concept dining and living layouts. We recommend installing corner carousel pull-outs or LeMans corner units to eliminate dead corners.

### 3. Kitchen Island with Calacatta Quartz
If your floor plan allows at least 12 feet of width, adding a central island provides a prep station, breakfast bar, and hidden trash pull-out.

### Material Recommendation:
Always insist on BWP (Boiling Water Proof) Marine Grade 710 plywood for the under-sink and base cabinetry, coupled with scratch-resistant anti-fingerprint acrylic or PU finishes.`,
    featuredImage: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
    category: "Modular Kitchen",
    author: "Monish Pasha",
    readTime: "5 min read",
    publishedAt: "November 2026",
    isPublished: true,
    tags: ["Modular Kitchen", "Noida 3BHK", "Plywood", "Interior Tips"]
  },
  {
    id: "blog-2",
    slug: "glass-vs-wood-wardrobe-guide",
    title: "Tinted Fluted Glass vs. Solid Wood Wardrobes: Which One Suits Your Bedroom?",
    excerpt: "A detailed comparison of rose gold profile tinted glass walk-in wardrobes versus traditional teakwood sliding systems for modern master bedrooms.",
    content: `Choosing the right wardrobe design sets the tone for your master bedroom suite. Over the past year in Noida luxury apartments, two clear trends have dominated: tinted reflective glass systems and handcrafted wooden louvers.

### The Appeal of Tinted Fluted Glass Wardrobes
Glass wardrobes framed in rose gold or champagne aluminum create the sensation of a high-end luxury fashion boutique:
- **Visual Depth**: Reflective bronze glass reflects ambient cove light, making compact bedrooms feel twice as large.
- **Sensor Illumination**: Concealed vertical LED strips automatically illuminate your clothing collection when doors slide open.
- **Maintenance**: Dust-proof seals prevent any airborne particles from entering delicate garments.

### Handcrafted Teak & Fluted Wood Wardrobes
For homeowners seeking organic warmth, nothing beats natural wood:
- **Timeless Durability**: Solid teak or seasoned commercial core with natural wood veneer withstands decades of daily use.
- **Acoustic Softness**: Wood naturally absorbs sound, creating a calm, quiet sanctuary for sleep.

### The MA Carpenter Verdict:
A hybrid approach often works best: choose solid wood carcass structures with tinted glass sliding shutters in the master suite!`,
    featuredImage: "/images/gallery/rose-gold-wardrobe.jpg",
    category: "Wardrobe Design",
    author: "Monish Pasha",
    readTime: "4 min read",
    publishedAt: "November 2026",
    isPublished: true,
    tags: ["Wardrobes", "Glass Wardrobe", "Master Bedroom", "Luxury Closets"]
  },
  {
    id: "blog-3",
    slug: "choosing-marine-ply-for-home-interiors",
    title: "Architectural Woodwork & Waterproof Plywood: The Complete Homeowner Guide",
    excerpt: "Why BWP Marine grade plywood and authentic teak wood carpentry deliver decades of structural durability over particle board.",
    content: `Many homeowners ask why custom carpenter-made interiors outlast ready-made flat-pack furniture. The secret lies in material composition and precision joinery.

### Commercial Ply vs. BWP Marine Ply (IS:710)
- **MDF & Particle Board**: Highly prone to swelling and warping when exposed to Delhi NCR's monsoon humidity.
- **BWP Marine Ply (IS 710)**: Bonded with synthetic phenol formaldehyde resin, it resists boiling water for over 72 hours without delamination. Essential for all kitchens and bathroom vanities.

### Architectural Woodwork & Jali Screens
CNC-carved wooden partitions and fluted wall cladding bring architectural elegance to foyers and dining areas. Staining with polyurethane (PU) matte coats preserves the authentic grain while providing anti-scratch protection.

At MA Carpenter and Interior in Sector 120 Noida, every piece of woodwork is precision-calibrated in our in-house facility before site installation.`,
    featuredImage: "/images/services/wooden-work.jpg",
    category: "Carpentry & Woodwork",
    author: "Monish Pasha",
    readTime: "6 min read",
    publishedAt: "November 2026",
    isPublished: true,
    tags: ["Carpentry", "Woodwork", "Plywood", "Quality Standards"]
  }
];

export interface EnquiryData {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  service: string;
  message: string;
  status: string;
  internalNotes: string | null;
  createdAt: string;
}

export const INITIAL_ENQUIRIES: EnquiryData[] = [
  {
    id: "enq-1",
    name: "Er. Rahul Mathur",
    phone: "9818204910",
    email: "rahul.mathur@techcorp.com",
    service: "Modular Kitchen",
    message: "Need Italian acrylic finish modular kitchen and living room TV wall for 3BHK flat in Amrapali Zodiac, Sector 120 Noida. Looking for 3D layout consultation this weekend.",
    status: "New",
    internalNotes: "Prefers Saturday morning site visit.",
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: "enq-2",
    name: "Pooja Khanna",
    phone: "9871142230",
    email: "pooja.khanna@gmail.com",
    service: "Wardrobe Design",
    message: "Interested in Rose Gold profile tinted glass walk-in wardrobe with soft-close sensors in Prateek Laurel, Sector 120.",
    status: "New",
    internalNotes: "Sent portfolio photos on WhatsApp.",
    createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
  },
  {
    id: "enq-3",
    name: "Dr. Arvind Saxena",
    phone: "9810143890",
    email: "arvind.saxena@apollo.org",
    service: "Complete Home Interior",
    message: "Full turnkey woodwork and interior design required for 4BHK apartment in Sector 50, Noida. Need quotation including false ceiling and marine ply cabinets.",
    status: "In Progress",
    internalNotes: "Initial 3D drawings presented.",
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
  },
];

export const INITIAL_ACTIVITY_LOGS = [
  {
    id: "log-1",
    action: "Asset Update",
    adminEmail: "admin@mainterior.com",
    details: "High-resolution local photography added for Wardrobe Design and Wooden Work",
    createdAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
  },
  {
    id: "log-2",
    action: "Gallery Sync",
    adminEmail: "admin@mainterior.com",
    details: "Rose Gold Profile Tinted Glass Walk-In Wardrobe published to visual gallery",
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
  },
  {
    id: "log-3",
    action: "Journal Published",
    adminEmail: "admin@mainterior.com",
    details: "3 comprehensive design guides published for Noida homeowners",
    createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
  },
  {
    id: "log-4",
    action: "Security Verified",
    adminEmail: "admin@mainterior.com",
    details: "Master credentials verification and fail-safe authentication enabled",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
];

