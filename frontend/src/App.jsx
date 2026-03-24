import './App.css'

function App() {
  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">Galaxy Atlas</div>
        <nav>
          <a href="#home">Ana Sayfa</a>
          <a href="#objects">Uzay Nesneleri</a>
          <a href="#about">Hakkında</a>
        </nav>
      </header>

      <section className="hero" id="home">
        <h1>Roket, Uydu ve Asteroid Takip Sistemi</h1>
        <p>
          Galaxy Atlas, uzay nesnelerini listeleyen ve detaylarını gösteren bir
          web platformudur.
        </p>
        <button>Keşfet</button>
      </section>

      <section className="objects" id="objects">
        <h2>Öne Çıkan Uzay Nesneleri</h2>

        <div className="card-container">
          <div className="card">
            <h3>Hubble</h3>
            <p>Tür: Uydu</p>
            <p>Dünya yörüngesinde gözlem yapan uzay teleskobu.</p>
          </div>

          <div className="card">
            <h3>Falcon 9</h3>
            <p>Tür: Roket</p>
            <p>Yeniden kullanılabilir fırlatma roketi.</p>
          </div>

          <div className="card">
            <h3>Apophis</h3>
            <p>Tür: Asteroid</p>
            <p>Dünya'ya yakın geçişiyle bilinen gök cismi.</p>
          </div>
        </div>
      </section>

      <section className="about" id="about">
        <h2>Proje Hakkında</h2>
        <p>
          Bu proje, yazılım mühendisliği dersi için geliştirilen bir uzay takip
          sistemidir.
        </p>
      </section>
    </div>
  )
}

export default App