
const API_BASE_URL = "http://172.20.10.2:8080";

async function request(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "İstek sırasında hata oluştu.");
    }

    return data;
  } catch (error) {
    throw new Error(error.message || "Sunucuya bağlanılamadı.");
  }
}

export async function registerUser(name, email, password) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password
    })
  });
}

export async function loginUser(email, password) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password
    })
  });
}

export async function updateUser(id, name, email, password) {
  const body = {
    name,
    email
  };

  if (password) {
    body.password = password;
  }

  return request(`/auth/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(body)
  });
}

export async function deleteUser(id) {
  return request(`/auth/delete/${id}`, {
    method: "DELETE"
  });
}
