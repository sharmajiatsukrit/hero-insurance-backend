import { Document, Schema, model } from "mongoose";
import { autoIncrement } from "mongoose-plugin-autoinc";
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;

interface ICustomer extends Document {
    phone: string;
    device: string;
    status: number;
}

const customerSchema: Schema = new Schema({
    phone: { type: String, required: true, index: { unique: true } },
    device: { type: String, default: 'Android' },
    status: { type: Number, default: 0 }
},
    {
        timestamps: true,
        versionKey: false
    });

customerSchema.plugin(autoIncrement, { model: 'customers', field: 'id', startAt: 1 });

customerSchema.plugin(mongooseFieldEncryption, {
    fields: [],
    secret: process.env.JWT_SECRET,
    saltGenerator: () => { return process.env.JWT_SECRET?.slice(0, 16) }
});

const Customer = model<ICustomer>('customers', customerSchema);

export default Customer;