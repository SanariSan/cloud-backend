import { axiosApiBase } from "../base-instance.test-api";

export const CallAccessChangePassword = async (
	{ oldPassword, newPassword },
	{ accessToken }: { accessToken?: string } = {},
) =>
	axiosApiBase.post(
		"/access/change-password",
		{
			oldPassword,
			newPassword,
		},
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		},
	);
