# Murat - Fonksiyonel Gereksinimler

1. **Üye Olma**

- **API Metodu:** POST /auth/register  
- **Açıklama:** Kullanıcıların yeni hesaplar oluşturarak sisteme kayıt olmasını sağlar. Kullanıcılar email adresi ve şifre belirleyerek hesap oluşturur. Kayıt işlemi sırasında gerekli bilgiler alınır ve sistemde yeni kullanıcı hesabı oluşturulur.

2. **Giriş Yapma**

- **API Metodu:** POST /auth/login  
- **Açıklama:** Kullanıcının email ve şifre bilgileri ile sisteme giriş yapmasını sağlar. Doğru bilgiler girildiğinde kullanıcı sisteme erişebilir. Hatalı girişlerde kullanıcı bilgilendirilir.

3. **Profil Güncelleme**

- **API Metodu:** PUT /users/{userId}  
- **Açıklama:** Kullanıcının profil bilgilerini güncellemesini sağlar. Kullanıcı ad, soyad, email veya şifre gibi bilgilerini değiştirebilir. Güvenlik için giriş yapmış olmak gerekir ve kullanıcı yalnızca kendi bilgilerini güncelleyebilir.

4. **Hesap Silme**

- **API Metodu:** DELETE /users/{userId}  
- **Açıklama:** Kullanıcının hesabını sistemden kalıcı olarak silmesini sağlar. Bu işlem geri alınamaz ve kullanıcının verileri silinir. Güvenlik için giriş yapmış olmak gerekir.

5. **Uzay Nesnelerini Listeleme**

- **API Metodu:** GET /space-objects  
- **Açıklama:** Sistemde bulunan asteroid, uydu ve roketleri liste halinde gösterir. Kullanıcılar tüm uzay nesnelerini tek ekranda görüntüleyebilir.

6. **Uzay Nesnesi Detay Görüntüleme**

- **API Metodu:** GET /space-objects/{id}  
- **Açıklama:** Seçilen uzay nesnesinin detay bilgilerini görüntülemeyi sağlar. Kullanıcı nesnenin türü, hızı, mesafesi ve diğer özelliklerini görebilir.

7. **Uzay Nesnelerini Karşılaştırma**

- **API Metodu:** POST /space-objects/compare  
- **Açıklama:** Kullanıcının iki veya daha fazla uzay nesnesini karşılaştırmasını sağlar. Seçilen nesnelerin özellikleri aynı ekranda gösterilir ve aralarındaki farklar incelenebilir.

8. **Uzay Nesnelerini Filtreleme**

- **API Metodu:** POST /space-objects/filter  
- **Açıklama:** Kullanıcının belirlediği kriterlere göre uzay nesnelerini filtrelemeyi sağlar. Hız, mesafe veya tür gibi kriterlerle sonuç listesi daraltılabilir.

9. **Olağandışı Nesne Tespiti (Yapay Zeka Gereksinimi)**

- **API Metodu:** POST /space-objects/anomaly-detect  
- **Açıklama:** Normal değerlerin dışında hız veya mesafeye sahip uzay nesnelerini tespit eder. Sistem bu nesneleri belirleyerek kullanıcıya bildirir ve dikkat çekici şekilde gösterir.