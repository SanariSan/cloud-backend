import { Router } from "express";
import { AsyncHandle, Authentificate, StickRepos } from "../../../middleware";
import { Add100, Add500 } from "../../../services/controllers";

const AddStoragePaymentRouter = Router();

AddStoragePaymentRouter.post(
	"/add100",
	AsyncHandle(StickRepos),
	AsyncHandle(Authentificate),
	AsyncHandle(Add100),
);
AddStoragePaymentRouter.post(
	"/add500",
	AsyncHandle(StickRepos),
	AsyncHandle(Authentificate),
	AsyncHandle(Add500),
);

export { AddStoragePaymentRouter };
