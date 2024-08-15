import TripsModel from "../models/tripsModel.js";

class TripsController {
    async createTrip(req, res) {
        const {
            bus_id,
            route_id,
            departure_date,
            departure_time,
            arrival_time,
            base_price,
            created_at  
        } = req.body;
        try {   
            const newTrip = await TripsModel.create(
                bus_id,
                route_id,
                departure_date,
                departure_time, 
                arrival_time,
                base_price,
                created_at
            );
            res.status(201).json({
                message: "Trip created successfully",
                trip: newTrip,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal server error",
            });
        }

    }

    async getAllTrips(req, res) {
        try {
            const trips = await TripsModel.findAll();
            res.status(200).json(trips);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal server error",
            });
        }
    }

    async getTripById(req, res) {
        const id = req.params.id;
        try {
            const trip = await TripsModel.findById(id);
            if (!trip) {
                return res.status(404).json({
                    message: "Trip not found",
                });
            }
            res.status(200).json(trip);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal server error",
            });
        }
    }

    async deleteTrip(req, res) {
        const id = req.params.id;
        try {
            const deletedTrip = await TripsModel.delete(id);
            if (!deletedTrip) {
                return res.status(404).json({
                    message: "Trip not found",
                });
            }
            res.status(200).json({
                message: "Trip deleted successfully",
                trip: deletedTrip,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal server error",
            });
        }
    }

    async updateTrip(req, res) {
        const id = req.params.id;
        const updatedFields = req.body;
        try {
            const updatedTrip = await TripsModel.update(id, updatedFields);
            if (!updatedTrip) {
                return res.status(404).json({
                    message: "Trip not found",
                });
            }
            res.status(200).json({
                message: "Trip updated successfully",
                trip: updatedTrip,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal server error",
            });
        }
    }
}

export default new TripsController();