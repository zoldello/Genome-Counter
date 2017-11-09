const fs = require("fs");
const fastCsv = require("fast-csv");
const mongoose = require("mongoose");

const SampleSheetModel = require("./../models/sampleSheetModel");
const consoleEnhancements = require("./consoleEnhancements");

/**
 * Provides means to read the data from either database or CSV file
 * @return {undefined} Not intended to return an object.
 */
class DataReader {
    constructor() {
        consoleEnhancements();
    }

    /**
     * Read csv data from file
     * @param {string} filePath- Parameter for file path. If is defaulted to a value if falsey.
     * @param {function} next - callback after task is completed
     * @return {undefined} Not intended to return an object.
     */
    csv(filePath, next) {
        const file = filePath
            ? filePath
            : "sampleSheet.csv";
        let data = [];

        console.warn(`Getting data from: ${file}. Please wait ...`);
        fs.createReadStream(file).pipe(fastCsv()).on("data", row => {
            data.push(row);
        }).on("end", () => {
            console.log(`Completed read of CSV file: ${file}`);
            next(data);
        });
    }

    /**
     * Connects to the database
     * @return {undefined} Not intended to return an object.
     */
    getDBHandle() {
        console.warn("Getting data, please wait ...");
        mongoose.Promise = global.Promise;
        const connect = () => {
            const mongodbUri = "mongodb://mks:Testing1@ds135444.mlab.com:35444/scans";

            mongoose.connection.openUri(mongodbUri);

            mongoose.connection.once("open", () => {
                console.log(`Connected to mongodb source: ${mongodbUri}`);
            }).on("error", error => {
                console.error(`Error connection to mongodb source: ${mongodbUri}. The error is ${error}`);
            });
        }

        connect();
    }

    /**
     * Searching the database for data
     * @param {string} whereToDisplay - Determines whether to display on screen or console.
     * @param {string} format - Whether to display data as JSON (set to: json) or in a tabular form (if set to: table).
     * @param {function} next - callback after task is completed
     * @return {undefined} Not intended to return an object.
     */
    database(whereToDisplay, format, next) {
        this.getDBHandle(); // connects to db

        SampleSheetModel.find({}, (error, sampleSheets) => {
            if (error) {
                console.error(`Error reading sample sheet data. The error is: ${error}`);
                return next(error, null, whereToDisplay, format);
            }

            return next(error, sampleSheets, whereToDisplay, format);
        });

    }
}

module.exports = DataReader;
