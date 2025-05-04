import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

let products = [];

app.get('/get-products', (req, res) => {
  res.json(products);
});

app.post('/add-product', (req, res) => {
  const reqBody = req.body;

  if (!reqBody?.name || !reqBody?.description || !reqBody?.price) {
    return res.status(400).json({ error: 'Required parameters missing' });
  }
  if (isNaN(reqBody.price) || reqBody.price <= 0) {
    return res.status(400).json({ error: 'Price must be a valid positive number' });
  }

  const newProduct = {
    id: new Date().getTime(),
    name: reqBody.name,
    description: reqBody.description,
    price: parseFloat(reqBody.price),
  };

  products.push(newProduct);
  res.status(201).json({ message: 'Product added successfully', product: newProduct });
});

app.delete('/delete-product/:id', (req, res) => {
  const productId = parseInt(req.params.id, 10);

  if (isNaN(productId)) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }

  const initialLength = products.length;
  products = products.filter((product) => product.id !== productId);

  if (products.length < initialLength) {
    res.json({ message: 'Product deleted successfully' });
  } else {
    res.status(404).json({ error: `Product with ID ${productId} not found` });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});