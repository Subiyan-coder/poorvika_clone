import axios from "axios";


const api = axios.create({

    baseURL: import.meta.env.VITE_API_URL,

    withCredentials: true

});


// Separate axios instance for refresh request
// This prevents the refresh request itself
// from entering the interceptor loop.
const refreshApi = axios.create({

    baseURL: import.meta.env.VITE_API_URL,

    withCredentials: true

});


// -------------------------
// Refresh State
// -------------------------

let isRefreshing = false;

let refreshSubscribers = [];


// -------------------------
// Subscribe waiting requests
// -------------------------

const subscribeToRefresh = (callback) => {

    refreshSubscribers.push(callback);

};


// -------------------------
// Notify waiting requests
// -------------------------

const notifyRefreshSubscribers = (error) => {

    refreshSubscribers.forEach(
        (callback) => callback(error)
    );

    refreshSubscribers = [];

};


// -------------------------
// Response Interceptor
// -------------------------

api.interceptors.response.use(

    (response) => {

        return response;

    },


    async (error) => {

        const originalRequest = error.config;


        // Only handle authentication failures
        // and don't retry the same request repeatedly.
        if (
            error.response?.status !== 401 ||
            originalRequest?._retry
        ) {

            return Promise.reject(error);

        }


        // Never try to refresh the refresh endpoint itself.
        if (
            originalRequest?.url?.includes(
                "/auth/refresh"
            )
        ) {

            return Promise.reject(error);

        }


        originalRequest._retry = true;


        // --------------------------------
        // Another request is refreshing
        // --------------------------------

        if (isRefreshing) {

            return new Promise(
                (resolve, reject) => {

                    subscribeToRefresh(
                        (refreshError) => {

                            if (refreshError) {

                                reject(refreshError);

                                return;
                            }


                            resolve(
                                api(originalRequest)
                            );

                        }
                    );

                }
            );

        }


        // --------------------------------
        // Start refresh
        // --------------------------------

        isRefreshing = true;


        try {

            await refreshApi.post(
                "/auth/refresh"
            );


            notifyRefreshSubscribers(null);


            return api(originalRequest);

        }
        catch (refreshError) {

            notifyRefreshSubscribers(
                refreshError
            );


            return Promise.reject(
                refreshError
            );

        }
        finally {

            isRefreshing = false;

        }

    }

);


export default api;