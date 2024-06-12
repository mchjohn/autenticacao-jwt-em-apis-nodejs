import { sign } from 'jsonwebtoken'
import { compare } from 'bcryptjs'

import { env } from '../config/env'

import { prismaCliente } from '../libs/prismaCliente'
import { InvalidCredentials } from '../errors/InvalidCredentials'

interface IInput {
    email: string
    password: string
}

interface IOutput {
    accessToken: string
}

export class SignInUseCase {
    async execute({ email, password }: IInput): Promise<IOutput> {
        const account = await prismaCliente.account.findUnique({
            where: {
                email: email,
            }
        })

        if (!account) {
            throw new InvalidCredentials()
        }

        const isPasswordValid = await compare(password, account.password)

        if (!isPasswordValid) {
            throw new InvalidCredentials()
        }

        const accessToken = sign(
            { sub: account.id },
            env.jwtSecret!,
            { expiresIn: '1d' }
        )

        return {
            accessToken
        }
    }
}
