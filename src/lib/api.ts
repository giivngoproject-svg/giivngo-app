import axios, { AxiosInstance } from 'axios';
import process from 'process';
//import next .env NEXT_PUBLIC_API_URL

const API_URL = process.env.NEXT_PUBLIC_API_URL;
console.log("API WORK IN : ",API_URL)
/**
 * Transform API response from backend (camelCase) to frontend (snake_case)
 */
function transformUserFromApi(data: any) {
  return {
    id: data.id,
    email: data.email,
    name: data.name,
    display_name: data.displayName,
    avatar_url: data.avatarUrl,
    phone: data.phone,
    stripe_account_id: data.stripeAccountId,
    email_verified: data.emailVerified ?? false,
    created_at: data.createdAt,
  };
}

/**
 * Transform campaign response from backend (camelCase) to frontend (snake_case)
 */
function transformCampaignFromApi(data: any) {
  return {
    id: data.id,
    user_id: data.userId,
    title: data.title,
    description: data.description,
    type: data.type,
    goal_amount: data.goalAmount,
    raised_amount: data.raisedAmount,
    cover_photo_url: data.coverPhotoUrl,
    end_date: data.endDate,
    status: data.status,
    slug: data.slug,
    min_contribution: data.minContribution,
    max_contribution: data.maxContribution,
    organiser_name: data.organiserName,
    recipient_name: data.recipientName,
    pool_mode: data.poolMode,
    tiers: data.tiers,
    contribution_items: data.contributionItems,
    hide_until_birthday: data.hideUntilBirthday,
    show_on_search: data.showOnSearch ?? true,
    created_at: data.createdAt,
  };
}

/**
 * Transform contribution response from backend (camelCase) to frontend (snake_case)
 */
function transformContributionFromApi(data: any) {
  return {
    id: data.id,
    campaign_id: data.campaignId,
    contributor_name: data.contributorName,
    contributor_email: data.contributorEmail,
    amount: data.amount,
    tip_amount: data.tipAmount,
    message: data.message,
    emoji: data.emoji,
    photo_url: data.photoUrl,
    video_url: data.videoUrl,
    is_private: data.isPrivate,
    anonymous_avatar_id: data.anonymousAvatarId,
    anonymous_avatar: data.anonymousAvatar
      ? {
          id: data.anonymousAvatar.id,
          name: data.anonymousAvatar.name,
          imageUrl: data.anonymousAvatar.imageUrl,
          description: data.anonymousAvatar.description,
          color: data.anonymousAvatar.color,
        }
      : undefined,
    status: data.status,
    stripe_payment_id: data.stripePaymentId,
    selected_items: (data.selectedItems || []).map((item: any) => ({
      id: item.id,
      item_id: item.itemId,
      label: item.label,
      amount: item.amount,
    })),
    created_at: data.createdAt,
  };
}

/**
 * HTTP client for backend API calls
 * Automatically includes JWT token from localStorage
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Add JWT token to all requests (from localStorage)
 */
apiClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/**
 * Handle error responses globally
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error for debugging
    console.error('API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message,
      path: error.config?.url,
    });

    // Handle 401 (token expired/invalid) — only for protected endpoints
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        const url = error.config?.url || '';

        // List of public endpoints that don't require authentication
        // 401 on these is normal (user just isn't logged in), not an error
        const publicEndpoints = [
          '/campaigns', // GET /campaigns (list)
          '/campaigns/', // GET /campaigns/{slug}
        ];

        const isPublicEndpoint = publicEndpoints.some((endpoint) =>
          url.includes(endpoint)
        );

        // Only redirect to login if this is a PROTECTED endpoint
        // (i.e., the user WAS authenticated but token expired)
        if (!isPublicEndpoint) {
          // Import here to avoid circular dependency
          const { useAuth } = require('@/stores/auth');
          const auth = useAuth.getState();

          // Sign out user
          auth.signOut();

          const path = window.location.pathname;
          // Redirect to sign-in if not already there
          if (!path.startsWith('/sign-in') && !path.startsWith('/sign-up')) {
            window.location.href = '/sign-in?expired=true';
          }
        }
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Auth API calls
 */
