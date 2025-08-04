const db = require('../models');

const createTestProducts = async () => {
  try {
    // Clear existing products
    await db.product.destroy({ where: {} });

    // Create test products
    const testProducts = [
      {
        id: 'PRODUCT001',
        name: 'Premium Cotton T-Shirt',
        description: 'High-quality cotton t-shirt with comfortable fit and modern design. Perfect for casual wear.',
        price: 29.99,
        stock: 100,
        parent_category: 'Fashion',
        child_category: 'Clothing',
        image: [
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
          'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500',
          'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500'
        ],
        colors: ['White', 'Black', 'Blue', 'Red'],
        size: 'S,M,L,XL',
        is_on_sale: true,
        sale_price: 24.99,
        sale_percentage: 17,
        weight: 0.2
      },
      {
        id: 'PRODUCT002',
        name: 'Wireless Bluetooth Headphones',
        description: 'Premium wireless headphones with noise cancellation and 30-hour battery life.',
        price: 89.99,
        stock: 50,
        parent_category: 'Electronics',
        child_category: 'Audio',
        image: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
          'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500'
        ],
        colors: ['Black', 'White', 'Blue'],
        size: 'One Size',
        is_on_sale: false,
        weight: 0.3
      },
      {
        id: 'PRODUCT003',
        name: 'Organic Green Tea',
        description: 'Premium organic green tea with natural antioxidants and smooth taste.',
        price: 12.99,
        stock: 200,
        parent_category: 'Groceries',
        child_category: 'Beverages',
        image: [
          'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500',
          'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500'
        ],
        colors: ['Green'],
        size: '100g,250g,500g',
        is_on_sale: true,
        sale_price: 9.99,
        sale_percentage: 23,
        weight: 0.1
      },
      {
        id: 'PRODUCT004',
        name: 'Smart Fitness Watch',
        description: 'Advanced fitness tracking with heart rate monitor and GPS navigation.',
        price: 199.99,
        stock: 75,
        parent_category: 'Electronics',
        child_category: 'Wearables',
        image: [
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
          'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=500'
        ],
        colors: ['Black', 'Silver', 'Rose Gold'],
        size: 'One Size',
        is_on_sale: true,
        sale_price: 159.99,
        sale_percentage: 20,
        weight: 0.05
      },
      {
        id: 'PRODUCT005',
        name: 'Handcrafted Ceramic Mug',
        description: 'Beautiful handcrafted ceramic mug perfect for your morning coffee or tea.',
        price: 15.99,
        stock: 150,
        parent_category: 'Home & Garden',
        child_category: 'Kitchenware',
        image: [
          'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500'
        ],
        colors: ['White', 'Blue', 'Green', 'Pink'],
        size: '350ml',
        is_on_sale: false,
        weight: 0.4
      }
    ];

    for (const product of testProducts) {
      await db.product.create(product);
    }

    console.log('Test products created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating test products:', error);
    process.exit(1);
  }
};

createTestProducts(); 