import { axiosApiBase } from "../";

export const CallAccessLogout = async ({ accessToken }: { accessToken?: string } = {}) =>
	axiosApiBase.delete("/access/logout", {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});
