# Berra Doğruer - REST API Görevleri

*API Test Videosu:* Link buraya eklenecek

*API Adresi:* https://galaxy-atlas-pearl.vercel.app

---

## 1. Favoriye Ekleme

- Endpoint: POST /favorites
- Authentication: Bearer Token gerekli
- **Request Body:**

```json
{
  "userId": 1,
  "spaceObjectId": 2
}
```

- Response: 201 Created

---

## 2. Favoriden Çıkarma

- Endpoint: DELETE /favorites/{id}
- Authentication: Bearer Token gerekli
- Response: 200 OK

---

## 3. Favori Listesini Görüntüleme

- Endpoint: GET /favorites?userId=1
- Authentication: Bearer Token gerekli
- Response: 200 OK

---

## 4. Harita Üzerinde Asteroid Gösterme

- Endpoint: GET /map/asteroids
- Response: 200 OK

---

## 5. Harita Üzerinde Uydu Gösterme

- Endpoint: GET /map/satellites
- Response: 200 OK

---

## 6. Harita Üzerinde Roket Gösterme

- Endpoint: GET /map/rockets
- Response: 200 OK

---

## 7. Yorum Yapma

- Endpoint: POST /comments
- Authentication: Bearer Token gerekli
- Request Body:

{
  "userId": 1,
  "spaceObjectId": 2,
  "content": "Çok güzel bir uzay nesnesi"
}

- Response: 201 Created

---

## 8. Yorum Güncelleme

- Endpoint: PUT /comments/edit/{id}
- Authentication: Bearer Token gerekli
- Request Body:

{
  "content": "Güncellenmiş yorum"
}

- Response: 200 OK

---

## 9. Yorum Silme

- Endpoint: DELETE /comments/edit/{id}
- Authentication: Bearer Token gerekli
- Response: 200 OK
