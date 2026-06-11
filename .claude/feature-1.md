# Giivngo new features request

## Request 1:

Please analyze and implement support for _multi-item campaign contributions_.

When a user creates a campaign, they should be able to add one or more contribution options, for example:

- Gift Fund — $50
- Drinks Package — $30
- Decorations — $20

During campaign setup, the creator should be able to click _"Add another item"_ and create multiple contribution options.

On the public campaign page, contributors should be able to:

1. Select one or more contribution options
2. Add them to a single cart
3. Complete a single checkout transaction

## Important

All funds should still be paid to the campaign creator as a single payout.

These are _not marketplace products_ and do not have separate recipients. They are simply contribution categories within a campaign that help contributors understand what their money is intended for.

## Required Process

Before making any code changes:

1. Analyze the current campaign creation flow
2. Analyze the campaign display page
3. Analyze the cart and checkout flow
4. Analyze the payment and payout flow
5. Propose the cleanest database/data model changes
6. Propose the implementation plan

After presenting the analysis and plan, proceed with implementation.

Please prioritize a solution that minimizes disruption to the existing payment and payout architecture.

## Request 2:

Add campaign privacy and post-campaign breakdown features.

Requirements:

Post-campaign creator breakdown
After a campaign ends, the campaign creator should see a clear breakdown of contributions.
Include:
Contributor name
Amount paid
Selected contribution item/product
Payment date
Private/public status
This should help the creator easily understand who paid for what.
Private contribution toggle
On the contributor checkout/contribution flow, add a toggle:
“Make my contribution private”
If enabled:
Hide the contributor’s name publicly.
Still show full details to the campaign creator in the private breakdown.
Birthday surprise toggle
During campaign creation/editing, add a toggle:
“Hide contributions, photos, and videos until the birthday”
If enabled:
Public visitors should not see contributions, photos, or videos before the birthday date.
Content should automatically become visible on the birthday date.
Campaign creator should still be able to manage/review everything privately.

Please inspect the current campaign creation, contribution, media upload, public campaign page, and creator dashboard flows before implementing. Then propose the cleanest data model and implementation plan before making changes.
