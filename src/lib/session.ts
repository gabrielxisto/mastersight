import api from "@/services/api.service";

export const verifyAuthentication = async() => {
  const response = await api.get('/users');

  if (response.status === 200) {
    return response.data.user
  };
  
  return null
}