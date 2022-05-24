import express from "express";
import con from '../dbCon.js';
import isAuthed from "../isAuthed.js";

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        let sort = [];
        req.query.sort ? sort = req.query.sort.split(' ') : null;
        const auth = await isAuthed(req)
        const [data] = await con.query(`
        SELECT blog.*, user.name FROM blog
        JOIN user ON blog.author_id = user.id
        ${sort[1] == 'ASC' ? `ORDER BY ?? ASC`: ''}
        ${sort[1] == 'DESC' ? `ORDER BY ?? DESC`: ''}
        `, [sort[0]])
        res.render('index', { css: 'index.css', data: data, isAuthed: auth, token: req.token })

    } catch (err) {
        res.json({ err: err });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const auth = await isAuthed(req)
        const [data] = await con.query(`
        SELECT blog.*, user.name FROM blog
        JOIN user ON blog.author_id = user.id
        WHERE blog.id = ?
        `, [req.params.id])
        console.log(data[0])
        res.render('blog', { css: 'index.css', data: data[0], isAuthed: auth, token: req.token })

    } catch (err) {
        res.json({ err: err });
    }
});

export default router
