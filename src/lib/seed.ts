import type { Campaign, Contribution, User } from "./types";

const NOW = Date.now();
const DAY = 24 * 60 * 60 * 1000;
const iso = (offsetDays: number) => new Date(NOW + offsetDays * DAY).toISOString();

export const DEMO_USER: User = {
  id: "user_demo",
  email: "demo@giivngo.app",
  name: "Alex Morgan",
  display_name: "Alex",
  avatar_url: undefined,
  phone: "+61 400 111 222",
  stripe_account_id: undefined,
  created_at: iso(-30),
};

const otherOrganiser: User = {
  id: "user_other",
  email: "jamie@example.com",
  name: "Jamie Reeves",
  display_name: "Jamie",
  created_at: iso(-60),
};

export const SEED_USERS: User[] = [DEMO_USER, otherOrganiser];

export const SEED_CAMPAIGNS: Campaign[] = [
  {
    id: "camp_sarah",
    user_id: DEMO_USER.id,
    title: "Sarah's 30th birthday Bali fund",
    description:
      "We're sending Sarah to Bali for her big 3-0. Throw in whatever you can — flights and a beachfront villa are the goal. No pressure, every dollar helps.",
    type: "birthday",
    goal_amount: 4000,
    raised_amount: 2410,
    cover_photo_url:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=70",
    end_date: iso(12),
    status: "active",
    slug: "sarahs-30th",
    min_contribution: 10,
    recipient_name: "Sarah",
    pool_mode: "standard",
    organiser_name: "Alex Morgan",
    created_at: iso(-18),
  },
  {
    id: "camp_footy",
    user_id: DEMO_USER.id,
    title: "Office footy tipping syndicate 2026",
    description:
      "Same crew, new season. $50 buy-in, winner takes 70%, second 20%, third 10%. Tips locked Thursday 7pm AEST each round.",
    type: "footy_tipping",
    goal_amount: 1500,
    raised_amount: 1350,
    cover_photo_url:
      "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1200&q=70",
    end_date: iso(4),
    status: "active",
    slug: "footy-tipping-2026",
    pool_mode: "tiers",
    tiers: [50],
    organiser_name: "Alex Morgan",
    created_at: iso(-22),
  },
  {
    id: "camp_mike",
    user_id: DEMO_USER.id,
    title: "Mike's farewell collection",
    description:
      "After 8 years Mike's heading to Melbourne. Let's send him off with a proper gift — and a card with absolutely too many signatures.",
    type: "farewell",
    goal_amount: 800,
    raised_amount: 920,
    cover_photo_url:
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1200&q=70",
    end_date: iso(-2),
    status: "ended",
    slug: "mikes-farewell",
    min_contribution: 5,
    recipient_name: "Mike",
    pool_mode: "blind",
    organiser_name: "Alex Morgan",
    created_at: iso(-21),
  },
  {
    id: "camp_dinner",
    user_id: otherOrganiser.id,
    title: "End-of-year team dinner",
    description:
      "Booking the big table at Bistro Rex. Throw in your share and we'll cover drinks too.",
    type: "event_entry",
    goal_amount: 1200,
    raised_amount: 1240,
    cover_photo_url:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=70",
    end_date: iso(-15),
    status: "paid_out",
    slug: "team-dinner-eoy",
    min_contribution: 60,
    max_contribution: 80,
    pool_mode: "mystery",
    organiser_name: "Jamie Reeves",
    created_at: iso(-45),
  },
];

const portrait = (seed: number) =>
  `https://i.pravatar.cc/200?img=${seed}`;

