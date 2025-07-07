import { Document, Schema, model } from 'mongoose';
import { autoIncrement } from 'mongoose-plugin-autoinc';

interface IOfferCategory extends Document {
    name: string;
    image:string;
    status: boolean;
    created_by: number;
    updated_by: number;
}

const offerCategorySchema: Schema = new Schema({

    name: { type: String, default: '' },
    image: { type: String, default: '' },
    status: { type: Boolean, default: true },
    created_by: { type: Schema.Types.ObjectId, ref: 'users' },
    updated_by: { type: Schema.Types.ObjectId, ref: 'users' }
},
    {
        timestamps: true,
        versionKey: false
    });

offerCategorySchema.plugin(autoIncrement, { model: 'offer_categories', field: 'id', startAt: 1 });

const OfferCategory = model<IOfferCategory>('offer_categories', offerCategorySchema);

export default OfferCategory;