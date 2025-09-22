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
    mobile: { type: String, default: 'Android' }, //secondry mobile number
    name: { type: String, default: '' },
    gender: { type: String, default: '' },
    dob: { type: String, default: '' },
    driving_licence_expiry: { type: String, default: '' },
    email: { type: String, default: '' },
    annual_income: { type: String, default: '' },
    marital_status: { type: String, default: '' },
    city: { type: String, default: '' },
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