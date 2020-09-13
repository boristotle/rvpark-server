const Sequelize = require('sequelize');

module.exports = {
  up: async (queryInterface, sequelize) => {
    return queryInterface.describeTable("Devices")
      .then(tableDefinition => {
        if (tableDefinition.activeSettings) return Promise.resolve();
        return queryInterface.removeColumn("Devices", "activeSettings")
      })
    },
  down: async (queryInterface, sequelize) => {
    return queryInterface.addColumn("Devices", "activeSettings", {
        type: Sequelize.BOOLEAN
    })
    }
};