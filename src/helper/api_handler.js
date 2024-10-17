import axios from 'axios'
import { client_online } from '../LoginModal';
import { signal } from '@preact/signals-react';

export const api_error_msg = signal(null);

const instance = axios.create({
  withCredentials: true,
  baseURL: "https://aperolwg.vps.cptr.at/api/",
  timeout: 3000
});

export function api_get(path, parameters=null, columns=null, appendix=null){
  const headers= {
    "params": JSON.stringify(parameters),
    "columns": columns,
    "appendix": appendix
  }
  return instance.get(path, {headers: headers})
    .then(resp =>{
      client_online.value = true;
      return Promise.resolve(resp.data);
    })
    .catch(e => {
      console.log(e.message);
      if(e.message.startsWith('timeout')) client_online.value = false;
      api_error_msg.value = e.message;
      setTimeout(()=>{api_error_msg.value = null}, 5000);
      return Promise.reject(e);
    })
}
