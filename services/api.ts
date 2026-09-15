const API_URL = "http://192.168.0.120:5000";

export async function updateUser(
  id: number,
  data: {
    name: string;
    email: string;
    phone: string;
  }
) {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
}