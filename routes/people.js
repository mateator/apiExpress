var express = require("express");
var router = express.Router();
var cors = require('cors')

  //podia haberme creado una BD con mySQL y prisma para hacer consultas a las tablas pero me consumiría mucho tiempo y tendría que levantar la BD en local etc
  //he empleado los 2 JSON como objetos y como nunca lo he hecho antes, por curiosidad, he hecho las queries de SQL mediante JS

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

  //itero el array de personas, de cada cual saco los attributos de cada objeto transformados en array para poder hacer .some 
  //con el .some comparo cada objeto que contiene una person, al emplear some cuando encuentre una coincidencia dejará de buscar
  //si no encuentra ninguna coincidencia en los que son != object, se va al else y busca dentro de los objetos obtenidos con los inner join
  //si la condicion principal y el else devuelven false, const data no almacenará el valor que no queremos encontrar con el filtro
  const data = populationData.population.person.filter(person =>  Object.values(person).some(personObjectData => typeof personObjectData != 'object' ?
   personObjectData.toString().toLowerCase().includes(req.body.textToFilter.toLowerCase()) : Object.values(personObjectData).some(personObjectObjectData => personObjectObjectData.toString().toLowerCase().includes(req.body.textToFilter.toLowerCase()))));

   const totalFilteredData = data.length;
   const paginatedData = data.splice(req.body.limit*req.body.offset,(req.body.limit*req.body.offset) + req.body.limit);

  res.send({data: paginatedData, total: totalFilteredData});
});

module.exports = router;
