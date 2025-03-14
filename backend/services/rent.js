const db = require("./db")

async function addRent(rent) {
    const checkProductQuery = `SELECT * FROM products WHERE id = ?`
    const checkProductParams = [rent.product_id]
    try {
        const product = await db.query(checkProductQuery, checkProductParams)
        if (product.length === 0) throw new Error("A termék nem létezik!")
    } catch (error) {
        console.error(error)
        throw error
    }
    const startDate = new Date()
    const expiresDate = new Date()
    expiresDate.setMonth(startDate.getMonth() + 1)
    const query = `INSERT INTO rent (user_id, product_id, start_date, expires, price) VALUES (?,?,?,?,?)`
    const params = [rent.user_id, rent.product_id, startDate, expiresDate, rent.price]
    console.log(query, params)
    try {
        const row = await db.query(query, params)
        if (!row) throw new Error("A kölcsönzés nem sikerült!")
        return row
    } catch (error) {
        console.error(error)
        throw error
    }
}

async function getRentById(id) {
    const rentQuery = `SELECT * FROM rent WHERE id = ?`
    const rentParams = [id]
    try {
        const rent = await db.query(rentQuery, rentParams)
        if (!rent.length) throw new Error("A keresett kölcsönzés nem található!")
        
        const userQuery = `SELECT name FROM users WHERE id = ?`
        const userParams = [rent[0].user_id]
        const user = await db.query(userQuery, userParams)
        if (!user.length) throw new Error("A felhasználó nem található!")
        
        rent[0].name = user[0].name
        return rent[0]
    } catch (error) {
        console.error(error)
        throw error
    }
}

async function getRentByUserId(id) {
    const rentQuery = `SELECT * FROM rent WHERE user_id = ?`
    const rentParams = [id]
    try {
        const rents = await db.query(rentQuery, rentParams)
        if (!rents.length) throw new Error("A keresett kölcsönzés nem található!")
        
        const userQuery = `SELECT name FROM users WHERE id = ?`
        const userParams = [id]
        const user = await db.query(userQuery, userParams)
        if (!user.length) throw new Error("A felhasználó nem található!")
        
        const name = user[0].name
        rents.forEach(rent => rent.name = name)
        
        return rents
    } catch (error) {
        console.error(error)
        throw error
    }
}

async function deleteRent(id){
    const query = `DELETE FROM rent WHERE id = ?`
    const params = [id]
    try {
        const result = await db.query(query, params)
        if (!result.affectedRows) throw new Error("A kölcsönzés törlése sikertelen!")
        return { success: true }
    } catch (error) {
        console.error(error)
        throw error
    }
}

async function updateRent(id, rent) {
    const fields = []
    const params = []
    for (const [key, value] of Object.entries(rent)) {
        fields.push(`${key}=?`)
        params.push(value)
    }
    const query = `UPDATE rent SET ${fields.join(", ")} WHERE id=?`
    params.push(id)
    try {
        const result = await db.query(query, params)
        if (!result.affectedRows) throw new Error("A kölcsönzés módosítása sikertelen!")
        return { success: true }
    } catch (error) {
        console.error(error)
        throw error
    }
}

async function getAllRent(){
    const query = `select * from rent`
    try{
        const rows = await db.query(query)
        return rows
    }
    catch(error){
        console.error(error)
    }
}

async function notifyUser(id){
    
}

module.exports = {
    addRent,
    getRentById,
    getRentByUserId,
    deleteRent,
    updateRent,
    getAllRent
}
