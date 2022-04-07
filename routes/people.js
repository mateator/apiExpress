const { text } = require("body-parser");
var express = require("express");
var router = express.Router();
var cors = require('cors')

router.post("/",cors(), function (req, res, next) {
  const populationData = require("../public/mockData/info-population.json");
  const genderLanguageCountryData = require("../public/mockData/datasource.json");

  //innerjoin country and language by id
  Object.values(genderLanguageCountryData).forEach((data) => {
    Object.values(genderLanguageCountryData).forEach((data2) => {
      data.country.map((country) => {
        data2.language.map((language) => {
          if (country.language === language.key) {
            country.language = language;
          }
        });
      });
    });
  });

  //innerjoin country/gender with person by id/key
  Object.values(populationData.population.person).forEach((person) => {
    Object.values(genderLanguageCountryData.data).forEach((allData, index) => {
      allData.map((data) => {
        switch (index) {
          //gender
          case 0:
            if (person.sex === data.key) {
              // console.log(1);
              person.sex = data;
            }
            break;

          //country
          case 2:
            if (person["country-id"] === data.id) {
              person.country = data;
            }
            break;

          default:
            break;
        }
      });
    });
  });

  //pagination
  const data = populationData.population.person.filter(person => console.log(person.filter(p=>p.includes("2000")).length) );
  const paginatedData = data.splice(req.body.offset,req.body.limit);

  res.send(paginatedData);
});

module.exports = router;
