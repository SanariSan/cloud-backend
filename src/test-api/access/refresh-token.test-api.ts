import { axiosApiBase } from "../base-instance.test-api";

export const CallAccessRefresh = async (
	{ refreshToken },
	{ accessToken }: { accessToken?: string } = {},
) =>
	axiosApiBase.put(
		"/access/refresh",
		{
			refreshToken,
		},
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		},
	);
