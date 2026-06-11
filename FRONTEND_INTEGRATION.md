# Frontend Integration Guide — giivngo

**Goal:** Replace all mock services with real API calls to giivngo-api backend.

**Timeline:** 3-5 days

---

## Quick Start

```bash
# Terminal 1: Start backend
cd giivngo-api
pnpm start:dev

# Terminal 2: Hydrate demo data
curl -X POST http://localhost:3001/seed/hydrate

# Terminal 3: Start frontend
cd giivngo
pnpm install axios  # NEW: add HTTP client
pnpm dev

# Browser: http://localhost:3000
# Test with demo users:
#   Email: alex@demo.local
#   Email: jordan@demo.local
```

---

## Step 1: Install Dependencies

```bash
cd giivngo
pnpm add axios
```

✅ **File created:** `src/lib/api.ts` — API client with automatic JWT injection

---

## Step 2: Update Environment Variables

Add to `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...  # From Stripe dashboard
```

---

## Step 3: Update Auth Store

**File:** `src/stores/auth.ts`

Replace mock auth with real API:

```typescript
import { authApi } from '@/lib/api';

export const useAuth = create<AuthState>((set) => ({
  signIn: async (email: string, password: string) => {
    try {
      const { access_token, user } = await authApi.signIn(email, password);
      
      // Store token locally
      localStorage.setItem('auth_token', access_token);
      localStorage.setItem('auth_user', JSON.stringify(user));
      
      set({ user, isAuthenticated: true });
      return true;
    } catch (error) {
      console.error('Sign in failed:', error);
      return false;
    }
  },

  signUp: async (email: string, password: string, name: string) => {
    try {
      const { access_token, user } = await authApi.signUp(email, password, name);
      
      localStorage.setItem('auth_token', access_token);
      localStorage.setItem('auth_user', JSON.stringify(user));
      
      set({ user, isAuthenticated: true });
      return true;
    } catch (error) {
      console.error('Sign up failed:', error);
      return false;
    }
  },

  signOut: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    set({ user: null, isAuthenticated: false });
  },

  // On app load, check if token exists
  checkAuth: async () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const user = await authApi.getMe();
        set({ user, isAuthenticated: true });
      } catch {
        localStorage.removeItem('auth_token');
        set({ user: null, isAuthenticated: false });
      }
    }
  },
}));
```

---

## Step 4: Update Campaigns Store

**File:** `src/stores/campaigns.ts`

Replace mock campaigns with real API:

```typescript
import { campaignsApi } from '@/lib/api';

export const useCampaigns = create<CampaignsState>((set) => ({
  campaigns: [],
  loadCampaigns: async () => {
    try {
      const campaigns = await campaignsApi.getAll();
      set({ campaigns });
    } catch (error) {
      console.error('Failed to load campaigns:', error);
    }
  },

  createCampaign: async (data: CreateCampaignInput) => {
    try {
      const newCampaign = await campaignsApi.create(data);
      set((state) => ({ campaigns: [...state.campaigns, newCampaign] }));
      return newCampaign;
    } catch (error) {
      console.error('Failed to create campaign:', error);
      throw error;
    }
  },

  updateCampaign: async (slug: string, data: UpdateCampaignInput) => {
    try {
      const updated = await campaignsApi.update(slug, data);
      set((state) => ({
        campaigns: state.campaigns.map((c) => (c.slug === slug ? updated : c)),
      }));
      return updated;
    } catch (error) {
      console.error('Failed to update campaign:', error);
      throw error;
    }
  },
}));
```

---

## Step 5: Stripe Integration

**Install Stripe.js:**

```bash
pnpm add @stripe/react-stripe-js @stripe/js
```

**Update checkout component:**

