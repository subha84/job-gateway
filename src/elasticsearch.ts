import { winstonLogger } from "@subha84/jobber-shared";
import { Logger } from "winston";
import { config } from "@gateway/config";
import {Client} from '@elastic/elasticsearch'

const log:Logger = winstonLogger(config.ELASTIC_SEARCH_URL as string,'apiGeteway', 'debug');

class ElasticSearch {
    private elasticSearchClient:Client;
    constructor(){
        this.elasticSearchClient = new Client({
            node: config.ELASTIC_SEARCH_URL
        })
    }

    public async checkConnection() {
        let isConnected = false;
        let retries = 10;
        while( !isConnected && retries > 0){
            try{
                const health = await this.elasticSearchClient.cluster.health();
                isConnected = true;
                log.log('INFO', `Elastic search server heath status ${health.status}`);
            }catch(e){
                retries --;
                log.log('Error', `retrying connection...${retries}`, e);
            }
        }
        if( retries <= 0){
            log.log('Error', 'Number of attempts exceed to connect to elastic search, please check if the server is running' );
        }
    }

}

export const elasticSearch:ElasticSearch = new ElasticSearch();