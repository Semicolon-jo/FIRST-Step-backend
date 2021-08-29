'use strict';
const axios = require('axios');
const express = require('express');
require('dotenv').config();
const PORT = 3001;
const cors = require('cors');
const server = express();
server.use(cors());
server.use(express.json());

const mongoose = require('mongoose');




server.listen(PORT, () => {
   console.log('all good', PORT);
})


mongoose.connect('mongodb://localhost:27017/cats6', { useNewUrlParser: true, useUnifiedTopology: true });


const unvierstySChema = new mongoose.Schema({
  
   universtyName: String ,

   universtyUrl : String ,  


 });


 const universtyModel = mongoose.model('unviersty', unvierstySChema);  


   


   ///// routes 
   
       server.get('/search',HandlerSearch)  //1 





   //// http://localhost:3001/search?country=Jordan  

   ///https://restcountries.eu/rest/v2/name/Jordan 


  async  function HandlerSearch (req,res)  {  

    let countryName = req.query.country 


    let resData = []  /// push tow data from 2 api  

    let unvierstyInfo  = await axios.get(`http://universities.hipolabs.com/search?country=${countryName}`)

    let contryInfo = await axios.get(`https://restcountries.eu/rest/v2/name/${countryName}`)  


    let  countryData =  new  Country (contryInfo.data) 

  
 
   resData.push(countryData)

    let UnvierstyData  = unvierstyInfo.data.map((item,idx) =>   {

      return (

        new unviersty (item)  
      )
   })
      
   resData.push(UnvierstyData)

      res.send(resData)  
     
}
   
   class unviersty {
   
      constructor(data)  {  //   for   first url data 
            
          this.universtyName = data.name   
            this.universtyUrl = data.web_pages[0] 

      }

         }





         
         class Country {   /////  for secound url data 
   
            constructor(data)  {
                  
                this.countryName = data[0].name 
                  this.capital = data[0].capital
                  this.lat = data[0].latlng[0]  
                  this.lng = data[0].latlng[1]  
                  this.timeZone = data[0].timezones[0]  
                  this.numericCode=data[0].numericCode
                  this.language = data[0].languages[0].name  
                  this.flagUrl = data[0].flag 
                  this.currencies= data[0].currencies[0].code 

            }
      
               } 



            
////////////////////////////////////////////////////////// 



    
































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
