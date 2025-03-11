const express = require('express');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(express.json()); // No need for body-parser


const dbconnect = require('./db_connection.js');
const Product = require('./product_schema.js');

app.post('/insert', async (req, res) => {
  try {
    const { id, name, description, price, category, stock } = req.body;
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const product = new Product({ id, name, description, price, category, stock });
    await product.save();
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/get', async (req, res) => {
  try {
    Product.find()
        .then(products => {
          res.status(200).send(products);
        }) 
        .catch(err => {
          res.status(500).send({ message: err.message || 'Error in Fetch Products ' })
        });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
const PORT = process.env.PORT || 5002;
console.log(app._router.stack.map(layer => layer.route?.path).filter(Boolean));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
