import axios from "axios";
import config from "config";

const host = "http://localhost";
const port = config.get("port");

const axiosApiBase = axios.create({
	baseURL: `${host}:${port}/v1`,
	timeout: 10000,
});

const axiosServicesBase = axios.create({
	baseURL: `${host}:${port}/services`,
	timeout: 10000,
});

export { axiosApiBase, axiosServicesBase };
