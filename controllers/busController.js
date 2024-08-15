import BusModel from "../models/busModel.js";

class BusController {
    async createBus(req, res) {
        const { bus_number, total_seats, bus_type, created_at } = req.body;
        try {
            const newBus = await BusModel.create(
                bus_number,
                total_seats,
                bus_type,
                created_at
            );
            res.status(201).json({
                message: "Bus created successfully",
                bus: newBus,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal server error",
            });
        }   
    }

    async getAllBuses(req, res) {
        try {
            const buses = await BusModel.findAll();
            res.status(200).json(buses);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal server error",
            });
        }
    }

    async getBusById(req, res) {
        const id = req.params.id;
        try {
            const bus = await BusModel.findById(id);
            if (!bus) {
                return res.status(404).json({
                    message: "Bus not found",
                });
            }
            res.status(200).json(bus);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal server error",
            });
        }
    }

    async deleteBus(req, res) {
        const id = req.params.id;
        try {
            const deletedBus = await BusModel.delete(id);
            if (!deletedBus) {
                return res.status(404).json({
                    message: "Bus not found",
                });
            }
            res.status(200).json({
                message: "Bus deleted successfully",
                bus: deletedBus,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal server error",
            });
        }
    }

    async updateBus(req, res) {
        const id = req.params.id;
        const { bus_number, total_seats, bus_type, created_at } = req.body;
        try {
            const updatedBus = await BusModel.update(
                id,
                { bus_number, total_seats, bus_type, created_at }
            );
            if (!updatedBus) {
                return res.status(404).json({
                    message: "Bus not found",
                });
            }
            res.status(200).json({
                message: "Bus updated successfully",
                bus: updatedBus,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal server error",
            });
        }

    }
}

export default new BusController();