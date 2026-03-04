import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { slugify } from "@/lib/slugify";

const SEED_BUILDS = [
  {
    title: "The Tourer — 200 Series GXL",
    make: "Toyota", model: "LandCruiser 200 Series", year: 2019, style: "4wd",
    location: "Perth, WA",
    description: "Built for long-range touring across the Kimberley and beyond. 3-inch lift, full electrical system, and a setup that's done 80,000km of dirt without missing a beat. This is the truck that goes everywhere.",
    mods: [
      { category: "Suspension", brand: "Old Man Emu", product_name: "BP-51 Bypass Shocks", shop_name: "Westside 4x4", notes: "3-inch lift, heavy load springs" },
      { category: "Protection", brand: "ARB", product_name: "Summit Bull Bar", shop_name: "Westside 4x4" },
      { category: "Lighting", brand: "Stedi", product_name: "ST-X 21.5\" Light Bar", notes: "Roof mounted with custom bracket" },
      { category: "Electrical", brand: "Redarc", product_name: "Manager30 Battery Management System", shop_name: "Auto Electrical Solutions Perth" },
      { category: "Recovery", brand: "Warn", product_name: "Zeon 12-S Platinum Winch" },
      { category: "Roof Racks", brand: "Rhino-Rack", product_name: "Pioneer Platform 2128mm x 1236mm" },
      { category: "Canopies", brand: "Alu-Cab", product_name: "Canopy Camper", notes: "Full fit-out with pull-out kitchen" },
      { category: "Tyres", brand: "BFGoodrich", product_name: "KO2 285/75R17", notes: "Second set — first lasted 65,000km" },
      { category: "Touring", brand: "Engel", product_name: "MR40F Fridge/Freezer", notes: "Mounted on MSA drop slide" },
      { category: "Comms", brand: "GME", product_name: "XRS-370C UHF Radio" },
    ],
  },
  {
    title: "Weekend Weapon — N80 HiLux SR5",
    make: "Toyota", model: "HiLux N80", year: 2022, style: "4wd",
    location: "Melbourne, VIC",
    description: "Daily driven Monday to Friday, beach rig on weekends. 2-inch lift keeps it compliant, 33s clear with a mild trim. The balance between practical and capable.",
    mods: [
      { category: "Suspension", brand: "Tough Dog", product_name: "Foam Cell 2\" Lift Kit", shop_name: "Fulcrum Suspensions" },
      { category: "Protection", brand: "Rival", product_name: "Alloy Underbody Armour (3-piece)", shop_name: "Fulcrum Suspensions" },
      { category: "Wheels", brand: "Method", product_name: "MR305 NV 17x8.5 -12 Offset", notes: "Matte black" },
      { category: "Tyres", brand: "Mickey Thompson", product_name: "Baja Boss A/T 285/70R17" },
      { category: "Lighting", brand: "Stedi", product_name: "Type-X Sport 7\" Driving Lights" },
      { category: "Protection", brand: "EFS", product_name: "Heavy Duty Bull Bar" },
      { category: "Canopies", brand: "FlexiTray", product_name: "FlexiCombo Tray + Canopy" },
      { category: "Electrical", brand: "Redarc", product_name: "BCDC1225D Dual Battery Charger" },
      { category: "Recovery", brand: "Maxtrax", product_name: "MKII Recovery Boards", notes: "Mounted on roof rack" },
    ],
  },
  {
    title: "Street Machine — VE SS Commodore",
    make: "Holden", model: "Commodore VE SS", year: 2010, style: "street",
    location: "Sydney, NSW",
    description: "LS3 with bolt-ons making 310kW atw on E85. Built to be fast and loud but still comfortable enough for highway trips. Cold start sets off car alarms.",
    mods: [
      { category: "Exhaust", brand: "Manta", product_name: "3\" Twin System with Varex Valves", shop_name: "Sydney Exhaust & Automotive" },
      { category: "Intake", brand: "OTR", product_name: "Cold Air Intake", notes: "Over-the-radiator design" },
      { category: "Tune", brand: "HP Tuners", product_name: "E85 Flex Fuel Tune", shop_name: "Dyno Dynamics Sydney", notes: "310kW atw on E85" },
      { category: "Suspension", brand: "Pedders", product_name: "eXtreme XA Coilovers", notes: "30mm drop" },
      { category: "Wheels", brand: "Simmons", product_name: "FR-1 20x8.5 / 20x10 Staggered", notes: "Gloss black machined face" },
      { category: "Tyres", brand: "Michelin", product_name: "Pilot Sport 4S 245/35R20 / 275/30R20" },
      { category: "Electrical", brand: "Haltech", product_name: "iC-7 Colour Display Dash" },
    ],
  },
  {
    title: "Red Centre Ready — Next-Gen Ranger Raptor",
    make: "Ford", model: "Ranger Raptor", year: 2023, style: "4wd",
    location: "Alice Springs, NT",
    description: "3.0L V6 twin-turbo diesel, factory Fox shocks. Additional protection and touring gear for extended outback trips. This thing eats corrugations for breakfast.",
    mods: [
      { category: "Protection", brand: "ARB", product_name: "Summit Sahara Bar", shop_name: "ARB Alice Springs" },
      { category: "Protection", brand: "Brown Davis", product_name: "130L Long Range Fuel Tank", notes: "Replaces factory tank — 1200km+ range" },
      { category: "Lighting", brand: "Lightforce", product_name: "Genesis+ 210mm LED Driving Lights" },
      { category: "Roof Racks", brand: "Rhino-Rack", product_name: "Backbone + Pioneer Platform" },
      { category: "Touring", brand: "Darche", product_name: "Panorama 2 Rooftop Tent", notes: "Hard shell, 30-second setup" },
      { category: "Electrical", brand: "Redarc", product_name: "RedVision Total Vehicle Management System" },
      { category: "Comms", brand: "GME", product_name: "XRS-390C UHF/GPS Radio" },
      { category: "Recovery", brand: "Maxtrax", product_name: "MKII + Maxtrax Mount" },
      { category: "Tyres", brand: "BFGoodrich", product_name: "KM3 Mud Terrain 285/70R17", notes: "For the sand — swaps back to KO2 for highway" },
    ],
  },
  {
    title: "The Family Rig — Isuzu MU-X LS-T",
    make: "Isuzu", model: "MU-X", year: 2022, style: "4wd",
    location: "Brisbane, QLD",
    description: "7-seater that actually goes off-road. Built for family camping trips from Moreton Bay to Fraser Island. Comfort and capability without compromise.",
    mods: [
      { category: "Suspension", brand: "Ironman 4x4", product_name: "Foam Cell Pro 2\" Lift Kit", shop_name: "Ironman 4x4 Brisbane" },
      { category: "Protection", brand: "Ironman 4x4", product_name: "Protector Bull Bar" },
      { category: "Wheels", brand: "Fuel", product_name: "Beast D564 17x9 -12", notes: "Matte black" },
      { category: "Tyres", brand: "Toyo", product_name: "Open Country A/T III 265/70R17" },
      { category: "Roof Racks", brand: "Rhino-Rack", product_name: "Vortex SX Platform" },
      { category: "Touring", brand: "Engel", product_name: "MT45F-G4 Fridge", notes: "40L, runs off second battery" },
      { category: "Electrical", brand: "Redarc", product_name: "BCDC1240D In-Vehicle Charger" },
      { category: "Towing", brand: "Hayman Reese", product_name: "Class 4 Tow Bar + WDH", notes: "Towing a Jayco Swan camper trailer" },
    ],
  },
  {
    title: "Built Not Bought — Y62 Patrol",
    make: "Nissan", model: "Patrol Y62", year: 2020, style: "4wd",
    location: "Perth, WA",
    description: "5.6L V8 petrol patrol. Heavy, thirsty, and absolutely unstoppable. 35s, long-travel, and enough electrical to power a small house. Cape trips and Canning Stock Route proven.",
    mods: [
      { category: "Suspension", brand: "Bilstein", product_name: "5100 Series Remote Reservoir Shocks", shop_name: "Outback Armour Perth", notes: "3-inch lift, adjustable" },
      { category: "Protection", brand: "AFN", product_name: "Heavy Duty Bull Bar" },
      { category: "Wheels", brand: "Method", product_name: "MR312 17x8.5 0 Offset", notes: "Bronze" },
      { category: "Tyres", brand: "BFGoodrich", product_name: "KO2 315/70R17", notes: "35-inch equivalent" },
      { category: "Lighting", brand: "Stedi", product_name: "Type-X Pro LED 8.5\" Driving Lights" },
      { category: "Electrical", brand: "Redarc", product_name: "Manager30 + 200Ah Lithium Battery", shop_name: "Auto Electrical Solutions Perth" },
      { category: "Canopies", brand: "Norweld", product_name: "Dual Cab Aluminium Canopy", notes: "Custom built with toolboxes and 80L water tank" },
      { category: "Touring", brand: "Engel", product_name: "MT60FP Fridge/Freezer" },
      { category: "Recovery", brand: "Warn", product_name: "VR EVO 12-S Winch" },
      { category: "Intake", brand: "Safari Snorkel", product_name: "V-Spec Snorkel" },
    ],
  },
  {
    title: "Show Stopper — Bagged XR6 Turbo",
    make: "Ford", model: "Falcon FG XR6 Turbo", year: 2014, style: "show",
    location: "Adelaide, SA",
    description: "Bagged on Airmaxxx management. 20-inch Rotiform staggered. Full respray in Aston Martin Onyx Black. This car doesn't go off-road — it parks and collects trophies.",
    mods: [
      { category: "Suspension", brand: "Airmaxxx", product_name: "Air Suspension Full Kit", shop_name: "LowLife Customs Adelaide", notes: "3/8\" management, 5-gallon tank" },
      { category: "Wheels", brand: "Rotiform", product_name: "BLQ-C 20x9 / 20x10.5 Staggered", notes: "Candy red with polished lip" },
      { category: "Tyres", brand: "Nankang", product_name: "NS-25 225/35R20 / 255/30R20" },
      { category: "Exhaust", brand: "Varex", product_name: "4\" Dump Pipe + 3\" Cat-Back", shop_name: "LowLife Customs Adelaide" },
      { category: "Tune", brand: "Haltech", product_name: "Elite 2500 ECU", notes: "Tuned by LowLife — 320kW atw on 98" },
      { category: "Lighting", brand: "VLAND", product_name: "Sequential LED Tail Lights" },
    ],
  },
  {
    title: "Tray Day — D-Max SX Single Cab",
    make: "Isuzu", model: "D-Max", year: 2021, style: "4wd",
    location: "Kalgoorlie, WA",
    description: "Single cab workhorse turned touring machine. Custom alloy tray with integrated water and fuel. This is what \"simple and functional\" looks like when done properly.",
    mods: [
      { category: "Canopies", brand: "Norweld", product_name: "Heavy Duty Alloy Tray", shop_name: "Norweld WA", notes: "Custom with integrated 40L water and underbody toolboxes" },
      { category: "Suspension", brand: "Tough Dog", product_name: "Return to Centre 2\" Lift", notes: "Heavy load rear for tray weight" },
      { category: "Protection", brand: "MCC", product_name: "Rocker Bull Bar" },
      { category: "Wheels", brand: "Dynamic", product_name: "Steel 16x8 -22 Offset", notes: "White — old school" },
      { category: "Tyres", brand: "Mickey Thompson", product_name: "Baja Boss A/T 265/75R16" },
      { category: "Electrical", brand: "Redarc", product_name: "Tow-Pro Elite V3 Electric Brake Controller" },
      { category: "Touring", brand: "Darche", product_name: "Eclipse 270 Awning" },
      { category: "Recovery", brand: "Maxtrax", product_name: "MKII Recovery Boards" },
    ],
  },
  {
    title: "Grocery Getter — GR Yaris",
    make: "Toyota", model: "GR Yaris", year: 2023, style: "street",
    location: "Melbourne, VIC",
    description: "1.6L triple turbo making 200kW+ from the factory. Bolt-ons and a tune make it terrifying. The quickest shopping run you've ever done.",
    mods: [
      { category: "Exhaust", brand: "Invidia", product_name: "Q300 Cat-Back Exhaust", shop_name: "JPC Automotive Melbourne" },
      { category: "Intake", brand: "GrimmSpeed", product_name: "Cold Air Intake" },
      { category: "Tune", brand: "Ecutek", product_name: "Stage 2 Tune", shop_name: "JPC Automotive Melbourne", notes: "230kW atw on 98 RON" },
      { category: "Suspension", brand: "Whiteline", product_name: "Front + Rear Sway Bar Kit" },
      { category: "Wheels", brand: "Enkei", product_name: "RPF1 18x8.5 +35", notes: "Gold — paying homage" },
      { category: "Tyres", brand: "Michelin", product_name: "Pilot Sport Cup 2 225/40R18", notes: "Track days only — PS4S for street" },
    ],
  },
  {
    title: "Prado Perfection — 150 Series GXL",
    make: "Toyota", model: "Prado 150 Series", year: 2020, style: "4wd",
    location: "Hobart, TAS",
    description: "The sensible family 4WD that's actually set up properly. 2-inch lift, sliders, and a full dual-battery system. Tasman Peninsula every other weekend.",
    mods: [
      { category: "Suspension", brand: "Old Man Emu", product_name: "Nitrocharger Sport 2\" Lift", shop_name: "Tasmania 4WD Centre" },
      { category: "Protection", brand: "ARB", product_name: "Commercial Bull Bar" },
      { category: "Protection", brand: "ARB", product_name: "Rock Sliders", notes: "Flat style, powder coated black" },
      { category: "Lighting", brand: "Stedi", product_name: "Type-X 8.5\" Sport Driving Lights" },
      { category: "Electrical", brand: "Redarc", product_name: "BCDC1225D + 120Ah AGM Second Battery" },
      { category: "Roof Racks", brand: "Rhino-Rack", product_name: "Pioneer Tradie Platform" },
      { category: "Touring", brand: "Darche", product_name: "Hi-View 2 Rooftop Tent" },
      { category: "Comms", brand: "Oricom", product_name: "UHF380 UHF CB Radio" },
    ],
  },
  {
    title: "The Stance Project — S15 Silvia",
    make: "Nissan", model: "200SX S15", year: 2001, style: "stance",
    location: "Gold Coast, QLD",
    description: "SR20DET on Garrett GT2871R making 280kW. Coilovers dialled for the flush look. This car sits in the garage and comes out for meets. And sometimes the track.",
    mods: [
      { category: "Suspension", brand: "BC Racing", product_name: "BR Series Coilovers", notes: "Custom spring rates 10kg/8kg" },
      { category: "Wheels", brand: "Work", product_name: "Meister S1 3P 18x9.5 +15 / 18x10.5 +12", notes: "Brushed silver step lip" },
      { category: "Tyres", brand: "Federal", product_name: "595 RS-PRO 225/35R18 / 255/35R18" },
      { category: "Exhaust", brand: "Tomei", product_name: "Expreme Ti Titanium Cat-Back" },
      { category: "Tune", brand: "Haltech", product_name: "Elite 2500 ECU + IC-7 Dash", shop_name: "Turbosmart Gold Coast", notes: "280kW on Garrett GT2871R" },
      { category: "Intake", brand: "Turbosmart", product_name: "Race Port BOV + Plenum Cooler" },
    ],
  },
  {
    title: "BT-50 Thunder — The Quiet Achiever",
    make: "Mazda", model: "BT-50 Thunder", year: 2022, style: "4wd",
    location: "Cairns, QLD",
    description: "Shared platform with the D-Max but a fraction of the attention. 2-inch lift, 33s, and a canopy setup that punches well above its price point. The underdog build.",
    mods: [
      { category: "Suspension", brand: "Ironman 4x4", product_name: "Nitro Gas 2\" Lift Kit", shop_name: "Ironman 4x4 Cairns" },
      { category: "Protection", brand: "Ironman 4x4", product_name: "Commercial Deluxe Bull Bar" },
      { category: "Wheels", brand: "Fuel", product_name: "Rebel D681 17x9 -12", notes: "Matte gunmetal" },
      { category: "Tyres", brand: "Toyo", product_name: "Open Country R/T 285/70R17", notes: "Rugged Terrain — best of both worlds" },
      { category: "Canopies", brand: "RSI", product_name: "SmartCanopy", notes: "Pop-up windows, interior lighting" },
      { category: "Electrical", brand: "Redarc", product_name: "BCDC1240D + 100Ah Lithium" },
      { category: "Touring", brand: "Engel", product_name: "MR40F Fridge" },
    ],
  },
  {
    title: "Barra Swapped XD Falcon",
    make: "Ford", model: "Falcon XD", year: 1982, style: "street",
    location: "Geelong, VIC",
    description: "XD shell, Barra turbo heart. Full cage, halved and tubbed. This started as a paddock basher and turned into a 400kW street weapon. Still registered.",
    mods: [
      { category: "Tune", brand: "Haltech", product_name: "Elite 2500 + IC-7 Dash", shop_name: "Castlemaine Rod Shop", notes: "Barra swap — 400kW on 15psi" },
      { category: "Exhaust", brand: "Pacemaker", product_name: "4-into-1 Extractors + 3.5\" Dump" },
      { category: "Suspension", brand: "Pedders", product_name: "Xa Coilovers + Watts Link Rear" },
      { category: "Wheels", brand: "Simmons", product_name: "OM-1 17x8 / 17x10 Staggered", notes: "Polished — old school correct" },
      { category: "Tyres", brand: "Mickey Thompson", product_name: "ET Street SS 275/40R17", notes: "Rear — street/strip" },
      { category: "Intake", brand: "Plazmaman", product_name: "Pro Series Intercooler + Piping" },
    ],
  },
  {
    title: "Troopy Life — HZJ78 Troop Carrier",
    make: "Toyota", model: "LandCruiser 78 Series Troopy", year: 2019, style: "4wd",
    location: "Darwin, NT",
    description: "The ultimate Australian touring rig. Full interior fit-out by a local Darwin shop. Sleeps two, carries everything, goes everywhere. This is home on wheels.",
    mods: [
      { category: "Suspension", brand: "Old Man Emu", product_name: "BP-51 Bypass Shocks + 2\" Lift" },
      { category: "Protection", brand: "ARB", product_name: "Sahara Bar" },
      { category: "Canopies", brand: "Alu-Cab", product_name: "Interior Fit-Out", shop_name: "Top End 4WD Darwin", notes: "Full bed, kitchen, overhead storage, 12V system" },
      { category: "Electrical", brand: "Redarc", product_name: "Manager30 + 2x 200Ah Lithium", notes: "600W solar on roof" },
      { category: "Wheels", brand: "Dynamic", product_name: "Steel 16x8 -22", notes: "White steelies — proper Troopy spec" },
      { category: "Tyres", brand: "BFGoodrich", product_name: "KO2 285/75R16" },
      { category: "Touring", brand: "Engel", product_name: "MT60FP + Engel Slide" },
      { category: "Comms", brand: "GME", product_name: "XRS-370C + AE4705 Antenna" },
      { category: "Intake", brand: "Safari Snorkel", product_name: "V-Spec Snorkel" },
      { category: "Recovery", brand: "Warn", product_name: "Zeon 10-S Winch" },
    ],
  },
  {
    title: "The Daily — WRX VA",
    make: "Subaru", model: "WRX", year: 2019, style: "street",
    location: "Canberra, ACT",
    description: "FA20DIT with intake, exhaust, and a conservative tune. Not trying to be a race car — just a quick daily that sounds good on cold start and handles properly in the Brindabellas.",
    mods: [
      { category: "Exhaust", brand: "Invidia", product_name: "R400 Cat-Back", notes: "Single exit — clean" },
      { category: "Intake", brand: "Cobb", product_name: "SF Intake + Airbox" },
      { category: "Tune", brand: "Cobb", product_name: "Accessport V3 + Stage 2 OTS Map", notes: "Pro tune booked — 220kW target" },
      { category: "Suspension", brand: "Whiteline", product_name: "Front + Rear Adjustable Sway Bars" },
      { category: "Suspension", brand: "KW", product_name: "V3 Coilovers", notes: "15mm drop" },
      { category: "Wheels", brand: "Enkei", product_name: "NT03+M 18x9.5 +40", notes: "Hyper silver" },
      { category: "Tyres", brand: "Michelin", product_name: "Pilot Sport 4S 255/35R18" },
    ],
  },
  {
    title: "Surf Rig — VW Amarok V6",
    make: "Volkswagen", model: "Amarok V6 TDI", year: 2023, style: "4wd",
    location: "Byron Bay, NSW",
    description: "The lifestyle rig. Soft-top canopy, surfboard racks, 2-inch lift for beach access. Drove it from Byron to Margaret River and back. Comfortable enough to do it again tomorrow.",
    mods: [
      { category: "Suspension", brand: "Bilstein", product_name: "B6 Off-Road 2\" Lift", shop_name: "Northern Rivers 4WD" },
      { category: "Wheels", brand: "Method", product_name: "MR316 17x8.5 0 Offset", notes: "Matte black" },
      { category: "Tyres", brand: "BFGoodrich", product_name: "KO2 265/70R17" },
      { category: "Roof Racks", brand: "Rhino-Rack", product_name: "Vortex RCH + Paddle Board Cradle" },
      { category: "Protection", brand: "Rival", product_name: "Alloy Underbody Skid Plates (3-piece)" },
      { category: "Canopies", brand: "Softopper", product_name: "Soft Top Canopy", notes: "Drops in 30 seconds for the long boards" },
      { category: "Touring", brand: "Dometic", product_name: "CFX3 45 Fridge", notes: "Slides out on ARB fridge slide" },
    ],
  },
  {
    title: "86 Track Weapon",
    make: "Toyota", model: "86 GTS", year: 2017, style: "street",
    location: "Phillip Island, VIC",
    description: "Dedicated track car that still drives to the circuit. Stripped interior, cage, and sticky rubber. 2:05 at Phillip Island on PS Cup 2. Street registered because driving there is half the fun.",
    mods: [
      { category: "Suspension", brand: "MCA", product_name: "Blue Series Coilovers", shop_name: "MCA Suspension", notes: "Custom valved for track" },
      { category: "Wheels", brand: "Enkei", product_name: "PF01 17x8 +35", notes: "Lightweight — 7.1kg each" },
      { category: "Tyres", brand: "Michelin", product_name: "Pilot Sport Cup 2 215/45R17" },
      { category: "Exhaust", brand: "Tomei", product_name: "Expreme Ti Cat-Back" },
      { category: "Intake", brand: "AVO", product_name: "Power Pipe Intake" },
      { category: "Suspension", brand: "Whiteline", product_name: "Full Anti-Roll Bar + Alignment Kit" },
    ],
  },
  {
    title: "Navara Warrior — Built by Premcar",
    make: "Nissan", model: "Navara N-Trek Warrior", year: 2021, style: "4wd",
    location: "Newcastle, NSW",
    description: "Factory Premcar Warrior with aftermarket additions. Cooper tyres for better highway comfort, long-range tank for the long way around. The Navara that actually works.",
    mods: [
      { category: "Protection", brand: "ARB", product_name: "Summit Bull Bar", shop_name: "ARB Newcastle" },
      { category: "Tyres", brand: "Cooper", product_name: "Discoverer AT3 XLT 275/70R17", notes: "Replaced the factory Cooper STT Pro — quieter" },
      { category: "Protection", brand: "Brown Davis", product_name: "Long Range Fuel Tank", notes: "140L — 1100km highway range" },
      { category: "Electrical", brand: "Redarc", product_name: "Tow-Pro Elite V3" },
      { category: "Roof Racks", brand: "Rhino-Rack", product_name: "Pioneer Platform + Backbone" },
      { category: "Touring", brand: "Darche", product_name: "Eclipse 270 Awning" },
      { category: "Recovery", brand: "Maxtrax", product_name: "MKII Jaxbase Recovery Kit" },
      { category: "Lighting", brand: "Lightforce", product_name: "Venom LED Driving Lights" },
    ],
  },
];

