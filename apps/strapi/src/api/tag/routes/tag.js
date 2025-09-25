module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/tags',
      handler: 'tag.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/tags/:id',
      handler: 'tag.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};