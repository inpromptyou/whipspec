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

  // Add username column if missing
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(50) UNIQUE`;

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

  return { success: true, tables: ["users", "sessions", "waitlist", "shops", "brands", "builds", "build_mods", "inquiries"] };
}
