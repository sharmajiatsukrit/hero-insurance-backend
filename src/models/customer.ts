import { Document, Schema, model } from "mongoose";
import { autoIncrement } from "mongoose-plugin-autoinc";
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;

interface ICustomer extends Document {
    name: string;
    phone: string;
    email: string;
    city: string;
    state: string;
    pincode: string;
    is_email_verified: boolean;
    is_sms_verified:boolean;
    language_code: string;
    language: string;
    device: string;
    status: number;
}

const customerSchema: Schema = new Schema({
    name: { type: String, default: '' },
    phone: { type: String, required: true, index: { unique: true } },
    email: { type: String },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    pincode: { type: String, default: '' },
    is_email_verified: { type: Boolean, default: false },
    is_sms_verified: { type: Boolean, default: false },
    language_code: { type: String, default: 'en' },
    language: { type: String, default: 'English' },
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