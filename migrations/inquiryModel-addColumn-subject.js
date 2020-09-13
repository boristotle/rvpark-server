const Sequelize = require('sequelize');

module.exports = {
  up: async (queryInterface, sequelize) => {
    return queryInterface.describeTable("Inquiries")
      .then(tableDefinition => {
        if (tableDefinition.subject) return Promise.resolve();
        return queryInterface.addColumn("Inquiries", "subject", {
            type: Sequelize.TEXT,
        })
      })
    },
  down: async (queryInterface, sequelize) => {
    return queryInterface.removeColumn("Inquiries", "subject");
    }
};