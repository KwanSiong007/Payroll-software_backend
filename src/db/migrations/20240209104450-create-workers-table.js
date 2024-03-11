//Worker table: worker name, user id, cookies, worksite, department, worker_shift
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("workers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      worker_name: { type: Sequelize.STRING },
      user_id: { type: Sequelize.STRING },
      cookies: { type: Sequelize.STRING },
      worksite: { type: Sequelize.STRING },
      department: { type: Sequelize.STRING },
      worker_shift: { type: Sequelize.STRING },
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
    await queryInterface.dropTable("workers");
  },
};
