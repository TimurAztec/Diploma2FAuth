import { GeneratedSecret } from "speakeasy"
import { User } from "src/users/user.schema"

export enum Role {
    Admin = 'admin',
    Customer = 'customer'
}

export interface IAuth {
    readonly user: User,
    readonly authToken: string
}

export interface IResetPassword {
    readonly password: string,
    readonly token: string
}

export interface I2FTokenReset {
    readonly secret: GeneratedSecret,
    readonly qrUrl: string
}