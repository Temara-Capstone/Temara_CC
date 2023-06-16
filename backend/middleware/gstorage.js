const { Storage } = require('@google-cloud/storage')
const path = require('path')

// Initialize storage
const storage = new Storage({
    keyFilename: path.join(__dirname, `../${process.env.PATH_KEY_JSON}`),
    projectID: process.env.PROJECT_ID,
})

module.exports = storage