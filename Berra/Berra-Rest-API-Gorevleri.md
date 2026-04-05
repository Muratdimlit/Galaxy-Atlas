

# Berra Doğruer - REST API Görevleri

**API Test Videosu:** [https://www.youtube.com/watch?v=UjCMixEtSC4](https://www.youtube.com/watch?v=UjCMixEtSC4)

**API Adresi:** [https://galaxy-atlas-pearl.vercel.app](https://galaxy-atlas-pearl.vercel.app)

---

## 1. Favoriye Ekleme

- **Endpoint:** `POST /favorites`
- **Authentication:** Bearer Token gerekli
- **Request Body:**

```json
{
  "userId": 1,
  "spaceObjectId": 2
}
```

- **Response:** `201 Created`

---

## 2. Favoriden Çıkarma

- **Endpoint:** `DELETE /favorites/{id}`
- **Authentication:** Bearer Token gerekli

- **Response:** `200 OK`

---

## 3. Favori Listesini Görüntüleme

- **Endpoint:** `GET /favorites?userId=1`
- **Authentication:** Bearer Token gerekli

- **Response:**

```json
[
  {
    "id": 10,
    "userId": 1,
    "spaceObjectId": 2,
    "createdAt": "2026-04-04T11:00:00Z"
  }
]
```

---

## 4. Harita Üzerinde Asteroid Gösterme

- **Endpoint:** `GET /map/asteroids`
- **Authentication:** Gerekli değil

- **Response:**

```json
[
  {
    "id": 3,
    "name": "Apophis",
    "type": "ASTEROID",
    "latitude": 10.0,
    "longitude": 20.0
  }
]
```

---

## 5. Harita Üzerinde Uydu Gösterme

- **Endpoint:** `GET /map/satellites`
- **Authentication:** Gerekli değil

- **Response:**

```json
[
  {
    "id": 1,
    "name": "Hubble",
    "type": "UYDU",
    "latitude": 28.5,
    "longitude": -80.6
  }
]
```

---

## 6. Harita Üzerinde Roket Gösterme

- **Endpoint:** `GET /map/rockets`
- **Authentication:** Gerekli değil

- **Response:**

```json
[
  {
    "id": 2,
    "name": "Falcon 9",
    "type": "ROKET",
    "latitude": 34.7,
    "longitude": -120.6
  }
]
```

---

## 7. Yorum Yapma

- **Endpoint:** `POST /comments`
- **Authentication:** Bearer Token gerekli
- **Request Body:**

```json
{
  "userId": 1,
  "spaceObjectId": 2,
  "content": "Bu nesnenin yörünge bilgileri çok ilginç."
}
```

- **Response:** `201 Created`

---

## 8. Yorum Güncelleme

- **Endpoint:** `PUT /comments/edit/{id}`
- **Authentication:** Bearer Token gerekli
- **Request Body:**

```json
{
  "content": "Yorumu güncelledim, yeni bilgiler eklendi."
}
```

- **Response:** `200 OK`

---

## 9. Yorum Silme

- **Endpoint:** `DELETE /comments/edit/{id}`
- **Authentication:** Bearer Token gerekli

- **Response:** `200 OK`
