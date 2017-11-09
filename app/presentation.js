const chalk = require("chalk");
const Table = require("cli-table");
const fs = require("fs");

const error = chalk.keyword("red");

/**
 *  Shows content either in console or in file
 */
class Presentation {
    constructor() {
        this.fileToSaveTo = "data.csv";
        this.headerDisplayOrder = [
            "FCID",
            "Lane",
            "SampleID",
            "SampleRef",
            "Index",
            "Description",
            "Control",
            "Recipe",
            "Operator",
            "SampleProject"
        ];
    }

    /**
     * Prints to console
     * @param {JSON} data - The data to display.
     * @param {function} next - The function to call on completion.
     * @return {undefined} Not intended to return an object.
     */
    toConsole(data, next) {
        if (!data) {
            console.error(error("No data to display"));
            next(false);
            return;
        }

        let table = new Table({"head": this.headerDisplayOrder});

        data.forEach(row => {
            let items = [];

            this.headerDisplayOrder.forEach(header => {
                // with CSV files, keys are lower case. With data
                // from database, the case is Pacal. This looks for both
                // and stores whichever it gets
                let field = row[header.toLowerCase()] || row[header]

                items.push(field || "");
            });
            table.push(items);
        });

        console.log("\n");
        console.log("Best view when console is at least 16.51cm (6.5\") wide");
        console.log(table.toString());

        next(true);
    }

    _makePrintFriendlyinTable(data) {
        if (!data) {
            return "";
        }

        let printableData = [];
        let row = []

        this.headerDisplayOrder.forEach(header => {
            row.push(header);
        });

        printableData.push(row.join(", ").replace(/,+$/, ""));

        data.forEach(item => {
            printableData.push(["\n"]);
            row.length = 0;

            this.headerDisplayOrder.forEach(header => {
                row.push(item[header]);
            });
            printableData.push(row.join(",").replace(/,+$/, ""));
        });

        return printableData.join("").toString();
    }

    /* Create a point.
     * @param {JSON} data - The data to print to file.
     * @param {format} y - Whether to print as JSON (json) or tabular form.
     * @param {function} next - Callback after method has completed.
     */
    toFile(data, format, next) {
        if (!data) {
            console.error(`Data is empty. Cannot write to file: ${this.fileToSaveTo}`);
        }

        let writeStream = fs.createWriteStream(this.fileToSaveTo);

        let printableData = format && format.toLowerCase() === "json"
            ? data.toString()
            : this._makePrintFriendlyinTable(data);

        writeStream.write(printableData, "utf8");

        writeStream.on("error", error => {
            console.log(`Error writing data to file. The error is: ${error}`);
            next(false);
        });
        writeStream.on("finish", () => {
            console.log("Completed writing data to file");
            next(true);
        });

        writeStream.end("end");
    }
}

module.exports = Presentation;
