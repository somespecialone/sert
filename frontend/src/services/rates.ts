interface IRates {
	getHistory(): Promise<Record<string, number[][]>>;
}

const ratesService: IRates = {
	async getHistory() {
		const resp = await fetch((import.meta.env.VITE_API_URL || '') + '/api/history');
		return await resp.json();
	}
};

export default ratesService;
