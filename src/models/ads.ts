import { Document, Schema, model } from 'mongoose';
import { autoIncrement } from 'mongoose-plugin-autoinc';

interface IAds extends Document {
    name: string;
    link: string;
    image:string;
    status: boolean;
    created_by: number;
    updated_by: number;
}

const AdsSchema: Schema = new Schema({

    name: { type: String, default: '' },
    link: { type: String, default: '' },
    image: { type: String, default: '' },
    status: { type: Boolean, default: true },
    created_by: { type: Schema.Types.ObjectId, ref: 'users' },
    updated_by: { type: Schema.Types.ObjectId, ref: 'users' }
},
    {
        timestamps: true,
        versionKey: false
    });

AdsSchema.plugin(autoIncrement, { model: 'ads', field: 'id', startAt: 1 });

const Ads = model<IAds>('ads', AdsSchema);

export default Ads;