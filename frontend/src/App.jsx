import { useEffect, useMemo, useState } from 'react'
import './App.css'

function App() {
  const fallbackObjects = [
    {
      id: 1,
      name: 'Hubble',
      type: 'UYDU',
      description: 'Dünya yörüngesinde gözlem yapan gelişmiş uzay teleskobu.',
      status: 'Aktif',
      orbit: 'Dünya Alçak Yörünge',
      risk: 'Düşük'
    },
    {
      id: 2,
      name: 'Falcon 9',
      type: 'ROKET',
      description: 'Yeniden kullanılabilir modern fırlatma roketi.',
      status: 'Hazır',
      orbit: 'Fırlatma Platformu',
      risk: 'Düşük'
    },
    {
      id: 3,
      name: 'Apophis',
      type: 'ASTEROID',
      description: "Dünya'ya yakın geçişleriyle dikkat çeken gök cismi.",
      status: 'İzleniyor',
      orbit: 'Güneş Yörüngesi',
      risk: 'Orta'
    }
  ]

  const [spaceObjects, setSpaceObjects] = useState(fallbackObjects)
  const [favorites, setFavorites] = useState([])
  const [comments, setComments] = useState([])

  const [newComment, setNewComment] = useState('')
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editedComment, setEditedComment] = useState('')

  const [activePage, setActivePage] = useState('home')
  const [selectedObject, setSelectedObject] = useState(null)

  // Test kullanıcı - Berra gereksinimleri için sabit
  const testUserId = 1
  const testUsername = 'Berra'

  const loadSpaceObjects = () => {
    fetch('http://localhost:8080/space-objects')
      .then((res) => {
        if (!res.ok) throw new Error('Nesneler alınamadı')
        return res.json()
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((item) => ({
            id: item.id,
            name: item.name || 'Bilinmeyen Nesne',
            type: String(item.type || 'NESNE').toUpperCase(),
            description: item.description || 'Detay bilgisi daha sonra eklenecek.',
            status: item.status || 'Aktif',
            orbit: item.orbit || 'Bilinmiyor',
            risk: item.risk || 'Düşük'
          }))
          setSpaceObjects(mapped)
        } else {
          setSpaceObjects(fallbackObjects)
        }
      })
      .catch(() => {
        setSpaceObjects(fallbackObjects)
      })
  }

  const loadFavorites = () => {
    fetch(`http://localhost:8080/favorites/${testUserId}`)
      .then((res) => res.json())
      .then((data) => {
        setFavorites(Array.isArray(data) ? data : [])
      })
      .catch((err) => console.error('Favori listeleme hatası:', err))
  }

  const loadComments = (spaceObjectId) => {
    if (!spaceObjectId) {
      setComments([])
      return
    }

    fetch(`http://localhost:8080/comments/${spaceObjectId}`)
      .then((res) => res.json())
      .then((data) => {
        setComments(Array.isArray(data) ? data : [])
      })
      .catch((err) => console.error('Yorum listeleme hatası:', err))
  }

  useEffect(() => {
    loadSpaceObjects()
    loadFavorites()
  }, [])

  useEffect(() => {
    if (selectedObject) {
      loadComments(selectedObject.id)
    } else {
      setComments([])
    }
  }, [selectedObject])

  const favoriteObjectIds = useMemo(
    () => favorites.map((fav) => fav.spaceObjectId),
    [favorites]
  )

  const favoriteObjects = useMemo(
    () => spaceObjects.filter((object) => favoriteObjectIds.includes(object.id)),
    [spaceObjects, favoriteObjectIds]
  )

  const isFavorite = (spaceObjectId) => favoriteObjectIds.includes(spaceObjectId)

  const addFavorite = (spaceObjectId) => {
    fetch('http://localhost:8080/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: testUserId,
        spaceObjectId
      })
    })
      .then((res) => res.json())
      .then(() => loadFavorites())
      .catch((err) => console.error('Favori ekleme hatası:', err))
  }

  const removeFavorite = (spaceObjectId) => {
    fetch(
      `http://localhost:8080/favorites?userId=${testUserId}&spaceObjectId=${spaceObjectId}`,
      {
        method: 'DELETE'
      }
    )
      .then(() => loadFavorites())
      .catch((err) => console.error('Favori silme hatası:', err))
  }

  const toggleFavorite = (spaceObjectId) => {
    if (isFavorite(spaceObjectId)) {
      removeFavorite(spaceObjectId)
    } else {
      addFavorite(spaceObjectId)
    }
  }

  const openObjectDetail = (object) => {
    setSelectedObject(object)
    setNewComment('')
    setEditingCommentId(null)
    setEditedComment('')
  }

  const closeObjectDetail = () => {
    setSelectedObject(null)
    setComments([])
    setNewComment('')
    setEditingCommentId(null)
    setEditedComment('')
  }

  const addComment = () => {
    if (!newComment.trim() || !selectedObject) return

    fetch('http://localhost:8080/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        spaceObjectId: selectedObject.id,
        username: testUsername,
        content: newComment
      })
    })
      .then((res) => res.json())
      .then(() => {
        setNewComment('')
        loadComments(selectedObject.id)
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
        if (selectedObject) {
          loadComments(selectedObject.id)
        }
      })
      .catch((err) => console.error('Yorum güncelleme hatası:', err))
  }

  const deleteComment = (id) => {
    fetch(`http://localhost:8080/comments/${id}`, {
      method: 'DELETE'
    })
      .then(() => {
        if (selectedObject) {
          loadComments(selectedObject.id)
        }
      })
      .catch((err) => console.error('Yorum silme hatası:', err))
  }

  const renderObjectCard = (object) => (
    <div className="card object-card" key={object.id}>
      <button
        className={`favorite-star ${isFavorite(object.id) ? 'active' : ''}`}
        onClick={() => toggleFavorite(object.id)}
        title="Favoriye ekle / çıkar"
      >
        ★
      </button>

      <span className="card-type">{object.type}</span>
      <h3>{object.name}</h3>
      <p className="card-desc">{object.description}</p>

      <div className="card-footer">
        <span>Durum: {object.status}</span>
        <button className="btn btn-outline" onClick={() => openObjectDetail(object)}>
          Detay
        </button>
      </div>
    </div>
  )

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
          <button className="nav-link-btn" onClick={() => setActivePage('home')}>
            Ana Sayfa
          </button>
          <button className="nav-link-btn" onClick={() => setActivePage('objects')}>
            Nesneler
          </button>
          <button className="nav-link-btn" onClick={() => setActivePage('favorites')}>
            Favoriler
          </button>
          <a href="#map">Harita</a>
          <a href="#about">Hakkında</a>
        </nav>

        <div className="nav-actions">
          <button className="btn btn-outline">Test Kullanıcı: Berra</button>
        </div>
      </header>

      {selectedObject && (
        <div className="auth-modal-overlay">
          <div className="card detail-modal-card">
            <div className="detail-header">
              <div>
                <span className="card-type">{selectedObject.type}</span>
                <h2 className="detail-title">{selectedObject.name}</h2>
              </div>

              <button className="btn btn-outline" onClick={closeObjectDetail}>
                Kapat
              </button>
            </div>

            <p className="detail-text">{selectedObject.description}</p>

            <div className="detail-info-grid">
              <div className="detail-info-box">
                <strong>Durum</strong>
                <span>{selectedObject.status}</span>
              </div>
              <div className="detail-info-box">
                <strong>Yörünge</strong>
                <span>{selectedObject.orbit}</span>
              </div>
              <div className="detail-info-box">
                <strong>Risk</strong>
                <span>{selectedObject.risk}</span>
              </div>
            </div>

            <div className="detail-comments-section">
              <h3>Yorumlar</h3>

              <div className="detail-comment-form">
                <input
                  type="text"
                  placeholder="Bu nesne hakkında yorum yaz..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="auth-input"
                />
                <button className="btn btn-primary" onClick={addComment}>
                  Yorum Ekle
                </button>
              </div>

              {comments.length === 0 ? (
                <p className="card-desc">Bu nesne için henüz yorum yok.</p>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, marginTop: '18px' }}>
                  {comments.map((comment) => (
                    <li className="detail-comment-item" key={comment.id}>
                      {editingCommentId === comment.id ? (
                        <>
                          <input
                            type="text"
                            value={editedComment}
                            onChange={(e) => setEditedComment(e.target.value)}
                            className="auth-input"
                          />

                          <div className="detail-comment-actions">
                            <button
                              className="btn btn-primary"
                              onClick={() => saveUpdatedComment(comment.id)}
                            >
                              Kaydet
                            </button>
                            <button
                              className="btn btn-outline"
                              onClick={cancelEditingComment}
                            >
                              Vazgeç
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <p
                            style={{
                              marginBottom: '6px',
                              fontWeight: 'bold',
                              color: '#8ecbff'
                            }}
                          >
                            {comment.username || 'Kullanıcı'}
                          </p>
                          <p style={{ marginBottom: '10px' }}>{comment.content}</p>

                          <div className="detail-comment-actions">
                            <button
                              className="btn btn-outline"
                              onClick={() => startEditingComment(comment)}
                            >
                              Güncelle
                            </button>
                            <button
                              className="btn btn-outline"
                              onClick={() => deleteComment(comment.id)}
                            >
                              Sil
                            </button>
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {activePage === 'home' && (
        <>
          <section className="hero" id="home">
            <div className="hero-content">
              <span className="badge">Uzay Teknolojileri • Takip Platformu</span>
              <h1>Roket, Uydu ve Asteroidleri Tek Platformda Takip Et</h1>
              <p>
                Galaxy Atlas; uzay nesnelerini listeleyen, detaylarını gösteren,
                favorilere ekleme ve yorum yapma imkânı sunan modern bir web
                platformudur.
              </p>

              <div className="hero-buttons">
                <button className="btn btn-primary" onClick={() => setActivePage('objects')}>
                  Keşfet
                </button>
                <button className="btn btn-outline" onClick={() => setActivePage('favorites')}>
                  Favorileri Gör
                </button>
              </div>

              <div className="hero-stats">
                <div className="stat-box">
                  <h3>{spaceObjects.length}+</h3>
                  <p>Uzay Nesnesi</p>
                </div>
                <div className="stat-box">
                  <h3>{favoriteObjects.length}</h3>
                  <p>Favori Nesne</p>
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
                <h3>{spaceObjects[0]?.name || 'Hubble Telescope'}</h3>
                <p>Tür: {spaceObjects[0]?.type || 'UYDU'}</p>
                <p>Durum: {spaceObjects[0]?.status || 'Aktif'}</p>
                <p>Yörünge: {spaceObjects[0]?.orbit || 'Dünya Alçak Yörünge'}</p>
              </div>

              <div className="glow-circle glow-1"></div>
              <div className="glow-circle glow-2"></div>
              <div className="floating-rock rock-1"></div>
              <div className="floating-rock rock-2"></div>
            </div>
          </section>

          <section className="features section" id="features">
            <div className="section-header">
              <span className="section-tag">Platform Özellikleri</span>
              <h2>Neler Sunuyor?</h2>
            </div>

            <div className="feature-grid">
              <div className="feature-card">
                <h3>Favoriler</h3>
                <p>Uzay nesnelerini favorilere ekleme ve çıkarma.</p>
              </div>

              <div className="feature-card">
                <h3>Yorum Sistemi</h3>
                <p>Her nesne için yorum ekleme, güncelleme ve silme.</p>
              </div>

              <div className="feature-card">
                <h3>Detay Görüntüleme</h3>
                <p>Nesne detaylarını modal ekranda inceleme.</p>
              </div>

              <div className="feature-card">
                <h3>Harita Alanı</h3>
                <p>Nesnelerin konumları için harita gösterim alanı.</p>
              </div>
            </div>
          </section>

          <section className="about section" id="about">
            <div className="about-box">
              <div className="about-text">
                <span className="section-tag">Proje Hakkında</span>
                <h2>Berra Gereksinimleri İçin Hazırlanan Arayüz</h2>
                <p>
                  Bu sürüm; favori işlemleri, yorum sistemi ve harita alanı gibi
                  kullanıcı etkileşimi odaklı gereksinimleri gerçekleştirmek için
                  hazırlanmıştır.
                </p>
              </div>

              <div className="about-side">
                <div className="info-card">
                  <h3>Teknolojiler</h3>
                  <p>React, Spring Boot, PostgreSQL, GitHub</p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {activePage === 'objects' && (
        <section className="objects section" id="objects">
          <div className="section-header">
            <span className="section-tag">Uzay Nesneleri</span>
            <h2>Tüm Nesneler</h2>
            <p>
              Buradan nesneleri inceleyebilir, favorilere ekleyebilir ve detay
              ekranında yorum yapabilirsiniz.
            </p>
          </div>

          <div className="card-container object-grid">
            {spaceObjects.map((object) => renderObjectCard(object))}
          </div>
        </section>
      )}

      {activePage === 'favorites' && (
        <section className="section" id="favorites">
          <div className="section-header">
            <span className="section-tag">Favoriler</span>
            <h2>Favori Nesnelerim</h2>
            <p>Yıldız ikonuna bastığınız nesneler burada kart olarak görünür.</p>
          </div>

          {favoriteObjects.length === 0 ? (
            <div className="card">
              <p className="card-desc">Henüz favori nesneniz yok.</p>
            </div>
          ) : (
            <div className="card-container object-grid">
              {favoriteObjects.map((object) => renderObjectCard(object))}
            </div>
          )}
        </section>
      )}

      <section className="section map-section" id="map">
        <div className="section-header">
          <span className="section-tag">Harita</span>
          <h2>Dünya Haritası ve Nesne Konumları</h2>
          <p>
            Asteroid, uydu ve roketlerin konumlarının ilerleyen aşamalarda dünya
            haritası üzerinde gösterileceği alan.
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

      <footer className="footer">
        <div>
          <h3>Galaxy Atlas</h3>
          <p>Uzay nesneleri için modern takip platformu.</p>
        </div>

        <div className="footer-links">
          <button className="nav-link-btn footer-btn" onClick={() => setActivePage('home')}>
            Ana Sayfa
          </button>
          <button className="nav-link-btn footer-btn" onClick={() => setActivePage('objects')}>
            Nesneler
          </button>
          <button className="nav-link-btn footer-btn" onClick={() => setActivePage('favorites')}>
            Favoriler
          </button>
          <a href="#map">Harita</a>
          <a href="#about">Hakkında</a>
        </div>
      </footer>
    </div>
  )
}

export default App