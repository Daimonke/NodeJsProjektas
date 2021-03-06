import express from "express";
import con from '../dbCon.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import isAuthed from "../isAuthed.js";

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const auth = await isAuthed(req)
        res.render('register', { css: 'index.css', isAuthed: auth })

    } catch (err) {
        res.json({ err: err });
    }
});

router.post('/', async (req, res) => {
    try {
        const { email, username, password, repeatPassword } = req.body;
        // Check if passwords match
        if (password !== repeatPassword) return res.json({ err: 'Passwords do not match' })
        // Check if username is already taken
        const [usernameCheck] = await con.query(`SELECT * FROM user WHERE name = ? OR email = ?`, [username, email])
        if (usernameCheck.length > 0) return res.json({ err: 'Username/email already taken' })
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)
        // Create user
        const registeredUser = await con.query(`
        INSERT INTO user (email, name, password, register_time)
        VALUES(?, ?, ?, ?)
        `, [email, username, hashedPassword, new Date().toLocaleString('LT')]);
        // Create token
        const token = jwt.sign({ username: username, id: registeredUser[0].insertId }, process.env.JWT_SECRET, { expiresIn: '1h' })
        // Send response
        res.cookie('token', token, { maxAge: 1000*60*60, httpOnly: true })
            .redirect('/')
    } catch (err) {
        res.json({ err: err })
    }
})

export default router
