const db = require("./db")

async function getImage(product){
    const url = `https://api.unsplash.com/photos/random?query=${product}&client_id=${process.env.UNSPLASH_ACCESS}`
    const response = await fetch(url)
    console.log(response)
}

module.exports = {
    getImage
}