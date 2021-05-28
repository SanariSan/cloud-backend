import { Router } from "express";
import { AsyncHandle, Authentificate, StickRepos } from "../../../middleware";
import { Add100, Add500 } from "../../../services/controllers";

const AddStoragePaymentRouter = Router();

AddStoragePaymentRouter.use(
	"/add100",
	AsyncHandle(StickRepos),
	AsyncHandle(Authentificate),
	AsyncHandle(Add100),
);
AddStoragePaymentRouter.use(
	"/add500",
	AsyncHandle(StickRepos),
	AsyncHandle(Authentificate),
	AsyncHandle(Add500),
);

export { AddStoragePaymentRouter };
