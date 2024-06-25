import axios from 'axios';
import applyCaseMiddleware from 'axios-case-converter';

const client = applyCaseMiddleware(axios.create({
  baseURL: 'http://localhost:3000/api/v1',
}));

export default client;