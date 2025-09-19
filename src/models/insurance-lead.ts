import { Document, Schema, model } from 'mongoose';
import { autoIncrement } from 'mongoose-plugin-autoinc';

interface IInsurancelead extends Document {
    name: string;
    gender:string;
    mobile: string;
    email: string;
    registration_no: string;
    type:string;
    status: boolean;
}

const InsuranceleadSchema: Schema = new Schema({
    name: { type: String, default: '' },
    gender: { type: String, default: '' },
    mobile: { type: String, default: '' },
    email: { type: String, default: '' },
    registration_no: { type: String, default: '' },
    type: { type: String, default: '' },
    status: { type: Boolean, default: true },
},
    {
        timestamps: true,
        versionKey: false
    });

InsuranceleadSchema.plugin(autoIncrement, { model: 'insurance_leads', field: 'id', startAt: 1 });

const Insurancelead = model<IInsurancelead>('insurance_leads', InsuranceleadSchema);

export default Insurancelead;