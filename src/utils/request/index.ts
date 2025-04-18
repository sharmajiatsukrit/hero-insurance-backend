import axios, { AxiosPromise, Method } from "axios";
import {ApiLog} from "../../models";
import moment from "moment";

async function networkRequest(method: Method, url: string, data = {}, headers = {}): AxiosPromise<any> {
    const reqHeaders = {
        ...headers,
        "Content-Type": "application/json",
    };
    // console.log(response);
    const log:any = {
        endpoint: url,
        method: method,
        payload: data,
        response: null,
        payloadtimestamp: moment().unix(),
        responsetimestamp: null
    };
    const response:any =  await axios({
        url,
        method,
        data,
        headers: reqHeaders,
    });
    
    log.response = response.data;
    log.responsetimestamp = moment().unix();
    // console.log(log);
    
    try {
        if(url != 'https://in1.api.clevertap.com/1/upload'){
          let logdata = JSON.stringify(log);
          const singleQuotedString = logdata.replace(/"/g, "'");
          // console.log(`"${singleQuotedString}"`);
          const logs:any =  await axios({
              url:"https://misp.heroinsurance.com/prod/services/HeroOne/api/Policy/SaveMongoLog",
              method:"POST",
              maxBodyLength: Infinity,
              data:`"${singleQuotedString}"`,
              headers: {"Content-Type": "application/json"},
          });
        
          if (logs.status === 200) {
            console.log('log Success:', logs.data);
          } else {
            console.log(`Unexpected status: ${logs.status}`);
          }
        }
        
      } catch (error: any) {
        if (error.response) {
          // Server responded with a status code outside 2xx
          console.error('Error Status:', error.response.status);
          console.error('Error Data:', error.response.data);
        } else if (error.request) {
          // Request was made but no response
          console.error('No response received:', error.request);
        } else {
          // Something else caused an error
          console.error('Error Message:', error.message);
        }
      }
    
    // console.log("dddd",logs);
    return response;
}

export { networkRequest };
