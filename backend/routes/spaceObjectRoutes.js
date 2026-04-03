const express = require("express");
const router = express.Router();

const spaceObjects = require("../data/spaceObjects");

router.get("/", (req, res) => {
  return res.status(200).json(spaceObjects);
});

router.post("/compare", (req, res) => {
  const { ids } = req.body || {};

  if (!ids || !Array.isArray(ids) || ids.length < 2) {
    return res.status(400).json({
      message: "Karşılaştırma için en az iki nesne id'si gönderilmelidir."
    });
  }

  const selectedObjects = spaceObjects.filter((obj) => ids.includes(obj.id));

  if (selectedObjects.length < 2) {
    return res.status(404).json({
      message: "Karşılaştırılacak yeterli uzay nesnesi bulunamadı."
    });
  }

  return res.status(200).json({
    message: "Karşılaştırma verileri hazır.",
    objects: selectedObjects
  });
});

router.post("/filter", (req, res) => {
  const { type, minSpeed, maxDistance } = req.body || {};

  let filteredObjects = [...spaceObjects];

  if (type) {
    filteredObjects = filteredObjects.filter(
      (obj) => obj.type.toLowerCase() === type.toLowerCase()
    );
  }

  if (minSpeed) {
    filteredObjects = filteredObjects.filter((obj) => {
      const speedValue = parseInt(obj.speed);
      return speedValue >= minSpeed;
    });
  }

  if (maxDistance) {
    filteredObjects = filteredObjects.filter((obj) => {
      const distanceValue = parseInt(obj.distance.replace(/[^0-9]/g, ""));
      return distanceValue <= maxDistance;
    });
  }

  return res.status(200).json({
    message: "Filtreleme sonuçları hazır.",
    objects: filteredObjects
  });
});

router.post("/anomaly-detect", (req, res) => {
  const analyzedObjects = spaceObjects.map((obj) => {
    const speedValue = parseInt(obj.speed);
    const distanceValue = parseInt(obj.distance.replace(/[^0-9]/g, ""));

    let riskScore = 0;
    const reasons = [];

    if (speedValue > 50000) {
      riskScore += 50;
      reasons.push("Hız normal eşik değerinin çok üstünde.");
    } else if (speedValue > 30000) {
      riskScore += 25;
      reasons.push("Hız beklenen aralığın üst sınırında.");
    }

    if (distanceValue > 1000000000) {
      riskScore += 50;
      reasons.push("Mesafe olağandışı derecede büyük.");
    } else if (distanceValue > 500000000) {
      riskScore += 25;
      reasons.push("Mesafe yüksek risk grubunda.");
    }

    const isAnomaly = riskScore >= 50;

    return {
      id: obj.id,
      name: obj.name,
      type: obj.type,
      speed: obj.speed,
      distance: obj.distance,
      riskScore,
      isAnomaly,
      reason: reasons.length > 0 ? reasons.join(" ") : "Normal davranış aralığında."
    };
  });

  const anomalies = analyzedObjects.filter((obj) => obj.isAnomaly);

  return res.status(200).json({
    message: "AI destekli anomali analizi tamamlandı.",
    totalObjectsAnalyzed: analyzedObjects.length,
    anomalyCount: anomalies.length,
    anomalies
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  const object = spaceObjects.find((obj) => obj.id === parseInt(id));

  if (!object) {
    return res.status(404).json({
      message: "Uzay nesnesi bulunamadı."
    });
  }

  return res.status(200).json(object);
});

module.exports = router;