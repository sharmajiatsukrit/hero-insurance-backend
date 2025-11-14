import { Document, Schema, model } from 'mongoose';
import { autoIncrement } from 'mongoose-plugin-autoinc';

interface IPolicyDetail extends Document {
    mobile_no:string,
    policy_no: string;
    product_name: string;
    product_type: string;
    start_date: string;
    end_date: string;
    renew_date: string;
}

const policyDetailSchema: Schema = new Schema({
    created_by: { type: Schema.Types.ObjectId, ref: 'customers' },
    mobile_no: { type: String, default: '' },
    policy_no: { type: String, default: '' },
    reg_no:{type: String, default: ''},
    product_name: { type: String, default: '' },
    product_type: { type: String, default: '' },
    start_date: { type: String, default: '' },
    end_date: { type: String, default: '' },
    renew_date: { type: String, default: '' },

},
    {
        timestamps: true,
        versionKey: false
    });

policyDetailSchema.plugin(autoIncrement, { model: 'policy_details', field: 'id', startAt: 1 });

const PolicyDetail = model<IPolicyDetail>('policy_details', policyDetailSchema);

export default PolicyDetail;