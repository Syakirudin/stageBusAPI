import BusStopModel from "../../models/bus.model/busStopModel.js";

class BusStopController {   
    async createBusStop(req, res) {
        const { route_id, city_name,stop_order,create_at,coordinate,stop_name,stop_type } = req.body;
        try {
            const newBusStop = await BusStopModel.create(
                route_id, 
                city_name,
                stop_order,
                create_at,
                coordinate,
                stop_name,
                stop_type
            );
            res.status(201).json({
                message: "Bus stop created successfully",
                bus_stop: newBusStop,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal server error",
            });
        }   
    }

    async getAllBusStops(req, res) {
        try {
            const busStops = await BusStopModel.findAll();
            res.status(200).json(busStops);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal server error",
            });
        }   
    }

    async getBusStopById(req, res) {
        const id = req.params.id;
        try {
            const busStop = await BusStopModel.findById(id);
            if (!busStop) {
                return res.status(404).json({
                    message: "Bus stop not found",
                });
            }
            res.status(200).json(busStop);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal server error",
            });
        }   
    }

    async updateBusStop(req, res) {
        const id = req.params.id;
        const updatedFields = req.body;
        try {
            const updatedBusStop = await BusStopModel.update(id, updatedFields);
            res.status(200).json({
                message: "Bus stop updated successfully",
                bus_stop: updatedBusStop,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal server error",
            });
        }   
    }

    async deleteBusStop(req, res) {
        const id = req.params.id;
        try {   
            const deletedBusStop = await BusStopModel.delete(id);
            res.status(200).json({
                message: "Bus stop deleted successfully",   
                bus_stop: deletedBusStop,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal server error",
            });
        }   
    }





}

export default new BusStopController () ;