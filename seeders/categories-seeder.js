'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Insert Parent Categories
    await queryInterface.bulkInsert('parentCategories', [
      {
        id: 'PARENT-CAT-1',
        name: 'Fashion',
        color: '#FF6B6B',
        icon: '/images/1729057863544_fash.png',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'PARENT-CAT-2',
        name: 'Electronics',
        color: '#4ECDC4',
        icon: '/images/1729057887903_ele.png',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'PARENT-CAT-3',
        name: 'Home & Garden',
        color: '#45B7D1',
        icon: '/images/1729057952685_gro.png',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'PARENT-CAT-4',
        name: 'Beauty & Personal Care',
        color: '#F7DC6F',
        icon: '/images/1729057972235_beauty.png',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'PARENT-CAT-5',
        name: 'Sports & Outdoors',
        color: '#BB8FCE',
        icon: '/images/1729083249213_well.png',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'PARENT-CAT-6',
        name: 'Jewelry & Accessories',
        color: '#85C1E9',
        icon: '/images/1729084739196_jw.png',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    // Insert Child Categories
    await queryInterface.bulkInsert('childCategories', [
      // Fashion subcategories
      {
        id: 'CHILD-CAT-1',
        name: 'Men\'s Clothing',
        color: '#FF8A80',
        icon: '/images/1729057863544_fash.png',
        parent_id: 'PARENT-CAT-1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'CHILD-CAT-2',
        name: 'Women\'s Clothing',
        color: '#FFB74D',
        icon: '/images/1729057863544_fash.png',
        parent_id: 'PARENT-CAT-1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'CHILD-CAT-3',
        name: 'Shoes',
        color: '#A5D6A7',
        icon: '/images/1729057928861_foot.png',
        parent_id: 'PARENT-CAT-1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'CHILD-CAT-4',
        name: 'Accessories',
        color: '#FFCC02',
        icon: '/images/1729057908594_bag.png',
        parent_id: 'PARENT-CAT-1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // Electronics subcategories
      {
        id: 'CHILD-CAT-5',
        name: 'Smartphones',
        color: '#80DEEA',
        icon: '/images/1729057887903_ele.png',
        parent_id: 'PARENT-CAT-2',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'CHILD-CAT-6',
        name: 'Laptops & Computers',
        color: '#90CAF9',
        icon: '/images/1729057887903_ele.png',
        parent_id: 'PARENT-CAT-2',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'CHILD-CAT-7',
        name: 'Audio & Headphones',
        color: '#CE93D8',
        icon: '/images/1729057887903_ele.png',
        parent_id: 'PARENT-CAT-2',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // Home & Garden subcategories
      {
        id: 'CHILD-CAT-8',
        name: 'Furniture',
        color: '#BCAAA4',
        icon: '/images/1729057952685_gro.png',
        parent_id: 'PARENT-CAT-3',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'CHILD-CAT-9',
        name: 'Kitchen & Dining',
        color: '#FFE082',
        icon: '/images/1729057952685_gro.png',
        parent_id: 'PARENT-CAT-3',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // Beauty & Personal Care subcategories
      {
        id: 'CHILD-CAT-10',
        name: 'Skincare',
        color: '#F8BBD9',
        icon: '/images/1729057972235_beauty.png',
        parent_id: 'PARENT-CAT-4',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'CHILD-CAT-11',
        name: 'Makeup',
        color: '#E1BEE7',
        icon: '/images/1729057972235_beauty.png',
        parent_id: 'PARENT-CAT-4',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // Sports & Outdoors subcategories
      {
        id: 'CHILD-CAT-12',
        name: 'Fitness Equipment',
        color: '#C5E1A5',
        icon: '/images/1729083249213_well.png',
        parent_id: 'PARENT-CAT-5',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'CHILD-CAT-13',
        name: 'Jewelry & Watches',
        color: '#B39DDB',
        icon: '/images/1729084739196_jw.png',
        parent_id: 'PARENT-CAT-6',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('childCategories', null, {});
    await queryInterface.bulkDelete('parentCategories', null, {});
  }
}; 