import express from "express";
import con from '../dbCon.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import isAuthed from '../isAuthed.js'

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const auth = await isAuthed(req)
        res.render('login', { css: 'index.css', isAuthed: auth })

    } catch (err) {
        res.json({ err: err });
    }
});

router.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;
        // Check if username is already taken
        const [user] = await con.query(`SELECT * FROM user WHERE name = ?`, [username])
        if (user.length === 0) return res.json({ err: 'User doesnt exist' })
        // Compare password
        const compare = await bcrypt.compare(password, user[0].password)
        if(!compare) return res.json({ err: 'Wrong password' })
        // Create token
        const token = jwt.sign({ username: user[0].name, id: user[0].id }, process.env.JWT_SECRET, { expiresIn: '25m' })
        // Send response
        res.cookie('token', token, { maxAge: 900000, httpOnly: true })
            .redirect('/')
    } catch (err) {
        res.json({ err: err })
    }
})

export default router
