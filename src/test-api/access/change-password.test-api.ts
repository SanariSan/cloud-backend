import { axiosApiBase } from "../";

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
