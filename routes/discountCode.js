const express = require('express');
const router = express.Router();

const { getDiscountCodes, getDiscountCode, getDiscountCodeByCode, generateDiscountCode, updateDiscountCode, deleteDiscountCode } = require('../controllers/discountCode');

const {protect,authorize} = require('../middleware/auth')

router.route('/').get(protect,getDiscountCodes)
router.route('/:userID').post(protect, authorize('admin'),generateDiscountCode);
router.route('/:id').get(protect,getDiscountCodeByCode).put(protect, authorize('admin'),updateDiscountCode).delete(protect, authorize('admin'),deleteDiscountCode);
router.route('/id/:id').get(protect,getDiscountCode);

module.exports = router;