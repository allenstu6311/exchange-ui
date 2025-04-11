import axios, { AxiosRequestConfig } from 'axios';
import CryptoJS from "crypto-js";

const API_KEY = 'UTj7iVVEx6nMyhJQiUyyIYW6GxUDXlGMcvVnzhOmlR3mktMBA5N2qk2B4EoIfSfn';
const SECRET_KEY = "4mSUiEArmbdTraMjjAuQYM0g1dVL4EH44UvIhyYXaoXmZblg1ZWtlv08wW4QMk9h";

const createSignature = (params: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    return CryptoJS.HmacSHA256(query, SECRET_KEY).toString();
  };
  


const instance = axios.create({
    baseURL:'https://testnet.binance.vision/api/v3',
    // headers:{
    //     'X-MBX-APIKEY':API_KEY
    // }
})


instance.interceptors.request.use(function(config){    
    return config
},function(error){
    return Promise.reject(error);
})

instance.interceptors.response.use(function(response){
    return response
},function(error){
    return Promise.reject(error);
})



export default instance