'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // First, let's get some existing product IDs
    const products = await queryInterface.sequelize.query(
      'SELECT id FROM products LIMIT 5',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (products.length === 0) {
      console.log('No products found, skipping review seeding');
      return;
    }

    const reviews = [];
    const reviewData = [
      {
        rating: 5,
        title: 'Excellent quality!',
        comment: 'This product exceeded my expectations. The quality is outstanding and it fits perfectly. Highly recommended!',
        reviewer_name: 'Sarah Johnson',
        reviewer_email: 'sarah.johnson@email.com'
      },
      {
        rating: 4,
        title: 'Good value for money',
        comment: 'Very satisfied with this purchase. Good quality and fast shipping. Would buy again.',
        reviewer_name: 'Mike Chen',
        reviewer_email: 'mike.chen@email.com'
      },
      {
        rating: 5,
        title: 'Love it!',
        comment: 'Amazing product! The design is beautiful and the material feels premium. Perfect for daily use.',
        reviewer_name: 'Emma Williams',
        reviewer_email: 'emma.williams@email.com'
      },
      {
        rating: 4,
        title: 'Pretty good',
        comment: 'Nice product overall. The color is exactly as shown in the pictures. Delivery was quick.',
        reviewer_name: 'David Brown',
        reviewer_email: 'david.brown@email.com'
      },
      {
        rating: 3,
        title: 'Average quality',
        comment: 'It\'s okay for the price. Could be better quality but serves its purpose.',
        reviewer_name: 'Lisa Davis',
        reviewer_email: 'lisa.davis@email.com'
      },
      {
        rating: 5,
        title: 'Perfect!',
        comment: 'Exactly what I was looking for. Great quality, perfect fit, and excellent customer service.',
        reviewer_name: 'John Smith',
        reviewer_email: 'john.smith@email.com'
      }
    ];

    // Add reviews for each product
    products.forEach((product, productIndex) => {
      // Add 2-3 reviews per product
      const numReviews = Math.floor(Math.random() * 2) + 2; // 2-3 reviews
      for (let i = 0; i < numReviews && (productIndex * 3 + i) < reviewData.length; i++) {
        const review = reviewData[productIndex * 3 + i] || reviewData[i];
        reviews.push({
          id: `REVIEW-${productIndex + 1}-${i + 1}`,
          product_id: product.id,
          user_id: null, // Guest review
          rating: review.rating,
          title: review.title,
          comment: review.comment,
          reviewer_name: review.reviewer_name,
          reviewer_email: review.reviewer_email,
          is_verified: Math.random() > 0.5, // Random verification status
          is_approved: true,
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
          updatedAt: new Date()
        });
      }
    });

    if (reviews.length > 0) {
      await queryInterface.bulkInsert('reviews', reviews, {});
      console.log(`Seeded ${reviews.length} reviews`);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('reviews', null, {});
  }
}; 