import { networkRequest } from "../request";

async function getMispToken() {
    const data = {
        auth_user: 'misp_login',
        auth_pass: 'misp_login',
    };
    const headers = {};
    const result = await networkRequest(
        'GET',
        'https://misp.heroinsurance.com/prod/services/HeroOne/api/Authenticate/MISPAuthorization',
        data,
        headers
    );

    if (result) {
        return result.data;
    }
    return null;
}

export {getMispToken}