export const authApi = {
  signUp: async (email: string, password: string, name: string, displayName?: string) => {
    const res = await apiClient.post('/auth/sign-up', {
      email,
      password,
      name,
      displayName,
    });
    return {
      access_token: res.data.access_token,
      user: transformUserFromApi(res.data.user),
    };
  },

  signIn: async (email: string, password: string) => {
    const res = await apiClient.post('/auth/sign-in', {
      email,
      password,
    });
    return {
      access_token: res.data.access_token,
      user: transformUserFromApi(res.data.user),
    };
  },

  googleSignIn: async (idToken: string) => {
    const res = await apiClient.post('/auth/google', {
      idToken,
    });
    return res.data;
  },

  getMe: async () => {
    const res = await apiClient.get('/auth/me');
    return transformUserFromApi(res.data);
  },

  verifyEmail: async (token: string) => {
    const res = await apiClient.post('/auth/verify-email', { token });
    return res.data;
  },

  resendVerification: async () => {
    const res = await apiClient.post('/auth/resend-verification');
    return res.data;
  },
};

/**
 * Campaign API calls
 */
export const campaignsApi = {
  getAll: async () => {
    const res = await apiClient.get('/campaigns');
    return res.data.map(transformCampaignFromApi);
  },

  create: async (campaignData: any) => {
    const res = await apiClient.post('/campaigns', campaignData);
    return transformCampaignFromApi(res.data);
  },

  getBySlug: async (slug: string) => {
    const res = await apiClient.get(`/campaigns/${slug}`);
    return transformCampaignFromApi(res.data);
  },

  update: async (slug: string, updates: any) => {
    const res = await apiClient.patch(`/campaigns/${slug}`, updates);
    return transformCampaignFromApi(res.data);
  },

  close: async (slug: string) => {
    const res = await apiClient.post(`/campaigns/${slug}/close`);
    return transformCampaignFromApi(res.data);
  },

  reactivate: async (slug: string, endDate: string) => {
    const res = await apiClient.post(`/campaigns/${slug}/reactivate`, {
      endDate,
    });
    return transformCampaignFromApi(res.data);
  },
};

/**
 * Contribution API calls
 */
export const contributionsApi = {
  getList: async (slug: string) => {
    const res = await apiClient.get(`/campaigns/${slug}/contributions`);
    return res.data.map(transformContributionFromApi);
  },

  checkout: async (slug: string, checkoutData: any) => {
    const res = await apiClient.post(`/campaigns/${slug}/checkout`, checkoutData);
    return res.data;
  },
};

/**
 * Profile API calls
 */
export const profileApi = {
  get: async () => {
    const res = await apiClient.get('/profile');
    return transformUserFromApi(res.data);
  },

  update: async (updates: any) => {
    const res = await apiClient.patch('/profile', updates);
    return transformUserFromApi(res.data);
  },

  connectStripe: async () => {
    const res = await apiClient.post('/profile/connect-stripe');
    return res.data;
  },

  getStripeStatus: async () => {
    const res = await apiClient.get('/profile/stripe/status');
    return res.data;
  },
};

/**
 * Invites API calls
 */
export const invitesApi = {
  getList: async (slug: string) => {
    const res = await apiClient.get(`/campaigns/${slug}/invites`);
    return res.data;
  },

  sendEmail: async (slug: string, recipients: string[]) => {
    const res = await apiClient.post(`/campaigns/${slug}/invites/email`, {
      recipients,
    });
    return res.data;
  },

  sendSms: async (slug: string, recipients: string[]) => {
    const res = await apiClient.post(`/campaigns/${slug}/invites/sms`, {
      recipients,
    });
    return res.data;
  },
};

/**
 * Storage API calls
 */
export const storageApi = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await apiClient.post('/storage/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  uploadVideo: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await apiClient.post('/storage/upload/video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await apiClient.post('/storage/upload/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};

export default apiClient;
