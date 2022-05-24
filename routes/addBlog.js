import express from "express";
import isAuthed from "../isAuthed.js";
import con from "../dbCon.js";

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const auth = await isAuthed(req)
        if (!auth) return res.redirect('/login');
        res.render('addBlog', { css: 'index.css', isAuthed: auth, token: req.token })
    } catch (err) {
        res.json({ err: err });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, content } = req.body;
        const auth = await isAuthed(req)
        if (!auth) return res.redirect('/login');
        if (title.length < 1 || content.length < 1) return res.json({ err: 'Please fill out all fields' })
        await con.query(`
        INSERT INTO blog (title, content, author_id, created_at)
        VALUES (?, ?, ?, ?)
        `, [title, content, req.token.id, new Date().toLocaleString('LT')])
        res.redirect('/user')
    } catch (err) {
        res.json({ err: err });
    }
});

export default router