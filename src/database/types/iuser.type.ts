export interface IUser {
	id: number;
	name: string;
	email: string;
	password: string;
	profilePicUrl: string | null;
	createdAt: Date;
	updatedAt: Date;
}
