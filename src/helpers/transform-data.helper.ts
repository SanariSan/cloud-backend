import { encode, decode } from "js-base64";

const b64Encode = (_) => encode(_);

const b64Decode = (_) => decode(_);

export { b64Encode, b64Decode };
