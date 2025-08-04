'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('reviews', [
      {
        id: 'REVIEW-001',
        product_id: 'PROD-001',
        user_id: null, // Guest review
        rating: 5,
        comment: 'Excellent quality t-shirt! Very comfortable and the fabric feels premium. Highly recommended for daily wear.',
        reviewer_name: 'John Smith',
        reviewer_email: 'john.smith@email.com',
        is_verified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'REVIEW-002',
        product_id: 'PROD-001',
        user_id: null,
        rating: 4,
        comment: 'Good quality shirt, fits well. The color is exactly as shown in the pictures. Fast delivery too!',
        reviewer_name: 'Sarah Johnson',
        reviewer_email: 'sarah.j@email.com',
        is_verified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'REVIEW-003',
        product_id: 'PROD-002',
        user_id: null,
        rating: 5,
        comment: 'Perfect for office wear! The shirt is wrinkle-resistant as advertised and looks very professional.',
        reviewer_name: 'Michael Brown',
        reviewer_email: 'mike.brown@email.com',
        is_verified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'REVIEW-004',
        product_id: 'PROD-003',
        user_id: null,
        rating: 5,
        comment: 'Beautiful kurta! The print is vibrant and the fabric is very comfortable. Perfect for summer.',
        reviewer_name: 'Priya Sharma',
        reviewer_email: 'priya.sharma@email.com',
        is_verified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'REVIEW-005',
        product_id: 'PROD-003',
        user_id: null,
        rating: 4,
        comment: 'Good quality kurta. The size fits perfectly and the color is as expected. Would buy again.',
        reviewer_name: 'Anita Singh',
        reviewer_email: 'anita.singh@email.com',
        is_verified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'REVIEW-006',
        product_id: 'PROD-004',
        user_id: null,
        rating: 5,
        comment: 'Love this co-ord set! Very trendy and comfortable. Gets lots of compliments when I wear it.',
        reviewer_name: 'Emma Wilson',
        reviewer_email: 'emma.wilson@email.com',
        is_verified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'REVIEW-007',
        product_id: 'PROD-005',
        user_id: null,
        rating: 5,
        comment: 'Gorgeous saree! The quality is excellent and it looks stunning. Perfect for special occasions.',
        reviewer_name: 'Kavya Patel',
        reviewer_email: 'kavya.patel@email.com',
        is_verified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'REVIEW-008',
        product_id: 'PROD-006',
        user_id: null,
        rating: 4,
        comment: 'Comfortable shoes for daily wear. Good grip and the material seems durable. Value for money.',
        reviewer_name: 'David Lee',
        reviewer_email: 'david.lee@email.com',
        is_verified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'REVIEW-009',
        product_id: 'PROD-006',
        user_id: null,
        rating: 5,
        comment: 'Excellent sports shoes! Very comfortable for walking and light exercise. Highly recommend.',
        reviewer_name: 'James Miller',
        reviewer_email: 'james.miller@email.com',
        is_verified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'REVIEW-010',
        product_id: 'PROD-007',
        user_id: null,
        rating: 5,
        comment: 'Beautiful jewelry set! Looks very elegant and the gold plating is of good quality. Love it!',
        reviewer_name: 'Lisa Anderson',
        reviewer_email: 'lisa.anderson@email.com',
        is_verified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'REVIEW-011',
        product_id: 'PROD-008',
        user_id: null,
        rating: 4,
        comment: 'Good webcam for the price. HD quality is clear and works well for video calls. Easy to set up.',
        reviewer_name: 'Robert Garcia',
        reviewer_email: 'robert.garcia@email.com',
        is_verified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'REVIEW-012',
        product_id: 'PROD-009',
        user_id: null,
        rating: 5,
        comment: 'Amazing beauty set! All products are of great quality and my skin feels so much better.',
        reviewer_name: 'Amanda White',
        reviewer_email: 'amanda.white@email.com',
        is_verified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'REVIEW-013',
        product_id: 'PROD-010',
        user_id: null,
        rating: 4,
        comment: 'Pretty summer dress! Light and comfortable. Perfect for hot weather. Good quality fabric.',
        reviewer_name: 'Jessica Taylor',
        reviewer_email: 'jessica.taylor@email.com',
        is_verified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'REVIEW-014',
        product_id: 'PROD-001',
        user_id: null,
        rating: 3,
        comment: 'Decent t-shirt but expected better quality for the price. It\'s okay but nothing exceptional.',
        reviewer_name: 'Mark Thompson',
        reviewer_email: 'mark.thompson@email.com',
        is_verified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'REVIEW-015',
        product_id: 'PROD-002',
        user_id: null,
        rating: 4,
        comment: 'Professional looking shirt. Good for office wear but the sizing runs a bit large.',
        reviewer_name: 'Chris Davis',
        reviewer_email: 'chris.davis@email.com',
        is_verified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('reviews', null, {});
  }
}; 