```typescript
import { loadStripe } from '@stripe/js';
import { Elements, CardElement, useStripe } from '@stripe/react-stripe-js';
import { contributionsApi } from '@/lib/api';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export function CheckoutForm({ campaignSlug }) {
  const stripe = useStripe();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Request PaymentIntent from backend
      const { clientSecret } = await contributionsApi.checkout(campaignSlug, {
        amount: 50,
        tipAmount: 5,
        contributorName: 'John Doe',
      });

      // Step 2: Confirm payment with Stripe.js
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: 'John Doe' },
        },
      });

      if (error) {
        alert(`Payment failed: ${error.message}`);
      } else if (paymentIntent.status === 'succeeded') {
        alert('Payment successful!');
        // Contribution created automatically via webhook
      }
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleCheckout}>
      <CardElement />
      <button type="submit" disabled={loading}>
        {loading ? 'Processing...' : 'Contribute'}
      </button>
    </form>
  );
}
```

---

## Step 6: File Uploads (Storage)

**Replace mock storage with real uploads:**

```typescript
import { storageApi } from '@/lib/api';

// Avatar upload
const handleAvatarUpload = async (file: File) => {
  try {
    const { url } = await storageApi.uploadAvatar(file);
    
    // Update profile with new avatar URL
    await profileApi.update({ avatarUrl: url });
    
    // Update local store
    set({ user: { ...user, avatarUrl: url } });
  } catch (error) {
    console.error('Avatar upload failed:', error);
  }
};

// Campaign cover photo
const handleCoverUpload = async (file: File) => {
  try {
    const { url } = await storageApi.uploadImage(file);
    return url; // Use in campaign creation
  } catch (error) {
    console.error('Cover upload failed:', error);
  }
};
```

---

## Step 7: Testing Integration

### Checklist

- [ ] **Auth Flow**
  - [ ] Sign up works (creates user in backend)
  - [ ] Sign in works (receives JWT token)
  - [ ] Token persists in localStorage
  - [ ] Sign out clears token
  - [ ] Protected pages redirect to /sign-in if no token

- [ ] **Campaigns**
  - [ ] Load campaigns shows all user campaigns
  - [ ] Create campaign creates in backend
  - [ ] Campaign details page loads from API
  - [ ] Update campaign persists to backend
  - [ ] Close campaign works

- [ ] **Contributions**
  - [ ] Checkout creates PaymentIntent
  - [ ] Stripe.js modal appears
  - [ ] Payment success creates contribution
  - [ ] Contribution appears in gift wall

- [ ] **Profile**
  - [ ] Get profile loads user data
  - [ ] Update profile saves to backend
  - [ ] Avatar upload works
  - [ ] Stripe Connect link generates

- [ ] **Error Handling**
  - [ ] Network errors show message
  - [ ] Invalid token redirects to sign-in
  - [ ] API errors don't crash app

---

## Step 8: Remove Mock Services

Once all integrations are tested, remove mock files:

```bash
# Delete mock services
rm src/lib/mock/auth.ts
rm src/lib/mock/stripe.ts
rm src/lib/mock/storage.ts
rm src/lib/mock/invites.ts

# Update imports to use real API instead
```

---

## Environment Variables

### Development (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=https://sphiudvihntcjbtnrvii.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Production

```env
NEXT_PUBLIC_API_URL=https://api.giivngo.com
NEXT_PUBLIC_SUPABASE_URL=https://sphiudvihntcjbtnrvii.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

---

## API Client Features

✅ **Automatic JWT injection** — All requests include auth token from localStorage

✅ **Error handling** — 401 redirects to sign-in, errors logged

✅ **Type-safe** — Full TypeScript support

✅ **Organized endpoints** — `authApi`, `campaignsApi`, `contributionsApi`, etc.

---

## Common Issues

### "Cannot find module 'axios'"
```bash
pnpm install axios
```

### "API returns 401"
- Token not being sent: Check localStorage.getItem('auth_token')
- Token expired: Sign in again
- Token invalid: Clear localStorage and sign up

### "Stripe payment fails"
- Missing publishable key: Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- Backend not receiving webhook: Check STRIPE_WEBHOOK_SECRET on backend

### "CORS errors"
- Set CORS_ORIGIN in backend .env to your frontend URL

---

## Next: Testing & Deployment

Once integration is complete:
1. Run full test suite (`pnpm test:e2e`)
2. Deploy to staging
3. Smoke test (create campaign, contribute, payout)
4. Deploy to production

---

**Time estimate:** 3-5 days for full integration + testing
