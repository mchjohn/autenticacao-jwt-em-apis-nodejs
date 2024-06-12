import { IController, IResponse } from '../interfaces/IController'

export class ListLeadsController implements IController {
    async handle(): Promise<IResponse> {
        return {
            statusCode: 200,
            body: {
                leads: [
                    { id: 1, name: 'Zé' },
                    { id: 2, name: 'Mané' },
                ]
            }
        }
    }
}
