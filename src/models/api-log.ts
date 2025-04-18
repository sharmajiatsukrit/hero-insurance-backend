import { Document, Schema, model } from 'mongoose';
import { BillingGatewayEnum } from "../enums";
import { BillingAdressType } from "../interfaces";
import { autoIncrement } from 'mongoose-plugin-autoinc';

interface IApiLog extends Document {
    endpoint: string;
    method: string;
    payload: any;
    response: any;
    unique_key: string;
    unique_id: string;
}

const ApiLogsSchema: Schema = new Schema({

    endpoint: { type: String, default: '' },
    method: { type: String, default: '' },
    payload: { type: Schema.Types.Mixed, default: {} },
    response: { type: Schema.Types.Mixed, default: {} },
    unique_key: { type: String, default: '' },
    unique_id: { type: String, default: '' },
    customer_id: { type: Schema.Types.ObjectId, ref: 'customers' }
},
    {
        timestamps: true,
        versionKey: false
    });

    ApiLogsSchema.plugin(autoIncrement, { model: 'api_logs', field: 'id', startAt: 1 });

const ApiLog = model<IApiLog>('api_logs', ApiLogsSchema);

export default ApiLog;