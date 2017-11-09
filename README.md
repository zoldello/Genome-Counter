# Sample Sheet App

This application parses samples from a sequence like Illumina sequencer; and outputs the results to a console or to a file called **"data.csv"**.

## Getting Started

### System requirements
This was developed on Ubuntu. However, there is no reason why it should not work on mac or windows. This code was developed using Node v7.4.0. However, given that ES2015 syntax is used, node v4.0.0 or higher may work too. It was also developed against npm v4.0.5

### Dependencies
* Fetch dependencies by running:
```
npm install
```

### Running the code
For a list of all available options run the help command:
```
node ssp -h
```

The code provides the sequenced data in a number of ways. Here are some ways:

* Read from **samplesheet.csv** and display on the console
```
node ssp -f
```

or, to read from a different file, run this command
```
node ssp -f [filePath]
```
[filePath] is the fully qualified path to the file in question

* Read from database into a table, and display in the console:
```
node ssp -d
```

* Read from database into a table, and display in a file called "data.csv" (stored in the directory where you run the app):
```
node ssp -D
```

* Read from database into a JSON, and display in the console:
```
node ssp -J
```
## The Code Base
### Data source
There are two sources of data, either the **samplesheet.csv** file or from mongodb.
The **samplesheet.csv** file is stored in the same directory as you storied the node.js code.
The mongodb data is hosted by [mlab](https://mlab.com).

### File Structure
The app does not strictly follow commonly used node.js folder-structure practices; due to the size. However, there are glimpse of it. Here are the main files in the codebase:

#### Folders
*  **mks**: This is the root folder. It hosts standard files like package.json, eslintrc.json, etc.

*  **app**: This contains code that does general task that has no folder than it can fall other

*  **config**: This host code for setting up this like database reads (dataReader.js)

*  **models**: Contain the file for holding the models [mongoose](http://mongoosejs.com) (like an ORM for mongodb) needs to retrieve data from the database

#### Files
Here are the major files:

*  **README.md**: This is this file. It gives general information about this application

*  **ssp.js**: This is the main file for the project. It orchestrates other files to make this product functional

*  **sampleSheet.csv**: This is where the data for reading from files-option is stored

*  **data.csv**: This is where the result of storing data to a file-option is stored. The data can either be in a table form or in JSON

*  **eslintrc.json**: This hold [ESLint](https://www.eslint.org) rules. They have add make the code style uniform throught the project

*  **models/SampleSheetModel.js**: This contains the model that [mongoose](http://mongoosejs.com) needs to fetch data

*  **config/dataReader.js**: This stores code needed to do the actual data fetch from SampleSheet.csv or mongodb

*  **config/consoleEnhancements.js**: The messages on the code were colored in a way to aid the reader understand the signnificance. Red means there is an error. Yelow means there is a warning. Green is informational. The code to override the default from node.js is stored here.   

*  **validator.js**: This stores code for checking data makes the requires needed by users like there must be lane 1 and lane 2 for every sample id
*  **transformation.js**: This is used for converting data into types like JSON.  

* **presentation.js**: This holds code for displaying data either on the console or having to a file.

I added JSDoc-style comments to the code to aid in understanding.


#### License
MIT
