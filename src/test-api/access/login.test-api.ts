import { axiosApiBase } from "../";

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
