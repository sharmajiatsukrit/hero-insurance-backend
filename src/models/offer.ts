import { Document, Schema, model } from 'mongoose';
import { autoIncrement } from 'mongoose-plugin-autoinc';

interface IOffer extends Document {
    offer_name: string;
    offer_link:string;
    valid_from: string;
    valid_to: string;
    offer_image: string;
    status: boolean;
    is_deleted:boolean;
    deleted_at:string;
    created_by: number;
    updated_by: number;
}

const OfferSchema: Schema = new Schema({
    offer_name: { type: String, default: '' },
    offer_link: { type: String, default: '' },
    valid_from: { type: String, default: '' },
    valid_to: { type: String, default: '' },
    offer_image: { type: String, default: '' },
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

OfferSchema.plugin(autoIncrement, { model: 'offers', field: 'id', startAt: 1 });

const Offer = model<IOffer>('offers', OfferSchema);

export default Offer;