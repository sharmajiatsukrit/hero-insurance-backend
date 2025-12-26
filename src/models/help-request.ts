import { Document, Schema, model } from 'mongoose';
import { autoIncrement } from 'mongoose-plugin-autoinc';

interface IHelpRequest extends Document {
    name: string;
    policy_no: string;
    email: string;
    description: string;
    mobile:string;
    status: boolean;
}

const HelpRequestSchema: Schema = new Schema({
    name: { type: String, default: '' },
    policy_no: { type: String, default: '' },
    email: { type: String, default: '' },
    mobile: { type: String, default: '' },
    description: { type: String, default: '' },
    customer_id: { type: Schema.Types.ObjectId, ref: "customers", default: null },
    status: { type: Number, default: 0 },
},
    {
        timestamps: true,
        versionKey: false
    });

HelpRequestSchema.plugin(autoIncrement, { model: 'help_requests', field: 'id', startAt: 1 });

const HelpRequest = model<IHelpRequest>('help_requests', HelpRequestSchema);

export default HelpRequest;