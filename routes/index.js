import express from "express";

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        res.render('index', { css: 'index.css' })

    } catch (err) {
        res.json({ err: err });
    }
});

export default router
