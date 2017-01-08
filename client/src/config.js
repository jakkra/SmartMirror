export const config = {
	YAHOO_WOEID: '897819',
	SMHI_COORD: {
		longitude: '13',
		latitude: '55.6'
	},
	serverBaseURL: process.env.NODE_ENV === 'production' ? 'http://localhost:3001' : 'http://localhost:3000',
	wsServerBaseURL: process.env.NODE_ENV === 'production' ? 'localhost:3001/' : 'localhost:3001/'

};