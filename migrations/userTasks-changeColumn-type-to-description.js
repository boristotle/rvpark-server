const Sequelize = require('sequelize');

module.exports = {
  up: async (queryInterface, sequelize) => {
    return queryInterface.describeTable("UserTasks")
      .then(tableDefinition => {
        if (tableDefinition.description) return Promise.resolve();
        return queryInterface.renameColumn("UserTasks", "type", "description")
      })
    },
  down: async (queryInterface, sequelize) => {
    return queryInterface.renameColumn("UserTasks", "description", "type");
    }
};