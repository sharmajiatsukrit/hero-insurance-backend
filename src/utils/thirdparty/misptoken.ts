import { networkRequest } from "../request";

async function getMispToken() {
    const data = {
        auth_user: "misp_login",
        auth_pass: "misp_login",
    };
    const headers = {};
    const result = await networkRequest("GET", "https://misp.heroinsurance.com/prod/services/HeroOne/api/Authenticate/MISPAuthorization", data, headers);

    if (result) {
        return result.data;
    }
    return null;
}

async function getPospToken() {
    const data = {
        api_endpoint: "https://uatdashboard.heroinsurance.com/da/api/policy-details",
    };

    const headers = {
        "Content-Type": "application/json",
        Authorization: "Basic RnludHVuZVVzZXI6RnludHVuZUBQYXNzMjAyNQ==",
    };

    try {
        const result = await networkRequest("POST", "https://uatmotorapi.heroinsurance.com/api/tokenGeneration", data, headers);
        if (result) {
            return result.data;
        }

        return null;
    } catch (error) {
        console.error("Error fetching token:", error);
        return null;
    }
}

async function getClaimAuthToken() {
    const data = {
        username: process.env.CLAIM_AUTH_USER,
        password: process.env.CLAIM_AUTH_PASS,
        machineIp: "string",
    };
    const headers = {};
    const result = await networkRequest("POST", "https://misp.heroinsurance.com/prod/services/B2CClaim/api/v1/Auth/login", data, headers);
    if (result) {
        return result.data;
    }
    return null;
}

export { getMispToken, getPospToken, getClaimAuthToken };