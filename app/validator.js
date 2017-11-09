const consoleEnhancements = require("./../config/consoleEnhancements");

class Validate {
    constructor() {
        consoleEnhancements();
    }

    /**
     * Checks to see if CSV data from file can be processed
     * @param {Array} data - The data to display.
    * @return {undefined} Not intended to return an object.
     */
    isCsvValid(data) {
        return this._isAllRequiredColumnsPresentInCsv(data) && this._isBothlane1And2PresentInCsv(data);
    }

    _isBothlane1And2PresentInCsv(data) {
        if (!data) {
            console.error("No data to test if both lane 1 and 2 are present");
            return false;
        }

        // if (data.length % 2 !== 1) {
        //    console.error("By definition, there must be an odd number of columns. The column count is even, so there must be a lane missing ");
        //    return false;
        // }

        const headers = data[0];
        const sampleIdIndex = headers.findIndex(header => header.toLowerCase() === "sampleid");
        const laneIndex = headers.findIndex(header => header.toLowerCase() === "lane");

        if (sampleIdIndex === -1) {
            console.error("SampleId not not found");
            return false;
        }

        if (laneIndex === -1) {
            console.error("Lane not found ");
            return false;
        }

        let sampleIdLaneCollection = {};
        let isDataValid = true;

        data.forEach((row, index) => {
            if (!isDataValid) { // there is no nice way to break out of foreach... Just do a no-op
                return;
            }

            if (index === 0) { // header, ignore this
                return;
            }

            let sampleId = row[sampleIdIndex];
            let lane = row[laneIndex];

            if (lane !== "1" && lane !== "2") {
                isDataValid = false;
                console.error(`Invalid lane at sample id: ${sampleId}. The lane value is: ${lane}`);
                return;
            }

            if (!sampleIdLaneCollection[sampleId]) {
                sampleIdLaneCollection[sampleId] = [lane];
            } else {
                sampleIdLaneCollection[sampleId].push(lane);
            }
        });

        const keys = Object.keys(sampleIdLaneCollection);

        keys.forEach(key => {
            let item = sampleIdLaneCollection[key];

            if (item.length !== 2) {
                isDataValid = false;
                console.error(`This field has no lane-pair: ${key}`);
            }

            if ((item[0] !== "1" || item[1] !== "1") && (item[0] !== "2" && item[1] !== "2")) {
                console.error(`There lane must contain 1 and 2. This lane does not: ${key}. The two values are: ${item.join(", ")}`);
                isDataValid = false;
            }
        });

        return isDataValid;
    }

    _isAllRequiredColumnsPresentInCsv(data) {
        if (!data) {
            console.error("There is no header data provided");
            return false;
        }

        const expectedHeaders = [
            "fcid",
            "sampleid",
            "lane",
            "sampleref",
            "index",
            "description",
            "control",
            "recipe",
            "sampleproject",
            "operator"
        ];

        // row 0 is supposed to have header
        const row0 = data[0].map(header => {
            if (!header) {
                console.warning("Encountered an empty header. The data may be invalid");
                return "";
            }

            return header.toLowerCase().trim();
        });

        let isDataValid = true;

        if (row0.length !== expectedHeaders.length) {
            console.error(`The length of the provided data does not match what is expected. This is what is expected: ${expectedHeaders.length}. This is what was provided: ${row0.length}`);
            isDataValid = false;
            return false;
        }

        expectedHeaders.forEach(header => {
            if (row0.indexOf(header) === -1) {
                console.error(`This header is missing: ${header}`);
                isDataValid = false;
            }
        });

        return isDataValid;
    }

    _isBothlane1And2PresentInDbData(data) {
        if (!data || data.length === 0) {
            return false;
        }

        let lane1AndLane2 = {};

        data.forEach(datum => {
            if (!datum) {
                console.warn(this.warnColor("The database has an empty document. This is unsual"));
                return;
            }

            let sampleIdVal = datum["SampleID"];
            let laneVal = datum["Lane"];
            
            if (lane1AndLane2[sampleIdVal]) {
                lane1AndLane2[sampleIdVal].push(laneVal);
            } else {
                lane1AndLane2[sampleIdVal] = [laneVal];
            }
        });

        let isValid = true;

        for (let sampleId of Object.keys(lane1AndLane2)) {
            let lanes = lane1AndLane2[sampleId];

            if (lanes.length !== 2) {
                console.error(`This sample id has lanes that do not sum up to exactly two values: ${sampleId}`);
                isValid = false;
            }

            if (!((lanes[0] === 1 && lanes[1] === 2) || (lanes[0] === 2 && lanes[1] === 1))) {
                console.error(`There lane must contain 1 and 2. This lane does not: ${sampleId}. The two values are: ${lanes.join(", ")}`);
                isValid = false;
            }
        }

        return isValid;
    }

    /**
     * Checks to see if Array of JSON from DB is in proper format
     * @param {Array} data - The data to display.
     * @return {undefined} Not intended to return an object.
     */
    isDBDataValid(data) {
        return this._isBothlane1And2PresentInDbData(data);
    }
}

module.exports = Validate;
