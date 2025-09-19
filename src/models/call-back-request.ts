import { Document, Schema, model } from 'mongoose';
import { autoIncrement } from 'mongoose-plugin-autoinc';

interface ICallBackRequest extends Document {
    service_type:string;
    name: string;
    mobile_no: string;
    email: string;
    location:string;
    preferred_slot: string;
    query: string;
    status: boolean;
}

const CallBackRequestSchema: Schema = new Schema({
    service_type: { type: Schema.Types.ObjectId, ref: "insurance_types", default: null },
    name: { type: String, default: '' },
    mobile_no: { type: String, default: '' },
    email: { type: String, default: '' },
    location: { type: String, default: '' },
    preferred_slot: { type: String, default: '' },
    query: { type: String, default: '' },
    status: { type: Boolean, default: true },
},
    {
        timestamps: true,
        versionKey: false
    });

CallBackRequestSchema.plugin(autoIncrement, { model: 'call_back_requests', field: 'id', startAt: 1 });

const CallBackRequest = model<ICallBackRequest>('call_back_requests', CallBackRequestSchema);

export default CallBackRequest;