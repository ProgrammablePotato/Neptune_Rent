const db = require("./db")

async function addReview(review) {
    const {product_id, user_id, rating, reviewText} = review
    const checkProductQuery = `SELECT * FROM products WHERE id = ?`
    const checkProductParams = [product_id]
    console.log(checkProductQuery, checkProductParams)
    try {
        const product = await db.query(checkProductQuery, checkProductParams)
        if (product.length === 0) throw new Error("A termék nem létezik!")
    } catch (error) {
        console.error(error)
        throw error
    }

    const checkUserQuery = `SELECT * FROM users WHERE id = ?`
    const checkUserParams = [user_id]
    console.log(checkUserQuery, checkUserParams)
    try {
        const user = await db.query(checkUserQuery, checkUserParams)
        if (user.length === 0) throw new Error("A felhasználó nem létezik!")
    } catch (error) {
        console.error(error)
        throw error
    }

    const query = `INSERT INTO reviews (product_id, user_id, rating, reviewText) VALUES (?,?,?,?)`
    const params = [product_id, user_id, rating, reviewText]
    console.log(query, params)
    try {
        const row = await db.query(query, params)
        if (!row || rating > 5) throw new Error("Az értékelés nem sikerült!")
        return row
    } catch (error) {
        console.error(error)
        throw error
    }
}

async function getReviewById(id){
    const query = `select * from reviews where id = ?`
    const params = [id]
    console.log(query, params)
    try{
        const [row] = await db.query(query, params)
        if (!row) throw new Error("Az értékelés nem található!")
        return row
    }
    catch(error){
        console.error(error)
    }
}

async function getAllReview() {
    const query = `select * from reviews`
    try {
        const rows = await db.query(query)
        return rows
    } catch (error) {
        console.error(error)
    }
}

async function getReviewByProductId(id){
    const query = `select * from reviews where product_id = ?`
    const params = [id]
    console.log(query, params)
    try{
        const rows = await db.query(query, params)
        return rows
    }
    catch(error){
        console.error(error)
    }
}

async function deleteReview(id){
    const query = `delete from reviews where id = ?`
    const params = [id]
    console.log(query, params)
    try{
        const result = await db.query(query, params)
        if (!result.affectedRows) throw new Error("Az értékelés törlése sikertelen!")
        return { success: true }
    }
    catch(error){
        console.error(error)
    }
}

async function editReview(id, review){
    const fields = []
    const params = []
    for (const [key, value] of Object.entries(review)) {
        fields.push(`${key}=?`)
        params.push(value)
    }
    const query = `UPDATE reviews SET ${fields.join(", ")} WHERE id=?`
    params.push(id)
    console.log(query, params)
    try {
        const result = await db.query(query, params)
        if (!result.affectedRows) throw new Error("Az értékelés módosítása sikertelen!")
        return { success: true }
    } catch (error) {
        console.error(error)
        throw error
    }
}

module.exports = {
    addReview,
    getReviewById,
    getReviewByProductId,
    deleteReview,
    editReview,
    getAllReview
}