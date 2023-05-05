const Addon = require('../models/addon');

// @desc    Get all addons
// @route   GET /api/v1/addons
// @access  Private

exports.getAddons = async (req, res, next) => {
    try {
        const addons = await Addon.find();
        res.status(200).json({ success: true, data: addons });
    }
    catch (err) {
        res.status(400).json({ success: false , error: "Server Error"});
    }
}

// @desc    Get single addon
// @route   GET /api/v1/addons/:id
// @access  Private

exports.getAddon = async (req, res, next) => {
    try {
        const addon = await Addon.findById(req.params.id);
        if (!addon) {
            return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: addon });
    }
    catch (err) {
        res.status(400).json({ success: false , error: "Server Error"});
    }
}

// @desc    Create an addon
// @route   POST /api/v1/addons
// @access  Private

exports.createAddon = async (req, res, next) => {
    try {
        const newAddon = await Addon.create(req.body);
        res.status(201).json({ success: true, data: newAddon });
    }
    catch (err) {
        res.status(400).json({ success: false , error: "Server Error"});
    }
}

// @desc    Update an addon
// @route   PUT /api/v1/addons/:id
// @access  Private

exports.updateAddon = async (req, res, next) => {
    try {
        const addon = Addon.findOneAndUpdate(req.body);
        if (!addon) {
            return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: addon });
    }
    catch (err) {
        res.status(400).json({ success: false , error: "Server Error"});
    }
}

// @desc    Delete an addon
// @route   DELETE /api/v1/addons/:id
// @access  Private

exports.deleteAddon = async (req, res, next) => {
    try {
        const addon = await Addon.findOne({ _id: req.params.id });
        if (!addon) {
            return res.status(400).json({ success: false });
        }
        await addon.remove();
        res.status(200).json({ success: true, data: {} });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ success: false , error: "Server Error"});
    }
}