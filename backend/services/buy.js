const db = require("./db")

async function buyProduct(details, user_id) {
    if (!Array.isArray(details) || details.length === 0) {
        throw new Error("Nincs megadva termék!")
    }
    for (const detail of details) {
        const { product_id, quantity } = detail
        const [stockRow] = await db.query(`SELECT stock, price FROM products WHERE id=?`, [product_id])
        if (!stockRow) throw new Error(`A termék (ID: ${product_id}) nem található!`)
        if (stockRow.stock < quantity) throw new Error(`Nincs elég készleten a termékből (ID: ${product_id})!`)
        detail.price = stockRow.price * quantity
        detail.ppu = stockRow.price
    }
    try {
        for (const detail of details) {
            const { product_id, quantity, price, ppu } = detail
            await db.query(`UPDATE products SET stock = stock - ? WHERE id=?`, [quantity, product_id])
            await db.query(`INSERT INTO cart (product_id, user_id, quantity, price, ppu) VALUES (?, ?, ?, ?, ?)`, [product_id, user_id, quantity, price, ppu])
        }
        return { success: true, message: "A vásárlás sikeres!" }
    } catch (error) {
        console.error(error)
        throw new Error("A vásárlás sikertelen!")
    }
}

async function editBuy(id, detail) {
    const [existingRow] = await db.query(`SELECT product_id, quantity FROM cart WHERE id=?`, [id])
    if (!existingRow) throw new Error("A vásárlás nem található!")
    const { product_id: oldProductId, quantity: oldQuantity } = existingRow
    let quantityDiff = 0
    let newProductId = oldProductId
    if (detail.quantity !== undefined) {
        quantityDiff = detail.quantity - oldQuantity
    }
    if (detail.product_id !== undefined) {
        newProductId = detail.product_id
        await db.query(`UPDATE products SET stock = stock + ? WHERE id=?`, [oldQuantity, oldProductId])
        const [newProduct] = await db.query(`SELECT price, stock FROM products WHERE id=?`, [newProductId])
        if (!newProduct) throw new Error("Az új termék nem található!")
        if (newProduct.stock < (detail.quantity || oldQuantity)) {
            throw new Error("Nincs elég készleten az új termékből!")
        }
        await db.query(`UPDATE products SET stock = stock - ? WHERE id=?`, [detail.quantity || oldQuantity, newProductId])
        detail.price = newProduct.price * (detail.quantity || oldQuantity)
        detail.ppu = newProduct.price
    } else {
        if (detail.quantity !== undefined) {
            const [stockRow] = await db.query(`SELECT stock, price FROM products WHERE id=?`, [oldProductId])
            if (!stockRow) throw new Error("A termék nem található!")
            if (stockRow.stock < quantityDiff) {
                throw new Error("Nincs elég készleten a módosításhoz!")
            }
            await db.query(`UPDATE products SET stock = stock - ? WHERE id=?`, [quantityDiff, oldProductId])
            detail.price = stockRow.price * detail.quantity
            detail.ppu = stockRow.price
        }
    }

    const fields = []
    const params = []
    for (const [key, value] of Object.entries(detail)) {
        fields.push(`${key}=?`)
        params.push(value)
    }
    if (fields.length === 0) return { success: false, message: "Nincs módosítandó adat!" }
    const query = `UPDATE cart SET ${fields.join(", ")} WHERE id=?`
    params.push(id)

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
    const query = `select * from cart where id=?`
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
    const query = `select * from cart`
    try {
        const rows = await db.query(query)
        return rows
    } catch (error) {
        console.error(error)
    }
}

async function deleteBuy(id) {
    try {
        const [buyRow] = await db.query(`SELECT product_id, quantity FROM cart WHERE id=?`, [id])
        if (!buyRow) throw new Error("A vásárlás nem található!")
        const { product_id, quantity } = buyRow
        await db.query(`UPDATE products SET stock = stock + ? WHERE id=?`, [quantity, product_id])
        const result = await db.query(`DELETE FROM cart WHERE id=?`, [id])
        if (!result.affectedRows) throw new Error("A vásárlás törlése sikertelen!")
        return { success: true, message: "A vásárlás törölve, a készlet frissítve." }
    } catch (error) {
        console.error(error)
        throw error
    }
}

async function getBuyerByUserId(id){
    const query = `select * from cart where user_id=?`
    const params = [id]
    try{
        const rows = await db.query(query, params)
        if (!rows) throw new Error("A vásárlás nem található!")
        return rows
    }
    catch(error){
        console.error(error)
    }
}

module.exports = {
    buyProduct,
    editBuy,
    getBuyDetails,
    deleteBuy,
    getAllBuyers,
    getBuyerByUserId
}