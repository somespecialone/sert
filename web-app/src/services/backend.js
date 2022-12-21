import { API_URL } from "@/constants";

const Backend = {
  apiUrl: API_URL,
  async getHistory() {
    const resp = await fetch(this.apiUrl + "/history");
    return await resp.json();
  },
};

export default Backend;
