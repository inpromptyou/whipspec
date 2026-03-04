import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { ensureTables } from "@/lib/schema";

const BRANDS = [
  // Bullbars, Protection, Recovery
  { name: "ARB", slug: "arb", category: "Protection", description: "Australia's leading 4x4 accessories manufacturer", website: "arb.com.au" },
  { name: "TJM", slug: "tjm", category: "Protection", description: "Bull bars, winches, recovery gear", website: "tjm.com.au" },
  { name: "Ironman 4x4", slug: "ironman-4x4", category: "Protection", description: "4WD accessories and suspension", website: "ironman4x4.com" },
  { name: "MCC 4x4", slug: "mcc-4x4", category: "Protection", description: "Bull bars and protection", website: "mcc4x4.com.au" },
  { name: "Uneek 4x4", slug: "uneek-4x4", category: "Protection", description: "Premium bull bars and rock sliders", website: "uneek4x4.com.au" },
  { name: "Offroad Animal", slug: "offroad-animal", category: "Protection", description: "Heavy-duty bull bars and protection", website: "offroadanimal.com.au" },
  { name: "Rhino 4x4", slug: "rhino-4x4", category: "Protection", description: "Bull bars and accessories", website: "rhino4x4.com.au" },
  { name: "Maxtrax", slug: "maxtrax", category: "Recovery", description: "Vehicle recovery boards — Australian made", website: "maxtrax.com.au" },
  { name: "Warn", slug: "warn", category: "Recovery", description: "Winches and recovery equipment", website: "warn.com" },
  { name: "Carbon Offroad", slug: "carbon-offroad", category: "Recovery", description: "Recovery gear and accessories", website: "carbonoffroad.com.au" },

  // Suspension
  { name: "Old Man Emu", slug: "old-man-emu", category: "Suspension", description: "Premium 4WD suspension by ARB", website: "oldmanemu.com.au" },
  { name: "Dobinsons", slug: "dobinsons", category: "Suspension", description: "Springs and shock absorbers", website: "dobinsonsspring.com" },
  { name: "Tough Dog", slug: "tough-dog", category: "Suspension", description: "Australian-made 4WD suspension", website: "toughdog.com.au" },
  { name: "Pedders", slug: "pedders", category: "Suspension", description: "Suspension, brakes, and steering", website: "pedders.com.au" },
  { name: "Bilstein", slug: "bilstein", category: "Suspension", description: "Performance shock absorbers", website: "bilstein.com" },
  { name: "King Springs", slug: "king-springs", category: "Suspension", description: "Australian-made coil springs", website: "kingsprings.com" },
  { name: "Superior Engineering", slug: "superior-engineering", category: "Suspension", description: "Suspension lifts and 4WD engineering", website: "superiorengineering.com.au" },
  { name: "FOX", slug: "fox-shocks", category: "Suspension", description: "High-performance racing shocks", website: "ridefox.com" },
  { name: "Fulcrum Suspensions", slug: "fulcrum-suspensions", category: "Suspension", description: "Custom 4WD suspension solutions", website: "fulcrumsuspensions.com.au" },
  { name: "EFS", slug: "efs", category: "Suspension", description: "4WD suspension and accessories", website: "efs.com.au" },

  // Roof Racks, Canopies
  { name: "Rhino-Rack", slug: "rhino-rack", category: "Roof Racks", description: "Roof racks, bars, and cargo systems", website: "rhinorack.com.au" },
  { name: "Front Runner", slug: "front-runner", category: "Roof Racks", description: "Expedition roof racks and vehicle gear", website: "frontrunneroutfitters.com" },
  { name: "Yakima", slug: "yakima", category: "Roof Racks", description: "Roof racks and outdoor transport", website: "yakima.com.au" },
  { name: "Norweld", slug: "norweld", category: "Canopies", description: "Premium aluminium ute trays and canopies", website: "norweld.com.au" },
  { name: "Utemaster", slug: "utemaster", category: "Canopies", description: "Ute lids, canopies, and cargo systems", website: "utemaster.co.nz" },
  { name: "Alu-Cab", slug: "alu-cab", category: "Canopies", description: "Canopies and rooftop tents", website: "alu-cab.com" },

  // Lighting
  { name: "STEDI", slug: "stedi", category: "Lighting", description: "LED driving lights and light bars — Australian", website: "stedi.com.au" },
  { name: "Lightforce", slug: "lightforce", category: "Lighting", description: "Premium driving lights — Australian made", website: "lightforce.com" },
  { name: "Narva", slug: "narva", category: "Lighting", description: "Automotive and 4WD lighting", website: "narva.com.au" },
  { name: "Baja Designs", slug: "baja-designs", category: "Lighting", description: "Off-road LED lights", website: "bajadesigns.com" },
  { name: "Rigid Industries", slug: "rigid-industries", category: "Lighting", description: "LED light bars and off-road lighting", website: "rigidindustries.com" },

  // Electrical, Power, Comms
  { name: "Redarc", slug: "redarc", category: "Electrical", description: "Dual battery, solar, power management — Australian", website: "redarc.com.au" },
  { name: "Enerdrive", slug: "enerdrive", category: "Electrical", description: "Lithium batteries and power systems", website: "enerdrive.com.au" },
  { name: "Projecta", slug: "projecta", category: "Electrical", description: "Batteries, chargers, and power", website: "projecta.com.au" },
  { name: "Baintech", slug: "baintech", category: "Electrical", description: "Lithium batteries and power solutions", website: "baintech.com.au" },
  { name: "GME", slug: "gme", category: "Comms", description: "UHF radios and communication — Australian", website: "gme.net.au" },
  { name: "Cel-Fi", slug: "cel-fi", category: "Comms", description: "Mobile signal boosters", website: "cel-fi.com.au" },

  // Snorkels, Intake
  { name: "Safari Snorkel", slug: "safari-snorkel", category: "Intake", description: "Vehicle snorkels — Australian made", website: "safarisnorkel.com" },
  { name: "Direction Plus", slug: "direction-plus", category: "Intake", description: "Fuel and oil filtration kits", website: "directionplus.com.au" },

  // Towing
  { name: "Hayman Reese", slug: "hayman-reese", category: "Towing", description: "Tow bars and towing accessories", website: "haymanreese.com.au" },

  // Touring, Camping
  { name: "Darche", slug: "darche", category: "Touring", description: "Swags, tents, and touring gear", website: "darche.com.au" },
  { name: "Oztent", slug: "oztent", category: "Touring", description: "30-second tents and camping gear", website: "oztent.com.au" },
  { name: "23ZERO", slug: "23zero", category: "Touring", description: "Rooftop tents and swags", website: "23zero.com.au" },
  { name: "Eezi-Awn", slug: "eezi-awn", category: "Touring", description: "Rooftop tents and awnings", website: "eezi-awn.com" },
  { name: "Engel", slug: "engel", category: "Touring", description: "Portable fridges and freezers", website: "engelaustralia.com.au" },
  { name: "Dometic", slug: "dometic", category: "Touring", description: "Fridges, coolers, and mobile living", website: "dometic.com" },
  { name: "Drifta", slug: "drifta", category: "Touring", description: "Camp kitchens and storage solutions", website: "dfrockscoring.com.au" },
  { name: "Clearview Mirrors", slug: "clearview-mirrors", category: "Touring", description: "Towing mirrors for utes and 4WDs", website: "clearviewaccessories.com.au" },

  // Wheels
  { name: "Method Race Wheels", slug: "method-race-wheels", category: "Wheels", description: "Off-road and street wheels", website: "methodracewheels.com" },
  { name: "Fuel Off-Road", slug: "fuel-off-road", category: "Wheels", description: "Off-road truck and 4WD wheels", website: "fueloffroad.com" },
  { name: "ROH", slug: "roh", category: "Wheels", description: "Australian wheel manufacturer", website: "rohwheels.com.au" },
  { name: "Black Rhino", slug: "black-rhino", category: "Wheels", description: "Truck and off-road wheels", website: "blackrhinowheels.com" },
  { name: "Dynamic Wheels", slug: "dynamic-wheels", category: "Wheels", description: "Steel and alloy 4WD wheels", website: "dynamicwheels.com.au" },

  // Tyres
  { name: "BFGoodrich", slug: "bfgoodrich", category: "Tyres", description: "All-terrain and mud-terrain tyres", website: "bfgoodrichtires.com" },
  { name: "Mickey Thompson", slug: "mickey-thompson", category: "Tyres", description: "Performance and off-road tyres", website: "mickeythompsontires.com" },
  { name: "Toyo Tyres", slug: "toyo-tyres", category: "Tyres", description: "Open Country all-terrain and mud tyres", website: "toyotires.com" },
  { name: "Maxxis", slug: "maxxis", category: "Tyres", description: "Off-road and all-terrain tyres", website: "maxxis.com" },
  { name: "Cooper Tires", slug: "cooper-tires", category: "Tyres", description: "All-terrain truck tyres", website: "coopertire.com" },
  { name: "Falken", slug: "falken", category: "Tyres", description: "Wildpeak all-terrain tyres", website: "falkentire.com" },
  { name: "Nitto", slug: "nitto", category: "Tyres", description: "Trail and mud grappler tyres", website: "nittotire.com" },

  // Exhaust and Performance
  { name: "Manta Performance", slug: "manta-performance", category: "Exhaust", description: "Performance exhaust systems — Australian", website: "mantaperformance.com.au" },
  { name: "Redback Exhaust", slug: "redback-exhaust", category: "Exhaust", description: "4WD exhaust systems", website: "redbackexhaust.com.au" },
  { name: "Torqit", slug: "torqit", category: "Exhaust", description: "Performance exhaust and intercoolers", website: "torqit.com" },
  { name: "HPD", slug: "hpd", category: "Exhaust", description: "Intercoolers and diesel performance", website: "hpdiesel.com.au" },

  // Street / Show
  { name: "Simmons Wheels", slug: "simmons-wheels", category: "Wheels", description: "Classic Australian wheels", website: "simmonswheels.com.au" },
  { name: "Walkinshaw Performance", slug: "walkinshaw-performance", category: "Tune", description: "Holden/HSV performance packages", website: "walkinshawperformance.com.au" },
  { name: "Harrop Engineering", slug: "harrop-engineering", category: "Tune", description: "Superchargers and drivetrain — Australian", website: "harrop.com.au" },
  { name: "XForce", slug: "xforce-exhaust", category: "Exhaust", description: "Performance exhaust systems", website: "xforce.com.au" },
  { name: "KW Suspension", slug: "kw-suspension", category: "Suspension", description: "Coilovers and performance suspension", website: "kwsuspensions.net" },
  { name: "BC Racing", slug: "bc-racing", category: "Suspension", description: "Coilovers and dampers", website: "bcracing.com" },
  { name: "Whiteline", slug: "whiteline", category: "Suspension", description: "Sway bars and chassis parts — Australian", website: "whiteline.com.au" },
];

export async function GET() {
  try {
    await ensureTables();
    const sql = getSql();

    // Add logo_url and website columns if missing
    await sql`ALTER TABLE brands ADD COLUMN IF NOT EXISTS website VARCHAR(255)`;
    await sql`ALTER TABLE brands ADD COLUMN IF NOT EXISTS logo_url TEXT`;

    let inserted = 0;
    for (const b of BRANDS) {
      const logoUrl = `https://logo.clearbit.com/${b.website}`;
      try {
        await sql`
          INSERT INTO brands (name, slug, description, category, website, logo_url)
          VALUES (${b.name}, ${b.slug}, ${b.description}, ${b.category}, ${b.website}, ${logoUrl})
          ON CONFLICT (slug) DO UPDATE SET
            website = EXCLUDED.website,
            logo_url = EXCLUDED.logo_url
        `;
        inserted++;
      } catch {
        // skip errors
      }
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${inserted} brands with logos`,
      total: BRANDS.length,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
