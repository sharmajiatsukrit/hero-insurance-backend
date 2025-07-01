import { Document, Schema, model } from 'mongoose';
import { autoIncrement } from 'mongoose-plugin-autoinc';

interface IAward extends Document {
    title: string;
    subtitle:string;
    award_date: string;
    award_image: string;
    status: boolean;
    is_deleted:boolean;
    deleted_at:string;
    created_by: number;
    updated_by: number;
}

const AwardSchema: Schema = new Schema({
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    award_date: { type: String, default: '' },
    award_image: { type: String, default: '' },
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

AwardSchema.plugin(autoIncrement, { model: 'awards', field: 'id', startAt: 1 });

const Award = model<IAward>('awards', AwardSchema);

export default Award;