// We need a system user to own these. Create one if not exists.
async function getOrCreateSystemUser(sql: ReturnType<typeof getSql>) {
  const existing = await sql`SELECT id FROM users WHERE email = 'system@whipspec.com' LIMIT 1`;
  if (existing.length > 0) return existing[0].id;

  const rows = await sql`
    INSERT INTO users (name, email, password_hash, account_type, username, bio, location)
    VALUES ('WhipSpec', 'system@whipspec.com', 'no-login', 'creator', 'whipspec', 'The official WhipSpec account. Showcasing builds from across Australia.', 'Australia')
    ON CONFLICT (email) DO UPDATE SET name = 'WhipSpec'
    RETURNING id
  `;
  return rows[0].id;
}

export async function GET() {
  try {
    const sql = getSql();
    const userId = await getOrCreateSystemUser(sql);

    let created = 0;
    let skipped = 0;

    for (const build of SEED_BUILDS) {
      const slug = slugify(build.title);

      // Check if already exists
      const existing = await sql`SELECT id FROM builds WHERE slug LIKE ${slug.split('-').slice(0, 3).join('-') + '%'} AND user_id = ${userId} LIMIT 1`;
      if (existing.length > 0) { skipped++; continue; }

      const rows = await sql`
        INSERT INTO builds (user_id, title, slug, make, model, year, description, style, location, status)
        VALUES (${userId}, ${build.title}, ${slug}, ${build.make}, ${build.model}, ${build.year}, ${build.description}, ${build.style}, ${build.location}, 'published')
        RETURNING id
      `;

      const buildId = rows[0].id;

      for (let i = 0; i < build.mods.length; i++) {
        const m = build.mods[i];
        await sql`
          INSERT INTO build_mods (build_id, category, brand, product_name, shop_name, notes, sort_order)
          VALUES (${buildId}, ${m.category}, ${m.brand || null}, ${m.product_name || null}, ${m.shop_name || null}, ${m.notes || null}, ${i})
        `;

        // Auto-create shop tags for shops mentioned
        if (m.shop_name) {
          await sql`
            INSERT INTO shop_tags (build_id, tagged_by, shop_name, status)
            VALUES (${buildId}, ${userId}, ${m.shop_name}, 'pending')
            ON CONFLICT DO NOTHING
          `;
        }
      }

      created++;
    }

    return NextResponse.json({
      success: true,
      created,
      skipped,
      total: SEED_BUILDS.length,
      message: `Seeded ${created} builds (${skipped} already existed). Visit /discover to see them.`,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Seed failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
