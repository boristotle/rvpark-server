const Sequelize = require('sequelize');

module.exports = {
  up: async (queryInterface, sequelize) => {
    return queryInterface.describeTable("Files")
      .then(tableDefinition => {
        if (tableDefinition.ImageId) return Promise.resolve();
        return queryInterface.addColumn("Files", "ImageId", {
            type: Sequelize.INTEGER,
            references: {
              model: "Images",
              key: "id"
            }
        })
      })
    },
  down: async (queryInterface, sequelize) => {
    return queryInterface.removeColumn("Files", "ImageId");
    }
};