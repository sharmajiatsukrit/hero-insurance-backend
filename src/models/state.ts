import { Document, Schema, model } from 'mongoose';
import { BillingGatewayEnum } from "../enums";
import { BillingAdressType } from "../interfaces";
import { autoIncrement } from 'mongoose-plugin-autoinc';

interface IState extends Document {
    name: string;
    statecode?: string;
    country_id: number;
    status: boolean;
    created_by: number;
    updated_by: number;
}

const stateSchema: Schema = new Schema({
    name: { type: String, default: '' },
    statecode: { type: String, default: '' }, // Optional field for state code
    country_id: { type: Schema.Types.ObjectId, ref: 'countries' },
    status: { type: Boolean, default: true },
    created_by: { type: Schema.Types.ObjectId, ref: 'users' },
    updated_by: { type: Schema.Types.ObjectId, ref: 'users' }
},
    {
        timestamps: true,
        versionKey: false
    });

stateSchema.plugin(autoIncrement, { model: 'states', field: 'id', startAt: 1 });

const State = model<IState>('states', stateSchema);

export default State;