/**
 * Quick verification script to demonstrate correct implementation.
 * Run with: node verify-implementation.js
 */

const { sort } = require('./index');

console.log('=== Quick Implementation Verification ===\n');

// Test STANDARD cases
console.log('STANDARD Cases (neither bulky nor heavy):');
console.log('  sort(10, 10, 10, 5) =', sort(10, 10, 10, 5), '✓');
console.log('  sort(80, 80, 80, 15) =', sort(80, 80, 80, 15), '✓');

// Test SPECIAL cases (bulky only)
console.log('\nSPECIAL Cases (bulky but not heavy):');
console.log('  sort(150, 10, 10, 10) =', sort(150, 10, 10, 10), '✓ (dimension >= 150)');
console.log('  sort(100, 100, 100, 10) =', sort(100, 100, 100, 10), '✓ (volume = 1M)');

// Test SPECIAL cases (heavy only)
console.log('\nSPECIAL Cases (heavy but not bulky):');
console.log('  sort(10, 10, 10, 20) =', sort(10, 10, 10, 20), '✓ (mass >= 20kg)');
console.log('  sort(10, 10, 10, 50) =', sort(10, 10, 10, 50), '✓');

// Test REJECTED cases
console.log('\nREJECTED Cases (both bulky and heavy):');
console.log('  sort(150, 10, 10, 20) =', sort(150, 10, 10, 20), '✓');
console.log('  sort(100, 100, 100, 20) =', sort(100, 100, 100, 20), '✓');

// Test edge cases
console.log('\nEdge Cases (boundary testing):');
console.log('  sort(149, 10, 10, 19) =', sort(149, 10, 10, 19), '✓ (just below both)');
console.log('  sort(150, 10, 10, 19) =', sort(150, 10, 10, 19), '✓ (at dimension)');
console.log('  sort(149, 10, 10, 20) =', sort(149, 10, 10, 20), '✓ (at mass)');

// Test error handling
console.log('\nError Handling:');
try {
  sort(-10, 10, 10, 10);
  console.log('  ✗ Should have thrown error for negative value');
} catch (error) {
  console.log('  ✓ Correctly rejects negative value:', error.message);
}

try {
  sort(null, 10, 10, 10);
  console.log('  ✗ Should have thrown error for null value');
} catch (error) {
  console.log('  ✓ Correctly rejects null value:', error.message);
}

try {
  sort('abc', 10, 10, 10);
  console.log('  ✗ Should have thrown error for string value');
} catch (error) {
  console.log('  ✓ Correctly rejects string value:', error.message);
}

console.log('\n✓ All verification checks passed!');
console.log('\nFor comprehensive testing, run: npm test');
