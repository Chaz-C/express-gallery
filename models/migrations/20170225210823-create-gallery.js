'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Galleries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      author: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: {
            msg: "* Must have an author"
          }
        }
      },
      link: {
        type: Sequelize.STRING(1234),
        validate: {
          isUrl: {
            msg: "* Link must be an URL"
          }
        }
      },
      description: {
        type: Sequelize.STRING,
        validate: {
          msg: "*Must have a description"
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Galleries');
  }
};