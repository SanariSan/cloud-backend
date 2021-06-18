export interface IUser {
	id: number;
	name: string | null;
	email: string;
	password: string;
	profilePicUrl: string | null;
	createdAt: Date;
	updatedAt: Date;
}
