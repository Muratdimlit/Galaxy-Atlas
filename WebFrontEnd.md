# Web Frontend Görev Dağılımı

**Web Frontend Adresi:** [https://galaxy-atlas-pearl.vercel.app](https://galaxy-atlas-pearl.vercel.app)

Bu dokümanda, web uygulamasının kullanıcı arayüzü (UI) ve kullanıcı deneyimi (UX) görevleri listelenmektedir. Her grup üyesi, kendisine atanan sayfaların tasarımı, implementasyonu ve kullanıcı etkileşimlerinden sorumludur.

---

## Grup Üyelerinin Web Frontend Görevleri

1. [Murat'ın Web Frontend Görevleri](./Murat/Murat-Web-Frontend-Gorevleri.md)
2. [Berra'nın Web Frontend Görevleri](./Berra/Berra-Web-Frontend-Gorevleri.md)

---

## Genel Web Frontend Prensipleri

### 1. Responsive Tasarım

- **Mobile-First Approach:** Önce mobil tasarım, sonra desktop düzeni
- **Breakpoints:**
  - Mobile: `< 768px`
  - Tablet: `768px - 1024px`
  - Desktop: `> 1024px`
- **Flexible Layouts:** CSS Flexbox ve Grid kullanımı
- **Responsive Images:** Görsellerin ekrana göre ölçeklenmesi
- **Touch-Friendly:** Buton ve tıklanabilir alanların mobil uyumlu olması

### 2. Tasarım Sistemi

- **Renk Paleti:** Uzay temalı koyu arka plan ve kontrast vurgular
- **Kart Yapısı:** İçeriklerin kart yapısında sunulması
- **Tutarlı Başlıklar:** Sayfa başlıklarında ortak stil kullanımı
- **İkon Kullanımı:** Favori, harita ve yorum işlemlerinde destekleyici ikonlar
- **Buton Tutarlılığı:** Tüm sayfalarda benzer buton tasarımı

### 3. Kullanıcı Deneyimi

- **Kolay Navigasyon:** Kullanıcıların sayfalar arasında rahat geçiş yapabilmesi
- **Hızlı Erişim:** Favoriler, harita ve nesne detaylarına kısa yoldan erişim
- **Form Kullanılabilirliği:** Giriş, kayıt ve yorum alanlarının anlaşılır olması
- **Hata Mesajları:** Eksik veya yanlış girişlerde kullanıcıya açık geri bildirim verilmesi
- **Boş Durum Tasarımı:** Veri yoksa bilgilendirici içerik gösterilmesi

### 4. Teknik Uygulama Esasları

- **Bileşen Tabanlı Yapı:** React bileşen mantığı ile geliştirme
- **Durum Yönetimi:** Form ve liste verilerinin düzenli kontrolü
- **API Entegrasyonu:** Backend servisleri ile veri alışverişi
- **Yüklenme Durumları:** Veri gelene kadar loading göstergesi kullanımı
- **Hata Yönetimi:** API veya ağ hatalarında kullanıcı dostu yaklaşım
