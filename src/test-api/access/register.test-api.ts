import { axiosApiBase } from "../base-instance.test-api";

export const CallAccessRegister = async (
	{ name, email, password, profilePicUrl },
	{ accessToken }: { accessToken?: string } = {},
) =>
	axiosApiBase.post(
		"/access/register",
		{
			name,
			email,
			password,
			profilePicUrl,
		},
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		},
	);
