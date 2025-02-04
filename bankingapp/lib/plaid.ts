import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const configuration = new Configuration({
    basePath: PlaidEnvironments.sandbox,
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': '67967c4f0ef3330026c8b3d9',
            'PLAID-SECRET': '003e74029452dc90927b6367599384',
        }
    }
})

export const plaidClient = new PlaidApi(configuration);