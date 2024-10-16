import axios, {type AxiosInstance, type AxiosInterceptorManager} from 'axios'


/**
 * Create axios client
 */
const axiosInstance: AxiosInstance = axios.create({ baseURL: import.meta.env.VITE_API_URL })


/**
 * Set interceptor for axios
 *
 * @function
 * @return AxiosInterceptorManager<any>
 */
const setInterceptors = (): AxiosInterceptorManager<any> => {
    axiosInstance.interceptors.request.use(
        (config: any) => {
            config.headers['Content-Type'] = 'application/json'

            return config
        },
        (error: any) => {
            return Promise.reject(error)
        }
    )

    return axiosInstance.interceptors.response.use(
        (response: any) => {
            return response
        },
        (error: any) => {
            return {
                data: error.response,
                status: error.response.status
            }
        })
}

/**
 * Create route using props & route
 *
 * @function
 * @param route
 * @param properties
 */
const getUrlFromRouteProps = (route: string, properties: any): string => {
    if (properties) {
        for (const [key, value] of Object.entries(properties)) {
            if (value) {
                route = route.replace(`{${key}}`, String(value))
            }
        }
    }

    return import.meta.env.VITE_API_URL + route
}

/**
 * Create request
 *
 * @param service
 * @return object
 */
const createRequest = (service: any | object): object => {
    return async (properties: any, body: any, headers: any): Promise<any> => {
        const response = await axiosInstance[service.method](getUrlFromRouteProps(service.route, properties), body, headers)

        return {
            data: response.data,
            status: response.status
            // Here could be added additional info
        }
    }
}

/**
 * Create API service
 *
 * @function
 * @param mapServices
 * @return  any | object
 */
export const createServices = (mapServices: object): any | object => {
    setInterceptors()

    const services: any | object = {}

    if (mapServices) {
        for (const [key, value] of Object.entries(mapServices)) {
            services[key] = createRequest(value)
        }
    }

    return services
}
