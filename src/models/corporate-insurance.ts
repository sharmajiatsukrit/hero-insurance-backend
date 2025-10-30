import { Document, Schema, model } from 'mongoose';
import { autoIncrement } from 'mongoose-plugin-autoinc';

interface ICorporateInsurance extends Document {
    plan_type:string;
    company_name: string;
    contact_person:string;
    mobile_no: string;
    email: string;
    number_of_employe: string;
    status: boolean;
}

const CorporateInsuranceSchema: Schema = new Schema({
    plan_type: { type: Schema.Types.ObjectId, ref: "corporate_insurance_types", default: null },
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

CorporateInsuranceSchema.plugin(autoIncrement, { model: 'corporate_insurance__requests', field: 'id', startAt: 1 });

const CorporateInsurance = model<ICorporateInsurance>('corporate_insurance__requests', CorporateInsuranceSchema);

export default CorporateInsurance;