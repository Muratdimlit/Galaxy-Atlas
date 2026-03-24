import './App.css'

function App() {
  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">Galaxy Atlas</div>

        <nav className="nav-links">
          <a href="#home">Ana Sayfa</a>
          <a href="#objects">Nesneler</a>
          <a href="#features">Özellikler</a>
          <a href="#about">Hakkında</a>
        </nav>

        <div className="nav-actions">
          <button className="btn btn-outline">Giriş Yap</button>
          <button className="btn btn-primary">Kayıt Ol</button>
        </div>
      </header>

      <section className="hero" id="home">
        <div className="hero-content">
          <span className="badge">Uzay Teknolojileri • Takip Platformu</span>
          <h1>Roket, Uydu ve Asteroidleri Tek Platformda Takip Et</h1>
          <p>
            Galaxy Atlas; uzay nesnelerini listeleyen, detaylarını gösteren,
            karşılaştırma ve inceleme imkânı sunan modern bir web platformudur.
          </p>

          <div className="hero-buttons">
            <button className="btn btn-primary">Keşfet</button>
            <button className="btn btn-outline">Detayları İncele</button>
          </div>

          <div className="hero-stats">
            <div className="stat-box">
              <h3>120+</h3>
              <p>Uzay Nesnesi</p>
            </div>
            <div className="stat-box">
              <h3>24/7</h3>
              <p>Takip Sistemi</p>
            </div>
            <div className="stat-box">
              <h3>REST</h3>
              <p>API Destekli</p>
            </div>
          </div>
        </div>

        <div className="hero-panel">
          <div className="orbit-card">
            <p className="mini-title">Canlı İzleme Kartı</p>
            <h3>Hubble Telescope</h3>
            <p>Tür: Uydu</p>
            <p>Durum: Aktif</p>
            <p>Yörünge: Dünya Alçak Yörünge</p>
          </div>

          <div className="glow-circle glow-1"></div>
          <div className="glow-circle glow-2"></div>
        </div>
      </section>

      <section className="objects section" id="objects">
        <div className="section-header">
          <span className="section-tag">Veri Kartları</span>
          <h2>Öne Çıkan Uzay Nesneleri</h2>
          <p>
            Platform üzerinden farklı türlerde uzay nesneleri görüntülenebilir,
            detayları incelenebilir ve sistematik olarak takip edilebilir.
          </p>
        </div>

        <div className="card-container">
          <div className="card">
            <span className="card-type">UYDU</span>
            <h3>Hubble</h3>
            <p className="card-desc">
              Dünya yörüngesinde gözlem yapan gelişmiş uzay teleskobu.
            </p>
            <div className="card-footer">
              <span>Durum: Aktif</span>
              <a href="/">Detay</a>
            </div>
          </div>

          <div className="card">
            <span className="card-type">ROKET</span>
            <h3>Falcon 9</h3>
            <p className="card-desc">
              Yeniden kullanılabilir modern fırlatma roketi.
            </p>
            <div className="card-footer">
              <span>Durum: Hazır</span>
              <a href="/">Detay</a>
            </div>
          </div>

          <div className="card">
            <span className="card-type">ASTEROID</span>
            <h3>Apophis</h3>
            <p className="card-desc">
              Dünya'ya yakın geçişleriyle dikkat çeken gök cismi.
            </p>
            <div className="card-footer">
              <span>Risk Seviyesi: Orta</span>
              <a href="/">Detay</a>
            </div>
          </div>
        </div>
      </section>

      <section className="features section" id="features">
        <div className="section-header">
          <span className="section-tag">Platform Özellikleri</span>
          <h2>Neler Sunuyor?</h2>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>Listeleme</h3>
            <p>Uydu, roket ve asteroid verilerini tek ekranda listeleme.</p>
          </div>

          <div className="feature-card">
            <h3>Detay Görüntüleme</h3>
            <p>Her nesne için açıklama, durum ve temel takip bilgileri.</p>
          </div>

          <div className="feature-card">
            <h3>REST API</h3>
            <p>Backend servisleri ile veri akışını sağlayan modern yapı.</p>
          </div>

          <div className="feature-card">
            <h3>Takım Geliştirme</h3>
            <p>GitHub branch mantığı ile geliştirilmeye uygun proje yapısı.</p>
          </div>
        </div>
      </section>

      <section className="about section" id="about">
        <div className="about-box">
          <div className="about-text">
            <span className="section-tag">Proje Hakkında</span>
            <h2>Yazılım Mühendisliği Dersi İçin Geliştiriliyor</h2>
            <p>
              Galaxy Atlas projesi; kullanıcıların uzay nesnelerini görüntüleyebildiği,
              REST API ile desteklenen ve veritabanı bağlantısına sahip bir takip
              sistemi oluşturmayı amaçlamaktadır.
            </p>
          </div>

          <div className="about-side">
            <div className="info-card">
              <h3>Teknolojiler</h3>
              <p>React, Spring Boot, PostgreSQL, Postman, GitHub</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div>
          <h3>Galaxy Atlas</h3>
          <p>Uzay nesneleri için modern takip platformu.</p>
        </div>

        <div className="footer-links">
          <a href="#home">Ana Sayfa</a>
          <a href="#objects">Nesneler</a>
          <a href="#features">Özellikler</a>
          <a href="#about">Hakkında</a>
        </div>
      </footer>
    </div>
  )
}

export default App