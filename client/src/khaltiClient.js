import axios from "axios";

export const khaltiClient = axios.create({
  baseURL: "https://dev.khalti.com/api/v2", // use khalti.com/api/v2 in production
  headers: {
    Authorization: "Key test_secret_key_xxxxxxxxxxxxxxxx",
    "Content-Type": "application/json",
  },
});
