const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { verifySession } = require('./sessionVerify');

router.post('/register', async (req, res) => {

    try {

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUSer = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        const user = await newUSer.save();
        res.status(200).json(user);

    } catch (err) {
        res.status(500).json(err);
    }
});

router.post("/login", async (req, res) => {

    try {
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(404).send("User not found");

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        !validPassword && res.status(400).json('Wrong password');

        req.session.user = user;
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }

});

router.post('/change_password', verifySession, async (req, res) => {
    if (req.body.password) {
        try {
            const user = req.session.user;
            const comparedPassword = await bcrypt.compare(req.body.password, user.password);
            comparedPassword && res.status(400).json('Please change password');

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            await User.findByIdAndUpdate(req.body.id, {
                $set: {
                    password: hashedPassword
                }
            });
            res.status(200).json('Password modified');

        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        res.status(400).json('Insert a valid password');
    }
});

module.exports = router;