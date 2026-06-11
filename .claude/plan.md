Developer Overview
Group money pooling platform — Phase 1 MVP


Document
Developer Overview — Phase 1 MVP
Version
1.0
Scope
Phase 1 — Consumer free tier only
Stack
Next.js App Router, TypeScript, Supabase, Stripe Connect, Clerk, Twilio, Resend
Hosting
Vercel (frontend + API), Supabase (DB), Upstash Redis (queues)
Status
Ready for estimation

Glossary:
https://upstash.com/
https://clerk.com/
https://www.twilio.com/en-us
https://resend.com/

What Is It
A group money pooling platform — not a charity or gift site
Organisers create a campaign, share a link, collect contributions, get paid out automatically
Built for Australian market — no equivalent product exists locally
Use cases: birthday trip funds, footy tipping pools, office lotto syndicates, farewell collections, group event entry, anything custom
Contributors do not need an account — pay via a public link
Funds held in Stripe escrow and released automatically on campaign end date


Core Pages / Screens
1. Landing Page  (/) (2d)
Value proposition, use case examples, Sign Up and Log In CTAs
No auth required to view
2. Auth  (/sign-up, /sign-in) (2d)
Handled by Supabase — email/password, Google, Apple Sign-In
Email verification on sign-up
Forgot password / reset flow
3. Dashboard  (/dashboard) (2d)
Lists all campaigns the user has created
Campaign cards: title, cover photo, progress bar, days remaining, status badge
Create Campaign CTA prominent at top
4. Campaign Creation Wizard  (/create)  (2d)
Step 1 — Basics: title, type, description, cover photo upload
Step 2 — Goal & timing: target amount (optional), end date, min/max contribution
Step 3 — Preview & publish
On publish: unique slug assigned (e.g. app.com/campaign/sarahs-30th)
5. Organiser Campaign Manager  (/manage/[slug]) (2d)
Resume
- Stats: total raised, contributor count, days remaining
- Contributor table: name, amount, date, message
Actions:
- Invite panel: email, SMS, WhatsApp share (Campaign URL)
- Edit campaign details, extend end date, close campaign early
- Copy shareable link
6. Public Campaign Page  (/campaign/[slug]) (3d)
Conditions:
No login required
Preview:
Shows: cover photo, title, organiser name, description, goal, progress bar, contributors
Contribution form: amount, name (optional), message/note (optional)
Photo upload — contributor can attach a personal photo (jpg/png) alongside their contribution
→  Photo stored in Supabase Storage, displayed on the campaign page alongside contributor's name and note
Actions:
Stripe Checkout — card, Apple Pay, Google Pay
Post-payment confirmation screen + email receipt to contributor
7. User Profile  (/profile)
Edit name, display name, photo, mobile number
View campaign history and contribution history
Connect bank account via Stripe Connect Express


Key Flows
Campaign Creation → Publish
User completes 3-step wizard → campaign published → unique URL generated → redirected to /manage/[slug]
Contribution Flow
Visitor opens campaign link → enters amount + optional name/message → optionally uploads a personal photo → Stripe Checkout → payment confirmed → receipt emailed → contribution recorded in DB
→  Uploaded photo and note displayed publicly on campaign page alongside contributor name after payment confirmed
Payout Flow
Campaign end date hits → BullMQ job fires → checks organiser has bank account connected
→  If no bank account: prompt organiser to connect via Stripe Connect Express first
Stripe Transfer executed from platform account to organiser connected account
2.5% platform fee deducted at transfer
Payout confirmation email sent to organiser
Campaign status updated to Paid Out
Invite Flow
Organiser enters email addresses → Resend dispatches branded invite email with campaign link
Organiser enters phone numbers → Twilio dispatches SMS with campaign link
WhatsApp: one-tap opens wa.me share URL — no API required
Copy link: clipboard copy for manual sharing


Core Data Models
User
id, email, name, display_name, avatar_url, phone, stripe_account_id, created_at
Campaign
id, user_id, title, description, type, goal_amount, raised_amount, cover_photo_url
end_date, status (active / ended / paid_out), slug, min_contribution, max_contribution, created_at
Contribution
id, campaign_id, contributor_name, contributor_email, amount, message
photo_url (Supabase Storage path — optional), stripe_payment_intent_id, status, created_at
Invite
id, campaign_id, channel (email | sms | whatsapp), recipient, sent_at, status
Payout
id, campaign_id, amount, fee_amount, net_amount, stripe_transfer_id, status, processed_at


Tech Stack — Phase 1
Frontend & Framework
Next.js 14 (App Router)  +  TypeScript
Tailwind CSS — all styling
Zustand — campaign wizard state
React Hook Form + Zod — form validation
Backend
Next.js API Routes — serverless API layer
Prisma ORM — database access
BullMQ + Upstash Redis — scheduled jobs (campaign expiry, payout triggers)
Database & Storage
PostgreSQL via Supabase — primary database
Supabase Storage — campaign photo uploads
Upstash Redis — queue backend + rate limiting
Auth
Clerk — email, Google, Apple Sign-In
Clerk Webhooks — sync new users to DB
Payments
Stripe Connect Express — organiser bank account onboarding
Stripe Payment Intents — contribution processing
Stripe Webhooks — real-time payment and payout status updates
Notifications & Comms
Resend — transactional email (invites, receipts, payout confirmations)
Twilio SMS — campaign invite dispatch
WhatsApp — wa.me URL scheme, no API required
Hosting & Monitoring
Vercel — frontend and API hosting
Sentry — error tracking
PostHog — product analytics and funnel tracking


