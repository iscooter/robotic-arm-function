/**
 * Validates input parameters for the sort function.
 * 
 * @param {number} width - Width dimension to validate
 * @param {number} height - Height dimension to validate
 * @param {number} length - Length dimension to validate
 * @param {number} mass - Mass to validate
 * @returns {Object} Object with isValid boolean and error message if invalid
 */
function validateInputs(width, height, length, mass) {
  const params = [
    { name: 'width', value: width },
    { name: 'height', value: height },
    { name: 'length', value: length },
    { name: 'mass', value: mass }
  ];

  // Check if all parameters are provided
  for (const param of params) {
    if (param.value === undefined || param.value === null) {
      return {
        isValid: false,
        error: `Invalid input: ${param.name} is required`
      };
    }
  }

  // Check if all parameters are numbers
  for (const param of params) {
    if (typeof param.value !== 'number' || isNaN(param.value)) {
      return {
        isValid: false,
        error: `Invalid input: ${param.name} must be a valid number`
      };
    }
  }

  // Check if all parameters are finite (not Infinity or -Infinity)
  for (const param of params) {
    if (!isFinite(param.value)) {
      return {
        isValid: false,
        error: `Invalid input: ${param.name} must be a finite number`
      };
    }
  }

  // Check if all parameters are non-negative
  for (const param of params) {
    if (param.value < 0) {
      return {
        isValid: false,
        error: `Invalid input: ${param.name} must be non-negative`
      };
    }
  }

  return { isValid: true };
}

/**
 * Sorts packages into dispatch stacks based on their physical dimensions and mass.
 * 
 * This function implements the Smarter Technology robotic arm sorting algorithm
 * that categorizes packages according to specific business rules for automated
 * handling in a distribution center.
 * 
 * Classification Rules:
 * - BULKY: Volume >= 1,000,000 cm³ OR any dimension >= 150 cm
 * - HEAVY: Mass >= 20 kg
 * - STANDARD: Neither bulky nor heavy (normal automated handling)
 * - SPECIAL: Either bulky OR heavy (requires special handling)
 * - REJECTED: Both bulky AND heavy (cannot be processed)
 * 
 * @param {number} width - Package width in centimeters (cm). Must be non-negative.
 * @param {number} height - Package height in centimeters (cm). Must be non-negative.
 * @param {number} length - Package length in centimeters (cm). Must be non-negative.
 * @param {number} mass - Package mass in kilograms (kg). Must be non-negative.
 * 
 * @returns {string} The dispatch stack identifier:
 *   - "STANDARD": Package can be handled by standard automated systems
 *   - "SPECIAL": Package requires special handling equipment
 *   - "REJECTED": Package cannot be processed and must be rejected
 * 
 * @throws {Error} Throws an error if any input is invalid (null, undefined, 
 *   non-numeric, negative, or infinite)
 * 
 * @example
 * // Standard package
 * sort(10, 10, 10, 5); // Returns "STANDARD"
 * 
 * @example
 * // Bulky package (dimension >= 150cm)
 * sort(150, 10, 10, 10); // Returns "SPECIAL"
 * 
 * @example
 * // Heavy package (mass >= 20kg)
 * sort(10, 10, 10, 25); // Returns "SPECIAL"
 * 
 * @example
 * // Rejected package (both bulky and heavy)
 * sort(150, 10, 10, 25); // Returns "REJECTED"
 */
function sort(width, height, length, mass) {
  // Validate and sanitize inputs
  const validation = validateInputs(width, height, length, mass);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  // Calculate package volume in cubic centimeters
  const volume = width * height * length;
  
  // Bulky threshold constants for maintainability
  const VOLUME_THRESHOLD = 1000000; // cm³
  const DIMENSION_THRESHOLD = 150;   // cm
  
  // Heavy threshold constant
  const MASS_THRESHOLD = 20; // kg
  
  // Determine if package is bulky
  // A package is bulky if its total volume meets/exceeds the threshold
  // OR if any single dimension meets/exceeds the dimension threshold
  const isBulky = volume >= VOLUME_THRESHOLD || 
                  width >= DIMENSION_THRESHOLD || 
                  height >= DIMENSION_THRESHOLD || 
                  length >= DIMENSION_THRESHOLD;
  
  // Determine if package is heavy
  // A package is heavy if its mass meets/exceeds the mass threshold
  const isHeavy = mass >= MASS_THRESHOLD;
  
  // Apply sorting logic based on bulky and heavy classifications
  // Priority order: REJECTED > SPECIAL > STANDARD
  if (isBulky && isHeavy) {
    // Both conditions met: package cannot be handled
    return "REJECTED";
  } else if (isBulky || isHeavy) {
    // Exactly one condition met (XOR): requires special handling
    return "SPECIAL";
  } else {
    // Neither condition met: standard automated handling
    return "STANDARD";
  }
}

module.exports = { sort, validateInputs };
