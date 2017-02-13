module.exports = function (sequelize, DataTypes) {
  let Gallery = sequelize.define("Gallery", {
    author: DataTypes.STRING,
    // link: DataTypes.STRING(1234),
    link: {
      type: DataTypes.STRING(1234),
      validate: {
        isUrl: {
          msg: "Link must be a URL"
        }
      }
    },
    // description: DataTypes.STRING,
    description: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Must have a description"
        }
      }
    }
  });
  return Gallery;
};
