// import { NotFoundError, ApiError, InternalError } from "./core/ApiError";
import bodyParser from "body-parser";
import cors from "cors";
// import { corsUrl, environment } from "./config";
// import Logger from "./core/Logger";
import express from "express";
const middleware = express();
middleware.use(bodyParser.json({ limit: "10mb" }));
middleware.use(bodyParser.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 }));
// middleware.use(cors({ origin: corsUrl, optionsSuccessStatus: 200 }));
middleware.use(cors());
export { middleware };
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// middleware.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//     if (err instanceof ApiError) {
//         ApiError.handle(err, res);
//     } else {
//         if (environment === "development") {
//             // Logger.error(err);
//             console.log(err);
//             return res.status(500).send(err.message);
//         }
//         ApiError.handle(new InternalError(), res);
//     }
// });
// eslint-disable-next-line @typescript-eslint/no-unused-vars
