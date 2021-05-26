export enum ENTITIES {
    USER = "User",
    USER_PRIVELEGE = "UserPrivelege",
    KEYSTORE = "Keystore",
    GROUP = "Group",
    GROUP_PATH = "GroupPath",
    PRIVELEGE_100 = "Privelege100",
    PRIVELEGE_500 = "Privelege500",
}
export type TEntities =
    | ENTITIES.USER
    | ENTITIES.KEYSTORE
    | ENTITIES.GROUP
    | ENTITIES.USER_PRIVELEGE
    | ENTITIES.PRIVELEGE_100
    | ENTITIES.PRIVELEGE_500
    | ENTITIES.GROUP_PATH;
