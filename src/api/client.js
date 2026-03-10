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
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);


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

export const addToShortlist = (data) =>
  apiClient.post("/shortlists", data);

export const updateShortlistEntry = (athleteId, data) =>
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

export const respondToOffer = (id, data) =>
  apiClient.patch(`/offers/${id}`, data);

export const withdrawOffer = (id) =>
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