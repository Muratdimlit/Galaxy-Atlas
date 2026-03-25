const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const users = [];

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Ad, email ve şifre zorunludur."
      });
    }

    const existingUser = users.find((user) => user.email === email);

    if (existingUser) {
      return res.status(409).json({
        message: "Bu email ile kayıtlı kullanıcı zaten var."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: users.length + 1,
      name,
      email,
      password: hashedPassword
    };

    users.push(newUser);

    return res.status(201).json({
      message: "Kullanıcı başarıyla kaydedildi.",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "Sunucu hatası.",
      error: error.message
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        message: "Email ve şifre zorunludur."
      });
    }

    const user = users.find((u) => u.email === email);

    if (!user) {
      return res.status(404).json({
        message: "Kullanıcı bulunamadı."
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Şifre yanlış."
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Giriş başarılı.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "Sunucu hatası.",
      error: error.message
    });
  }
});

router.put("/users/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, password } = req.body || {};

    if (parseInt(userId) !== req.user.id) {
      return res.status(403).json({
        message: "Başka kullanıcının bilgilerini güncelleyemezsiniz."
      });
    }

    const user = users.find((u) => u.id === parseInt(userId));

    if (!user) {
      return res.status(404).json({
        message: "Kullanıcı bulunamadı."
      });
    }

    if (email) {
      const emailOwner = users.find(
        (u) => u.email === email && u.id !== parseInt(userId)
      );

      if (emailOwner) {
        return res.status(409).json({
          message: "Bu email başka bir kullanıcı tarafından kullanılıyor."
        });
      }
    }

    if (name) user.name = name;
    if (email) user.email = email;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    return res.status(200).json({
      message: "Profil başarıyla güncellendi.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "Sunucu hatası.",
      error: error.message
    });
  }
});

module.exports = router;

router.delete("/users/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    if (parseInt(userId) !== req.user.id) {
      return res.status(403).json({
        message: "Başka kullanıcının hesabını silemezsiniz."
      });
    }

    const userIndex = users.findIndex((u) => u.id === parseInt(userId));

    if (userIndex === -1) {
      return res.status(404).json({
        message: "Kullanıcı bulunamadı."
      });
    }

    users.splice(userIndex, 1);

    return res.status(200).json({
      message: "Hesap başarıyla silindi."
    });
  } catch (error) {
    return res.status(500).json({
      message: "Sunucu hatası.",
      error: error.message
    });
  }
});