import api from "@/http/api";

/* =========================
   ADMIN APIs
========================= */

export const getAdminStats = async () => {
  const res = await api.get("/api/admin/stats");
  return res.data;
};

/* =========================
   ADMIN USERS
========================= */

export const getAllUsers = async () => {
  const res = await api.get("/api/admin/users");
  return res.data;
};

export const deleteUser = async (userId: string) => {
  const res = await api.delete(`/api/admin/users/${userId}`);
  return res.data;
};
