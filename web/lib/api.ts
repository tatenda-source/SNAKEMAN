import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

// Snake data
export const getSnakes = () => api.get("/api/snakes").then((r) => r.data);
export const getSnake = (id: string) => api.get(`/api/snakes/${id}`).then((r) => r.data);

// Identification
export const identifySnake = async (imageFile: File, context?: string) => {
  const formData = new FormData();
  formData.append("image", imageFile);
  if (context) formData.append("context", context);
  return api.post("/api/identify/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((r) => r.data);
};

// Experts
export const getExperts = (availableOnly = false) =>
  api.get(`/api/experts/?available_only=${availableOnly}`).then((r) => r.data);

// Bookings
export const createBooking = (data: Record<string, unknown>) =>
  api.post("/api/bookings/", data).then((r) => r.data);

export const getAvailableSlots = (date: string, expertId?: string) => {
  const params = expertId ? `?date_str=${date}&expert_id=${expertId}` : `?date_str=${date}`;
  return api.get(`/api/bookings/slots/available${params}`).then((r) => r.data);
};

// Emergency
export const reportEmergency = (data: Record<string, unknown>) =>
  api.post("/api/emergency/report", data).then((r) => r.data);

// Content
export const getContent = (params?: Record<string, unknown>) =>
  api.get("/api/content/", { params }).then((r) => r.data);
