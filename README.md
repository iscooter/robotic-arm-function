# robotic-arm-function

A package sorting function for robotic arm systems that categorizes packages into different stacks based on their dimensions and mass.

## Function

### `sort(width, height, length, mass)`

Sorts packages into three categories: STANDARD, SPECIAL, or REJECTED.

**Parameters:**
- `width` (number): Width in centimeters (cm)
- `height` (number): Height in centimeters (cm)
- `length` (number): Length in centimeters (cm)
- `mass` (number): Mass in kilograms (kg)

**Returns:**
- `"STANDARD"`: Package is neither bulky nor heavy
- `"SPECIAL"`: Package is either bulky OR heavy (but not both)
- `"REJECTED"`: Package is both bulky AND heavy

**Classification Rules:**

A package is **bulky** if:
- Its volume (width × height × length) is ≥ 1,000,000 cm³, OR
- Any single dimension is ≥ 150 cm

A package is **heavy** if:
- Its mass is ≥ 20 kg

## Usage

```javascript
const { sort } = require('./index');

// Standard package
console.log(sort(10, 10, 10, 5)); // "STANDARD"

// Bulky but not heavy
console.log(sort(150, 10, 10, 10)); // "SPECIAL"

// Heavy but not bulky
console.log(sort(10, 10, 10, 25)); // "SPECIAL"

// Both bulky and heavy
console.log(sort(150, 10, 10, 25)); // "REJECTED"
```

## Testing

Run the test suite:

```bash
npm test
```

## Examples

| Width | Height | Length | Mass | Result | Reason |
|-------|--------|--------|------|--------|--------|
| 100 | 100 | 100 | 15 | SPECIAL | Bulky (volume = 1,000,000 cm³) |
| 150 | 10 | 10 | 10 | SPECIAL | Bulky (dimension ≥ 150 cm) |
| 50 | 50 | 50 | 20 | SPECIAL | Heavy (mass ≥ 20 kg) |
| 100 | 100 | 100 | 20 | REJECTED | Both bulky AND heavy |
| 80 | 80 | 80 | 15 | STANDARD | Neither bulky nor heavy |
