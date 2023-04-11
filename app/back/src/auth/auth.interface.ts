import { GeneratedSecret } from "speakeasy"
import { User } from "src/users/user.schema"

export interface IAuth {
    readonly user: User,
    readonly accessToken: string
}

export interface IResetPassword {
    readonly password: string,
    readonly token: string
}

export interface I2FTokenReset {
    readonly secret: GeneratedSecret,
    readonly qrUrl: string
}