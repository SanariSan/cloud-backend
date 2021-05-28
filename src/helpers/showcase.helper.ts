import { ProtectedRequest } from "../types";

export function validatePaymentServiceToken(req: ProtectedRequest): boolean {
	return true;
}

export function returnSomeResponseToPaymentService(arg): void {
	return;
}
