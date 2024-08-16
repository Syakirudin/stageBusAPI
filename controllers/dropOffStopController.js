import DropOffStopModel from "../models/dropOffStopModel.js";

class DropOffStopController {
  async createDropOffStop(req, res) {
    const { coordinate, time, created_at } = req.body;

    try {
      const newDropOffStop = await DropOffStopModel.create(
        coordinate,
        time,
        created_at
      );
      res.status(201).json({
        message: "Drop off stop created successfully",
        drop_off_stop: newDropOffStop,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async getAllDropOffStops(req, res) {
    try {
      const dropOffStops = await DropOffStopModel.findAll();
      res.status(200).json(dropOffStops);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async getDropOffStopById(req, res) {
    const id = req.params.id;
    try {
      const dropOffStop = await DropOffStopModel.findById(id);
      if (!dropOffStop) {
        return res.status(404).json({
          message: "Drop off stop not found",
        });
      }
      res.status(200).json(dropOffStop);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async deleteDropOffStop(req, res) {
    const id = req.params.id;
    try {
      const deletedDropOffStop = await DropOffStopModel.delete(id);
      if (!deletedDropOffStop) {
        return res.status(404).json({
          message: "Drop off stop not found",
        });
      }
      res.status(200).json({
        message: "Drop off stop deleted successfully",
        drop_off_stop: deletedDropOffStop,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async updateDropOffStop(req, res) {
    const id = req.params.id;
    const updatedFields = req.body;
    try {
      const updatedDropOffStop = await DropOffStopModel.update(
        id,
        updatedFields
      );
      if (!updatedDropOffStop) {
        return res.status(404).json({
          message: "Drop off stop not found",
        });
      }
      res.status(200).json({
        message: "Drop off stop updated successfully",
        drop_off_stop: updatedDropOffStop,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
}

export default new DropOffStopController();
