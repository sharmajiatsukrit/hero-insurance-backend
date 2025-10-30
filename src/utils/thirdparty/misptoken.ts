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

async function getPospToken() {
    const data = {
        api_endpoint: "https://uatmotorapi.heroinsurance.com/api/proposalReports",
    };

    const headers = {
        "Content-Type": "application/json",
        "Authorization": "Basic d2Vic2VydmljZTFAZnludHVuZS5jb206VGVzdGluZ0AxMjM0",
    };

    try {
        const result = await networkRequest(
            "POST",
            "https://uatmotorapi.heroinsurance.com/api/tokenGeneration",
            data,
            headers
        );
       

        if (result) {
            return result.data;
        }

        return null;
    } catch (error) {
        console.error("Error fetching token:", error);
        return null;
    }
}



export {getMispToken,getPospToken}