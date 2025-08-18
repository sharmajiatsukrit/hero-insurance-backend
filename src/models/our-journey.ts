import { Document, Schema, model } from "mongoose";
import { autoIncrement } from "mongoose-plugin-autoinc";

interface IOurJourney extends Document {
    type: string;
    value: object;
    status: boolean;
}

const OurJourneySchema: Schema = new Schema(
    {
        type: { type: String, default: "" },
        value: { type: Object, default: {} },
        status: { type: Boolean, default: true },
        created_by: { type: Schema.Types.ObjectId, ref: "users", default: null },
        updated_by: { type: Schema.Types.ObjectId, ref: "users", default: null },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

OurJourneySchema.plugin(autoIncrement, { model: "our_journeys", field: "id", startAt: 1 });

const OurJourney = model<IOurJourney>("our_journeys", OurJourneySchema);

export default OurJourney;
