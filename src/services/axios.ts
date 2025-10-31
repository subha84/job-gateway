import { config } from '@gateway/config';
import axios from 'axios'
import { sign } from 'jsonwebtoken';


export class RestService {
    public axios:ReturnType<typeof axios.create>;
    constructor(baseurl:string, serviceName:string){
        this.axios = this.createAxiosInstance(baseurl, serviceName);        
    }

    public createAxiosInstance(baseUrl:string, serviceName:string): ReturnType<typeof axios.create> {
        let gatewayToken = '';
        if( serviceName ){
            gatewayToken = sign({
                id: serviceName
            }, config.GATEWAY_JWT_TOKEN as string)
        }
        return axios.create({
            headers:{
                baseUrl,
                "Content-Type": "application/json",
                Accept: "application/json",
                gatewayToken
            },
            withCredentials: true
            
        })
    }
}