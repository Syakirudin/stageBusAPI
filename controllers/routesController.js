import RoutesModel from "../../models/routesModel.js";

class RoutesController {
    async createRoute(req, res) {
        const { route_number, route_name, created_at } = req.body;
        try {
            const newRoute = await RoutesModel.create(
                route_number,
                route_name,
                created_at
            );
            res.status(201).json({
                message: "Route created successfully",
                route: newRoute,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal server error",
            });
        }
    }

    async getAllRoutes(req, res) {
        try {
            const routes = await RoutesModel.findAll();
            res.status(200).json(routes);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal server error",
            });
        }
    }

    async getRouteById(req, res) {
        const id = req.params.id;
        try {
            const route = await RoutesModel.findById(id);
            if (!route) {
                return res.status(404).json({
                    message: "Route not found",
                });
            }
            res.status(200).json(route);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal server error",
            });
        }
    }

    async deleteRoute(req, res) {
        const id = req.params.id;
        try {
            const deletedRoute = await RoutesModel.delete(id);
            if (!deletedRoute) {
                return res.status(404).json({
                    message: "Route not found",
                });
            }
            res.status(200).json({
                message: "Route deleted successfully",
                route: deletedRoute,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal server error",
            });
        }
    }

    async updateRoute(req, res) {
        const id = req.params.id;
        const updatedFields = req.body;
        try {
            const updatedRoute = await RoutesModel.update(id, updatedFields);
            if (!updatedRoute) {
                return res.status(404).json({
                    message: "Route not found",
                });
            }
            res.status(200).json({
                message: "Route updated successfully",
                route: updatedRoute,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal server error",
            });
        }
    }
}

export default new RoutesController();