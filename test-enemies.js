// Simple test to verify enemy data structure
const { locations } = require('./src/index.tsx');

console.log('Testing enemy data structure...');

// Test first location
const firstLocation = locations[0];
console.log(`Location: ${firstLocation.name}`);
console.log(`Enemies: ${firstLocation.enemies.length}`);

// Test first enemy
const firstEnemy = firstLocation.enemies[0];
console.log(`First enemy: ${firstEnemy.name}`);
console.log(`HP: ${firstEnemy.hp}/${firstEnemy.maxHp}`);
console.log(`Attack: ${firstEnemy.attack}, Defense: ${firstEnemy.defense}`);
console.log(`Abilities: ${firstEnemy.abilities.length}`);

firstEnemy.abilities.forEach((ability, index) => {
  console.log(`  Ability ${index + 1}: ${ability.name} (${ability.type}) - ${ability.description}`);
});

// Count total enemies
let totalEnemies = 0;
locations.forEach(location => {
  totalEnemies += location.enemies.length;
});

console.log(`\nTotal locations: ${locations.length}`);
console.log(`Total enemies: ${totalEnemies}`);

// Test location connections
console.log('\nLocation connections:');
locations.forEach((location, index) => {
  console.log(`${index}. ${location.name} -> [${location.connections.join(', ')}]`);
});

console.log('\nTest completed successfully!');