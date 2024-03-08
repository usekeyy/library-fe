const key = process.env.REACT_APP_API_BASE_URL;

export const baseUrl = (location) => {
	return key+location;
}