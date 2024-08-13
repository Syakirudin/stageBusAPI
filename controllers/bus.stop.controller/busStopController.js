import BusStopModel from "../../models/bus.model/busStopModel.js";

class BusStopController {   
    async createBusStop(req, res) {
        const { route_id, city_name, stop_order, create_at, coordinate, stop_name, stop_type } = req.body;
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
            console.error('Error creating bus stop:', error);  // Log detailed error to the console
            res.status(500).json({
                message: "Internal server error",
                error: error.message  // Include the error message in the response
            });
        }
    }
    

    async getAllBusStops(req, res) {
        try {
            const busStops = await BusStopModel.findAll();
            res.status(200).json(busStops);
        } catch (error) {
            console.error('Error fetching bus stops:', error.message); // Log error details
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
            console.error('Error fetching bus stop by ID:', error.message); // Log error details
            res.status(500).json({
                message: "Internal server error",
            });
        }   
    }

    async updateBusStop(req, res) {
        const id = req.params.id;
        const updatedFields = req.body;

        // Validate input data here if necessary
        
        try {
            const updatedBusStop = await BusStopModel.update(id, updatedFields);
            if (!updatedBusStop) {
                return res.status(404).json({
                    message: "Bus stop not found",
                });
            }
            res.status(200).json({
                message: "Bus stop updated successfully",
                bus_stop: updatedBusStop,
            });
        } catch (error) {
            console.error('Error updating bus stop:', error.message); // Log error details
            res.status(500).json({
                message: "Internal server error",
            });
        }   
    }

    async deleteBusStop(req, res) {
        const id = req.params.id;
        try {
            const deletedBusStop = await BusStopModel.delete(id);
            if (!deletedBusStop) {
                return res.status(404).json({
                    message: "Bus stop not found",
                });
            }
            res.status(200).json({
                message: "Bus stop deleted successfully",
                bus_stop: deletedBusStop,
            });
        } catch (error) {
            console.error('Error while deleting bus stop:', error);  // Log the full error object
            res.status(500).json({
                message: "Internal server error",
                error: error.message  // Include the error message in the response
            });
        }
    }
    
}

export default new BusStopController();
