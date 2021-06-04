import { axiosApiBase } from "../base-instance.test-api";

export const CallAccessLogout = async ({ accessToken }: { accessToken?: string } = {}) =>
	axiosApiBase.delete("/access/logout", {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});
