'use strict';
module.exports = function(sequelize, DataTypes) {
  var Gallery = sequelize.define('Gallery', {
    author: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "* Must have an author"
        }
      }
    },
    link: {
      type: DataTypes.STRING(1234),
      validate: {
        isUrl: {
          msg: "* Link must be an URL"
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "* Must have a description"
        }
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Gallery;
};