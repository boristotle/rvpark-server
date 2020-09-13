const Sequelize = require('sequelize');

module.exports = {
  up: async (queryInterface, sequelize) => {
    return queryInterface.describeTable("Studies")
      .then(tableDefinition => {
        if (tableDefinition.cameraSettings) return Promise.resolve();
        return queryInterface.addColumn("Studies", "cameraSettings", {
            type: Sequelize.ENUM,
            values: ["per-camera", "generic"],
            defaultValue: "generic"
        })
      })
    },
  down: async (queryInterface, sequelize) => {
    return queryInterface.removeColumn("Studies", "cameraSettings");
    }
};