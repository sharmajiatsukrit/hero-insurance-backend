import { Document, Schema, model } from 'mongoose';
import { autoIncrement } from 'mongoose-plugin-autoinc';

interface IInsuranceSolution extends Document {
    title: string;
    link: string;
    image: string;
    status: boolean;
    created_by: number;
    updated_by: number;
}

const InsuranceSolutionSchema: Schema = new Schema({
    title: { type: String, default: ''},
    link: { type: String, default: '' },
    image: { type: String, default: '' },
    status: { type: Boolean, default: true },
    created_by: { type: Schema.Types.ObjectId, ref: 'users' },
    updated_by: { type: Schema.Types.ObjectId, ref: 'users' }
}, {
    timestamps: true,
    versionKey: false
});

InsuranceSolutionSchema.plugin(autoIncrement, { model: 'insurance_solutions', field: 'id', startAt: 1 });

const InsuranceSolution = model<IInsuranceSolution>('insurance_solutions', InsuranceSolutionSchema);

export default InsuranceSolution;