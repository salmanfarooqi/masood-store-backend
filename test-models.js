const db = require('./models');

async function testModels() {
  try {
    console.log('Testing database models...');
    
    // Test database connection
    await db.sequelize.authenticate();
    console.log('✅ Database connection successful');
    
    // List all loaded models
    console.log('\n📋 Loaded models:');
    Object.keys(db).forEach(key => {
      if (key !== 'sequelize' && key !== 'Sequelize' && key !== 'healthCheck' && key !== 'closeConnection') {
        console.log(`  - ${key}: ${typeof db[key]}`);
      }
    });
    
    // Test Product model specifically
    if (db.product) {
      console.log('\n✅ Product model found');
      console.log('Product model attributes:', Object.keys(db.product.rawAttributes));
      
      // Try to count products
      try {
        const count = await db.product.count();
        console.log(`📊 Total products in database: ${count}`);
      } catch (error) {
        console.error('❌ Error counting products:', error.message);
      }
    } else {
      console.log('\n❌ Product model not found!');
    }
    
    // Test other important models
    const importantModels = ['user', 'parentCategory', 'childCategory', 'Collection', 'Review'];
    console.log('\n🔍 Checking important models:');
    importantModels.forEach(modelName => {
      if (db[modelName]) {
        console.log(`  ✅ ${modelName}: Found`);
      } else {
        console.log(`  ❌ ${modelName}: Not found`);
      }
    });
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await db.sequelize.close();
    console.log('\n🔌 Database connection closed');
  }
}

testModels(); 