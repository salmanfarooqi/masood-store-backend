'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('collections', [
      {
        id: 'COLLECTION-1',
        name: 'Summer Collection',
        description: 'Fresh and vibrant pieces perfect for the summer season',
        image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500',
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'COLLECTION-2',
        name: 'Winter Essentials',
        description: 'Cozy and warm clothing for the cold winter months',
        image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500',
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'COLLECTION-3',
        name: 'Formal Wear',
        description: 'Elegant and sophisticated pieces for formal occasions',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'COLLECTION-4',
        name: 'Casual Comfort',
        description: 'Comfortable and stylish pieces for everyday wear',
        image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=500',
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'COLLECTION-5',
        name: 'Sports & Active',
        description: 'High-performance gear for your active lifestyle',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500',
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'COLLECTION-6',
        name: 'Vintage Classics',
        description: 'Timeless pieces with a vintage aesthetic',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500',
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('collections', null, {});
  }
}; 