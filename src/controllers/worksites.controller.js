const { Op } = require("sequelize");

class WorksitesController {
  constructor(db) {
    this.db = db;
  }

  //Add new worksite
  async insertWorksite(req, res) {
    const { worksiteName, geometry } = req.body;
    try {
      const newWorksite = await this.db.worksites.create({
        worksite_name: worksiteName,
        geometry: geometry,
      });
      // Respond with new worksite
      return res.json(newWorksite);
    } catch (err) {
      console.log("error:", err);
      return res.status(400).json({ error: true, msg: err });
    }
  }

  async getAll(req, res) {
    try {
      const output = await this.db.worksites.findAll();
      return res.json(output);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }
}
module.exports = WorksitesController;
