import { Document, Schema, model } from 'mongoose';
import { BillingGatewayEnum } from "../enums";
import { BillingAdressType } from "../interfaces";
import { autoIncrement } from 'mongoose-plugin-autoinc';

interface IUnifiedLead extends Document {
    unique_no: number;
}

const UnifiedLeadSchema: Schema = new Schema({
    unique_no: { type: Number, unique: true, required: true  }
}, {
    timestamps: true,
    versionKey: false
});

UnifiedLeadSchema.plugin(autoIncrement, { model: 'unified_leads', field: 'id', startAt: 1 });

const UnifiedLead = model<IUnifiedLead>('unified_leads', UnifiedLeadSchema);

export default UnifiedLead;