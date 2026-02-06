/**
 * Comprehensive test suite for the robotic arm package sorting function.
 * 
 * This test suite validates:
 * 1. Correct sorting logic for all package categories
 * 2. Edge case handling at threshold boundaries
 * 3. Input validation and error handling
 * 4. Comprehensive coverage from dataset.txt
 * 
 * Test Categories:
 * - STANDARD: Packages neither bulky nor heavy
 * - SPECIAL (bulky): Packages that are bulky but not heavy
 * - SPECIAL (heavy): Packages that are heavy but not bulky
 * - REJECTED: Packages that are both bulky and heavy
 * - Edge cases: Boundary values and decimal precision
 * - Error handling: Invalid inputs and error conditions
 */

const fs = require('fs');
const path = require('path');
const { sort, validateInputs } = require('./index');

// Test result tracking
const results = {
  passed: 0,
  failed: 0,
  errors: 0,
  byCategory: {},
  details: [] // Store all test details for HTML report
};

/**
 * Runs a single test case and records the result.
 * 
 * @param {string} description - Test case description
 * @param {number} width - Package width in cm
 * @param {number} height - Package height in cm
 * @param {number} length - Package length in cm
 * @param {number} mass - Package mass in kg
 * @param {string} expected - Expected result ("STANDARD", "SPECIAL", or "REJECTED")
 * @param {string} category - Test category for grouping results
 */
function test(description, width, height, length, mass, expected, category) {
  try {
    const result = sort(width, height, length, mass);
    
    // Track results by category
    if (!results.byCategory[category]) {
      results.byCategory[category] = { passed: 0, failed: 0, total: 0 };
    }
    results.byCategory[category].total++;
    
    const passed = result === expected;
    const testDetail = {
      description,
      category,
      input: { width, height, length, mass },
      expected,
      actual: result,
      passed,
      error: null
    };
    
    if (passed) {
      console.log(`✓ PASS: ${description}`);
      results.passed++;
      results.byCategory[category].passed++;
    } else {
      console.log(`✗ FAIL: ${description}`);
      console.log(`  Input: w=${width}, h=${height}, l=${length}, m=${mass}`);
      console.log(`  Expected: ${expected}, Got: ${result}`);
      results.failed++;
      results.byCategory[category].failed++;
    }
    
    results.details.push(testDetail);
  } catch (error) {
    console.log(`✗ ERROR: ${description}`);
    console.log(`  ${error.message}`);
    results.errors++;
    if (!results.byCategory[category]) {
      results.byCategory[category] = { passed: 0, failed: 0, total: 0 };
    }
    results.byCategory[category].total++;
    results.byCategory[category].failed++;
    
    results.details.push({
      description,
      category,
      input: { width, height, length, mass },
      expected,
      actual: null,
      passed: false,
      error: error.message
    });
  }
}

/**
 * Tests error handling for invalid inputs.
 * 
 * @param {string} description - Test case description
 * @param {Array} args - Arguments to pass to sort function
 * @param {boolean} shouldThrow - Whether an error is expected
 */
function testErrorHandling(description, args, shouldThrow = true) {
  try {
    const result = sort(...args);
    const passed = !shouldThrow;
    
    results.details.push({
      description,
      category: 'error_handling',
      input: { width: args[0], height: args[1], length: args[2], mass: args[3] },
      expected: shouldThrow ? 'Error' : 'Success',
      actual: result,
      passed,
      error: null
    });
    
    if (shouldThrow) {
      console.log(`✗ FAIL: ${description}`);
      console.log(`  Expected error but got result: ${result}`);
      results.failed++;
    } else {
      console.log(`✓ PASS: ${description}`);
      results.passed++;
    }
  } catch (error) {
    const passed = shouldThrow;
    
    results.details.push({
      description,
      category: 'error_handling',
      input: { width: args[0], height: args[1], length: args[2], mass: args[3] },
      expected: shouldThrow ? 'Error' : 'Success',
      actual: 'Error thrown',
      passed,
      error: error.message
    });
    
    if (shouldThrow) {
      console.log(`✓ PASS: ${description}`);
      console.log(`  Correctly threw: ${error.message}`);
      results.passed++;
    } else {
      console.log(`✗ FAIL: ${description}`);
      console.log(`  Unexpected error: ${error.message}`);
      results.failed++;
    }
  }
}

