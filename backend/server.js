const express = require('express');
const app = express();
const products = require('./data/products');
app.get('/', (req, res) => {
    res.send('API is running....!');
})
app.get('/api/products', (req, res) => {
    res.json(products);
})
app.get('/api/products/:id', (req, res)=>{
    const product = products.find(product=>product._id===req.params.id);
    res.json(product);
})
app.listen(5000, console.log('server running on 5000'));