const db = require("./db")

async function addUser(detail) {
    const { firebase_uid, name, addr1, addr2, country, zipcode, city, email, phone, nick } = detail
    const checkQuery = `SELECT * FROM users WHERE firebase_uid = ?`
    try {
        const existingUser = await db.query(checkQuery, [firebase_uid])
        if (existingUser.length > 0) {
            const userId = existingUser[0].id
            return await editUser(userId, detail)
        } else {
            const insertQuery = `INSERT INTO users (firebase_uid, name, addr1, addr2, country, zipcode, city, email, phone, nick) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
            const params = [firebase_uid, name, addr1, addr2, country, zipcode, city, email, phone, nick]
            console.log(insertQuery, params)
            const result = await db.query(insertQuery, params)
            if (!result.affectedRows) throw new Error("A felhasználó hozzáadása sikertelen!")
            return { success: true, insertedId: result.insertId }
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}

async function editUser(id, detail) {
    const fields = []
    const params = []
    for (const [key, value] of Object.entries(detail)) {
        fields.push(`${key}=?`)
        params.push(value)
    }
    const query = `UPDATE users SET ${fields.join(", ")} WHERE id=?`
    params.push(id)
    console.log(query, params)
    try {
        const result = await db.query(query, params)
        if (!result.affectedRows) throw new Error("A felhasználó módosítása sikertelen!")
        return { success: true }
    } catch (error) {
        console.error(error)
        throw error
    }
}

async function getUserDetails(id,detail){
    const query = `select ${detail} from users where id=?`
    const params = [id]
    console.log(query, params)
    try{
        const [row] = await db.query(query, params)
        if (!row) throw new Error("A felhasználó nem található!")
        return row
    }
    catch(error){
        console.error(error)
    }
}

async function deleteUser(id) {
    const date = new Date().getTime()
    const checkQuery = `SELECT COUNT(*) as rentalCount FROM rent WHERE user_id=? AND expires > ?`
    const checkParams = [id, date]
    console.log(checkQuery, checkParams)
    try {
        const [row] = await db.query(checkQuery, checkParams)
        if (row.rentalCount > 0) throw new Error("A felhasználónak aktív bérlése van, nem törölhető!")

        const query = `DELETE FROM users WHERE firebase_uid=?`
        const params = [id]
        console.log(query, params)
        const result = await db.query(query, params)
        if (!result.affectedRows) {
            throw new Error("A felhasználó törlése sikertelen!")
        }
        return { success: true }
    } catch (error) {
        if (error.message === "A felhasználó törlése sikertelen!") {
            return { redirect: "https://thispersondoesnotexist.com" }
        }
        console.error(error)
        throw error
    }
}

async function getAllUser(){
    const query = `select * from users`
    try{
        const rows = await db.query(query)
        return rows
    }
    catch(error){
        console.error(error)
    }
}

async function getUserByFirebaseUid(firebase_uid) {
    const query = `SELECT * FROM users WHERE firebase_uid = ?`
    const params = [firebase_uid]
    console.log(query, params)
    try {
        const [row] = await db.query(query, params)
        if (!row) throw new Error("A felhasználó nem található!")
        return row
    } catch (error) {
        console.error(error)
        throw error
    }
}

module.exports = {
    addUser,
    editUser,
    getUserDetails,
    deleteUser,
    getAllUser,
    getUserByFirebaseUid
}
