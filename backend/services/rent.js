const db = require("./db")
const nodemailer = require("nodemailer")
const cron = require("node-cron")

const transporter = nodemailer.createTransport({
    host: "mail.tokyohost.eu",
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USER, 
        pass: process.env.MAIL_PASS,
    }
})

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
    const query = `INSERT INTO rent (user_id, product_id, start_date, expires, price) VALUES (?,?,?,?,?)`
    const params = [
        rent.user_id, 
        rent.product_id, 
        new Date(rent.start_date).toISOString().slice(0, 19).replace('T', ' '),
        new Date(rent.expires).toISOString().slice(0, 19).replace('T', ' '),
        rent.price
    ]
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
        if (key === 'start_date' || key === 'expires') {
            fields.push(`${key}=?`)
            params.push(value)
        } else if (key === 'price') {
            fields.push(`${key}=?`)
            params.push(parseFloat(value))
        }
    }
    const query = `UPDATE rent SET ${fields.join(", ")} WHERE id=?`
    params.push(id)
    console.log('SQL Query:', query)
    console.log('SQL Params:', params)
    
    try {
        const result = await db.query(query, params)
        console.log('Update result:', result)
        if (!result.affectedRows) throw new Error("A kölcsönzés módosítása sikertelen!")
        return { success: true }
    } catch (error) {
        console.error('Update error:', error)
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

async function notifyUser() {
    try {
        const query = `
            SELECT r.id, r.user_id, r.product_id, r.expires, u.email 
            FROM rent r
            JOIN users u ON r.user_id = u.id
            WHERE DATEDIFF(r.expires, CURDATE()) IN (7, 3, 2, 1)
        `
        const rentals = await db.query(query)

        if (!rentals.length) {
            console.log("Nincs értesítésre váró bérlés.")
            return
        }
        for (const rental of rentals) {
            const { user_id, email, product_id, expires } = rental
            const daysLeft = Math.ceil((new Date(expires) - new Date()) / (1000 * 60 * 60 * 24))
            const subject = `Reminder: Your rental will expire in ${daysLeft} days!`
            const text = `Dear User,<br><br>
                Your rental for product ${product_id} will expire in ${daysLeft} days (${expires}).<br>
                Please return you product to a Neptune Rent pickup point or extend your rent period (comes with additional costs) before the rent period is over.<br>
                Best regards,<br>
                The Neptune Rent Team`
            await transporter.sendMail({
                from: '"Neptune Rent" <noreply@neptunerent.eu>',
                to: email,
                subject: subject,
                html: text
            })
            console.log(`E-mail snet to ${email}. (${daysLeft} remains).`)
        }
    } catch (error) {
        console.error("Error:", error)
    }
}

cron.schedule("0 9 * * *", () => {
    console.log("Checking dayz...")
    notifyUser()
})

module.exports = {
    addRent,
    getRentById,
    getRentByUserId,
    deleteRent,
    updateRent,
    getAllRent,
    notifyUser
}
