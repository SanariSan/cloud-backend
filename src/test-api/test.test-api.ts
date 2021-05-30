import { AxiosResponse, AxiosError } from "axios";
import { CallAccessRegister, USERS } from "./";
import {
	CallAccessLogin,
	CallAccessLogout,
	CallAccessRefresh,
	CallAccessChangePassword,
} from "./access";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const logRes = true;

async function registerUsers() {
	await CallAccessRegister(USERS.user1).then((res: AxiosResponse) => {
		const { status, statusText, data } = res;
		USERS.user1.keystore.accessToken.push(data.data.tokens.accessToken);
		USERS.user1.keystore.refreshToken.push(data.data.tokens.refreshToken);

		if (logRes) console.log(data);
	});

	await CallAccessRegister(USERS.user2).then((res: AxiosResponse) => {
		const { status, statusText, data } = res;
		USERS.user2.keystore.accessToken.push(data.data.tokens.accessToken);
		USERS.user2.keystore.refreshToken.push(data.data.tokens.refreshToken);

		if (logRes) console.log(data);
	});
}

async function logoutUsers() {
	await CallAccessLogout({
		accessToken: USERS.user1.keystore.accessToken[USERS.user1.keystore.accessToken.length - 1],
	}).then((res: AxiosResponse) => {
		const { status, statusText, data } = res;
		USERS.user1.keystore.accessToken.pop();
		USERS.user1.keystore.refreshToken.pop();

		if (logRes) console.log(data);
	});

	await CallAccessLogout({
		accessToken: USERS.user2.keystore.accessToken[USERS.user2.keystore.accessToken.length - 1],
	}).then((res: AxiosResponse) => {
		const { status, statusText, data } = res;
		USERS.user2.keystore.accessToken.pop();
		USERS.user2.keystore.refreshToken.pop();

		if (logRes) console.log(data);
	});
}

async function loginUsers() {
	await CallAccessLogin(USERS.user1).then((res: AxiosResponse) => {
		const { status, statusText, data } = res;
		USERS.user1.keystore.accessToken.push(data.data.tokens.accessToken);
		USERS.user1.keystore.refreshToken.push(data.data.tokens.refreshToken);

		if (logRes) console.log(data);
	});

	await CallAccessLogin(USERS.user2).then((res: AxiosResponse) => {
		const { status, statusText, data } = res;
		USERS.user2.keystore.accessToken.push(data.data.tokens.accessToken);
		USERS.user2.keystore.refreshToken.push(data.data.tokens.refreshToken);

		if (logRes) console.log(data);
	});
}

async function refreshUsers() {
	await CallAccessRefresh(
		{
			refreshToken: USERS.user1.keystore.refreshToken.pop(),
		},
		{ accessToken: USERS.user1.keystore.accessToken.pop() },
	).then((res: AxiosResponse) => {
		const { status, statusText, data } = res;
		USERS.user1.keystore.accessToken.push(data.data.tokens.accessToken);
		USERS.user1.keystore.refreshToken.push(data.data.tokens.refreshToken);

		if (logRes) console.log(data);
	});

	await CallAccessRefresh(
		{
			refreshToken: USERS.user2.keystore.refreshToken.pop(),
		},
		{ accessToken: USERS.user2.keystore.accessToken.pop() },
	).then((res: AxiosResponse) => {
		const { status, statusText, data } = res;
		USERS.user2.keystore.accessToken.push(data.data.tokens.accessToken);
		USERS.user2.keystore.refreshToken.push(data.data.tokens.refreshToken);

		if (logRes) console.log(data);
	});
}

async function changePasswordUsers() {
	await CallAccessChangePassword(
		{
			oldPassword: USERS.user1.password,
			newPassword: USERS.user1.newPassword,
		},
		{ accessToken: USERS.user1.keystore.accessToken.pop() },
	).then((res: AxiosResponse) => {
		const { status, statusText, data } = res;

		const passTemp = USERS.user1.password;
		USERS.user1.password = USERS.user1.newPassword;
		USERS.user1.newPassword = passTemp;

		USERS.user1.keystore.accessToken = [];
		USERS.user1.keystore.refreshToken = [];

		if (logRes) console.log(data);
	});

	await CallAccessChangePassword(
		{
			oldPassword: USERS.user2.password,
			newPassword: USERS.user2.newPassword,
		},
		{ accessToken: USERS.user2.keystore.accessToken.pop() },
	).then((res: AxiosResponse) => {
		const { status, statusText, data } = res;

		const passTemp = USERS.user2.password;
		USERS.user2.password = USERS.user2.newPassword;
		USERS.user2.newPassword = passTemp;

		USERS.user2.keystore.accessToken = [];
		USERS.user2.keystore.refreshToken = [];

		if (logRes) console.log(data);
	});
}

async function init() {
	await registerUsers().catch((err: AxiosError) => {
		const { status, statusText, data } = <AxiosResponse>err.response;

		if (logRes) console.log({ status, statusText, data });
		throw new Error();
	});

	await logoutUsers().catch((err: AxiosError) => {
		const { status, statusText, data } = <AxiosResponse>err.response;

		if (logRes) console.log({ status, statusText, data });
		throw new Error();
	});

	await loginUsers().catch((err: AxiosError) => {
		const { status, statusText, data } = <AxiosResponse>err.response;

		if (logRes) console.log({ status, statusText, data });
		throw new Error();
	});

	await loginUsers().catch((err: AxiosError) => {
		const { status, statusText, data } = <AxiosResponse>err.response;

		if (logRes) console.log({ status, statusText, data });
		throw new Error();
	});

	await refreshUsers().catch((err: AxiosError) => {
		const { status, statusText, data } = <AxiosResponse>err.response;

		if (logRes) console.log({ status, statusText, data });
		throw new Error();
	});

	await changePasswordUsers().catch((err: AxiosError) => {
		const { status, statusText, data } = <AxiosResponse>err.response;

		if (logRes) console.log({ status, statusText, data });
		throw new Error();
	});

	await loginUsers().catch((err: AxiosError) => {
		const { status, statusText, data } = <AxiosResponse>err.response;

		if (logRes) console.log({ status, statusText, data });
		throw new Error();
	});

	console.dir(USERS.user1);
	console.dir(USERS.user2);
}

init();
