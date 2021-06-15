import axios from "axios";

const host = "http://localhost";
const port = parseInt(<string>process.env.PORT);

const axiosApiBase = axios.create({
	baseURL: `${host}:${port}/v1`,
	timeout: 10000,
});

const axiosServicesBase = axios.create({
	baseURL: `${host}:${port}/services`,
	timeout: 10000,
});

export { axiosApiBase, axiosServicesBase };
