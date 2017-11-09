class Transformation {

    /**
     * Converts array of array from CSV file to array of JSON
     * @param {Array} data - The data to manipulate.
     * @return {undefined} Not intended to return an object.
     */
    toKeyValuePairs(data) {
        if (!data) {
            return null;
        }

        let formattedData = [];
        const headers = data[0];

        data.forEach((rows, index) => {
            if (index === 0) { // ignoring header
                return;
            } else if (!rows || rows.length === 0) {
                console.warn("Weird. A row in the dataset is empty");
                return;
            }

            let obj = {};

            rows.forEach((row, index) => {
                obj[headers[index].toLowerCase()] = row;
            });
            formattedData.push(obj);
        });

        return formattedData;
    }
}

module.exports = Transformation;
