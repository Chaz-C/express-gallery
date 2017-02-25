let photos = [ {
  author: 'chaz',
  link: 'https://s-media-cache-ak0.pinimg.com/236x/51/ce/e8/51cee85e14ffc94989f8bc5d36dbb49c.jpg',
  description: 'Lapidaria margarethae',
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  author: 'chaz',
  link: 'https://s-media-cache-ak0.pinimg.com/236x/15/98/37/159837b671e6fdc8b535abeb12c6d5d9.jpg',
  description: 'oh so pokey!',
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  author: 'chaz',
  link: 'https://s-media-cache-ak0.pinimg.com/236x/52/d6/21/52d621ebf60b9d3b0736f48bb1f1acf8.jpg',
  description: 'Fenestraria - Baby Toes',
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  author: 'chaz',
  link: 'https://s-media-cache-ak0.pinimg.com/236x/0d/33/7a/0d337a765577f9a488f476dfc25ae132.jpg',
  description: 'Piaranthus geminatus v. geminatus',
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  author: 'chaz',
  link: 'https://s-media-cache-ak0.pinimg.com/236x/e1/57/b9/e157b972395f6615cf4c21a4d7baff9e.jpg',
  description: 'Lithops',
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  author: 'chaz',
  link: 'https://s-media-cache-ak0.pinimg.com/236x/89/44/52/8944529cf0542768167c72627599953d.jpg',
  description: 'Ankhworks Pottery ~ Wall Hanging Container',
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  author: 'chaz',
  link: 'https://s-media-cache-ak0.pinimg.com/236x/0c/d1/15/0cd11561fe9d7e1297c598bc7fb4206e.jpg',
  description: 'Kalanchoe "Pink Butterflies"',
  createdAt: new Date(),
  updatedAt: new Date()
}
];

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Galleries', photos);
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Galleries', photos);
  }
};
