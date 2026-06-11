Please analyze and implement support for _multi-item campaign contributions_.

## Feature Overview

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
