import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [favorites, setFavorites] = useState([])
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editedComment, setEditedComment] = useState('')

  const loadFavorites = () => {
    fetch('http://localhost:8080/favorites?userId=1')
      .then((res) => res.json())
      .then((data) => {
        console.log('Favoriler:', data)
        setFavorites(data)
      })
      .catch((err) => console.error('Favori listeleme hatası:', err))
  }

  const loadComments = () => {
    fetch('http://localhost:8080/comments?spaceObjectId=1')
      .then((res) => res.json())
      .then((data) => {
        console.log('Yorumlar:', data)
        setComments(data)
      })
      .catch((err) => console.error('Yorum listeleme hatası:', err))
  }

  useEffect(() => {
    loadFavorites()
    loadComments()
  }, [])

  const addFavorite = () => {
    fetch('http://localhost:8080/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: 1,
        spaceObjectId: 1
      })
    })
      .then((res) => res.json())
      .then(() => loadFavorites())
      .catch((err) => console.error('Favori ekleme hatası:', err))
  }

  const deleteFavorite = (id) => {
    fetch(`http://localhost:8080/favorites/${id}`, {
      method: 'DELETE'
    })
      .then(() => loadFavorites())
      .catch((err) => console.error('Favori silme hatası:', err))
  }

  const addComment = () => {
    if (!newComment.trim()) return

    fetch('http://localhost:8080/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: 1,
        spaceObjectId: 1,
        content: newComment
      })
    })
      .then((res) => res.json())
      .then(() => {
        setNewComment('')
        loadComments()
      })
      .catch((err) => console.error('Yorum ekleme hatası:', err))
  }

  const startEditingComment = (comment) => {
    setEditingCommentId(comment.id)
    setEditedComment(comment.content)
  }

  const cancelEditingComment = () => {
    setEditingCommentId(null)
    setEditedComment('')
  }

  const saveUpdatedComment = (id) => {
    if (!editedComment.trim()) return

    fetch(`http://localhost:8080/comments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: editedComment
      })
    })
      .then((res) => res.json())
      .then(() => {
        setEditingCommentId(null)
        setEditedComment('')
        loadComments()
      })
      .catch((err) => console.error('Yorum güncelleme hatası:', err))
  }

  const deleteComment = (id) => {
    fetch(`http://localhost:8080/comments/${id}`, {
      method: 'DELETE'
    })
      .then(() => loadComments())
      .catch((err) => console.error('Yorum silme hatası:', err))
  }

  return (
    <div className="app">
      <div className="space-bg">
        <div className="star star-1"></div>
        <div className="star star-2"></div>
        <div className="star star-3"></div>
        <div className="planet planet-1"></div>
        <div className="planet planet-2"></div>
        <div className="asteroid asteroid-1"></div>
        <div className="asteroid asteroid-2"></div>
        <div className="orbit-line orbit-1"></div>
        <div className="orbit-line orbit-2"></div>
      </div>

      <header className="navbar">
        <div className="logo">Galaxy Atlas</div>

        <nav className="nav-links">
          <a href="#home">Ana Sayfa</a>
          <a href="#objects">Nesneler</a>
          <a href="#features">Özellikler</a>
          <a href="#favorites">Favoriler</a>
          <a href="#comments">Yorumlar</a>
          <a href="#map">Harita</a>
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
          <div className="floating-rock rock-1"></div>
          <div className="floating-rock rock-2"></div>
        </div>
      </section>

      <section className="objects section" id="objects">
        <div className="section-header">
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

      <section className="section" id="favorites">
        <div className="section-header">
          <h2>Favorilerim</h2>
        </div>

        <div className="card-container">
          <div className="card">
            <h3>Favori Ekle</h3>
            <p className="card-desc">
              Test için sabit olarak userId=1 ve spaceObjectId=1 gönderiliyor.
            </p>

            <div className="hero-buttons">
              <button className="btn btn-primary" onClick={addFavorite}>
                Favoriye Ekle
              </button>
            </div>
          </div>

          <div className="card">
            <h3>Favori Listem</h3>

            {favorites.length === 0 ? (
              <p className="card-desc">Henüz favori yok.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {favorites.map((fav) => (
                  <li
                    key={fav.id}
                    style={{
                      marginBottom: '12px',
                      padding: '10px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px'
                    }}
                  >
                    <p>Favori ID: {fav.id}</p>
                    <p>Kullanıcı ID: {fav.userId}</p>
                    <p>Uzay Nesnesi ID: {fav.spaceObjectId}</p>

                    <button
                      className="btn btn-outline"
                      onClick={() => deleteFavorite(fav.id)}
                    >
                      Favoriden Çıkar
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <section className="section" id="comments">
        <div className="section-header">
          <h2>Yorumlar</h2>
        </div>

        <div className="card-container">
          <div className="card">
            <h3>Yorum Ekle</h3>
            <input
              type="text"
              placeholder="Yorum yaz..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '12px',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.06)',
                color: 'white',
                outline: 'none'
              }}
            />

            <button className="btn btn-primary" onClick={addComment}>
              Yorum Ekle
            </button>
          </div>

          <div className="card">
            <h3>Yorum Listesi</h3>

            {comments.length === 0 ? (
              <p className="card-desc">Henüz yorum yok.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {comments.map((comment) => (
                  <li
                    key={comment.id}
                    style={{
                      marginBottom: '14px',
                      padding: '14px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '14px',
                      background: 'rgba(255,255,255,0.03)'
                    }}
                  >
                    {editingCommentId === comment.id ? (
                      <>
                        <input
                          type="text"
                          value={editedComment}
                          onChange={(e) => setEditedComment(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px',
                            marginBottom: '12px',
                            borderRadius: '10px',
                            border: '1px solid rgba(255,255,255,0.15)',
                            background: 'rgba(255,255,255,0.06)',
                            color: 'white',
                            outline: 'none'
                          }}
                        />

                        <button
                          className="btn btn-primary"
                          onClick={() => saveUpdatedComment(comment.id)}
                        >
                          Kaydet
                        </button>

                        <button
                          className="btn btn-outline"
                          onClick={cancelEditingComment}
                          style={{ marginLeft: '10px' }}
                        >
                          Vazgeç
                        </button>
                      </>
                    ) : (
                      <>
                        <p style={{ marginBottom: '10px' }}>{comment.content}</p>

                        <button
                          className="btn btn-outline"
                          onClick={() => startEditingComment(comment)}
                        >
                          Güncelle
                        </button>

                        <button
                          className="btn btn-outline"
                          onClick={() => deleteComment(comment.id)}
                          style={{ marginLeft: '10px' }}
                        >
                          Sil
                        </button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <section className="section map-section" id="map">
        <div className="section-header">
          <span className="section-tag">Yakında</span>
          <h2>Dünya Haritası ve Nesne Konumları</h2>
          <p>
            İlerleyen adımlarda uzay nesnelerinin konumlarını dünya üzerinde
            göstereceğimiz alan burada yer alacak.
          </p>
        </div>

        <div className="map-placeholder">
          <div className="map-grid"></div>
          <div className="map-pin pin-1"></div>
          <div className="map-pin pin-2"></div>
          <div className="map-pin pin-3"></div>
          <div className="map-center-text">
            Harita alanı burada gösterilecek
          </div>
        </div>
      </section>

      <section className="about section" id="about">
        <div className="about-box">
          <div className="about-text">
            <span className="section-tag">Proje Hakkında</span>
            <h2>Yazılım Mühendisliği Dersi İçin Geliştiriliyor</h2>
            <p>
              Galaxy Atlas projesi; kullanıcıların uzay nesnelerini
              görüntüleyebildiği, REST API ile desteklenen ve veritabanı
              bağlantısına sahip bir takip sistemi oluşturmayı amaçlamaktadır.
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
          <a href="#favorites">Favoriler</a>
          <a href="#comments">Yorumlar</a>
          <a href="#map">Harita</a>
          <a href="#about">Hakkında</a>
        </div>
      </footer>
    </div>
  )
}

export default App