export const SEED_CONTRIBUTIONS: Contribution[] = [
  // Sarah's 30th
  { id: "c1", campaign_id: "camp_sarah", contributor_name: "Priya Singh", amount: 200, tip_amount: 20, message: "Have the best time, queen!", emoji: "👑", photo_url: portrait(5), status: "succeeded", created_at: iso(-14) },
  { id: "c2", campaign_id: "camp_sarah", contributor_name: "Tom B.", amount: 150, message: "Can't wait to see the photos.", emoji: "📸", status: "succeeded", created_at: iso(-12) },
  { id: "c3", campaign_id: "camp_sarah", contributor_name: "Nina", amount: 80, tip_amount: 10, message: "Bintang on me 🍻", emoji: "🍻", photo_url: portrait(9), status: "succeeded", created_at: iso(-11) },
  { id: "c4", campaign_id: "camp_sarah", contributor_name: "Anonymous", amount: 500, status: "succeeded", created_at: iso(-9) },
  { id: "c5", campaign_id: "camp_sarah", contributor_name: "Ravi", amount: 60, message: "Send pics!", emoji: "🌴", photo_url: portrait(12), status: "succeeded", created_at: iso(-7) },
  { id: "c6", campaign_id: "camp_sarah", contributor_name: "Lou Lou", amount: 220, tip_amount: 15, message: "30 looks good on you.", emoji: "🥳", status: "succeeded", created_at: iso(-5) },
  { id: "c7", campaign_id: "camp_sarah", contributor_name: "Sam K.", amount: 100, message: "Margaritas in the villa!", emoji: "🍹", photo_url: portrait(15), status: "succeeded", created_at: iso(-3) },
  { id: "c8", campaign_id: "camp_sarah", contributor_name: "Beck", amount: 1100, tip_amount: 50, message: "From the whole Sydney crew x", emoji: "❤️", status: "succeeded", created_at: iso(-1) },

  // Footy tipping
  { id: "c9", campaign_id: "camp_footy", contributor_name: "Dec", amount: 50, status: "succeeded", created_at: iso(-19) },
  { id: "c10", campaign_id: "camp_footy", contributor_name: "Pri", amount: 50, status: "succeeded", created_at: iso(-19) },
  { id: "c11", campaign_id: "camp_footy", contributor_name: "Marco", amount: 50, status: "succeeded", created_at: iso(-18) },
  { id: "c12", campaign_id: "camp_footy", contributor_name: "Anya", amount: 50, status: "succeeded", created_at: iso(-18) },
  { id: "c13", campaign_id: "camp_footy", contributor_name: "Jules", amount: 50, status: "succeeded", created_at: iso(-17) },
  { id: "c14", campaign_id: "camp_footy", contributor_name: "Sam", amount: 50, status: "succeeded", created_at: iso(-15) },
  { id: "c15", campaign_id: "camp_footy", contributor_name: "Kim", amount: 50, status: "succeeded", created_at: iso(-14) },

  // Mike's farewell
  { id: "c16", campaign_id: "camp_mike", contributor_name: "Sarah", amount: 100, message: "We'll miss you mate.", photo_url: portrait(20), status: "succeeded", created_at: iso(-16) },
  { id: "c17", campaign_id: "camp_mike", contributor_name: "Dean", amount: 50, message: "Don't forget us in Melbourne!", status: "succeeded", created_at: iso(-15) },
  { id: "c18", campaign_id: "camp_mike", contributor_name: "Lena", amount: 120, message: "8 years of cracking work xx", photo_url: portrait(25), status: "succeeded", created_at: iso(-14) },
  { id: "c19", campaign_id: "camp_mike", contributor_name: "The Tuesday Crew", amount: 250, status: "succeeded", created_at: iso(-12) },
  { id: "c20", campaign_id: "camp_mike", contributor_name: "Anonymous", amount: 400, message: "Best of luck.", status: "succeeded", created_at: iso(-6) },

  // Team dinner (paid out)
  { id: "c21", campaign_id: "camp_dinner", contributor_name: "Alex", amount: 80, status: "succeeded", created_at: iso(-40) },
  { id: "c22", campaign_id: "camp_dinner", contributor_name: "Pri", amount: 80, status: "succeeded", created_at: iso(-40) },
  { id: "c23", campaign_id: "camp_dinner", contributor_name: "Marco", amount: 80, status: "succeeded", created_at: iso(-38) },
  { id: "c24", campaign_id: "camp_dinner", contributor_name: "Dec", amount: 70, status: "succeeded", created_at: iso(-37) },
  { id: "c25", campaign_id: "camp_dinner", contributor_name: "Lou", amount: 60, status: "succeeded", created_at: iso(-36) },
];
