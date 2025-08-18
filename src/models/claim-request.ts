import { Document, Schema, model } from 'mongoose';
import { autoIncrement } from 'mongoose-plugin-autoinc';

interface IClaimRequest extends Document {
    insurance_type:string;
    description: string;
    mobile_no:string;
    name: string;
    email: string;
    status: boolean;
}

const ClaimRequestSchema: Schema = new Schema({
    insurance_type: { type: Schema.Types.ObjectId, ref: "insurance_types", default: null },
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    mobile_no: { type: String, default: '' },
    description: { type: String, default: '' },
    status: { type: Boolean, default: true },
},
    {
        timestamps: true,
        versionKey: false
    });

ClaimRequestSchema.plugin(autoIncrement, { model: 'claims_requests', field: 'id', startAt: 1 });

const ClaimRequest = model<IClaimRequest>('claims_requests', ClaimRequestSchema);

export default ClaimRequest;