import { hash } from 'bcryptjs'

import { prismaCliente } from '../libs/prismaCliente'
import { AccountAlreadyExists } from '../errors/AccountAlreadyExists'

interface IInput {
    name: string
    email: string
    password: string
}

type IOutput = void

export class SignUpUseCase {
    constructor(private readonly salt: number) {}

    async execute({ name, email, password }: IInput): Promise<IOutput> {
        const accountAlredyExists = await prismaCliente.account.findUnique({
            where: {
                email: email,
            }
        })

        if (accountAlredyExists) {
            throw new AccountAlreadyExists()
        }

        const hashedPassword = await hash(password, 8)

        await prismaCliente.account.create({
            data: {
                name,
                email,
                password: hashedPassword,
            }
        })
    }
}
