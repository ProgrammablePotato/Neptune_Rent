const express = require('express')
const userRouter = require('./routes/users')
const productsRouter = require('./routes/products')
const rent = require('./routes/rent')
const review = require('./routes/review')
const buyRouter = require('./routes/buy')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const imagesRouter = require('./routes/image')
const path = require('path')
require('dotenv').config()

const app = express()
const port = process.env.PORT
app.use(cors(
    {origin:["http://localhost:4200", "https://localhost:4200", "http://192.168.1.247:4200"],
    credentials:true  
}))

app.use(bodyParser.json())

app.use(cookieParser())

app.use('/users', userRouter)

app.use('/products', productsRouter)

app.use('/rent', rent)

app.use('/review', review)

app.use('/buy', buyRouter)

app.use('/upload', imagesRouter)

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use((req, res, next) => {
    res.status(404).json({ message: "Neptune Rent API v0.5.1" })
})

app.get('/', (req, res) => {
    res.json({message:"Ok"})
})

app.listen(port, () => {console.log("Fut itt: http://localhost:" + port)})
