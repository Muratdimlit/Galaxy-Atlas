import { useEffect, useMemo  ,useState } from 'react'
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

  const TEST_USER_ID = 1

  const [spaceObjects, setSpaceObjects] = useState(fallbackObjects)
  const [favorites, setFavorites] = useState([])
  const [comments, setComments] = useState([])

  const [newComment, setNewComment] = useState('')
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editedComment, setEditedComment] = useState('')

  const [activePage, setActivePage] = useState('home')
  const [selectedCommentObject, setSelectedCommentObject] = useState(null)

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
      .catch((err) => {
        console.error('Nesne listeleme hatası:', err)
        setSpaceObjects(fallbackObjects)
      })
  }

  const loadFavorites = () => {
    fetch(`http://localhost:8080/favorites/${TEST_USER_ID}`)
      .then((res) => {
        if (!res.ok) throw new Error('Favoriler alınamadı')
        return res.json()
      })
      .then((data) => {
        setFavorites(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        console.error('Favori listeleme hatası:', err)
        setFavorites([])
      })
  }

  const loadComments = (spaceObjectId) => {
    if (!spaceObjectId) {
      setComments([])
      return
    }

    fetch(`http://localhost:8080/comments/${spaceObjectId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Yorumlar alınamadı')
        return res.json()
      })
      .then((data) => {
        setComments(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        console.error('Yorum listeleme hatası:', err)
        setComments([])
      })
  }

  useEffect(() => {
  const savedUser = localStorage.getItem('loggedInUser')
  if (savedUser) {
    setLoggedInUser(JSON.parse(savedUser))
  }
  loadSpaceObjects()
}, [])

useEffect(() => {
  if (loggedInUser) {
    loadFavorites(loggedInUser.id)
  } else {
    setFavoriteIds([])
    setFavoriteRecords([])
    setCompareSelection([])
  }
}, [loggedInUser])

useEffect(() => {
  if (selectedObject) {
    loadComments(selectedObject.id)
  } else {
    setComments([])
  }
}, [selectedObject])

  const favoriteObjectIds = useMemo(() => {
    return favorites.map((fav) => fav.spaceObjectId)
  }, [favorites])

  const favoriteObjects = useMemo(() => {
    return spaceObjects.filter((object) => favoriteObjectIds.includes(object.id))
  }, [spaceObjects, favoriteObjectIds])

  const toggleFavorite = async (spaceObjectId) => {
    const isFavorite = favoriteObjectIds.includes(spaceObjectId)

    try {
      if (isFavorite) {
        await fetch(
          `http://localhost:8080/favorites?userId=${TEST_USER_ID}&spaceObjectId=${spaceObjectId}`,
          {
            method: 'DELETE'
          }
        )
      } else {
        await fetch('http://localhost:8080/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: TEST_USER_ID,
            spaceObjectId
          })
        })
      }

      await loadFavorites()
    } catch (error) {
      console.error('Favori işlemi hatası:', error)
    }
  }

  const openCommentsPanel = (object) => {
    setSelectedCommentObject(object)
    setNewComment('')
    setEditingCommentId(null)
    setEditedComment('')
    loadComments(object.id)
  }

  const closeCommentsPanel = () => {
    setSelectedCommentObject(null)
    setComments([])
    setNewComment('')
    setEditingCommentId(null)
    setEditedComment('')
  }

  const addComment = async () => {
    if (!selectedCommentObject || !newComment.trim()) return

    try {
      await fetch('http://localhost:8080/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: TEST_USER_ID,
          spaceObjectId: selectedCommentObject.id,
          content: newComment
        })
      })

      setNewComment('')
      loadComments(selectedCommentObject.id)
    } catch (error) {
      console.error('Yorum ekleme hatası:', error)
    }
  }

  const startEditingComment = (comment) => {
    setEditingCommentId(comment.id)
    setEditedComment(comment.content)
  }

  const cancelEditingComment = () => {
    setEditingCommentId(null)
    setEditedComment('')
  }

  const saveUpdatedComment = async (commentId) => {
    if (!editedComment.trim() || !selectedCommentObject) return

    try {
      await fetch(`http://localhost:8080/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: editedComment
        })
      })

      setEditingCommentId(null)
      setEditedComment('')
      loadComments(selectedCommentObject.id)
    } catch (error) {
      console.error('Yorum güncelleme hatası:', error)
    }
  }

  const deleteComment = async (commentId) => {
    if (!selectedCommentObject) return

    try {
      await fetch(`http://localhost:8080/comments/${commentId}`, {
        method: 'DELETE'
      })

      loadComments(selectedCommentObject.id)
    } catch (error) {
      console.error('Yorum silme hatası:', error)
    }
  }

  const renderObjectCard = (object) => {
    const isFavorite = favoriteObjectIds.includes(object.id)

    return (
      <div className="card object-card" key={object.id}>
        <span className="card-type">{object.type}</span>
        <h3>{object.name}</h3>
        <p className="card-desc">{object.description}</p>

        <div
          style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '14px',
            flexWrap: 'wrap'
          }}
        >
          <button
            type="button"
            className={`btn ${isFavorite ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => toggleFavorite(object.id)}
          >
            {isFavorite ? 'Favoriden Çıkar' : 'Favoriye Ekle'}
          </button>
        </div>

        <div className="card-footer">
          <span>Durum: {object.status}</span>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => openCommentsPanel(object)}
          >
            Yorumlar
          </button>
        </div>
      </div>
    )
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
          {loggedInUser ? (
            <>
              <span style={{ color: 'white', marginRight: '12px' }}>
                Hoş geldin, {loggedInUser.name}
              </span>
              <button className="btn btn-outline" onClick={openProfilePanel}>
                Profil
              </button>
              <button className="btn btn-outline" onClick={logout}>
                Çıkış Yap
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => openAuthModal('login')}
              >
                Giriş Yap
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => openAuthModal('register')}
              >
                Kayıt Ol
              </button>
            </>
          )}
        </div>
      </header>

      {showAuthPanel && (
        <div className="auth-modal-overlay">
          <div className="card auth-modal-card">
            <h2 className="auth-title">
              {authMode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
            </h2>

            {authMode === 'register' ? (
              <>
                <input
                  type="text"
                  placeholder="Ad Soyad"
                  value={registerForm.name}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, name: e.target.value })
                  }
                  className="auth-input"
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={registerForm.email}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, email: e.target.value })
                  }
                  className="auth-input"
                />

                <input
                  type="password"
                  placeholder="Şifre"
                  value={registerForm.password}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      password: e.target.value
                    })
                  }
                  className="auth-input"
                />

                <button className="btn btn-primary" onClick={handleRegister}>
                  Kayıt Ol
                </button>
              </>
            ) : (
              <>
                <input
                  type="email"
                  placeholder="Email"
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, email: e.target.value })
                  }
                  className="auth-input"
                />

                <input
                  type="password"
                  placeholder="Şifre"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                  className="auth-input"
                />

                <button className="btn btn-primary" onClick={handleLogin}>
                  Giriş Yap
                </button>
              </>
            )}

            {authMessage && <p className="auth-message">{authMessage}</p>}

            <div className="auth-actions-row">
              {authMode === 'login' ? (
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    setAuthMode('register')
                    setAuthMessage('')
                  }}
                >
                  Hesabın yok mu? Kayıt Ol
                </button>
              ) : (
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    setAuthMode('login')
                    setAuthMessage('')
                  }}
                >
                  Zaten hesabın var mı? Giriş Yap
                </button>
              )}

              <button className="btn btn-outline" onClick={closeAuthModal}>
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {showProfilePanel && (
        <div className="auth-modal-overlay">
          <div className="card auth-modal-card">
            <h2 className="auth-title">Profil Bilgileri</h2>

            <input
              type="text"
              placeholder="Ad Soyad"
              value={profileForm.name}
              onChange={(e) =>
                setProfileForm({ ...profileForm, name: e.target.value })
              }
              className="auth-input"
            />

            <input
              type="email"
              placeholder="Email"
              value={profileForm.email}
              onChange={(e) =>
                setProfileForm({ ...profileForm, email: e.target.value })
              }
              className="auth-input"
            />

            <input
              type="password"
              placeholder="Şifre"
              value={profileForm.password}
              onChange={(e) =>
                setProfileForm({ ...profileForm, password: e.target.value })
              }
              className="auth-input"
            />

            <button className="btn btn-primary" onClick={handleProfileUpdate}>
              Profili Güncelle
            </button>

            <div style={{ marginTop: '12px' }}>
              <button className="btn btn-outline" onClick={handleDeleteAccount}>
                Hesabı Sil
              </button>
            </div>

            {profileMessage && <p className="auth-message">{profileMessage}</p>}

            <div className="auth-actions-row">
              <button className="btn btn-outline" onClick={closeProfilePanel}>
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

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
          Galaxy Atlas; uzay nesnelerini listeleyen, favorilere ekleyen ve
          yorum yönetimi yapılabilen modern bir web platformudur.
        </p>

        <div className="hero-buttons">
          <button
            className="btn btn-primary"
            onClick={() => setActivePage('objects')}
          >
            Keşfet
          </button>
          <button
            className="btn btn-outline"
            onClick={() => setActivePage('objects')}
          >
            Detayları İncele
          </button>
        </div>

        <div className="hero-stats">
          <div className="stat-box">
            <h3>{spaceObjects.length}+</h3>
            <p>Uzay Nesnesi</p>
          </div>
          <div className="stat-box">
            <h3>{favorites.length}</h3>
            <p>Favori</p>
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
  </>
)}

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
    <button
      className="nav-link-btn footer-btn"
      onClick={() => setActivePage('home')}
    >
      Ana Sayfa
    </button>

    <button
      className="nav-link-btn footer-btn"
      onClick={() => setActivePage('objects')}
    >
      Nesneler
    </button>

    <button
      className="nav-link-btn footer-btn"
      onClick={() => setActivePage('favorites')}
    >
      Favoriler
    </button>

    <a href="#features">Özellikler</a>
    <a href="#map">Harita</a>
    <a href="#about">Hakkında</a>
 </div>
</footer>
</div>
  )
}

export default App