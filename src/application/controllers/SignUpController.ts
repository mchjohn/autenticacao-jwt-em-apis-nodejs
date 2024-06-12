import { ZodError, z } from 'zod'

import { SignUpUseCase } from '../useCases/SignUpUseCase'

import { AccountAlreadyExists } from '../errors/AccountAlreadyExists'
import { IController, IRequest, IResponse } from '../interfaces/IController'

const schema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(6).max(10)
})

export class SignUpController implements IController {
    constructor(private readonly signUpUseCase: SignUpUseCase) {} // Inveresão de dependência

    async handle({ body }: IRequest): Promise<IResponse> {
        try {
            const { name, email, password } = schema.parse(body)

            await this.signUpUseCase.execute({ name, email, password})

            return {
                statusCode: 204,
                body: null
            }
        } catch (error) {
            if (error instanceof ZodError) {
                return {
                    statusCode: 400,
                    body: error.issues,
                }
            }

            if (error instanceof AccountAlreadyExists) {
                return {
                    statusCode: 409,
                    body: {
                        error: 'This email already in use'
                    }
                }
            }

            throw error
        }
    }
}
