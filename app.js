const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const HOST = '192.168.26.133';
const PORT = 3000;
const FILE_PATH = path.join(__dirname, 'requests.txt');
const TAG_FILE_PATH = path.join(__dirname, 'tag.json');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let tagData;
fs.readFile(TAG_FILE_PATH, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading tag.json file', err);
        process.exit(1);
    }
    tagData = JSON.parse(data);
});

// Get all tag data
app.get('/tags', (req, res) => {
    res.json(tagData);
});

// Get a single tag by tag ID
app.get('/tags/:tagId', (req, res) => {
    const tagId = req.params.tagId;
    const tag = tagData.find(item => item.tag === tagId);

    if (tag) {
        res.json(tag);
    } else {
        res.status(404).send({ error: `Tag ${tagId} not found` });
    }
});

// Handle all POST requests
app.post('/submit', (req, res) => {
    const requestData = JSON.stringify(req.body, null, 2);

    // Clear the file and write new input
    fs.writeFile(FILE_PATH, requestData, (err) => {
        if (err) {
            console.error('Error writing to file', err);
            return res.status(500).send('Error saving request');
        }

        console.log('Request saved to requests.txt');
        res.status(200).send('Request received and saved!');
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});
