import { Document, Schema, model } from "mongoose";
import { autoIncrement } from "mongoose-plugin-autoinc";

interface IInsuranceType extends Document {
    name: string;
    status: boolean;
    created_by: number;
    updated_by: number;
}

const InsuranceTypeSchema: Schema = new Schema(
    {
        name: { type: String, default: "" },
        status: { type: Boolean, default: true },
        created_by: { type: Schema.Types.ObjectId, ref: "users" },
        updated_by: { type: Schema.Types.ObjectId, ref: "users" },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

InsuranceTypeSchema.plugin(autoIncrement, { model: 'insurance_types', field: 'id', startAt: 1 });

const InsuranceType = model<IInsuranceType>('insurance_types', InsuranceTypeSchema);

export default InsuranceType;