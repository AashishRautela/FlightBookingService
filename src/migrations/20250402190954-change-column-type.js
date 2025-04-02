'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn('Bookings', 'totalCost', {
      type: Sequelize.DECIMAL(10, 2), // Adjust precision/scale if needed
      allowNull: false // Keep the same constraints as before
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn('Bookings', 'totalCost', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
  }
};
