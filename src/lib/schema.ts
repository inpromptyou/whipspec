import { getSql } from "./db";

export async function ensureTables() {
  const sql = getSql();

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      account_type VARCHAR(20) NOT NULL DEFAULT 'creator',
      avatar_url TEXT,
      bio TEXT,
      location VARCHAR(255),
      instagram VARCHAR(255),
      tiktok VARCHAR(255),
      website VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  // Add missing user columns
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(50) UNIQUE`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS facebook VARCHAR(255)`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS snapchat VARCHAR(255)`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS youtube VARCHAR(255)`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS twitter VARCHAR(255)`;

  await sql`
    CREATE TABLE IF NOT EXISTS sessions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token VARCHAR(512) UNIQUE NOT NULL,
      expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS waitlist (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS shops (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      description TEXT,
      location VARCHAR(255),
      services TEXT[] DEFAULT '{}',
      phone VARCHAR(50),
      email VARCHAR(255),
      instagram VARCHAR(255),
      tiktok VARCHAR(255),
      website VARCHAR(255),
      hero_image TEXT,
      gallery TEXT[] DEFAULT '{}',
      claimed BOOLEAN DEFAULT FALSE,
      verified BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS brands (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      description TEXT,
      category VARCHAR(100),
      website VARCHAR(255),
      logo_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS builds (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      make VARCHAR(100),
      model VARCHAR(100),
      year INTEGER,
      description TEXT,
      style VARCHAR(50),
      location VARCHAR(255),
      hero_image TEXT,
      gallery TEXT[] DEFAULT '{}',
      status VARCHAR(20) DEFAULT 'published',
      views INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS build_mods (
      id SERIAL PRIMARY KEY,
      build_id INTEGER NOT NULL REFERENCES builds(id) ON DELETE CASCADE,
      category VARCHAR(100) NOT NULL,
      brand VARCHAR(255),
      product_name VARCHAR(255),
      shop_id INTEGER REFERENCES shops(id) ON DELETE SET NULL,
      shop_name VARCHAR(255),
      link TEXT,
      notes TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS inquiries (
      id SERIAL PRIMARY KEY,
      shop_id INTEGER NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      car_details TEXT,
      message TEXT NOT NULL,
      budget VARCHAR(50),
      status VARCHAR(20) DEFAULT 'new',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  // Sponsorships system
  await sql`
    CREATE TABLE IF NOT EXISTS sponsorships (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      placement VARCHAR(50) NOT NULL,
      target_type VARCHAR(30),
      target_id INTEGER,
      daily_budget NUMERIC(10,2) NOT NULL,
      total_spent NUMERIC(10,2) DEFAULT 0,
      budget_cap NUMERIC(10,2),
      status VARCHAR(20) DEFAULT 'active',
      title VARCHAR(255),
      image_url TEXT,
      link_url TEXT,
      impressions INTEGER DEFAULT 0,
      clicks INTEGER DEFAULT 0,
      starts_at DATE DEFAULT CURRENT_DATE,
      ends_at DATE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  // Platform engagement metrics (daily snapshots for dynamic pricing)
  await sql`
    CREATE TABLE IF NOT EXISTS platform_metrics (
      id SERIAL PRIMARY KEY,
      date DATE UNIQUE NOT NULL DEFAULT CURRENT_DATE,
      total_views INTEGER DEFAULT 0,
      unique_visitors INTEGER DEFAULT 0,
      total_builds INTEGER DEFAULT 0,
      total_shops INTEGER DEFAULT 0,
      total_users INTEGER DEFAULT 0,
      engagement_score NUMERIC(8,2) DEFAULT 0,
      floor_price NUMERIC(10,2) DEFAULT 5.00,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  // Sponsorship events (impressions, clicks for billing)
  await sql`
    CREATE TABLE IF NOT EXISTS sponsorship_events (
      id SERIAL PRIMARY KEY,
      sponsorship_id INTEGER NOT NULL REFERENCES sponsorships(id) ON DELETE CASCADE,
      event_type VARCHAR(20) NOT NULL,
      metadata JSONB DEFAULT '{}',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  // Shop tags — shops tagged by creators that aren't registered yet (lead gen pipeline)
  await sql`
    CREATE TABLE IF NOT EXISTS shop_tags (
      id SERIAL PRIMARY KEY,
      build_id INTEGER NOT NULL REFERENCES builds(id) ON DELETE CASCADE,
      tagged_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      shop_name VARCHAR(255) NOT NULL,
      address VARCHAR(500),
      phone VARCHAR(50),
      website VARCHAR(255),
      email VARCHAR(255),
      google_place_id VARCHAR(255),
      shop_id INTEGER REFERENCES shops(id) ON DELETE SET NULL,
      status VARCHAR(20) DEFAULT 'pending',
      invite_sent_at TIMESTAMP WITH TIME ZONE,
      claimed_at TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  // Password resets
  await sql`
    CREATE TABLE IF NOT EXISTS password_resets (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      token VARCHAR(255) UNIQUE NOT NULL,
      expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
      used BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  // Stripe subscription columns
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255)`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_subscription_id VARCHAR(255)`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_plan VARCHAR(50)`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(20) DEFAULT 'inactive'`;

  return { success: true, tables: ["users", "sessions", "waitlist", "shops", "brands", "builds", "build_mods", "inquiries", "sponsorships", "platform_metrics", "sponsorship_events", "shop_tags", "password_resets"] };
}
