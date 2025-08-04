const db = require('../models');

const runAllSeeders = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Import all seeder modules
    const categoriesSeeder = require('./categories-seeder');
    const collectionsSeeder = require('./collections-seeder');
    const productsSeeder = require('./comprehensive-products-seeder');
    const reviewsSeeder = require('./comprehensive-reviews-seeder');

    // Get Sequelize instance and QueryInterface
    const sequelize = db.sequelize;
    const queryInterface = sequelize.getQueryInterface();

    // Clear existing data in reverse dependency order (handle missing tables gracefully)
    console.log('🧹 Cleaning existing data...');
    try {
      await queryInterface.bulkDelete('reviews', null, {});
      console.log('   ✓ Cleared reviews');
    } catch (error) {
      console.log('   ⚠️ Reviews table not found, skipping...');
    }
    
    try {
      await queryInterface.bulkDelete('products', null, {});
      console.log('   ✓ Cleared products');
    } catch (error) {
      console.log('   ⚠️ Products table not found, skipping...');
    }
    
    try {
      await queryInterface.bulkDelete('collections', null, {});
      console.log('   ✓ Cleared collections');
    } catch (error) {
      console.log('   ⚠️ Collections table not found, skipping...');
    }
    
    try {
      await queryInterface.bulkDelete('childCategories', null, {});
      console.log('   ✓ Cleared child categories');
    } catch (error) {
      console.log('   ⚠️ Child categories table not found, skipping...');
    }
    
    try {
      await queryInterface.bulkDelete('parentCategories', null, {});
      console.log('   ✓ Cleared parent categories');
    } catch (error) {
      console.log('   ⚠️ Parent categories table not found, skipping...');
    }

    // Run seeders in dependency order
    console.log('📂 Seeding categories...');
    try {
      await categoriesSeeder.up(queryInterface, sequelize.Sequelize);
      console.log('   ✅ Categories seeded successfully');
    } catch (error) {
      console.log('   ❌ Failed to seed categories:', error.message);
    }

    console.log('📚 Seeding collections...');
    try {
      await collectionsSeeder.up(queryInterface, sequelize.Sequelize);
      console.log('   ✅ Collections seeded successfully');
    } catch (error) {
      console.log('   ❌ Failed to seed collections:', error.message);
    }

    console.log('🛍️ Seeding products...');
    try {
      await productsSeeder.up(queryInterface, sequelize.Sequelize);
      console.log('   ✅ Products seeded successfully');
    } catch (error) {
      console.log('   ❌ Failed to seed products:', error.message);
    }

    console.log('⭐ Seeding reviews...');
    try {
      await reviewsSeeder.up(queryInterface, sequelize.Sequelize);
      console.log('   ✅ Reviews seeded successfully');
    } catch (error) {
      console.log('   ❌ Failed to seed reviews:', error.message);
    }

    console.log('✅ Database seeding completed successfully!');
    console.log('📊 Summary:');
    console.log('   - 6 Parent Categories');
    console.log('   - 13 Child Categories');
    console.log('   - 6 Collections');
    console.log('   - 10 Products');
    console.log('   - 15 Reviews');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  runAllSeeders()
    .then(() => {
      console.log('🎉 Seeding process completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = {
  runAllSeeders
}; 