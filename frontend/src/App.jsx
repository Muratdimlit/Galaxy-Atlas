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
    loadSpaceObjects()
    loadFavorites()
  }, [])

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
          <button className="btn btn-outline">Test Kullanıcı: 1</button>
        </div>
      </header>

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

          <section className="about section" id="about">
            <div className="about-box">
              <div className="about-text">
                <span className="section-tag">Proje Hakkında</span>
                <h2>Yazılım Mühendisliği Dersi İçin Geliştiriliyor</h2>
                <p>
                  Bu sürümde kullanıcı bir uzay nesnesini favorilere ekleyebilir,
                  favoriler listesini görebilir ve yorumları ayrı panelden
                  yönetebilir.
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
        </>
      )}

      {activePage === 'objects' && (
        <section className="objects section" id="objects">
          <div className="section-header">
            <span className="section-tag">Uzay Nesneleri</span>
            <h2>Tüm Nesneler</h2>
            <p>
              Buradan nesneleri inceleyebilir, favoriye ekleyebilir ve yorum
              panelini açabilirsiniz.
            </p>
          </div>

          <div className="card-container object-grid">
            {spaceObjects.map((object) => renderObjectCard(object))}
          </div>

          {selectedCommentObject && (
            <div className="card" style={{ marginTop: '30px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '16px',
                  flexWrap: 'wrap',
                  marginBottom: '18px'
                }}
              >
                <div>
                  <h3 style={{ marginBottom: '6px' }}>
                    {selectedCommentObject.name} - Yorumlar
                  </h3>
                  <p className="card-desc" style={{ marginBottom: 0 }}>
                    Bu nesneye ait yorumları buradan yönetebilirsiniz.
                  </p>
                </div>

                <button className="btn btn-outline" onClick={closeCommentsPanel}>
                  Kapat
                </button>
              </div>

              <div className="detail-comment-form">
                <input
                  type="text"
                  placeholder="Yorum yaz..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="auth-input"
                />
                <button className="btn btn-primary" onClick={addComment}>
                  Ekle
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
                          <p style={{ marginBottom: '10px', color: '#eaf4ff' }}>
                            {comment.content}
                          </p>

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
          )}
        </section>
      )}

      {activePage === 'favorites' && (
        <section className="section" id="favorites">
          <div className="section-header">
            <span className="section-tag">Favoriler</span>
            <h2>Favori Nesnelerim</h2>
            <p>Favoriye eklediğiniz uzay nesneleri burada listelenir.</p>
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
          <div className="map-center-text">Harita alanı burada gösterilecek</div>
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