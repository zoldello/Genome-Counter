const chalk = require("chalk");

const errorColor = chalk.keyword("red");
const warningColor = chalk.keyword("yellow");
const normalLogColor = chalk.keyword("green");


const consoleEnhancements = () => {
    console.error = error => {
        process.stdout.write(errorColor(error));
        process.stdout.write("\n");
    };

    console.warn = warning => {
        process.stdout.write(warningColor(warning));
        process.stdout.write("\n");
    };

    console.log = log => {
        process.stdout.write(normalLogColor(log));
        process.stdout.write("\n");
    };
};


module.exports = consoleEnhancements;
