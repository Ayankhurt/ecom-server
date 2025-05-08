import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

let products = [];

app.get('/products', (req, res) => {
  res.json(products);
});

app.post('/product', (req, res) => {
  const { name, description, price } = req.body;

  if (!name || !description || !price) {
    return res.status(400).json({ error: 'Name, description, and price are required' });
  }
  if (isNaN(price) || price <= 0) {
    return res.status(400).json({ error: 'Price must be a positive number' });
  }

  const newProduct = {
    id: Date.now(),
    name,
    description,
    price: parseFloat(price),
  };

  products.push(newProduct);
  res.status(201).json({ message: 'Product added successfully', product: newProduct });
});

app.delete('/product/:id', (req, res) => {
  const productId = parseInt(req.params.id);

  if (isNaN(productId)) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }

  const initialLength = products.length;
  products = products.filter((product) => product.id !== productId);

  if (products.length < initialLength) {
    res.status(200).json({ message: 'Product deleted successfully' });
  } else {
    res.status(404).json({ error: `Product with ID ${productId} not found` });
  }
});

app.put('/product/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const { name, description, price } = req.body;

  console.log('Edit Request - Product ID:', productId, 'Body:', req.body);

  if (isNaN(productId)) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }
  if (!name || !description || !price) {
    return res.status(400).json({ error: 'Name, description, and price are required' });
  }
  if (isNaN(price) || price <= 0) {
    return res.status(400).json({ error: 'Price must be a positive number' });
  }

  const productIndex = products.findIndex((product) => product.id === productId);
  if (productIndex === -1) {
    return res.status(404).json({ error: `Product with ID ${productId} not found` });
  }

  products[productIndex] = {
    id: productId,
    name,
    description,
    price: parseFloat(price),
  };

  res.status(200).json({ message: 'Product updated successfully', product: products[productIndex] });
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});