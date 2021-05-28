import { Router } from "express";
import { AddStoragePaymentRouter } from "./add-storage";

const ServicesRouter = Router();

ServicesRouter.use("/payment", AddStoragePaymentRouter);

export { ServicesRouter };
