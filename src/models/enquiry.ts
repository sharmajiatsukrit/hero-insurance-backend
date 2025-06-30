import { Document, Schema, model } from 'mongoose';
import { autoIncrement } from 'mongoose-plugin-autoinc';

interface IEnquiry extends Document {
    name: string;
    mobile_no:string;
    email: string;
    description: string;
    status: boolean;
    is_deleted:boolean;
    deleted_at:string;
    created_by: number;
    updated_by: number;
}

const EnquirySchema: Schema = new Schema({
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    mobile_no: { type: String, default: '' },
    description: { type: String, default: '' },
    status: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false },
    deleted_at: { type: String, default: '' },
    created_by: { type: Schema.Types.ObjectId, ref: 'users', default:null },
    updated_by: { type: Schema.Types.ObjectId, ref: 'users', default:null }
},
    {
        timestamps: true,
        versionKey: false
    });

EnquirySchema.plugin(autoIncrement, { model: 'enquiries', field: 'id', startAt: 1 });

const Enquiry = model<IEnquiry>('enquiries', EnquirySchema);

export default Enquiry;