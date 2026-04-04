# Murat Dimlit - REST API Görevleri

**API Test Videosu:** Link buraya eklenecek

**API Adresi:** [https://galaxy-atlas-backend.onrender.com](https://galaxy-atlas-backend.onrender.com)

---

## 1. Hesap Oluşturma

- **Endpoint:** `POST /auth/register`
- **Authentication:** Gerekli değil
- **Request Body:**

```json
{
  "firstName": "Murat",
  "lastName": "Dimlit",
  "email": "murat@example.com",
  "password": "123456"
}
```

- **Response:** `201 Created`

---

## 2. Giriş Yapma

- **Endpoint:** `POST /auth/login`
- **Authentication:** Gerekli değil
- **Request Body:**

```json
{
  "email": "murat@example.com",
  "password": "123456"
}
```

- **Response:**

```json
{
  "token": "jwt_token"
}
```

---

## 3. Hesap Bilgilerini Güncelleme

- **Endpoint:** `PUT /users/{userId}`
- **Authentication:** Bearer Token gerekli
- **Request Body:**

```json
{
  "firstName": "YeniAd",
  "lastName": "YeniSoyad",
  "email": "yeni@example.com",
  "password": "yenisifre123"
}
```

- **Response:** `200 OK`

---

## 4. Hesap Silme

- **Endpoint:** `DELETE /users/{userId}`
- **Authentication:** Bearer Token gerekli

- **Response:** `200 OK`

---

## 5. Uzay Nesnelerini Listeleme

- **Endpoint:** `GET /space-objects`
- **Authentication:** Gerekli değil

- **Response:**

```json
[
  {
    "id": 1,
    "name": "Hubble",
    "type": "UYDU",
    "description": "Dünya yörüngesinde gözlem yapan gelişmiş uzay teleskobu.",
    "latitude": 28.5,
    "longitude": -80.6
  },
  {
    "id": 2,
    "name": "Falcon 9",
    "type": "ROKET",
    "description": "Yeniden kullanılabilir roket.",
    "latitude": 34.7,
    "longitude": -120.6
  }
]
```

---

## 6. Uzay Nesnesi Detay Görüntüleme

- **Endpoint:** `GET /space-objects/{id}`
- **Authentication:** Gerekli değil

- **Response:**

```json
{
  "id": 1,
  "name": "Hubble",
  "type": "UYDU",
  "description": "Dünya yörüngesinde gözlem yapan gelişmiş uzay teleskobu.",
  "latitude": 28.5,
  "longitude": -80.6
}
```

---

## 7. Uzay Nesnelerini Karşılaştırma

- **Endpoint:** `GET /space-objects/compare?ids=1,2`
- **Authentication:** Gerekli değil

- **Response:**

```json
{
  "comparedObjects": [
    {
      "id": 1,
      "name": "Hubble",
      "type": "UYDU"
    },
    {
      "id": 2,
      "name": "Falcon 9",
      "type": "ROKET"
    }
  ],
  "comparisonCriteria": [
    "name",
    "type",
    "latitude",
    "longitude",
    "description"
  ]
}
```

---

## 8. Filtreleme Yapma

- **Endpoint:** `GET /space-objects/filter?type=ASTEROID`
- **Authentication:** Gerekli değil

- **Response:**

```json
[
  {
    "id": 3,
    "name": "Apophis",
    "type": "ASTEROID",
    "description": "Dünya'ya yakın geçişleriyle dikkat çeken gök cismi.",
    "latitude": 10.0,
    "longitude": 20.0
  }
]
```
