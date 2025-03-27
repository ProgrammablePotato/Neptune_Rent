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

async function getTestCart(user_id) {
    const query = `
        SELECT id, user_id, price, quantity, brand, name, prod_id
        FROM cart_test
        WHERE user_id = ?`;

    try {
        const rows = await db.query(query, [user_id]);
        
        if (!rows || rows.length === 0) {
            throw new Error("A kosár üres vagy nem található!");
        }

        return rows;
    } catch (error) {
        console.error("Hiba történt a kosár lekérdezésekor:", error);
        throw error;
    }
}

async function addToTestCart(user_id, product_id) {
    const selectQuery = `
        SELECT 
            p.brand, p.name, k.ppu, k.quantity
        FROM kotegelo k
        JOIN products p ON k.product_id = p.id
        WHERE k.product_id = ? AND k.user_id = ?`;

    try {
        const [result] = await db.query(selectQuery, [product_id, user_id]);

        if (!result) {
            throw new Error("A termék nem található a kotegelo táblában!");
        }

        const { brand, name, ppu, quantity } = result;

        const insertQuery = `
            INSERT INTO cart_test (user_id, prod_id, price, quantity, brand, name)
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            quantity = quantity + VALUES(quantity)`;

        await db.query(insertQuery, [user_id, product_id, ppu, quantity, brand, name]);

        return { message: "Termék hozzáadva a kosárhoz!" };
    } catch (error) {
        console.error("Hiba történt:", error);
        throw error;
    }
}


module.exports = {
    getUserCartById,
    getUserCartByName,
    addToUserCart,
    updateUserCart,
    getAllCart,
    deleteCart,
    getTestCart,
    addToTestCart
}