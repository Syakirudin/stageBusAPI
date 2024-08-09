class errorMsgController {
    notFound(req, res) {
        res.status(404).json({
            message: "Not found",
        });
    }


    //add other error message controllers

    
}

export default new errorMsgController();