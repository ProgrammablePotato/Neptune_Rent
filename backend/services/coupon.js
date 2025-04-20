const db = require("./db")

const createCoupon = async (code, discount, expiryDate, isActive) => {
    const query = `
        INSERT INTO coupons (code, discount, expiry_date, is_active)
        VALUES (?, ?, ?, ?)
    `
    const values = [code, discount, expiryDate, isActive]
    const result = await db.query(query, values)
    return { id: result.insertId, code, discount, expiryDate, isActive }
}

const getAllCoupons = async () => {
    const query = `
        SELECT * FROM coupons
        ORDER BY created_at DESC
    `
    return await db.query(query)
}

const getCouponByCode = async (code) => {
    const query = `
        SELECT * FROM coupons
        WHERE code = ?
    `
    const result = await db.query(query, [code])
    return result[0]
}

const updateCoupon = async (id, code, discount, expiryDate, isActive) => {
    const query = `
        UPDATE coupons
        SET code = ?, discount = ?, expiry_date = ?, is_active = ?
        WHERE id = ?
    `
    const values = [code, discount, expiryDate, isActive, id]
    await db.query(query, values)
    return { id, code, discount, expiryDate, isActive }
}

const deleteCoupon = async (id) => {
    const query = `
        DELETE FROM coupons
        WHERE id = ?
    `
    await db.query(query, [id])
    return { id }
}

const validateCoupon = async (code, userId) => {
    const couponQuery = `
        SELECT * FROM coupons
        WHERE code = ? AND is_active = true
        AND (expiry_date IS NULL OR expiry_date > NOW())
    `
    const coupon = await db.query(couponQuery, [code])
    
    if (coupon.length === 0) {
        throw new Error('Invalid or expired coupon')
    }

    const usageQuery = `
        SELECT * FROM coupon_usage
        WHERE coupon_id = ? AND user_id = ?
    `
    const usage = await db.query(usageQuery, [coupon[0].id, userId])
    
    if (usage.length > 0) {
        throw new Error('You have already used this coupon')
    }

    return coupon[0]
}

const useCoupon = async (code, userId) => {
    const coupon = await validateCoupon(code, userId)
    
    const query = `
        INSERT INTO coupon_usage (coupon_id, user_id)
        VALUES (?, ?)
    `
    await db.query(query, [coupon.id, userId])
    
    return coupon
}

module.exports = {
    createCoupon,
    getAllCoupons,
    getCouponByCode,
    updateCoupon,
    deleteCoupon,
    validateCoupon,
    useCoupon
}

