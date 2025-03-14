const db = require("./db")

async function addUser(detail) {
    const { name, addr1, addr2, country, zipcode, city } = detail
    const query = `INSERT INTO users (name, addr1, addr2, country, zipcode, city) VALUES (?, ?, ?, ?, ?, ?);`
    const params = [name, addr1, addr2, country, zipcode, city]
    console.log(query, params)
    try {
        const result = await db.query(query, params)
        if (!result.affectedRows) throw new Error("A felhasználó hozzáadása sikertelen!")
        return { success: true, insertedId: result.insertId }
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
        
        const query = `DELETE FROM users WHERE id=?`
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

module.exports = {
    addUser,
    editUser,
    getUserDetails,
    deleteUser,
    getAllUser
}
