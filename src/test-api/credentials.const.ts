type TUsers = "user1" | "user2";
export const USERS: Record<
	TUsers,
	{
		id: number;
		name: string;
		email: string;
		profilePicUrl: string;
		password: string;
		newPassword: string;
		groupOwnageId?: number;
		userPrivelegeId?: number;
		groupsParticipate: number[];
		keystore: { accessToken: string[]; refreshToken: string[] };
	}
> = {
	user1: {
		id: 1,
		name: "user1",
		email: "user1@mail.ru",
		profilePicUrl: "https://user1_url.ru",
		password: "user1_pass",
		newPassword: "user1_pass1",
		keystore: {
			accessToken: [],
			refreshToken: [],
		},
		groupOwnageId: undefined,
		userPrivelegeId: undefined,
		groupsParticipate: [],
	},
	user2: {
		id: 2,
		name: "user2",
		email: "user2@mail.ru",
		profilePicUrl: "https://user2_url.ru",
		password: "user2_pass",
		newPassword: "user2_pass1",
		keystore: {
			accessToken: [],
			refreshToken: [],
		},
		groupOwnageId: undefined, //GROUPS.groupN.id
		userPrivelegeId: undefined, //xxx
		groupsParticipate: [], //[GROUPS.groupN.id, GROUPS.groupN.id]
	},
};

//todo - make tests based on it
type TGroups = "group1" | "group2";
export const GROUPS: Record<
	TGroups,
	{
		id: number;
		name: string;
		password: string;
		newPassword: string;
		groupPathId?: number;
		usersParticipateIds: number[];
	}
> = {
	group1: {
		id: 1,
		name: "abcde",
		password: "abcde_pass",
		newPassword: "abcde_pass1",
		groupPathId: undefined,
		usersParticipateIds: [],
	},
	group2: {
		id: 2,
		name: "edcba",
		password: "edcba_pass",
		newPassword: "edcba_pass1",
		groupPathId: undefined,
		usersParticipateIds: [],
	},
};
