const db = require("./db")

async function createProduct(product) {
    const query = `INSERT INTO products (name, category, brand, price, description, stock, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)`
    const params = [product.name, product.category, product.brand, product.price, product.description, product.stock, product.image_url]
    console.log(query, params)

    const result = await db.query(query, params);
    let message = "Hiba a termék létrehozásánál!";

    if (result.affectedRows) {
        message = "A termék létrehozva!";
    }

    return { message };
}

async function getProduct(id){
    const query = `select * from products where id = ?`
    const params = [id]
    try{
        const [row] = await db.query(query, params)
        if (!row) throw new Error("A termék nem található!")
        return row
    }
    catch(error){
        throw new Error("Az adatbázis nem elérhető!")
    }
}

async function getAllProducts(){
    const query = `select * from products`
    try{
        const rows = await db.query(query)
        return rows
    }
    catch(error){
        console.error(error)
    }
}

async function deleteProduct(id){
    const query = `delete from products where id = ?`
    const params = [id]
    try{
        const result = await db.query(query, params)
        if (!result.affectedRows) throw new Error("A termék törlése sikertelen!")
        return { success: true }
    }
    catch(error){
        console.error(error)
    }
}

async function editProduct(id, product){
    const fields = []
    const params = []
    for (const [key, value] of Object.entries(product)) {
        fields.push(`${key}=?`)
        params.push(value)
    }
    const query = `UPDATE products SET ${fields.join(", ")} WHERE id=?`
    params.push(id)
    try {
        const result = await db.query(query, params)
        if (!result.affectedRows) throw new Error("A termék módosítása sikertelen!")
        return { success: true }
    } catch (error) {
        console.error(error)
    }
}

async function getBrand(){
    const query = `select distinct brand from products`
    try{
        const rows = await db.query(query)
        return rows
    }
    catch(error){
        console.error(error)
    }
}
async function getLatestImage(category) {
    const query = `SELECT image_url FROM products where category = ? ORDER BY id DESC LIMIT 1`
    const params = [category]
    try {
      const row = db.query(query, params)
      if (!row) throw new Error("A termék nem található!")
      return row
    } catch (error) {
      console.error(error)
    }
}

module.exports = {
    createProduct,
    getAllProducts,
    getProduct,
    deleteProduct,
    editProduct,
    getBrand,
    getLatestImage
}
