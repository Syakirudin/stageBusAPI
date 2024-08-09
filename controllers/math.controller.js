// backend/controllers/MathController.js

class MathController {
    getSum(req, res) {
        const { a, b } = req.query;
        const sum = Number(a) + Number(b);
        res.json({ sum });
    }

    getSub(req, res) {
        const { a, b } = req.query;
        const sub = Number(a) - Number(b);
        res.json({ sub });
    }
}

export default new MathController();
