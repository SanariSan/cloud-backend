import { axiosApiBase } from "../base-instance.test-api";

export const CallAccessLogin = async (
	{ email, password },
	{ accessToken }: { accessToken?: string } = {},
) =>
	axiosApiBase.post(
		"/access/login",
		{
			email,
			password,
		},
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		},
	);
