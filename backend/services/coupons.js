const db = require('../db');

class CouponService {

  static async getUsedCoupons(userId) {
    try {
      const result = await db.query(
        `SELECT c.*, uc.used_at 
         FROM coupons c 
         JOIN used_coupons uc ON c.id = uc.coupon_id 
         WHERE uc.user_id = $1 
         ORDER BY uc.used_at DESC`,
        [userId]
      )
      return result.rows
    } catch (error) {
      console.error('Error getting used coupons:', error)
      throw error
    }
  }
}

module.exports = CouponService; 