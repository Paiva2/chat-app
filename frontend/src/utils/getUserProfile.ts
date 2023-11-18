import api from "../lib/api"

export async function getUserProfile(token: string) {
  const getProfileRes = await api.get("/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return getProfileRes.data
}
