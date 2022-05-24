import express from "express";
import con from '../dbCon.js';
import isAuthed from "../isAuthed.js";

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const auth = await isAuthed(req);
        if(!auth) return res.redirect('/login');
        const [data] = await con.query(`
        SELECT blog.*, user.name FROM blog
        JOIN user ON blog.author_id = user.id
        WHERE user.id = ?
        `, [req.token.id])
        res.render('profile', { css: 'index.css', data: data, isAuthed: auth, token: req.token })

    } catch (err) {
        res.json({ err: err });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await isAuthed(req)
        const [blog] = await con.query(`
        SELECT * FROM blog
        WHERE id = ?
        `, [req.params.id])
        if (req.token.id == blog[0].author_id) {
            const data = await con.query(`
        DELETE FROM blog
        WHERE id = ?
        `, [req.params.id])
            console.log(data)
            res.redirect('/profile')
        } else {
            res.json({ err: 'You are not authorized to delete this post' })
        }
    } catch (err) {
        res.json({ err: err });
    }
});

export default router
