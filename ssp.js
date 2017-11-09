#!/usr/bin/env node

const commander = require("commander");
const clear = require("cli-clear");

const pjson = require("./package.json");
const DataReader = require("./config/dataReader");
const Validator = require("./app/validator");
const Transformation = require("./app/transformation");
const Presentation = require("./app/presentation");
const consoleEnhancements = require("./config/consoleEnhancements");

clear();

commander.version(pjson.version)
    .option("-f, --file [filePath]", "Parse csv file and print to console")
    .option("-d, --databaseToConsole", "Parse database and print to console")
    .option("-D, --databaseToFile", "Parse database and print to file columns (data.csv)")
    .option("-J, --databaseToFileJSON", "Parse database and print to file as JSON (data.csv)")
    .arguments("<filePath>[env]")
    .parse(process.argv);

const dataReader = new DataReader();
const validator = new Validator();
const transformation = new Transformation();
const presentation = new Presentation();

consoleEnhancements();


/**
 * Tells user the code successfully or unsuccessfully finished and then exist
 * @param {Boolean} isSuccessful - True if no error, else it is false
 * @return {undefined} Not mention for returning a value
 */
const finished = isSuccessful => {
    const message = isSuccessful
        ? "Completed successfully"
        : "Completed unsuccessfully";

    console[isSuccessful
        ? "log"
        : "error"](message);
    process.exit(0);
}

/**
 * Shows data from CVS file onto console.
 * @param {string} rawData - Array from data file
 * @return {undefined} Not mention for returning a value
 */
const showCsvData = rawData => {
    const isDataValid = validator.isCsvValid(rawData);

    if (!isDataValid) {
        finished(false);
    }

    let formattedData = transformation.toKeyValuePairs(rawData);

    if (!formattedData) {
        finished(false);
    }

    presentation.toConsole(formattedData, finished);
};

/**
 * Shows data from database either on screen or writes to a file
 * @constructor
 * @param {string} error - Error message
 * @param {string} data - JSON of sequence data.
 * @param {string} whereToDisplay - Display data on screen or in the console.
 * @param {string} format - Display data in JSON or in a tabular form.
 */
const showDBData = (error, data, whereToDisplay, format) => {
    if (error) {
        console.error(`Error reading data in mongo. The exception is: ${error}`);
        finished(false);
    } else if (!data) {
        console.error("No data to display");
        finished(false);
    } else {
        const isDataValid = validator.isDBDataValid(data);

        if (!isDataValid) {
            console.error("Invalid data from database. Cannot proceed...");
            finished(false);
        }

        if (whereToDisplay === "toFile") {
            presentation["toFile"](data, format, finished);
        } else {
            presentation["toConsole"](data, finished);
        }
    }
}

if (commander.file) {
    let filePath = process.argv[3];
    dataReader.csv(filePath, showCsvData);
} else if (commander.databaseToConsole) {
    dataReader.database("toConsole", null, showDBData);
} else if (commander.databaseToFile) {
    dataReader.database("toFile", "table", showDBData);
} else if (commander.databaseToFileJSON) {
    dataReader.database("toFile", "json", showDBData);
} else {
    console.error("Command not found. Exiting...");
    process.exit(1);
}
