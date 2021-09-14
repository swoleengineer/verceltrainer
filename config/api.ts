import axios from 'axios';


export const getApiUrl = () => {
  return 'https://exercisedb.p.rapidapi.com/exercises/bodyPart/'
}

export const token = (): string | null | false => `rUh3x5HXUUmshlcrWakmIaiEivTkp1bXJWajsnbUdj4ny3cMuB`;

export const config = () => {
  return ({
    headers: {
      ['x-rapidapi-host']: 'exercisedb.p.rapidapi.com',
      ['x-rapidapi-key']: 'rUh3x5HXUUmshlcrWakmIaiEivTkp1bXJWajsnbUdj4ny3cMuB'
    }
  })
}

const instance = axios.create({ baseURL: getApiUrl(), ...config() });

export default instance;
