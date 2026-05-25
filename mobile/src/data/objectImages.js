const objectImages = {
  hubble: [
    require("../../assets/object-images/hubble1.jpeg"),
    require("../../assets/object-images/hubble2.jpeg")
  ],
  "falcon 9": [
    require("../../assets/object-images/falcon1.jpeg"),
    require("../../assets/object-images/falcon2.jpeg")
  ],
  apophis: [
    require("../../assets/object-images/apophis1.jpeg"),
    require("../../assets/object-images/apophis2.jpeg")
  ]
};

export function getObjectImages(name) {
  if (!name) return [];

  const key = name.toLowerCase().trim();

  return objectImages[key] || [];
}