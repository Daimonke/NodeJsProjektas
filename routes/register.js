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
        const { username, password, repeatPassword } = req.body;
        // Check if passwords match
        if (password !== repeatPassword) return res.json({ err: 'Passwords do not match' })
        // Check if username is already taken
        const [usernameCheck] = await con.query(`SELECT name FROM user WHERE name = ?`, [username])
        if (usernameCheck.length > 0) return res.json({ err: 'Username already taken' })
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)
        // Create user
        const registeredUser = await con.query(`
        INSERT INTO user (name, password, register_time)
        VALUES(?, ?, ?)
        `, [username, hashedPassword, new Date().toLocaleString('LT')]);
        // Create token
        const token = jwt.sign({ username: username, id: registeredUser[0].insertId }, process.env.JWT_SECRET, { expiresIn: '25m' })
        // Send response
        res.cookie('token', token, { maxAge: 900000, httpOnly: true })
            .redirect('/')
    } catch (err) {
        res.json({ err: err })
    }
})

export default router
