import { User } from "./user.model";
import { Keystore } from "./keystore.model";
import { Group } from "./group.model";

const Entities = {
    User,
    Keystore,
    Group,
    [Symbol.iterator]: function* () {
        let k;
        for (let k in this) {
            yield this[k];
        }
    },
};

export { Entities, User, Keystore, Group };
