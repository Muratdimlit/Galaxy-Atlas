# Berra - Web Frontend Görevleri

**Web Test Videosu:** [https://www.youtube.com/watch?v=UjCMixEtSC4](https://www.youtube.com/watch?v=UjCMixEtSC4)

**Web Adresi:** https://galaxy-atlas-pearl.vercel.app

---

## 1. Favoriye Ekleme ve Favoriden Çıkarma Arayüzü

- **Sayfa / Bileşen:** Uzay nesnesi kartları ve detay ekranı
- **Açıklama:** Kullanıcının bir uzay nesnesini favorilere ekleyebilmesini ve isterse favorilerden çıkarabilmesini sağlayan kullanıcı arayüzü
- **Frontend Görevleri:**
  - Favori ekleme butonunun tasarlanması
  - Favori kaldırma butonunun tasarlanması
  - Butonların aktif / pasif durumlarının görsel olarak ayırt edilmesi
  - Favori işlemleri sonrası kullanıcıya geri bildirim verilmesi
  - API ile favori ekleme ve silme işlemlerinin entegre edilmesi
  - Mobil uyumlu favori butonlarının hazırlanması

---

## 2. Favori Listesi Sayfası

- **Sayfa / Bileşen:** Favoriler sayfası
- **Açıklama:** Kullanıcının favorilerine eklediği uzay nesnelerini listeleyebildiği ekran
- **Frontend Görevleri:**
  - Favori nesnelerin kart yapısında listelenmesi
  - Boş favori listesi için bilgilendirici mesaj tasarımı
  - Favori listesinden nesne kaldırma işleminin eklenmesi
  - Favori listesindeki nesnelere detay butonunun eklenmesi
  - API’den gelen favori verilerinin arayüze aktarılması
  - Mobil uyumlu favori listesi görünümünün hazırlanması

---

## 3. Uzay Nesnesi Detay Sayfasında Yorum Alanı

- **Sayfa / Bileşen:** Uzay nesnesi detay ekranı
- **Açıklama:** Kullanıcının seçilen uzay nesnesi hakkında yorum yapabildiği alan
- **Frontend Görevleri:**
  - Yorum giriş alanının tasarlanması
  - Yorum gönderme butonunun hazırlanması
  - Kullanıcının yazdığı yorumun ekranda listelenmesi
  - API ile yorum ekleme işleminin entegre edilmesi
  - Başarılı / hatalı yorum işlemleri için mesaj gösterimi
  - Mobil uyumlu yorum alanının hazırlanması

---

## 4. Yorum Güncelleme ve Silme Arayüzü

- **Sayfa / Bileşen:** Uzay nesnesi detay ekranındaki yorum listesi
- **Açıklama:** Kullanıcının daha önce yaptığı yorumu düzenleyebilmesi veya silebilmesi için hazırlanan arayüz
- **Frontend Görevleri:**
  - Her yorum için düzenle butonunun eklenmesi
  - Her yorum için sil butonunun eklenmesi
  - Düzenleme sırasında yorum metninin input alanına aktarılması
  - Güncellenen yorumun arayüzde anlık gösterilmesi
  - API ile yorum güncelleme ve silme işlemlerinin entegre edilmesi
  - Silme işlemi sonrası kullanıcıya geri bildirim verilmesi

---

## 5. Harita Üzerinde Asteroid Gösterimi

- **Sayfa / Bileşen:** Harita bölümü
- **Açıklama:** Sistemde bulunan asteroid verilerinin koordinat bilgilerine göre harita üzerinde gösterilmesi
- **Frontend Görevleri:**
  - Asteroid marker yapısının hazırlanması
  - Asteroid popup tasarımının yapılması
  - Popup içinde ad, tür, açıklama gibi bilgilerin gösterilmesi
  - API’den asteroid verilerinin çekilip haritaya aktarılması
  - Harita üzerinde asteroid markerlarının görsel olarak ayırt edilmesi
  - Mobil uyumlu harita görünümünün korunması

---

## 6. Harita Üzerinde Uydu Gösterimi

- **Sayfa / Bileşen:** Harita bölümü
- **Açıklama:** Uydu verilerinin harita üzerinde gösterilmesi ve kullanıcının uydu bilgilerini görüntüleyebilmesi
- **Frontend Görevleri:**
  - Uydu marker yapısının hazırlanması
  - Uydu popup alanının tasarlanması
  - API’den gelen uydu verilerinin arayüzde işlenmesi
  - Uydu türü için uygun ikon / marker kullanımı
  - Harita üzerindeki uydu verilerinin kullanıcıya okunabilir biçimde sunulması
  - Yavaş yüklenme durumlarında kullanıcıya uygun geri bildirim verilmesi

---

## 7. Harita Üzerinde Roket Gösterimi

- **Sayfa / Bileşen:** Harita bölümü
- **Açıklama:** Roket nesnelerinin harita üzerinde konum bilgileriyle birlikte gösterilmesi
- **Frontend Görevleri:**
  - Roket marker yapısının hazırlanması
  - Roket popup tasarımının yapılması
  - Roket nesnelerinin diğer uzay nesnelerinden görsel olarak ayrılması
  - API’den gelen roket verilerinin harita bileşenine aktarılması
  - Popup içinde temel roket bilgilerinin gösterilmesi
  - Harita üzerinde kullanıcı etkileşiminin iyileştirilmesi

---

## 8. Harita ve Etkileşim Deneyimi İyileştirmeleri

- **Sayfa / Bileşen:** Harita bölümü ve ilgili popup bileşenleri
- **Açıklama:** Kullanıcının harita üzerinde yer alan nesnelerle daha rahat etkileşim kurabilmesi için yapılan arayüz iyileştirmeleri
- **Frontend Görevleri:**
  - Popup tasarımlarının düzenlenmesi
  - Marker tıklanabilirliğinin iyileştirilmesi
  - Harita üzerindeki bilgi pencerelerinin kullanıcı dostu hale getirilmesi
  - Nesneler arasında görsel tutarlılık sağlanması
  - Mobil cihazlarda harita kullanım deneyiminin iyileştirilmesi
  - Kullanıcının detay ekranına yönlendirilmesini kolaylaştıran butonların eklenmesi
