import { API_URL } from "@/constants";

const Backend = {
  apiUrl: API_URL,
  async getRates() {
    const resp = await fetch(this.apiUrl + "/rates");
    return await resp.json();
  },
  async getHistory() {
    const resp = await fetch(this.apiUrl + "/history");
    return await resp.json();
  },
};

export default Backend;
