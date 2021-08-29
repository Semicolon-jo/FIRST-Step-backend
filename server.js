'use strict';
const axios = require('axios');
const express = require('express');
require('dotenv').config();
const PORT = 3001;
const cors = require('cors');
const server = express();
server.use(cors());
server.use(express.json());

// server.get('/', Home);
// server.get('/search', GetUniversData);
// class Univers {
//     constructor(item) {
//         this.country = item.country;
//         this.name = item.name;
//         this.web_pages = item.web_pages;
//     }
// }

let inMemory = {};//Memory

// Home = (req, res) => {
//     res.send('Home Page');
// }

//---------- Get Data from API ---------------
// http://universities.hipolabs.com/search?country=Jordan
// GetUniversData = (req, res) => {
//     let country = req.query.search;
//     let CountryURL = `http://universities.hipolabs.com/search?country=${country}`;
//     if (inMemory[country] !== undefined) {
//         res.send(inMemory[country]);
//     } else {
//         axios.get(CountryURL).then(element => {
//             let UniversData = element.map(item => {
//                 return new Univers(item);
//             })
//             res.send(UniversData);
//         })
//     }


// }
server.listen(PORT, () => {
   console.log('all good', PORT);
})