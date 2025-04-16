import mongoose from "mongoose";


const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        venue: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: ["Music", "Art", "Technology", "Workshop", "Sports", "Other"],
            default: "Other",
        },
        //user who organize or hosts the event
        organizer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        price: {
            type: Number,
            default: 0,
        },
        availableSeats: {
            type: Number,
            required: true,
        },
        totalSeats: {
            type: Number,
            required: true,
        },
        imageUrl: {
            type: String,
            default: "",
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
    },

    {
        timestamps: true,
    },
)

const Event = mongoose.model("Event", eventSchema);

export default Event;
