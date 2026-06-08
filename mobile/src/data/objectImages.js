const objectImages = {
  hubble: [
    require("../../assets/object-images/hubble1.jpeg"),
    require("../../assets/object-images/hubble2.jpeg")
  ],
  iss: [
    require("../../assets/object-images/hubble1.jpeg"),
    require("../../assets/object-images/hubble2.jpeg")
  ],
  "starlink-101": [
    require("../../assets/object-images/hubble1.jpeg"),
    require("../../assets/object-images/hubble2.jpeg")
  ],

  "falcon 9": [
    require("../../assets/object-images/falcon1.jpeg"),
    require("../../assets/object-images/falcon2.jpeg")
  ],
  "saturn v": [
    require("../../assets/object-images/falcon1.jpeg"),
    require("../../assets/object-images/falcon2.jpeg")
  ],
  "ariane 5": [
    require("../../assets/object-images/falcon1.jpeg"),
    require("../../assets/object-images/falcon2.jpeg")
  ],

  apophis: [
    require("../../assets/object-images/apophis1.jpeg"),
    require("../../assets/object-images/apophis2.jpeg")
  ],
  bennu: [
    require("../../assets/object-images/apophis1.jpeg"),
    require("../../assets/object-images/apophis2.jpeg")
  ],
  ryugu: [
    require("../../assets/object-images/apophis1.jpeg"),
    require("../../assets/object-images/apophis2.jpeg")
  ]
};

export function getObjectImages(name, type) {
  if (!name) return [];

  const key = name.toLowerCase().trim();

  if (objectImages[key]) {
    return objectImages[key];
  }

  const normalizedType = String(type || "").trim().toUpperCase();

  if (normalizedType === "UYDU" || normalizedType === "SATELLITE") {
    return objectImages.hubble;
  }

  if (normalizedType === "ROKET" || normalizedType === "ROCKET") {
    return objectImages["falcon 9"];
  }

  if (
    normalizedType === "ASTEROID" ||
    normalizedType === "ASTEROİD" ||
    normalizedType === "ASTEROIT"
  ) {
    return objectImages.apophis;
  }

  return [];
}