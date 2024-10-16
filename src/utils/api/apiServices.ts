import apiRoutes from './apiRoutes.js'
import apiRequestMethod from './apiRequestMethod.js'
import { createServices } from './index.js'

const apiMap = {
    createOrder: {
        method: apiRequestMethod.POST,
        route: apiRoutes.orders.create
    },
    readOrders: {
        method: apiRequestMethod.GET,
        route: apiRoutes.orders.read
    },
    readFields: {
        method: apiRequestMethod.GET,
        route: apiRoutes.fields.read
    },
    updateOrder: {
        method: apiRequestMethod.PUT,
        route: apiRoutes.orders.update
    },
    deleteOrder: {
        method: apiRequestMethod.DELETE,
        route: apiRoutes.orders.delete
    }
}

const apiServices = createServices(apiMap)

export default apiServices
