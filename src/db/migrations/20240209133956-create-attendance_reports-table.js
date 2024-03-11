"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("attendance_reports", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      worksite_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "worksites",
          key: "id",
        },
      },
      worker_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "workers",
          key: "id",
        },
      },
      worker_name: { type: Sequelize.STRING },
      user_id: { type: Sequelize.STRING },
      worksite: { type: Sequelize.STRING },
      department: { type: Sequelize.STRING },
      worker_shift: { type: Sequelize.STRING },
      check_in_time: { type: Sequelize.DATE },
      check_out_time: { type: Sequelize.DATE },
      duration_worked: { type: Sequelize.INTEGER }, // Duration in minutes
      remarks: { type: Sequelize.STRING },
      total_working_days_per_month: { type: Sequelize.INTEGER },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("attendance_reports");
  },
};
