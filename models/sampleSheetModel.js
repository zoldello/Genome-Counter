const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sampleSheetSchema = new Schema({
    "FCID": {
        "required": true,
        "type": String
    },
    "SampleID": {
        "required": true,
        "type": String
    },
    "Lane": {
        "required": true,
        "type": Number
    },
    "SampleRef": {
        "required": true,
        "type": String
    },
    "Index": {
        "required": true,
        "type": String
    },
    "Description": {
        "type": String
    },
    "Control": {
        "type": String
    },
    "Recipe": {
        "type": String
    },
    "SampleProject": {
        "type": String
    },
    "Operator": {
        "required": true,
        "type": String
    }
});

const SampleSheet = mongoose.model("SampleSheet", sampleSheetSchema);
module.exports = SampleSheet;
