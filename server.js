"use strict";
const axios = require("axios");
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const server = express();
server.use(cors());
server.use(express.json());

const mongoose = require("mongoose");

server.listen(process.env.PORT, () => {
  console.log("all good", process.env.PORT);
});

mongoose.connect(process.env.MONGO_APP, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const unvierstySChema = new mongoose.Schema({
  country: String,
  email: String,
  universtyName: String,
  universtyUrl: String,
});

const noteSChema = new mongoose.Schema({
  note: String,
  email: String,

});

const universtyModel = mongoose.model("unviersty", unvierstySChema);

const noteModel = mongoose.model("note", noteSChema);


///// routes

server.get("/search", HandlerSearch); //1
server.post("/Adduniversity", handlerAdduniverstiy); //2
server.delete("/delete/:universityId", deleteuniversityhandler);
server.get('/faviorate', favioratehandler);
server.post("/AddNote", handlerAddNote);
server.put('/updateNote', updateNoteHandler)


//// http://localhost:3001/search?country=Jordan

///https://restcountries.eu/rest/v2/name/Jordan

async function HandlerSearch(req, res) {
  let countryName = req.query.country;

  let resData = []; /// push tow data from 2 api

  let unvierstyInfo = await axios.get(
    `http://universities.hipolabs.com/search?country=${countryName}`
  );

  let contryInfo = await axios.get(
    `https://restcountries.eu/rest/v2/name/${countryName}`
  );

  let countryData = new Country(contryInfo.data);

  resData.push(countryData);

  let UnvierstyData = unvierstyInfo.data.map((item, idx) => {
    return new unviersty(item);
  });

  resData.push(UnvierstyData);

  res.send(resData);
}

class unviersty {
  constructor(data) {
    //   for   first url data

    this.universtyName = data.name;
    this.universtyUrl = data.web_pages[0];
    this.country = data.country;
  }
}

class Country {
  /////  for secound url data

  constructor(data) {
    this.countryName = data[0].name;
    this.capital = data[0].capital;
    this.lat = data[0].latlng[0];
    this.lng = data[0].latlng[1];
    this.timeZone = data[0].timezones[0];
    this.numericCode = data[0].numericCode;
    this.language = data[0].languages[0].name;
    this.flagUrl = data[0].flag;
    this.currencies = data[0].currencies[0].code;
  }
}

//////////////////////////////////////////////////////////
//http://localhost:3001/Adduniversity ,universityOb
async function handlerAdduniverstiy(req, res) {
  let { email, universtyName, universtyUrl, country } = req.body; // same name in frontEnd at params in url
  // console.log(req.body);
  await universtyModel.create({ email, universtyName, universtyUrl, country }); // same name in frontEnd at params in url

  // universtyModel.find({ email }, function (err, ownerData) {
  //   if (err) {
  //     console.log("error in getting the data");
  //   } else {
  //     console.log(ownerData);
  //     res.send(ownerData);
  //   }
  // });
}

function deleteuniversityhandler(req, res) {
  console.log("request true");
  // let bookData= await axios.delete(`${process.env.REACT_APP_SERVER}/deleteBook/${bookID}?email=${user.email}`)
  //to get id from req
  let universityId = req.params.universityId;

  //to get email from req
  let email = req.query.email;
  // to remove data has the id
  universtyModel.remove({ _id: universityId }, (error, universityData) => {

    if (error) {
      console.log("error in deleteing the data");
    } else {
      console.log('universityData', universityData);
      universtyModel.find({ email }, function (err, universitiesData) {
        if (err) {
          console.log("error in getting the data");
        } else {
          res.send(universitiesData);
        }
      });
    }
  });
}

//http://localhost:3001/faviorate?email=email


function favioratehandler(req, res) {
  let email = req.query.email;
  universtyModel.find({ email }, function (err, ownerData) {
    if (err) {
      console.log("error in getting the data");
    } else {
      console.log(ownerData);
      res.send(ownerData);
    }
  });




}

//// http://localhost:3001/AddNote?email=.....@
// ------ Add not and keep note shown event after refrech the page ----------
async function handlerAddNote(req, res) {
  // console.log("req hitt");
  console.log("req.queryr", req.body);
  // console.log(req.body);
  let { note, email } = req.body;

  await noteModel.create({ note, email });
  noteModel.find({email},(error,noteData)=>{
    if (error) {
      res.send(error);
    } else {
      // console.log('11111',noteData);
      res.send(noteData);
    }

  })

}

//// http://localhost:3001/updateNote
// -------- ubdate on the note ---------
function updateNoteHandler(req, res) {
  let { note, email } = req.body;

  // console.log(req.body)
  noteModel.findOne({ email }, (error, noteInfo) => {
    if (error) {
      res.send(error);
    } else {

      noteInfo.note = note;
      noteInfo.email = email;
      noteInfo.save()
        .then(() => {
          noteModel.find({ email }, function (err, ownerData) {
            if (err) {
              console.log('error in getting the data',error);
            } else {
              console.log('ownerData',ownerData);
              res.send(ownerData)
            }
          })
        }).catch(error => {
          console.log('error in saving ')
        })
    }
  })
}


