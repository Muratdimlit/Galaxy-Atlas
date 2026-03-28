import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

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
  const [favoriteIds, setFavoriteIds] = useState([])
  const [favoriteRecords, setFavoriteRecords] = useState([])
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
  const [selectedObject, setSelectedObject] = useState(null)

  const [filterType, setFilterType] = useState('ALL')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [filterRisk, setFilterRisk] = useState('ALL')

  const [compareSelection, setCompareSelection] = useState([])

  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode)
    setAuthMessage('')
    setShowAuthPanel(true)
  }

  const closeAuthModal = () => {
    setShowAuthPanel(false)
    setAuthMessage('')
  }

  const openProfilePanel = () => {
    if (!loggedInUser) return

    setProfileForm({
      name: loggedInUser.name || '',
      email: loggedInUser.email || '',
      password: loggedInUser.password || ''
    })
    setProfileMessage('')
    setShowProfilePanel(true)
  }

  const closeProfilePanel = () => {
    setShowProfilePanel(false)
    setProfileMessage('')
  }

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

  const loadFavorites = (userId) => {
    if (!userId) {
      setFavoriteIds([])
      setFavoriteRecords([])
      return
    }

    fetch(`http://localhost:8080/favorites/${userId}`)
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

    fetch(`http://localhost:8080/comments/${spaceObjectId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Yorumlar alınamadı')
        return res.json()
      })
      .then((data) => {
        setComments(Array.isArray(data) ? data : [])
      })
      .catch((err) => console.error('Yorum listeleme hatası:', err))
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

  useEffect(() => {
    const fetchISS = () => {
      fetch("http://localhost:8080/iss")
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
    return spaceObjects.filter((object) => favoriteIds.includes(object.id))
  }, [spaceObjects, favoriteIds])

  const filteredObjects = useMemo(() => {
    return spaceObjects.filter((object) => {
      const typeMatch = filterType === 'ALL' || object.type === filterType
      const statusMatch =
        filterStatus === 'ALL' || object.status === filterStatus
      const riskMatch = filterRisk === 'ALL' || object.risk === filterRisk

      return typeMatch && statusMatch && riskMatch
    })
  }, [spaceObjects, filterType, filterStatus, filterRisk])

  const comparedObjects = useMemo(() => {
    return spaceObjects.filter((object) => compareSelection.includes(object.id))
  }, [spaceObjects, compareSelection])

  const toggleFavorite = (spaceObjectId) => {
    if (!loggedInUser) {
      setAuthMessage('Favori eklemek için önce giriş yapmalısınız.')
      openAuthModal('login')
      return
    }

    const existingFavorite = getFavoriteRecordByObjectId(spaceObjectId)

    if (existingFavorite) {
      fetch(
        `http://localhost:8080/favorites?userId=${loggedInUser.id}&spaceObjectId=${spaceObjectId}`,
        {
          method: 'DELETE'
        }
      )
        .then(() => loadFavorites(loggedInUser.id))
        .catch((err) => console.error('Favori silme hatası:', err))
      return
    }

    fetch('http://localhost:8080/favorites', {
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
  }

  const closeObjectDetail = () => {
    setSelectedObject(null)
    setComments([])
    setNewComment('')
    setEditingCommentId(null)
    setEditedComment('')
  }

  const addComment = () => {
    if (!newComment.trim()) return

    if (!loggedInUser) {
      setAuthMessage('Yorum eklemek için önce giriş yapmalısınız.')
      openAuthModal('login')
      return
    }

    if (!selectedObject) return

    fetch('http://localhost:8080/comments', {
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
    if (!loggedInUser || loggedInUser.id !== comment.userId) return
    setEditingCommentId(comment.id)
    setEditedComment(comment.content)
  }

  const cancelEditingComment = () => {
    setEditingCommentId(null)
    setEditedComment('')
  }

  const saveUpdatedComment = (id) => {
    if (!editedComment.trim() || !loggedInUser) return

    fetch(`http://localhost:8080/comments/${id}`, {
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

    fetch(`http://localhost:8080/comments/${id}`, {
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
      const response = await fetch('http://localhost:8080/auth/register', {
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
      console.error('Kayıt olma hatası:', error)
      setAuthMessage('Sunucuya bağlanırken hata oluştu.')
    }
  }

  const handleLogin = async () => {
    setAuthMessage('')

    try {
      const response = await fetch('http://localhost:8080/auth/login', {
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
      const response = await fetch(
        `http://localhost:8080/auth/update/${loggedInUser.id}`,
        {
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
      const response = await fetch(
        `http://localhost:8080/auth/delete/${loggedInUser.id}`,
        {
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
    const isFavorite = favoriteIds.includes(object.id)
    const isSelectedForCompare = compareSelection.includes(object.id)

    return (
      <div className="card object-card" key={object.id}>
        <button
          className={`favorite-star ${isFavorite ? 'active' : ''}`}
          onClick={() => toggleFavorite(object.id)}
          title="Favoriye ekle"
        >
          ★
        </button>

        <span className="card-type">{object.type}</span>
        <h3>{object.name}</h3>
        <p className="card-desc">{object.description}</p>

        {loggedInUser && (
          <div style={{ marginBottom: '14px' }}>
            <button
              className={`btn ${isSelectedForCompare ? 'btn-primary' : 'btn-outline'
                }`}
              onClick={() => toggleCompareSelection(object.id)}
            >
              {isSelectedForCompare ? 'Seçildi' : 'Karşılaştır'}
            </button>
          </div>
        )}

        <div className="card-footer">
          <span>Durum: {object.status}</span>
          <button
            className="btn btn-outline"
            onClick={() => openObjectDetail(object)}
          >
            Detay
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
          <button
            className="nav-link-btn"
            onClick={() => setActivePage('objects')}
          >
            Nesneler
          </button>
          <button
            className="nav-link-btn"
            onClick={() => setActivePage('favorites')}
          >
            Favoriler
          </button>
          <a href="#features">Özellikler</a>
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

            <div className="detail-comments-section">
              <h3>Yorumlar</h3>

              {!loggedInUser ? (
                <p className="card-desc">Yorum eklemek için giriş yapın.</p>
              ) : (
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
              )}

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
                            {comment.userName || 'Bilinmeyen Kullanıcı'}
                          </p>
                          <p style={{ marginBottom: '10px' }}>{comment.content}</p>

                          {loggedInUser &&
                            loggedInUser.id === comment.userId && (
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
                            )}
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
                karşılaştırma ve inceleme imkânı sunan modern bir web platformudur.
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
                <p>Her nesne için detay paneli, yorumlar ve takip bilgileri.</p>
              </div>
              <div className="feature-card">
                <h3>Favoriler</h3>
                <p>Nesneleri yıldız ile favorilere ekleme ve kişisel listeleme.</p>
              </div>
              <div className="feature-card">
                <h3>REST API</h3>
                <p>Backend servisleri ile veri akışını sağlayan modern yapı.</p>
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
        </>
      )}

      {activePage === 'objects' && (
        <section className="objects section" id="objects">
          <div className="section-header">
            <span className="section-tag">Uzay Nesneleri</span>
            <h2>Tüm Nesneler</h2>
            <p>
              Buradan nesneleri inceleyebilir, favorilere ekleyebilir, filtreleyebilir
              ve karşılaştırabilirsiniz.
            </p>
          </div>

          {!loggedInUser ? (
            <div className="card">
              <p className="card-desc">
                Filtreleme ve karşılaştırma özelliklerini kullanmak için giriş yapın.
              </p>
            </div>
          ) : (
            <>
              <div className="card" style={{ marginBottom: '28px' }}>
                <h3 style={{ marginBottom: '18px' }}>Filtreleme</h3>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '14px'
                  }}
                >
                  <select
                    className="auth-input"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="ALL">Tüm Türler</option>
                    <option value="UYDU">UYDU</option>
                    <option value="ROKET">ROKET</option>
                    <option value="ASTEROID">ASTEROID</option>
                  </select>

                  <select
                    className="auth-input"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="ALL">Tüm Durumlar</option>
                    <option value="Aktif">Aktif</option>
                    <option value="Hazır">Hazır</option>
                    <option value="İzleniyor">İzleniyor</option>
                  </select>

                  <select
                    className="auth-input"
                    value={filterRisk}
                    onChange={(e) => setFilterRisk(e.target.value)}
                  >
                    <option value="ALL">Tüm Riskler</option>
                    <option value="Düşük">Düşük</option>
                    <option value="Orta">Orta</option>
                    <option value="Yüksek">Yüksek</option>
                  </select>

                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      setFilterType('ALL')
                      setFilterStatus('ALL')
                      setFilterRisk('ALL')
                    }}
                  >
                    Filtreleri Temizle
                  </button>
                </div>
              </div>

              <div className="card" style={{ marginBottom: '28px' }}>
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
                    <h3 style={{ marginBottom: '6px' }}>Karşılaştırma Alanı</h3>
                    <p className="card-desc" style={{ marginBottom: 0 }}>
                      Karşılaştırmak için en fazla 2 nesne seçin.
                    </p>
                  </div>

                  <button
                    className="btn btn-outline"
                    onClick={clearCompareSelection}
                  >
                    Seçimi Temizle
                  </button>
                </div>

                {comparedObjects.length === 0 ? (
                  <p className="card-desc">
                    Henüz karşılaştırma için nesne seçilmedi.
                  </p>
                ) : (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                      gap: '18px'
                    }}
                  >
                    {comparedObjects.map((object) => (
                      <div key={object.id} className="card">
                        <span className="card-type">{object.type}</span>
                        <h3>{object.name}</h3>
                        <p className="card-desc">{object.description}</p>
                        <p>
                          <strong>Durum:</strong> {object.status}
                        </p>
                        <p>
                          <strong>Yörünge:</strong> {object.orbit}
                        </p>
                        <p>
                          <strong>Risk:</strong> {object.risk}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="card-container object-grid">
                {filteredObjects.length === 0 ? (
                  <div className="card">
                    <p className="card-desc">
                      Bu filtrelere uygun nesne bulunamadı.
                    </p>
                  </div>
                ) : (
                  filteredObjects.map((object) => renderObjectCard(object))
                )}
              </div>
            </>
          )}
        </section>
      )}

      {activePage === 'favorites' && (
        <section className="section" id="favorites">
          <div className="section-header">
            <span className="section-tag">Favoriler</span>
            <h2>Favori Nesnelerim</h2>
            <p>
              Yıldız ikonuna bastığınız nesneler burada kart olarak görünür.
            </p>
          </div>

          {!loggedInUser ? (
            <div className="card">
              <p className="card-desc">
                Favori nesneleri görmek için giriş yapın.
              </p>
            </div>
          ) : favoriteObjects.length === 0 ? (
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