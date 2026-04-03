import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://galaxy-atlas-backend.onrender.com'

function App() {

  const issIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })

  const asteroidIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })

  const dangerousAsteroidIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })

  const satelliteIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })

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

  const [showAuthPanel, setShowAuthPanel] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [authMessage, setAuthMessage] = useState('')
  const [loggedInUser, setLoggedInUser] = useState(null)
  const [issPosition, setIssPosition] = useState(null)

  const [showProfilePanel, setShowProfilePanel] = useState(false)
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [profileMessage, setProfileMessage] = useState('')

  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: ''
  })

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  })

  const [activePage, setActivePage] = useState('home')
  const [selectedCommentObject, setSelectedCommentObject] = useState(null)

  const loadSpaceObjects = () => {
    fetch(`${API_BASE_URL}/space-objects`)
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

  const loadNasaAsteroids = () => {
    fetch(`${API_BASE_URL}/asteroids?startDate=2026-04-02&endDate=2026-04-02`)
      .then((res) => {
        if (!res.ok) throw new Error('Favoriler alınamadı')
        return res.json()
      })
      .then((data) => {
        setFavorites(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        console.error('NASA asteroid yükleme hatası:', err)
        setNasaAsteroids([])
      })
  }

  const loadSatellites = () => {
    fetch(`${API_BASE_URL}/satellites`)
      .then((res) => {
        if (!res.ok) throw new Error('Uydu verisi alınamadı')
        return res.json()
      })
      .then((data) => {
        const mapped = Array.isArray(data)
          ? data.map((sat) => ({
            id: Number(sat.id),
            name: sat.name || 'Bilinmeyen Uydu',
            type: 'UYDU',
            description:
              sat.description || 'CelesTrak API verisi ile alınan gerçek uydu kaydı.',
            status: sat.status || 'Aktif',
            orbit: sat.orbit || 'EARTH',
            risk: sat.risk || 'Düşük'
          }))
          : []

        setSatellites(mapped)
      })
      .catch((err) => {
        console.error('Uydu yükleme hatası:', err)
        setSatellites([])
      })
  }

  const loadFavorites = (userId) => {
    if (!userId) {
      setFavoriteIds([])
      setFavoriteRecords([])
      return
    }

    fetch(`${API_BASE_URL}/favorites/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Favoriler alınamadı')
        return res.json()
      })
      .then((data) => {
        const safeData = Array.isArray(data) ? data : []
        setFavoriteRecords(safeData)
        setFavoriteIds(safeData.map((fav) => fav.spaceObjectId))
      })
      .catch((err) => console.error('Favori listeleme hatası:', err))
  }

  const loadComments = (spaceObjectId) => {
    if (!spaceObjectId) {
      setComments([])
      return
    }

    fetch(`${API_BASE_URL}/comments/${spaceObjectId}`)
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

  useEffect(() => {
    const fetchISS = () => {
      fetch(`${API_BASE_URL}/iss`)
        .then(res => res.json())
        .then(data => {
          const lat = parseFloat(data.iss_position.latitude)
          const lon = parseFloat(data.iss_position.longitude)
          setIssPosition([lat, lon])
        })
    }

    fetchISS()
    const interval = setInterval(fetchISS, 5000)

    return () => clearInterval(interval)
  }, [])

  const getFavoriteRecordByObjectId = (spaceObjectId) =>
    favoriteRecords.find((fav) => fav.spaceObjectId === spaceObjectId)

  const favoriteObjects = useMemo(() => {
    return spaceObjects.filter((object) => favoriteObjectIds.includes(object.id))
  }, [spaceObjects, favoriteObjectIds])

  const toggleFavorite = async (spaceObjectId) => {
    const isFavorite = favoriteObjectIds.includes(spaceObjectId)

    if (existingFavorite) {
      fetch(`${API_BASE_URL}/favorites?userId=${loggedInUser.id}&spaceObjectId=${spaceObjectId}`, {
        method: 'DELETE'
      }
      )
        .then(() => loadFavorites(loggedInUser.id))
        .catch((err) => console.error('Favori silme hatası:', err))
      return
    }

    fetch(`${API_BASE_URL}/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: loggedInUser.id,
        spaceObjectId
      })
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          throw new Error(data.message || 'Favori işlemi başarısız')
        }
        return data
      })
      .then(() => loadFavorites(loggedInUser.id))
      .catch((err) => console.error('Favori ekleme hatası:', err))
  }

  const toggleCompareSelection = (objectId) => {
    if (!loggedInUser) {
      setAuthMessage('Karşılaştırma için önce giriş yapmalısınız.')
      openAuthModal('login')
      return
    }

    if (compareSelection.includes(objectId)) {
      setCompareSelection(compareSelection.filter((id) => id !== objectId))
      return
    }

    if (compareSelection.length >= 2) {
      alert('En fazla 2 nesne seçebilirsiniz.')
      return
    }

    setCompareSelection([...compareSelection, objectId])
  }

  const clearCompareSelection = () => {
    setCompareSelection([])
  }

  const openObjectDetail = (object) => {
    setSelectedObject(object)
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

    if (!loggedInUser) {
      setAuthMessage('Yorum eklemek için önce giriş yapmalısınız.')
      openAuthModal('login')
      return
    }

    if (!selectedObject) return

    fetch(`${API_BASE_URL}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: loggedInUser.id,
        userName: loggedInUser.name,
        spaceObjectId: selectedObject.id,
        content: newComment
      })
    })
      .then((res) => {
        if (!res.ok) throw new Error('Yorum eklenemedi')
        return res.json()
      })
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

  const saveUpdatedComment = async (commentId) => {
    if (!editedComment.trim() || !selectedCommentObject) return

    fetch(`${API_BASE_URL}/comments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: loggedInUser.id,
        content: editedComment
      })
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          throw new Error(data.message || 'Yorum güncellenemedi')
        }
        return data
      })
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
    if (!loggedInUser) return

    fetch(`${API_BASE_URL}/comments/${id}`, {
      method: 'DELETE'
    })
      .then((res) => {
        if (!res.ok) throw new Error('Yorum silinemedi')
        return Promise.resolve()
      })
      .then(() => {
        if (selectedObject) {
          loadComments(selectedObject.id)
        }
      })
      .catch((err) => console.error('Yorum silme hatası:', err))
  }

  const handleRegister = async () => {
    setAuthMessage('')

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerForm)
      })

      const data = await response.json()

      if (!response.ok) {
        setAuthMessage(data.message || 'Kayıt işlemi başarısız.')
        return
      }

      setAuthMessage('Kayıt başarılı. Şimdi giriş yapabilirsiniz.')
      setRegisterForm({
        name: '',
        email: '',
        password: ''
      })
      setAuthMode('login')
    } catch (error) {
      console.error('Yorum güncelleme hatası:', error)
    }
  }

  const deleteComment = async (commentId) => {
    if (!selectedCommentObject) return

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginForm)
      })

      const data = await response.json()

      if (!response.ok) {
        setAuthMessage(data.message || 'Giriş başarısız.')
        return
      }

      setLoggedInUser(data.user)
      localStorage.setItem('loggedInUser', JSON.stringify(data.user))
      if (data.token) {
        localStorage.setItem('token', data.token)
      }

      setAuthMessage('')
      setLoginForm({
        email: '',
        password: ''
      })
      setShowAuthPanel(false)
    } catch (error) {
      console.error('Giriş yapma hatası:', error)
      setAuthMessage('Sunucuya bağlanırken hata oluştu.')
    }
  }

  const handleProfileUpdate = async () => {
    if (!loggedInUser) return

    setProfileMessage('')

    try {
      const response = await fetch(`${API_BASE_URL}/auth/update/${loggedInUser.id}`, {

        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileForm)
      }
      )

      const data = await response.json()

      if (!response.ok) {
        setProfileMessage(data.message || 'Profil güncellenemedi.')
        return
      }

      setLoggedInUser(data.user)
      localStorage.setItem('loggedInUser', JSON.stringify(data.user))
      setProfileMessage('Profil başarıyla güncellendi.')
    } catch (error) {
      console.error('Profil güncelleme hatası:', error)
      setProfileMessage('Sunucuya bağlanırken hata oluştu.')
    }
  }

  const handleDeleteAccount = async () => {
    if (!loggedInUser) return

    const confirmDelete = window.confirm(
      'Hesabınızı silmek istediğinize emin misiniz?'
    )

    if (!confirmDelete) return

    try {
      const response = await fetch(`${API_BASE_URL}/auth/delete/${loggedInUser.id}`, {

        method: 'DELETE'
      }
      )

      const data = await response.json()

      if (!response.ok) {
        setProfileMessage(data.message || 'Hesap silinemedi.')
        return
      }

      closeProfilePanel()
      logout()
      alert('Hesap başarıyla silindi.')
    } catch (error) {
      console.error('Hesap silme hatası:', error)
      setProfileMessage('Sunucuya bağlanırken hata oluştu.')
    }
  }

  const logout = () => {
    setLoggedInUser(null)
    setFavoriteIds([])
    setFavoriteRecords([])
    setComments([])
    setNewComment('')
    setEditedComment('')
    setEditingCommentId(null)
    setAuthMessage('')
    setShowAuthPanel(false)
    setAuthMode('login')
    setSelectedObject(null)
    setShowProfilePanel(false)
    setProfileMessage('')
    setCompareSelection([])

    localStorage.removeItem('loggedInUser')
    localStorage.removeItem('token')
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
          <span className="section-tag">Canlı Harita</span>
          <h2>ISS Konumu</h2>
          <p>Uluslararası Uzay İstasyonu anlık olarak haritada gösterilmektedir.</p>
        </div>

        <div style={{ height: '350px', borderRadius: '20px', overflow: 'hidden' }}>
          <MapContainer
            center={[0, 0]}
            zoom={2}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {issPosition && (
              <Marker position={issPosition}>
                <Popup>
                  <div>
                    <strong>ISS</strong>
                    <br />
                    Uluslararası Uzay İstasyonu
                    <br />
                    Enlem: {issPosition[0].toFixed(4)}
                    <br />
                    Boylam: {issPosition[1].toFixed(4)}
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>


          {issPosition && (
            <div
              className="card"
              style={{ marginTop: '20px', textAlign: 'left' }}
            >
              <h3>Canlı ISS Verisi</h3>
              <p><strong>Enlem:</strong> {issPosition[0].toFixed(4)}</p>
              <p><strong>Boylam:</strong> {issPosition[1].toFixed(4)}</p>
              <p><strong>Kaynak:</strong> Backend / ISS API</p>
              <p className="card-desc">
                Bu veri 5 saniyede bir güncellenmektedir.
              </p>
            </div>
          )}
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