const db = require("./db")

async function getUserCartById(id) {
    const query = `SELECT users.name, cart.contents FROM cart INNER JOIN users ON cart.user_id = users.id WHERE users.id=?`
    const params = [id]
    console.log(query, params)
    try {
        const row = await db.query(query, params)
        if (!row) throw new Error("A keresett kosár nem található!")
        return row
    } catch (error) {
        console.error(error)
        throw error
    }
}

async function getUserCartByName(name){
    const query = `SELECT users.name, cart.contents FROM cart INNER JOIN users ON cart.user_id = users.id WHERE users.name=?`
    const params = [name]
    console.log(query, params)
    try {
        const row = await db.query(query, params)
        if (!row) throw new Error("A keresett kosár nem található!")
        return row
    } catch (error) {
        console.error(error)
        throw error
    }
}

async function addToUserCart(user_id, contents){
    const query = `INSERT INTO cart (user_id, contents) VALUES (?, ?)`
    const params = [user_id, contents]
    console.log(query, params)
    try {
        const result = await db.query(query, params)
        if (!result.insertId) throw new Error("A kosárba helyezés sikertelen!")
        return { success: true, insertedId: result.insertId }
    } catch (error) {
        console.error(error)
        throw error
    }
}

async function updateUserCart(id, contents){
    const query = `UPDATE cart SET contents=? WHERE user_id=?`
    const params = [contents, id]
    console.log(query, params)
    try {
        const result = await db.query(query, params)
        if (!result.affectedRows) throw new Error("A kosár frissítése sikertelen!")
        return { success: true }
    } catch (error) {
        console.error(error)
        throw error
    }
}

async function getAllCart() {
    const query = `SELECT * FROM cart`
    try {
        const rows = await db.query(query)
        return rows
    } catch (error) {
        console.error(error)
    }
}

async function deleteCart(id){
    const query = `DELETE FROM cart WHERE id = ?`
    const params = [id]
    try {
        const result = await db.query(query, params)
        if (!result.affectedRows) throw new Error("A kosár törlése sikertelen!")
        return { success: true }
    } catch (error) {
        console.error(error)
        throw error
    }
}

async function getTestCart(id) {
    const query = `select contents from cart_test where user_id = ?`
    const params = [id]
    try {
        const row = await db.query(query, params)
        if (!row) throw new Error("A keresett kosár nem található!")
        return row
    } catch (error) {
        console.error(error)
        throw error
    }
}

module.exports = {
    getUserCartById,
    getUserCartByName,
    addToUserCart,
    updateUserCart,
    getAllCart,
    deleteCart,
    getTestCart
}