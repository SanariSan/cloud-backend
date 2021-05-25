export enum ENTITIES {
    USER = "User",
    KEYSTORE = "Keystore",
    GROUP = "Group",
    USER_PRIVELEGE = "UserPrivelege",
    PRIVELEGE_100 = "Privelege100",
    PRIVELEGE_500 = "Privelege500",
    GROUP_PATH = "GroupPath",
}
export type TEntities =
    | ENTITIES.USER
    | ENTITIES.KEYSTORE
    | ENTITIES.GROUP
    | ENTITIES.USER_PRIVELEGE
    | ENTITIES.PRIVELEGE_100
    | ENTITIES.PRIVELEGE_500
    | ENTITIES.GROUP_PATH;
