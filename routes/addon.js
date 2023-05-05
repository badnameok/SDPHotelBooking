const express = require('express');

const { getAddons, getAddon, createAddon, updateAddon, deleteAddon } = require('../controllers/addons');

const router = express.Router();

router.route('/').get(getAddons).post(createAddon);
router.route('/:id').get(getAddon).put(updateAddon).delete(deleteAddon);

module.exports = router;