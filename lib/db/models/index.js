const { Schema, model } = require("mongoose");

const ArrivalModel = model(
	"Arrival",
	new Schema({
		arrivalTime: { type: Date },
		captainName: { type: String },
		vesselName: { type: String },
		portName: { type: String },
	})
);

module.exports = {
	ArrivalModel,
};
