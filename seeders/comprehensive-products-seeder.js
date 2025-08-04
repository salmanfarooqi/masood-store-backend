'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('products', [
      // Fashion - Men's Clothing
      {
        id: 'PROD-001',
        name: 'Classic Cotton T-Shirt',
        description: 'Premium quality cotton t-shirt with comfortable fit. Perfect for casual wear and everyday comfort.',
        price: 25.99,
        stock: 150,
        parent_category: 'Fashion',
        child_category: 'Men\'s Clothing',
        image: [
          '/images/und-neck-half-sleeve-casual-t-shirt-product-images-rvwmlodbas-0-202304131033.jpg',
          '/images/-collar-half-sleeve-casual-t-shirt-product-images-rvrtzhyumb-0-202304080900.webp'
        ],
        colors: ['White', 'Black', 'Navy', 'Gray'],
        size: 'S,M,L,XL,XXL',
        is_on_sale: true,
        sale_price: 19.99,
        sale_percentage: 23,
        weight: 0.2,
        collection_id: 'COLLECTION-4',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'PROD-002',
        name: 'Formal Business Shirt',
        description: 'Professional dress shirt perfect for office wear and formal occasions. Made with wrinkle-resistant fabric.',
        price: 45.99,
        stock: 80,
        parent_category: 'Fashion',
        child_category: 'Men\'s Clothing',
        image: [
          '/images/turdy-construction-for-everyday-use-product-images-rv9d1dhzig-0-202408051114.jpg'
        ],
        colors: ['White', 'Light Blue', 'Gray'],
        size: 'S,M,L,XL',
        is_on_sale: false,
        weight: 0.3,
        collection_id: 'COLLECTION-3',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Fashion - Women's Clothing
      {
        id: 'PROD-003',
        name: 'Elegant Cotton Kurta',
        description: 'Beautiful printed cotton kurta perfect for casual and semi-formal occasions. Comfortable and stylish.',
        price: 35.99,
        stock: 100,
        parent_category: 'Fashion',
        child_category: 'Women\'s Clothing',
        image: [
          '/images/1729060369509_glowworld-women-blue-printed-cotton-kurta-product-images-rvb5rj3wer-0-202205161816.jpg',
          '/images/1729065290580_buynewtrend-women-maroon-cotton-blend-top-product-images-rvb22aqlk7-0-202201130044.jpg'
        ],
        colors: ['Blue', 'Maroon', 'Green', 'Pink'],
        size: 'S,M,L,XL',
        is_on_sale: true,
        sale_price: 28.99,
        sale_percentage: 19,
        weight: 0.25,
        collection_id: 'COLLECTION-1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'PROD-004',
        name: '2-Piece Co-ord Set',
        description: 'Trendy matching co-ord set perfect for modern women. Comfortable fabric with stylish design.',
        price: 55.99,
        stock: 60,
        parent_category: 'Fashion',
        child_category: 'Women\'s Clothing',
        image: [
          '/images/e-2-piece-co-ord-set-1pair-size-xl-product-images-rvifrbqagu-0-202408030114.webp',
          '/images/ops-fancy-top-printed-top-printed-trouser-casual-wear-party-wear-daily-wear-.jpg'
        ],
        colors: ['Pink', 'Black', 'White'],
        size: 'S,M,L,XL',
        is_on_sale: false,
        weight: 0.4,
        collection_id: 'COLLECTION-4',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'PROD-005',
        name: 'Traditional Saree with Blouse',
        description: 'Elegant traditional saree with matching blouse piece. Perfect for festivals and special occasions.',
        price: 75.99,
        stock: 40,
        parent_category: 'Fashion',
        child_category: 'Women\'s Clothing',
        image: [
          '/images/hite-color-saree-with-blouse-piece-product-images-rvcpwdyagl-0-202304220521.webp'
        ],
        colors: ['White', 'Red', 'Blue', 'Gold'],
        size: 'Free Size',
        is_on_sale: true,
        sale_price: 65.99,
        sale_percentage: 13,
        weight: 0.6,
        collection_id: 'COLLECTION-3',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Fashion - Shoes
      {
        id: 'PROD-006',
        name: 'Casual Sports Shoes',
        description: 'Comfortable sports shoes perfect for daily wear and light exercise. Breathable material with good grip.',
        price: 65.99,
        stock: 120,
        parent_category: 'Fashion',
        child_category: 'Shoes',
        image: [
          '/images/shoes1.jpg',
          '/images/sh2.jpg'
        ],
        colors: ['White', 'Black', 'Blue', 'Gray'],
        size: '6,7,8,9,10,11',
        is_on_sale: true,
        sale_price: 55.99,
        sale_percentage: 15,
        weight: 0.8,
        collection_id: 'COLLECTION-5',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Fashion - Accessories & Jewelry
      {
        id: 'PROD-007',
        name: 'Gold Plated Jewelry Set',
        description: 'Beautiful gold plated jewelry set including necklace and earrings. Perfect for special occasions.',
        price: 45.99,
        stock: 80,
        parent_category: 'Fashion',
        child_category: 'Accessories',
        image: [
          '/images/jawllery.jpg',
          '/images/jw1.webp',
          '/images/jw2.webp',
          '/images/jw3.webp'
        ],
        colors: ['Gold', 'Silver'],
        size: 'One Size',
        is_on_sale: false,
        weight: 0.1,
        collection_id: 'COLLECTION-3',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Electronics
      {
        id: 'PROD-008',
        name: 'HD Web Camera',
        description: 'High definition web camera with 1080p resolution. Perfect for video calls and streaming.',
        price: 89.99,
        stock: 50,
        parent_category: 'Electronics',
        child_category: 'Audio & Headphones',
        image: [
          '/images/l-silver-1-59-kgs-1080p-web-cam-digital-o494352995-p608658148-0-20240402160.webp'
        ],
        colors: ['Silver', 'Black'],
        size: 'One Size',
        is_on_sale: true,
        sale_price: 75.99,
        sale_percentage: 16,
        weight: 0.5,
        collection_id: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Beauty Products
      {
        id: 'PROD-009',
        name: 'Pink Beauty Set',
        description: 'Complete beauty and skincare set with multiple products. Perfect for daily beauty routine.',
        price: 125.99,
        stock: 30,
        parent_category: 'Beauty & Personal Care',
        child_category: 'Skincare',
        image: [
          '/images/PINK.webp',
          '/images/PINK2.webp'
        ],
        colors: ['Pink'],
        size: 'One Size',
        is_on_sale: true,
        sale_price: 99.99,
        sale_percentage: 21,
        weight: 0.8,
        collection_id: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Additional Women's Dresses
      {
        id: 'PROD-010',
        name: 'Casual Summer Dress',
        description: 'Light and comfortable summer dress perfect for casual outings and warm weather.',
        price: 42.99,
        stock: 70,
        parent_category: 'Fashion',
        child_category: 'Women\'s Clothing',
        image: [
          '/images/women dress 1.webp',
          '/images/women dres2.webp',
          '/images/women dres 3.webp',
          '/images/women dress 4.webp'
        ],
        colors: ['Blue', 'Pink', 'Yellow', 'Green'],
        size: 'S,M,L,XL',
        is_on_sale: false,
        weight: 0.3,
        collection_id: 'COLLECTION-1',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
  }
}; 