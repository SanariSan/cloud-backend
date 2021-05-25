import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Privelege100 } from "./privelege-100.model";
import { Privelege500 } from "./privelege-500.model";
import { User } from "./user.model";

@Entity()
export class UserPrivelege {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("text")
    createdAt!: Date;

    @Column("text")
    updatedAt!: Date;

    @ManyToMany(type => Privelege100)
    @JoinTable({ name: "users_privelege_100" })
    @JoinColumn({ name: "privelege100Id" })
    privelege100!: Array<Privelege100>;

    @ManyToMany(type => Privelege500)
    @JoinTable({ name: "users_privelege_500" })
    @JoinColumn({ name: "privelege500Id" })
    privelege500!: Array<Privelege500>;

    @OneToOne(type => User)
    @JoinColumn({ name: "userId" })
    user!: User;
}
