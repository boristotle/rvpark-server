const Sequelize = require('sequelize');

module.exports = {
  up: async (queryInterface, sequelize) => {
    return queryInterface.describeTable("Images")
      .then(tableDefinition => {
        if (tableDefinition.description) return Promise.resolve();
        return queryInterface.removeColumn("Images", "clonedFromImageId")
      })
    },
  down: async (queryInterface, sequelize) => {
    return queryInterface.addColumn("Images", "clonedFromImageId");
    }
};