
const { execSync } = require('child_process');

try {
  // Run Vitest tests
  execSync('npx vitest run', { stdio: 'inherit' });
  console.log('Tests completed successfully!');
} catch (error) {
  console.error('Error running tests:', error.message);
  process.exit(1);
}
