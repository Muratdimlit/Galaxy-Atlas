
const API_BASE_URL = "http://172.20.10.7:8080";

async function request(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    });

    let data = null;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      throw new Error(data?.message || "İstek sırasında hata oluştu.");
    }

    return data;
  } catch (error) {
    throw new Error(error.message || "Sunucuya bağlanılamadı.");
  }
}

// R1 - Hesap oluşturma
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

// R2 - Giriş yapma
export async function loginUser(email, password) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password
    })
  });
}

// R3 - Profil güncelleme
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

// R4 - Hesap silme
export async function deleteUser(id) {
  return request(`/auth/delete/${id}`, {
    method: "DELETE"
  });
}

// R5 - Uzay nesnelerini listeleme
export async function getSpaceObjects() {
  return request("/space-objects");
}

// R6 - Uzay nesnesi detay görüntüleme
export async function getSpaceObjectById(id) {
  return request(`/space-objects/${id}`);
}

// R7 - Uzay nesnelerini karşılaştırma
export async function compareSpaceObjects(id1, id2) {
  return request(`/space-objects/compare?id1=${id1}&id2=${id2}`);
}

// R8 - Filtreleme
export async function filterSpaceObjects(type) {
  if (type === "ASTEROID") {
    return request("/space-objects/asteroids");
  }

  if (type === "SATELLITE") {
    return request("/space-objects/satellites");
  }

  if (type === "ROCKET") {
    return request("/space-objects/rockets");
  }

  return request("/space-objects");
}

// R9 - Favoriye ekleme
export async function addFavorite(userId, spaceObjectId) {
  return request("/favorites", {
    method: "POST",
    body: JSON.stringify({
      userId,
      spaceObjectId
    })
  });
}

// R10 - Favoriden çıkarma
export async function removeFavorite(userId, spaceObjectId) {
  return request(`/favorites?userId=${userId}&spaceObjectId=${spaceObjectId}`, {
    method: "DELETE"
  });
}

// R11 - Favori listesini görüntüleme
export async function getFavoritesByUser(userId) {
  return request(`/favorites/${userId}`);
}

// R15 - Yorum yapma
export async function addComment(userId, spaceObjectId, content) {
  return request("/comments", {
    method: "POST",
    body: JSON.stringify({
      userId,
      spaceObjectId,
      content
    })
  });
}

// R15/R16 - Yorumları görüntüleme
export async function getCommentsBySpaceObject(spaceObjectId) {
  return request(`/comments/${spaceObjectId}`);
}

// R16 - Yorum güncelleme
export async function updateComment(commentId, content) {
  return request(`/comments/${commentId}`, {
    method: "PUT",
    body: JSON.stringify({
      content
    })
  });
}

// R16 - Yorum silme
export async function deleteComment(commentId) {
  return request(`/comments/${commentId}`, {
    method: "DELETE"
  });
}