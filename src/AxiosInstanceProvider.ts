import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export type AuthProviderDescriptor = () => string;
export type AuthTokenProvider = () => Promise<string>;

export class AxiosInstanceProvider {

    private axiosInstance: AxiosInstance;
    constructor(
        url: string,
        getToken: AuthTokenProvider,
    ) {
        this.axiosInstance = axios.create({
            baseURL: url,
        });

        this.axiosInstance.interceptors.request.use(async (config: AxiosRequestConfig) => {
            const authToken = await getToken();
            if (config && config.headers) {
                config.headers.Authorization = `${authToken}`;
            } else {
                console.error('Axios config not available to set auth header');
            }
            return config;
        }, undefined);

        this.axiosInstance.interceptors.response.use(undefined, async (err: any) => {
            console.error('API Gateway Client response error intercepted.');
            if (err && err.config && err.response && err.response.status && err.response.status === 401) {
                const authToken = await getToken();
                err.config.headers.Authorization = `${authToken}`;
                return axios.request(err.config);
            } else {
                throw err; // throwing will return a rejected promise since this is an async function
            }
        });
    }

    public getInstance = (): AxiosInstance => {
        return this.axiosInstance;
    }
};