/**
 * Parses and runs tests from the dataset file.
 * 
 * @param {string} datasetPath - Path to the dataset.txt file
 */
function runDatasetTests(datasetPath) {
  try {
    const fileContent = fs.readFileSync(datasetPath, 'utf-8');
    const lines = fileContent.split('\n');
    
    let currentCategory = '';
    
    for (const line of lines) {
      // Skip comments and empty lines
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith('#')) {
        // Extract category from comments for section headers
        if (trimmedLine.startsWith('#') && !trimmedLine.startsWith('# Format:') && !trimmedLine.startsWith('# Units:') && !trimmedLine.startsWith('# Robotic')) {
          currentCategory = trimmedLine.substring(2).trim();
        }
        continue;
      }
      
      // Parse CSV line: width,height,length,mass,expected,category,description
      const parts = trimmedLine.split(',');
      if (parts.length >= 7) {
        const width = parseFloat(parts[0]);
        const height = parseFloat(parts[1]);
        const length = parseFloat(parts[2]);
        const mass = parseFloat(parts[3]);
        const expected = parts[4].trim();
        const category = parts[5].trim();
        const description = parts.slice(6).join(',').trim();
        
        test(description, width, height, length, mass, expected, category);
      }
    }
  } catch (error) {
    console.error(`Error reading dataset file: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Generates an HTML test results report.
 * 
 * @param {string} outputPath - Path where the HTML file should be saved
 */
function generateHtmlReport(outputPath) {
  const totalTests = results.passed + results.failed;
  const successRate = ((results.passed / totalTests) * 100).toFixed(2);
  const timestamp = new Date().toLocaleString();
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Robotic Arm Test Results</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        .header p {
            font-size: 1.1em;
            opacity: 0.9;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 40px;
            background: #f8f9fa;
        }
        .stat-card {
            background: white;
            padding: 25px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s;
        }
        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .stat-card h3 {
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #666;
            margin-bottom: 10px;
        }
        .stat-card .number {
            font-size: 3em;
            font-weight: bold;
            color: #667eea;
        }
        .stat-card.success .number { color: #28a745; }
        .stat-card.failure .number { color: #dc3545; }
        .stat-card.rate .number { color: #667eea; }
        .categories {
            padding: 40px;
        }
        .categories h2 {
            margin-bottom: 25px;
            color: #333;
            font-size: 1.8em;
        }
        .category-grid {
            display: grid;
            gap: 15px;
            margin-bottom: 40px;
        }
        .category-item {
            background: white;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .category-item h3 {
            color: #495057;
            font-size: 1.1em;
        }
        .category-stats {
            display: flex;
            gap: 15px;
            align-items: center;
        }
        .progress-bar {
            width: 200px;
            height: 8px;
            background: #e9ecef;
            border-radius: 4px;
            overflow: hidden;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #28a745, #20c997);
            transition: width 0.3s ease;
        }
        .category-badge {
            padding: 6px 12px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 0.9em;
        }
        .badge-success {
            background: #d4edda;
            color: #155724;
        }
        .badge-warning {
            background: #fff3cd;
            color: #856404;
        }
        .test-details {
            padding: 0 40px 40px;
        }
        .test-details h2 {
            margin-bottom: 25px;
            color: #333;
            font-size: 1.8em;
        }
        .filter-buttons {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }
        .filter-btn {
            padding: 10px 20px;
            border: 2px solid #667eea;
            background: white;
            color: #667eea;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.2s;
        }
        .filter-btn:hover, .filter-btn.active {
            background: #667eea;
            color: white;
        }
        .test-item {
            background: white;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 15px;
            transition: all 0.2s;
        }
        .test-item:hover {
            border-color: #667eea;
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
        }
        .test-item.passed {
            border-left: 4px solid #28a745;
        }
        .test-item.failed {
            border-left: 4px solid #dc3545;
        }
        .test-header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 10px;
        }
        .test-title {
            font-weight: 600;
            font-size: 1.1em;
            color: #333;
        }
        .test-badge {
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 0.85em;
            font-weight: bold;
        }
        .badge-pass {
            background: #d4edda;
            color: #155724;
        }
        .badge-fail {
            background: #f8d7da;
            color: #721c24;
        }
        .test-details-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
            margin-top: 15px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 6px;
        }
        .detail-item {
            display: flex;
            flex-direction: column;
        }
        .detail-label {
            font-size: 0.85em;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
        }
        .detail-value {
            font-family: 'Courier New', monospace;
            font-weight: 600;
            color: #333;
        }
        .error-message {
            margin-top: 10px;
            padding: 10px;
            background: #f8d7da;
            border-left: 4px solid #dc3545;
            border-radius: 4px;
            color: #721c24;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
        }
        .footer {
            padding: 30px 40px;
            background: #f8f9fa;
            text-align: center;
            color: #666;
            border-top: 2px solid #e9ecef;
        }
        @media (max-width: 768px) {
            .header h1 { font-size: 1.8em; }
            .summary { grid-template-columns: 1fr; }
            .test-details-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🤖 Robotic Arm Package Sorting</h1>
            <p>Comprehensive Test Results Report</p>
            <p style="font-size: 0.9em; margin-top: 10px;">Generated: ${timestamp}</p>
        </div>
        
        <div class="summary">
            <div class="stat-card">
                <h3>Total Tests</h3>
                <div class="number">${totalTests}</div>
            </div>
            <div class="stat-card success">
                <h3>Passed</h3>
                <div class="number">${results.passed}</div>
            </div>
            <div class="stat-card failure">
                <h3>Failed</h3>
                <div class="number">${results.failed}</div>
            </div>
            <div class="stat-card rate">
                <h3>Success Rate</h3>
                <div class="number">${successRate}%</div>
            </div>
        </div>
        
        <div class="categories">
            <h2>📊 Results by Category</h2>
            <div class="category-grid">
                ${Object.entries(results.byCategory).map(([category, stats]) => {
                    const percentage = ((stats.passed / stats.total) * 100).toFixed(1);
                    const badgeClass = percentage === "100.0" ? "badge-success" : "badge-warning";
                    return `
                        <div class="category-item">
                            <h3>${category.replace(/_/g, ' ').toUpperCase()}</h3>
                            <div class="category-stats">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${percentage}%"></div>
                                </div>
                                <span class="category-badge ${badgeClass}">${stats.passed}/${stats.total} (${percentage}%)</span>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
        
        <div class="test-details">
            <h2>📝 Detailed Test Results</h2>
            <div class="filter-buttons">
                <button class="filter-btn active" onclick="filterTests('all')">All Tests</button>
                <button class="filter-btn" onclick="filterTests('passed')">Passed Only</button>
                <button class="filter-btn" onclick="filterTests('failed')">Failed Only</button>
            </div>
            <div id="test-list">
                ${results.details.map((detail, index) => {
                    const statusClass = detail.passed ? 'passed' : 'failed';
                    const badgeClass = detail.passed ? 'badge-pass' : 'badge-fail';
                    const badgeText = detail.passed ? '✓ PASS' : '✗ FAIL';
                    
                    return `
                        <div class="test-item ${statusClass}" data-status="${statusClass}">
                            <div class="test-header">
                                <div class="test-title">${index + 1}. ${detail.description}</div>
                                <span class="test-badge ${badgeClass}">${badgeText}</span>
                            </div>
                            <div class="test-details-grid">
                                <div class="detail-item">
                                    <span class="detail-label">Category</span>
                                    <span class="detail-value">${detail.category}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Width</span>
                                    <span class="detail-value">${detail.input.width} cm</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Height</span>
                                    <span class="detail-value">${detail.input.height} cm</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Length</span>
                                    <span class="detail-value">${detail.input.length} cm</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Mass</span>
                                    <span class="detail-value">${detail.input.mass} kg</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Expected</span>
                                    <span class="detail-value">${detail.expected}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Actual</span>
                                    <span class="detail-value">${detail.actual || 'N/A'}</span>
                                </div>
                            </div>
                            ${detail.error ? `<div class="error-message">Error: ${detail.error}</div>` : ''}
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
        
        <div class="footer">
            <p><strong>Robotic Arm Package Sorting Function</strong></p>
            <p>Testing Framework v1.0 | Smarter Technology</p>
        </div>
    </div>
    
    <script>
        function filterTests(filter) {
            const items = document.querySelectorAll('.test-item');
            const buttons = document.querySelectorAll('.filter-btn');
            
            buttons.forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            
            items.forEach(item => {
                if (filter === 'all') {
                    item.style.display = 'block';
                } else {
                    item.style.display = item.dataset.status === filter ? 'block' : 'none';
                }
            });
        }
    </script>
</body>
</html>`;
  
  try {
    fs.writeFileSync(outputPath, html, 'utf-8');
    console.log(`\n📄 HTML test report generated: ${outputPath}`);
  } catch (error) {
    console.error(`\n❌ Error generating HTML report: ${error.message}`);
  }
}

// Main test execution
console.log('╔═════════════════════════════════════════════════════════════╗');
console.log('║  Robotic Arm Package Sorting - Comprehensive Test Suite    ║');
console.log('╚═════════════════════════════════════════════════════════════╝\n');

// Run dataset-based tests
console.log('=== Dataset Tests (from dataset.txt) ===\n');
const datasetPath = path.join(__dirname, 'dataset.txt');
runDatasetTests(datasetPath);

// Run error handling tests
console.log('\n=== Input Validation & Error Handling Tests ===\n');
testErrorHandling('Null width', [null, 10, 10, 10], true);
testErrorHandling('Undefined height', [10, undefined, 10, 10], true);
testErrorHandling('String length', [10, 10, "abc", 10], true);
testErrorHandling('Negative width', [-5, 10, 10, 10], true);
testErrorHandling('Negative mass', [10, 10, 10, -20], true);
testErrorHandling('NaN value', [NaN, 10, 10, 10], true);
testErrorHandling('Infinity value', [Infinity, 10, 10, 10], true);
testErrorHandling('Missing parameter', [10, 10, 10], true);
testErrorHandling('Object as parameter', [{ width: 10 }, 10, 10, 10], true);
testErrorHandling('Array as parameter', [[10], 10, 10, 10], true);

// Print detailed results
console.log('\n╔═════════════════════════════════════════════════════════════╗');
console.log('║                     Test Results Summary                    ║');
console.log('╚═════════════════════════════════════════════════════════════╝\n');

console.log(`Total Tests Run: ${results.passed + results.failed}`);
console.log(`✓ Passed: ${results.passed}`);
console.log(`✗ Failed: ${results.failed}`);

if (results.errors > 0) {
  console.log(`⚠ Errors: ${results.errors}`);
}

// Print category breakdown
console.log('\n=== Results by Category ===');
for (const [category, stats] of Object.entries(results.byCategory)) {
  const percentage = ((stats.passed / stats.total) * 100).toFixed(1);
  console.log(`${category}: ${stats.passed}/${stats.total} (${percentage}%)`);
}

// Calculate overall statistics
const totalTests = results.passed + results.failed;
const successRate = ((results.passed / totalTests) * 100).toFixed(2);
console.log(`\nOverall Success Rate: ${successRate}%`);

// Generate HTML report
const htmlReportPath = path.join(__dirname, 'test-results.html');
generateHtmlReport(htmlReportPath);

// Final verdict
if (results.failed === 0) {
  console.log('\n╔═════════════════════════════════════════════════════════════╗');
  console.log('║              ✓ ALL TESTS PASSED SUCCESSFULLY!               ║');
  console.log('╚═════════════════════════════════════════════════════════════╝');
  process.exit(0);
} else {
  console.log('\n╔═════════════════════════════════════════════════════════════╗');
  console.log(`║  ✗ ${results.failed} TEST(S) FAILED - PLEASE REVIEW                        ║`);
  console.log('╚═════════════════════════════════════════════════════════════╝');
  process.exit(1);
}
