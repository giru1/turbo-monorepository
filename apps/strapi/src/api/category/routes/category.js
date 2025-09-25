module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/categorys',
      handler: 'category.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/categorys/:id',
      handler: 'category.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};