Out of Scope — Phase 1
Company workspaces / multi-user org accounts
Recurring campaigns
Message wall / reactions
Campaign matching / sponsor pledges
Split the bill mode
QR code generation
PDF contribution receipts
White label / custom domain
Native iOS / Android app
Stripe Identity KYC
B2B subscription billing





[APP NAME]   |   Developer Overview
Phase 2 — B2B Organisational Layer


Document
Developer Overview — Phase 2 B2B Layer
Version
1.0
Scope
B2B SaaS layer — builds on top of Phase 1 infrastructure
Dependency
Phase 1 must be fully live before Phase 2 build begins
Status
Scoped — not yet active



What Is Phase 2
Adds an organisational (B2B) layer on top of the existing Phase 1 consumer product
Businesses — HR teams, office managers, sports clubs — get a company workspace
All Phase 1 functionality remains unchanged — Phase 2 is purely additive
Key architectural change: Organisation entity sits above User in the data model
Campaigns can belong to either an individual (Phase 1) or an organisation (Phase 2)
Introduces subscription billing on top of the existing 2.5% transaction fee


New Pages / Screens — Phase 2
1. Organisation Onboarding  (/org/create)
Company name, logo upload, billing email
Stripe subscription plan selection at onboarding
First admin user linked to the org on creation
2. Organisation Dashboard  (/org/dashboard)
Admin view of all campaigns running across the organisation
Summary stats: total raised org-wide, active campaigns, total contributors
Campaign cards filterable by status, creator, date
Invite team members to the workspace
3. Team Management  (/org/team)
Admin can invite members via email — they join the org workspace
Role management: Admin or Member
Admin: can view all campaigns, manage billing, invite/remove members
Member: can create and manage their own campaigns under the org brand
4. Branded Campaign Pages
Org campaigns display company logo and accent colour on public campaign page
Organiser's name replaced with company display name if set
No platform branding on white label tier
5. Finance & Export  (/org/finance)
Full transaction history across all org campaigns
Export CSV or PDF — line items per contribution, per campaign, date range filter
Payout history with Stripe transfer IDs
Useful for payroll teams reconciling farewell funds and event costs
6. Subscription & Billing  (/org/billing)
Current plan, next billing date, payment method
Upgrade / downgrade plan
Invoice history


Key Flows — Phase 2
Org Onboarding
Admin signs up or logs in → creates organisation → uploads logo → selects subscription plan → Stripe billing activated → redirected to org dashboard
Team Member Invite
Admin enters email → invite sent via Resend → recipient clicks link → signs up or logs in → automatically joined to org workspace
Org Campaign Creation
Member creates campaign from within org workspace → campaign inherits org branding → appears in org admin dashboard alongside all other campaigns
Finance Export
Admin selects date range and campaign filter → platform generates CSV or PDF → downloaded instantly
→  PDF receipts per contributor also available on Business and Enterprise tiers


New Data Models — Phase 2
Organisation
id, name, logo_url, billing_email, stripe_customer_id, stripe_subscription_id
plan (business | enterprise), status (active | cancelled), created_at
OrganisationMember
id, org_id, user_id, role (admin | member), joined_at
Campaign — Updated
org_id (FK, nullable) added — null = individual campaign, set = org campaign


Additional Tech — Phase 2
Stripe Billing — subscription management for Business and Enterprise tiers
Stripe Customer Portal — self-serve plan changes and invoice access
PDFKit or similar — PDF receipt and export generation
SSO / SAML integration — Okta and Azure AD for Enterprise tier
Custom domain routing — subdomain or CNAME support for white label
Resend — additional email templates for team invites, billing receipts, org notifications


Out of Scope — Phase 2
Native iOS / Android app
Recurring campaign automation
Campaign matching / sponsor pledges
Public API for third-party integrations
In-app messaging between org members


Next Steps for Dev — Phase 2
Phase 1 must be fully live and stable before Phase 2 scoping begins
Review Phase 2 overview and flag any architecture conflicts with Phase 1 decisions
Confirm SSO library and custom domain approach early — these have longest lead time
Provide separate time and cost estimate for Phase 2 once Phase 1 estimate is agreed

Full functional specification with complete Phase 1 and Phase 2 detail available on request.



Monetisation — Phase 1
2.5% platform fee deducted from total raised at payout
Stripe transaction fees (~1.75% + 30c AU) passed through to contributor at checkout
No subscription or paywalls at Phase 1 — free to create and contribute


Next Steps for Dev
Review this document and raise any questions or ambiguities
Confirm tech stack or propose alternatives with rationale
Provide time and cost estimate broken down by section
Agree on MVP scope — minimum viable feature set for first public launch
Agree sprint structure and delivery milestones

Full functional specification with complete feature detail, extended monetisation models, and Phase 2 B2B overview available on request.

