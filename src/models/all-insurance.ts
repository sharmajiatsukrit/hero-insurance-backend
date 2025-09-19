import { Document, Schema, model } from 'mongoose';
import { autoIncrement } from 'mongoose-plugin-autoinc';

interface IAllInsurance extends Document {
    plan_type:string;
    company_name: string;
    contact_person:string;
    mobile_no: string;
    email: string;
    number_of_employe: string;
    status: boolean;
}

const AllInsuranceSchema: Schema = new Schema({
    plan_type: { type: Schema.Types.ObjectId, ref: "insurance_types", default: null },
    company_name: { type: String, default: '' },
    contact_person: { type: String, default: '' },
    mobile_no: { type: String, default: '' },
    email: { type: String, default: '' },
    number_of_employe: { type: String, default: '' },
    status: { type: Boolean, default: true },
},
    {
        timestamps: true,
        versionKey: false
    });

AllInsuranceSchema.plugin(autoIncrement, { model: 'all_insurance_requests', field: 'id', startAt: 1 });

const AllInsurance = model<IAllInsurance>('all_insurance_requests', AllInsuranceSchema);

export default AllInsurance;