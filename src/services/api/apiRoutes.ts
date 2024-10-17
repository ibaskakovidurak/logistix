const apiRoutes = {
  orders: {
    create: '/api/orders',
    read: '/api/orders',
    update: '/api/orders/{id}',
    delete: '/api/orders/{id}'
  },
  fields: {
    read: '/api/meta?obj=orders'
  }
}

export default apiRoutes
