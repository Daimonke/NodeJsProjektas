import express from "express";

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        res.clearCookie('token')
        .redirect('/')
    } catch (err) {
        res.json({ err: err });
    }
});

export default router;