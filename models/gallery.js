module.exports = function (sequelize, DataTypes) {
  let Gallery = sequelize.define("Gallery", {
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
  });
  return Gallery;
};
