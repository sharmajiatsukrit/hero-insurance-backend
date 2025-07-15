import axios, { AxiosPromise, Method } from "axios";

async function sendSMS(to: string,message: string): AxiosPromise<any> {
    const user = process.env.SMS_USER;
    const pass = process.env.SMS_PASS;
    const url = "https://enterprise.smsgupshup.com/GatewayAPI/rest";
    const method = "POST";
    const messageObj = {
        method:"sendMessage",
        send_to:to,
        msg:message,
        msg_type:"TEXT",
        userid:user,
        auth_scheme:"PLAIN",
        password:pass,
        format:"JSON",
        v:"1.1"
    };

    const reqHeaders = {
        "Content-Type": "application/json",
    };

    return axios({
        url,
        method,
        data:messageObj,
        headers: reqHeaders,
    });
}

export { sendSMS };
