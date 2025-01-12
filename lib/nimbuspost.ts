import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_NP_API_BASE_URL;

export const nimbuspost = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token: string) => {
  nimbuspost.defaults.headers.common['Authorization'] =
    `Bearer ${token}`;
};
