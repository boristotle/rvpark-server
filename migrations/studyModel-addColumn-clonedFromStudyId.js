const Sequelize = require('sequelize');

module.exports = {
  up: async (queryInterface, sequelize) => {
    return queryInterface.describeTable("Studies")
      .then(tableDefinition => {
        if (tableDefinition.clonedFromStudyId) return Promise.resolve();
        return queryInterface.addColumn("Studies", "clonedFromStudyId", {
            type: Sequelize.INTEGER,
            references: {
              model: "Studies",
              key: "id"
            }
        })
      })
    },
  down: async (queryInterface, sequelize) => {
    return queryInterface.removeColumn("Studies", "clonedFromStudyId");
    }
};