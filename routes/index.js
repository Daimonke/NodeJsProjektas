import express from "express";
import con from '../dbCon.js'

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const [data] = await con.query(`
        SELECT blog.*, user.name FROM blog
        JOIN user ON blog.author_id = user.id
        `)
        res.render('index', { css: 'index.css', data: data })

    } catch (err) {
        res.json({ err: err });
    }
});

export default router
