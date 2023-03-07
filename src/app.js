import fs from 'fs'
import crypto, { randomUUID } from 'crypto'
import { Product } from './Product.js'
import { ProductManager } from './ProductManager.js'
import express from 'express'

const app = express()
app.use(express.json())

const pm = new ProductManager('./static/products.json')

app.get('/products', async (req,res) =>{
    const products = await pm.getProducts()

    const limit = req.query.limit
    if(limit){
        res.json(products.slice(0, limit))
    }else {
        res.json(products)
    }

})

app.get('/products/:pid', async (req,res) => {
    const product = await pm.getProductById(req.params.pid)
    res.json(product)
})

app.post('/products', async (req,res) => {
    let id = randomUUID()
    const product = new Product ({
        id:id,
        ...req.body
    })

    
    let agregado = await pm.addProduct(product)
    res.json(agregado)
})

app.put('/products/:pid', async (req,res) => {
    let newProduct = new Product({
        id:req.params.pid,
        ...req.body
    })

    let replaceProduct = await pm.updateProduct(req.params.pid, newProduct)
    res.json(replaceProduct)

})

app.listen(8080, () => console.log('Servidor funcionando en 8080'))