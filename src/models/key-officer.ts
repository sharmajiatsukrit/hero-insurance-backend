import { Document, Schema, model } from 'mongoose';
import { autoIncrement } from 'mongoose-plugin-autoinc';

interface IKeyOfficer extends Document {
    name: string;
    designation:string;
    menu_order: number;
    kof_image: string;
    status: boolean;
    is_deleted:boolean;
    deleted_at:string;
    created_by: number;
    updated_by: number;
}

const KeyOfficerSchema: Schema = new Schema({
    name: { type: String, default: '' },
    designation: { type: String, default: '' },
    menu_order: { type: Number, default: '' },
    kof_image: { type: String, default: '' },
    status: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false },
    deleted_at: { type: String, default: '' },
    created_by: { type: Schema.Types.ObjectId, ref: 'users', },
    updated_by: { type: Schema.Types.ObjectId, ref: 'users', }
},
    {
        timestamps: true,
        versionKey: false
    });

KeyOfficerSchema.plugin(autoIncrement, { model: 'key_officers', field: 'id', startAt: 1 });

const KeyOfficer = model<IKeyOfficer>('key_officers', KeyOfficerSchema);

export default KeyOfficer;