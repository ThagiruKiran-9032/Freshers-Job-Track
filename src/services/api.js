import axios from 'axios';

// Provider-neutral Axios Instance configured for Jobicy IT Jobs API v2
const apiClient = axios.create({
  baseURL: 'https://jobicy.com/api/v2',
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default apiClient;
