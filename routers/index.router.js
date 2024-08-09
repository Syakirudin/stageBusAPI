import express from "express";

const router = express.Router();

router.get('/api/hello', (req, res) => {
    res.send('Hello, world!');
});

export { router };
