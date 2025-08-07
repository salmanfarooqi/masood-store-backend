const express = require('express');
const app = express();
const db = require('./models');
const { getAllProductByBuyer } = require('./controllers/buyer/products/product');

app.use(express.json());

// Test the getAllProductByBuyer function directly
app.get('/test-products', async (req, res) => {
  try {
    console.log('Testing getAllProductByBuyer...');
    const result = await getAllProductByBuyer(req, res);
    console.log('Test completed');
  } catch (error) {
    console.error('Test failed:', error);
    res.status(500).json({ error: error.message });
  }
});

// Simple test route
app.get('/', (req, res) => {
  res.json({ message: 'Test server running' });
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Test products endpoint: http://localhost:${PORT}/test-products`);
}); 