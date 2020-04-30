import axios from 'axios';
export const bibleAxios = axios.create({
    baseURL: 'https://backend.connected.cloud/api/bibles',
    timeout: 5000,
    headers: { 'X-AUTH-TOKEN': '8roFEv78sm3NQhFCzKNmCKgFXkzhnEPz' }
});