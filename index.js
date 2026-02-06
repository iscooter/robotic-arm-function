/**
 * Sorts packages based on dimensions and mass
 * @param {number} width - Width in cm
 * @param {number} height - Height in cm
 * @param {number} length - Length in cm
 * @param {number} mass - Mass in kg
 * @returns {string} "STANDARD", "SPECIAL", or "REJECTED"
 */
function sort(width, height, length, mass) {
  // Calculate volume
  const volume = width * height * length;
  
  // Check if bulky: volume >= 1,000,000 cm³ OR any dimension >= 150 cm
  const isBulky = volume >= 1000000 || width >= 150 || height >= 150 || length >= 150;
  
  // Check if heavy: mass >= 20 kg
  const isHeavy = mass >= 20;
  
  // Return appropriate stack
  if (isBulky && isHeavy) {
    return "REJECTED";
  } else if (isBulky || isHeavy) {
    // XOR: one is true but not both
    return "SPECIAL";
  } else {
    return "STANDARD";
  }
}

module.exports = { sort };
