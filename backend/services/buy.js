const db = require("./db")

async function buyProduct(detail) {
    const { product_id, user_id, quantity } = detail
    const { quantity: stock} = await db.query(`select stock from products where id=?`, [product_id])
    if (stock < quantity) throw new Error("Nincs elég készleten!")
    else(await db.query(`update products set stock=stock-? where id=?`, [quantity, product_id]))
    const priceQuery = `select price from products where id=?`
    const priceParams = [product_id]
    try{
        const [row] = await db.query(priceQuery, priceParams)
        if (!row) throw new Error("A termék nem található!")
        const price = row.price
        detail.price = price * quantity
        console.log(detail.price)
    }
    catch(error){
        console.error(error)
        throw error
    }
    const ppuQuery = `select price from products where id=?`
    const ppuParams = [product_id]
    try{
        const row = await db.query(ppuQuery, ppuParams)
        if (!row) throw new Error("A termék nem található!")
        const price = row.price
        detail.price = price
    } catch (error) {
        console.error(error)
        throw error
    }

    const query = `INSERT INTO kotegelo (product_id, user_id, quantity) VALUES (?, ?, ?);`
    const params = [product_id, user_id, quantity]
    console.log(query, params)
    try {
        const result = await db.query(query, params)
        if (!result.affectedRows) throw new Error("A vásárlás sikertelen!")
        return { success: true, insertedId: result.insertId }
    } catch (error) {
        console.error(error)
        throw error
    }
}

async function editBuy(id, detail) {
    const fields = []
    const params = []
    for (const [key, value] of Object.entries(detail)) {
        fields.push(`${key}=?`)
        params.push(value)
    }
    const query = `UPDATE kotegelo SET ${fields.join(", ")} WHERE id=?`
    params.push(id)
    console.log(query, params)
    try {
        const result = await db.query(query, params)
        if (!result.affectedRows) throw new Error("A vásárlás módosítása sikertelen!")
        return { success: true }
    } catch (error) {
        console.error(error)
        throw error
    }
}

async function getBuyDetails(id){
    const query = `select * from kotegelo where id=?`
    const params = [id]
    console.log(query, params)
    try{
        const [row] = await db.query(query, params)
        if (!row) throw new Error("A vásárlás nem található!")
        return row
    }
    catch(error){
        console.error(error)
    }
}

async function getAllBuyers() {
    const query = `select * from kotegelo`
    try {
        const rows = await db.query(query)
        return rows
    } catch (error) {
        console.error(error)
    }
}

async function deleteBuy(id) {
    const query = `DELETE FROM kotegelo WHERE id=?`
    const params = [id]
    console.log(query, params)
    try {
        const result = await db.query(query, params)
        if (!result.affectedRows) throw new Error("A vásárlás törlése sikertelen!")
        return { success: true }
    } catch (error) {
        console.error(error)
        throw error
    }
}

module.exports = {
    buyProduct,
    editBuy,
    getBuyDetails,
    deleteBuy,
    getAllBuyers
}