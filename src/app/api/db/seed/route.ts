import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { ensureTables } from "@/lib/schema";

const BRANDS = [
  // Bullbars, Protection, Recovery
  { name: "ARB", slug: "arb", category: "Protection", description: "Australia's leading 4x4 accessories manufacturer" },
  { name: "TJM", slug: "tjm", category: "Protection", description: "Bull bars, winches, recovery gear" },
  { name: "Ironman 4x4", slug: "ironman-4x4", category: "Protection", description: "4WD accessories and suspension" },
  { name: "MCC 4x4", slug: "mcc-4x4", category: "Protection", description: "Bull bars and protection" },
  { name: "Uneek 4x4", slug: "uneek-4x4", category: "Protection", description: "Premium bull bars and rock sliders" },
  { name: "Offroad Animal", slug: "offroad-animal", category: "Protection", description: "Heavy-duty bull bars and protection" },
  { name: "Rhino 4x4", slug: "rhino-4x4", category: "Protection", description: "Bull bars and accessories" },
  { name: "Maxtrax", slug: "maxtrax", category: "Recovery", description: "Vehicle recovery boards — Australian made" },
  { name: "Warn", slug: "warn", category: "Recovery", description: "Winches and recovery equipment" },
  { name: "Carbon Offroad", slug: "carbon-offroad", category: "Recovery", description: "Recovery gear and accessories" },

  // Suspension
  { name: "Old Man Emu", slug: "old-man-emu", category: "Suspension", description: "Premium 4WD suspension by ARB" },
  { name: "Dobinsons", slug: "dobinsons", category: "Suspension", description: "Springs and shock absorbers" },
  { name: "Tough Dog", slug: "tough-dog", category: "Suspension", description: "Australian-made 4WD suspension" },
  { name: "Pedders", slug: "pedders", category: "Suspension", description: "Suspension, brakes, and steering" },
  { name: "Bilstein", slug: "bilstein", category: "Suspension", description: "Performance shock absorbers" },
  { name: "King Springs", slug: "king-springs", category: "Suspension", description: "Australian-made coil springs" },
  { name: "Superior Engineering", slug: "superior-engineering", category: "Suspension", description: "Suspension lifts and 4WD engineering" },
  { name: "FOX", slug: "fox-shocks", category: "Suspension", description: "High-performance racing shocks" },
  { name: "Fulcrum Suspensions", slug: "fulcrum-suspensions", category: "Suspension", description: "Custom 4WD suspension solutions" },
  { name: "EFS", slug: "efs", category: "Suspension", description: "4WD suspension and accessories" },

  // Roof Racks, Canopies
  { name: "Rhino-Rack", slug: "rhino-rack", category: "Roof Racks", description: "Roof racks, bars, and cargo systems" },
  { name: "Front Runner", slug: "front-runner", category: "Roof Racks", description: "Expedition roof racks and vehicle gear" },
  { name: "Yakima", slug: "yakima", category: "Roof Racks", description: "Roof racks and outdoor transport" },
  { name: "Norweld", slug: "norweld", category: "Canopies", description: "Premium aluminium ute trays and canopies" },
  { name: "Utemaster", slug: "utemaster", category: "Canopies", description: "Ute lids, canopies, and cargo systems" },
  { name: "Alu-Cab", slug: "alu-cab", category: "Canopies", description: "Canopies and rooftop tents" },

  // Lighting
  { name: "STEDI", slug: "stedi", category: "Lighting", description: "LED driving lights and light bars — Australian" },
  { name: "Lightforce", slug: "lightforce", category: "Lighting", description: "Premium driving lights — Australian made" },
  { name: "Narva", slug: "narva", category: "Lighting", description: "Automotive and 4WD lighting" },
  { name: "Baja Designs", slug: "baja-designs", category: "Lighting", description: "Off-road LED lights" },
  { name: "Rigid Industries", slug: "rigid-industries", category: "Lighting", description: "LED light bars and off-road lighting" },

  // Electrical, Power
  { name: "Redarc", slug: "redarc", category: "Electrical", description: "Dual battery, solar, power management — Australian" },
  { name: "Enerdrive", slug: "enerdrive", category: "Electrical", description: "Lithium batteries and power systems" },
  { name: "Projecta", slug: "projecta", category: "Electrical", description: "Batteries, chargers, and power" },
  { name: "Baintech", slug: "baintech", category: "Electrical", description: "Lithium batteries and power solutions" },
  { name: "GME", slug: "gme", category: "Comms", description: "UHF radios and communication — Australian" },
  { name: "Cel-Fi", slug: "cel-fi", category: "Comms", description: "Mobile signal boosters" },

  // Snorkels, Intake
  { name: "Safari Snorkel", slug: "safari-snorkel", category: "Intake", description: "Vehicle snorkels — Australian made" },
  { name: "Direction Plus", slug: "direction-plus", category: "Intake", description: "Fuel and oil filtration kits" },

  // Towing
  { name: "Hayman Reese", slug: "hayman-reese", category: "Towing", description: "Tow bars and towing accessories" },

  // Touring, Camping
  { name: "Darche", slug: "darche", category: "Touring", description: "Swags, tents, and touring gear" },
  { name: "Oztent", slug: "oztent", category: "Touring", description: "30-second tents and camping gear" },
  { name: "23ZERO", slug: "23zero", category: "Touring", description: "Rooftop tents and swags" },
  { name: "Eezi-Awn", slug: "eezi-awn", category: "Touring", description: "Rooftop tents and awnings" },
  { name: "Engel", slug: "engel", category: "Touring", description: "Portable fridges and freezers" },
  { name: "Dometic", slug: "dometic", category: "Touring", description: "Fridges, coolers, and mobile living" },
  { name: "Drifta", slug: "drifta", category: "Touring", description: "Camp kitchens and storage solutions" },
  { name: "Clearview Mirrors", slug: "clearview-mirrors", category: "Touring", description: "Towing mirrors for utes and 4WDs" },

  // Wheels
  { name: "Method Race Wheels", slug: "method-race-wheels", category: "Wheels", description: "Off-road and street wheels" },
  { name: "Fuel Off-Road", slug: "fuel-off-road", category: "Wheels", description: "Off-road truck and 4WD wheels" },
  { name: "ROH", slug: "roh", category: "Wheels", description: "Australian wheel manufacturer" },
  { name: "Black Rhino", slug: "black-rhino", category: "Wheels", description: "Truck and off-road wheels" },
  { name: "Dynamic Wheels", slug: "dynamic-wheels", category: "Wheels", description: "Steel and alloy 4WD wheels" },

  // Tyres
  { name: "BFGoodrich", slug: "bfgoodrich", category: "Tyres", description: "All-terrain and mud-terrain tyres" },
  { name: "Mickey Thompson", slug: "mickey-thompson", category: "Tyres", description: "Performance and off-road tyres" },
  { name: "Toyo Tyres", slug: "toyo-tyres", category: "Tyres", description: "Open Country all-terrain and mud tyres" },
  { name: "Maxxis", slug: "maxxis", category: "Tyres", description: "Off-road and all-terrain tyres" },
  { name: "Cooper Tires", slug: "cooper-tires", category: "Tyres", description: "All-terrain truck tyres" },
  { name: "Falken", slug: "falken", category: "Tyres", description: "Wildpeak all-terrain tyres" },
  { name: "Nitto", slug: "nitto", category: "Tyres", description: "Trail and mud grappler tyres" },

  // Exhaust and Performance
  { name: "Manta Performance", slug: "manta-performance", category: "Exhaust", description: "Performance exhaust systems — Australian" },
  { name: "Redback Exhaust", slug: "redback-exhaust", category: "Exhaust", description: "4WD exhaust systems" },
  { name: "Torqit", slug: "torqit", category: "Exhaust", description: "Performance exhaust and intercoolers" },
  { name: "HPD", slug: "hpd", category: "Exhaust", description: "Intercoolers and diesel performance" },

  // Street / Show (Commodore, etc.)
  { name: "Simmons Wheels", slug: "simmons-wheels", category: "Wheels", description: "Classic Australian wheels" },
  { name: "Walkinshaw Performance", slug: "walkinshaw-performance", category: "Tune", description: "Holden/HSV performance packages" },
  { name: "Harrop Engineering", slug: "harrop-engineering", category: "Tune", description: "Superchargers and drivetrain — Australian" },
  { name: "XForce", slug: "xforce-exhaust", category: "Exhaust", description: "Performance exhaust systems" },
  { name: "KW Suspension", slug: "kw-suspension", category: "Suspension", description: "Coilovers and performance suspension" },
  { name: "BC Racing", slug: "bc-racing", category: "Suspension", description: "Coilovers and dampers" },
  { name: "Whiteline", slug: "whiteline", category: "Suspension", description: "Sway bars and chassis parts — Australian" },
];

export async function GET() {
  try {
    await ensureTables();

    const sql = getSql();

    let inserted = 0;
    for (const b of BRANDS) {
      try {
        await sql`
          INSERT INTO brands (name, slug, description, category)
          VALUES (${b.name}, ${b.slug}, ${b.description}, ${b.category})
          ON CONFLICT (slug) DO NOTHING
        `;
        inserted++;
      } catch {
        // skip duplicates
      }
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${inserted} brands`,
      total: BRANDS.length,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
