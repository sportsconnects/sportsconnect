import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});


apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken")
      localStorage.removeItem("user")
      toast.error("Your session has expired. Please sign in again.")
      setTimeout(() => {
        window.location.href = "/signin"
      }, 1500) 
    }
    return Promise.reject(error)
  }
)


export const registerAthlete = (formData) =>
  apiClient.post("/auth/register/athlete", formData);

export const registerRecruiter = (formData) =>
  apiClient.post("/auth/register/recruiter", formData);

export const loginUser = (formData) =>
  apiClient.post("/auth/login", formData);

export const logoutUser = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  window.location.href = "/signin";
};


export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const getToken = () => localStorage.getItem("authToken");

export const isLoggedIn = () => !!localStorage.getItem("authToken");

// ── Athletes 
export const getAthletes = (params) =>
  apiClient.get("/athletes", { params });

export const getAthleteById = (id) =>
  apiClient.get(`/athletes/${id}`);

export const createAthleteProfile = (data) =>
  apiClient.post("/athletes/profile", data);

export const updateAthleteProfile = (data) =>
  apiClient.put("/athletes/profile", data);

// ── Recruiters ─
export const getRecruiterById = (id) =>
  apiClient.get(`/recruiters/${id}`);

export const createRecruiterProfile = (data) =>
  apiClient.post("/recruiters/profile", data);

export const updateRecruiterProfile = (data) =>
  apiClient.put("/recruiters/profile", data);

// ── Shortlists 
export const getShortlist = () =>
  apiClient.get("/shortlists");

export const addToShortlist = (athleteId) =>
  apiClient.post(`/shortlists/${athleteId}`);

export const updateShortlistItem = (athleteId, data) =>
  apiClient.patch(`/shortlists/${athleteId}`, data);

export const removeFromShortlist = (athleteId) =>
  apiClient.delete(`/shortlists/${athleteId}`);

// ── Offers 
export const sendOffer = (data) =>
  apiClient.post("/offers", data);

export const getOffers = () =>
  apiClient.get("/offers");

export const getOfferById = (id) =>
  apiClient.get(`/offers/${id}`);

export const updateOffer = (id, data) =>
  apiClient.patch(`/offers/${id}`, data);

export const deleteOffer = (id) =>
  apiClient.delete(`/offers/${id}`);

// ── Auth helpers 
export const isAthlete = () => {
  const user = getCurrentUser();
  return user?.role === "athlete";
};

export const isRecruiter = () => {
  const user = getCurrentUser();
  return user?.role === "recruiter";
};

export const setupRecruiterProfile = (data) =>
  apiClient.post("/recruiters/profile", data);

// -- Posts
export const getFeedPosts = (params) =>
  apiClient.get("/posts/feed", { params })

export const getAthletePostsById = (userId) =>
  apiClient.get(`/posts/athlete/${userId}`)

export const sharePost = (postId, caption = "") =>
  apiClient.post(`/posts/${postId}/share`, { caption })

export const createPost = (data) =>
  apiClient.post("/posts", data)

export const likePost = (postId) =>
  apiClient.patch(`/posts/${postId}/like`)

export const commentOnPost = (postId, text) =>
  apiClient.post(`/posts/${postId}/comment`, { text })

export const deletePost = (postId) =>
  apiClient.delete(`/posts/${postId}`)

// ── Follows
export const toggleFollow = (userId) =>
  apiClient.post(`/follows/${userId}`)

export const getFollowStatus = (userId) =>
  apiClient.get(`/follows/status/${userId}`)

export const getFollowing = (userId) =>
  apiClient.get(`/follows/following/${userId}`)

export const getFollowers = (userId) =>
  apiClient.get(`/follows/followers/${userId}`)

// --AI endpoint
export const chatWithAI = (messages, profile) =>
  apiClient.post("/ai/chat", { messages, profile })

// --Athlete Onboarding
export const setupAthleteProfile = (data) =>
  apiClient.post("/athletes/profile/setup", data)

// Messages
export const startConversation = (recipientId) =>
  apiClient.post("/messages/conversations", { recipientId })

export const getConversations = () =>
  apiClient.get("/messages/conversations")

export const getMessages = (conversationId) =>
  apiClient.get(`/messages/conversations/${conversationId}/messages`)

export const sendMessage = (conversationId, text) =>
  apiClient.post(`/messages/conversations/${conversationId}/messages`, { text })

export const getUnreadCount = () =>
  apiClient.get("/messages/unread")

export const deleteConversation = (conversationId) =>
  apiClient.delete(`/messages/conversations/${conversationId}`)

export const markConversationUnread = (conversationId) =>
  apiClient.patch(`/messages/conversations/${conversationId}/unread`)

//Notifications
export const getNotifications = (params) => apiClient.get("/notifications", { params })
export const markAllNotificationsRead = () => apiClient.patch("/notifications/read")
export const markNotificationRead = (id) => apiClient.patch(`/notifications/${id}/read`)

//Delete Account
export const deleteAccount = () => apiClient.delete("/auth/account")

//Filter search on Athlete Recruiters Tab
export const getRecruiters = (params) => apiClient.get("/recruiters", { params })