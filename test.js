const { sort } = require('./index');

// Test helper
let passed = 0;
let failed = 0;

function test(description, width, height, length, mass, expected) {
  const result = sort(width, height, length, mass);
  if (result === expected) {
    console.log(`✓ PASS: ${description}`);
    passed++;
  } else {
    console.log(`✗ FAIL: ${description}`);
    console.log(`  Expected: ${expected}, Got: ${result}`);
    failed++;
  }
}

console.log('Running tests for sort function...\n');

// STANDARD cases (neither bulky nor heavy)
console.log('=== STANDARD cases ===');
test('Small and light package', 10, 10, 10, 5, 'STANDARD');
test('Medium package under all thresholds', 50, 50, 50, 10, 'STANDARD');
test('Package with dimensions and mass below thresholds', 80, 80, 80, 15, 'STANDARD');

// SPECIAL cases (bulky XOR heavy)
console.log('\n=== SPECIAL cases (bulky but not heavy) ===');
test('Bulky by volume, not heavy', 100, 100, 100, 10, 'SPECIAL');
test('Bulky by width, not heavy', 150, 10, 10, 5, 'SPECIAL');
test('Bulky by height, not heavy', 10, 150, 10, 5, 'SPECIAL');
test('Bulky by length, not heavy', 10, 10, 150, 5, 'SPECIAL');
test('Bulky by multiple dimensions, not heavy', 200, 50, 50, 15, 'SPECIAL');
test('Exactly at volume threshold, not heavy', 100, 100, 100, 15, 'SPECIAL');

console.log('\n=== SPECIAL cases (heavy but not bulky) ===');
test('Heavy but not bulky', 10, 10, 10, 20, 'SPECIAL');
test('Very heavy but small', 10, 10, 10, 50, 'SPECIAL');
test('Just at heavy threshold, not bulky', 50, 50, 50, 20, 'SPECIAL');

// REJECTED cases (bulky AND heavy)
console.log('\n=== REJECTED cases (bulky AND heavy) ===');
test('Bulky by volume and heavy', 100, 100, 100, 20, 'REJECTED');
test('Bulky by dimension and heavy', 150, 10, 10, 20, 'REJECTED');
test('Very bulky and very heavy', 200, 200, 200, 100, 'REJECTED');
test('Bulky by multiple dimensions and heavy', 150, 150, 50, 25, 'REJECTED');

// Edge cases
console.log('\n=== Edge cases ===');
test('Exactly at volume threshold (1,000,000)', 100, 100, 100, 10, 'SPECIAL');
test('Just below volume threshold', 99, 100, 100, 10, 'STANDARD');
test('Exactly at dimension threshold (150)', 150, 10, 10, 10, 'SPECIAL');
test('Just below dimension threshold (149)', 149, 10, 10, 10, 'STANDARD');
test('Exactly at mass threshold (20)', 10, 10, 10, 20, 'SPECIAL');
test('Just below mass threshold (19)', 10, 10, 10, 19, 'STANDARD');
test('At both thresholds', 150, 10, 10, 20, 'REJECTED');

// Summary
console.log('\n=== Test Summary ===');
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Total: ${passed + failed}`);

if (failed === 0) {
  console.log('\n✓ All tests passed!');
  process.exit(0);
} else {
  console.log(`\n✗ ${failed} test(s) failed`);
  process.exit(1);
}
