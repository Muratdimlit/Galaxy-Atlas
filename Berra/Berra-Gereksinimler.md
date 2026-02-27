\# Berra - Fonksiyonel Gereksinimler



10\. \*\*Favoriye Ekleme\*\*



\- \*\*API Metodu:\*\* POST /favorites  

\- \*\*Açıklama:\*\* Kullanıcının seçtiği bir uzay nesnesini favorilerine eklemesini sağlar. Kullanıcı daha sonra favori listesinden bu nesnelere hızlıca erişebilir. Güvenlik için giriş yapmış olmak gerekir.



11\. \*\*Favoriden Çıkarma\*\*



\- \*\*API Metodu:\*\* DELETE /favorites/{favoriteId}  

\- \*\*Açıklama:\*\* Kullanıcının favori listesine eklediği uzay nesnesini favorilerden kaldırmasını sağlar. Güvenlik için giriş yapmış olmak gerekir ve kullanıcı yalnızca kendi favorilerini kaldırabilir.



12\. \*\*Favori Listesini Görüntüleme\*\*



\- \*\*API Metodu:\*\* GET /favorites  

\- \*\*Açıklama:\*\* Kullanıcının favoriye eklediği uzay nesnelerini liste halinde görüntülemesini sağlar. Güvenlik için giriş yapmış olmak gerekir.



13\. \*\*Harita Üzerinde Asteroid Gösterme\*\*



\- \*\*API Metodu:\*\* GET /map/asteroids  

\- \*\*Açıklama:\*\* Asteroidlerin harita üzerinde görüntülenmesini sağlar. Kullanıcılar asteroidlerin konumlarını ve temel bilgilerini harita üzerinde inceleyebilir.



14\. \*\*Harita Üzerinde Uydu Gösterme\*\*



\- \*\*API Metodu:\*\* GET /map/satellites  

\- \*\*Açıklama:\*\* Uyduların harita üzerinde görüntülenmesini sağlar. Kullanıcılar uyduların konumlarını ve temel bilgilerini harita üzerinde inceleyebilir.



15\. \*\*Harita Üzerinde Roket Gösterme\*\*



\- \*\*API Metodu:\*\* GET /map/rockets  

\- \*\*Açıklama:\*\* Roketlerin harita üzerinde görüntülenmesini sağlar. Kullanıcılar roketlerin konumlarını ve temel bilgilerini harita üzerinde inceleyebilir.



16\. \*\*Yorum Yapma\*\*



\- \*\*API Metodu:\*\* POST /comments  

\- \*\*Açıklama:\*\* Kullanıcının uzay nesneleri hakkında yorum yapmasını sağlar. Kullanıcı yaptığı yorum ile görüş ve değerlendirmelerini paylaşabilir. Güvenlik için giriş yapmış olmak gerekir.



17\. \*\*Yorum Silme\*\*



\- \*\*API Metodu:\*\* DELETE /comments/{commentId}  

\- \*\*Açıklama:\*\* Kullanıcının daha önce yaptığı yorumu silmesini sağlar. Güvenlik için giriş yapmış olmak gerekir ve kullanıcı yalnızca kendi yorumunu silebilir.



18\. \*\*Yorum Güncelleme\*\*



\- \*\*API Metodu:\*\* PUT /comments/{commentId}  

\- \*\*Açıklama:\*\* Kullanıcının daha önce yaptığı yorumu güncellemesini sağlar. Kullanıcı yorum metnini değiştirebilir. Güvenlik için giriş yapmış olmak gerekir ve kullanıcı yalnızca kendi yorumunu güncelleyebilir.



19\. \*\*AI Destekli Nesne Önerisi (Yapay Zeka Gereksinimi)\*\*



\- \*\*API Metodu:\*\* GET /recommendations  

\- \*\*Açıklama:\*\* Kullanıcının geçmişte görüntülediği, favorilere eklediği ve yorum yaptığı uzay nesnelerine göre benzer uzay nesnelerini önerir. Kullanıcı önerilen uzay nesnelerini liste halinde görüntüleyebilir. Güvenlik için giriş yapmış olmak gerekir.

