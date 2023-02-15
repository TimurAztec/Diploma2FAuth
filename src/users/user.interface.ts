import { User } from "./user.schema";

export enum Role {
    Admin = 'admin',
    Customer = 'customer'
}

export interface IAuth {
    readonly user: User,
    readonly authToken: string
}