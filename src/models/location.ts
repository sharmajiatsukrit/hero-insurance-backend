import { Document, Schema, model } from "mongoose";
import { autoIncrement } from "mongoose-plugin-autoinc";

interface ILocation extends Document {
    location: string;
    latitude: string;
    longitude: string;
    region:string;
    status: boolean;
    is_deleted: boolean;
    created_by: number;
    updated_by: number;
}

const LocationSchema: Schema = new Schema(
    {
        location: { type: String, default: "", },
        latitude: { type: String, default: "",  },
        longitude: { type: String, default: "",  },
        region:{ type: String, default: "" },
        status: { type: Boolean, default: true },
        is_deleted: { type: Boolean, default: false },
        created_by: { type: Schema.Types.ObjectId, ref: "users" },
        updated_by: { type: Schema.Types.ObjectId, ref: "users" },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

LocationSchema.plugin(autoIncrement, { model: "locations", field: "id", startAt: 1 });

const Location = model<ILocation>("locations", LocationSchema);

export default Location;
