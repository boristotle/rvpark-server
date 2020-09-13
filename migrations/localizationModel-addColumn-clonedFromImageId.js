const Sequelize = require('sequelize');

module.exports = {
  up: async (queryInterface, sequelize) => {
    return queryInterface.describeTable("Localizations")
      .then(tableDefinition => {
        if (tableDefinition.clonedFromImageId) return Promise.resolve();
        return queryInterface.addColumn("Localizations", "clonedFromImageId", {
            type: Sequelize.INTEGER,
            references: {
              model: "Images",
              key: "id"
            }
        })
      })
    },
  down: async (queryInterface, sequelize) => {
    return queryInterface.removeColumn("Localizations", "clonedFromImageId");
    }
};