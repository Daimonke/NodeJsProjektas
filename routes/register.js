import express from "express";
import con from '../dbCon.js';
import bcrypt from 'bcrypt';

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        res.render('register', { css: 'index.css' })

    } catch (err) {
        res.json({ err: err });
    }
});

router.post('/', async (req, res) => {
    try {
        const { username, password, repeatPassword } = req.body;
        if (password !== repeatPassword) return res.json({ err: 'Passwords do not match' })
        const [usernameCheck] = await con.query(`SELECT name FROM user WHERE name = ?`, [username])
        if (usernameCheck.length > 0) return res.json({ err: 'Username already taken' })
        const hashedPassword = await bcrypt.hash(password, 10)
        await con.query(`
        INSERT INTO user (name, password, register_time)
        VALUES(?, ?, ?)
        `, [username, hashedPassword, new Date().toLocaleString('LT')]);
        res.redirect('/')
    } catch (err) {
        res.json({ err: err })
    }
})

export default router
