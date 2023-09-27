// import './styles.css';

const { faker } = require("@faker-js/faker/locale/vi");
const { match } = require("assert");
const { log } = require("console");
//ghì dè file
const fs = require("fs");


var images = [];

function uuid() {
  return faker.string.uuid();
}
export default uuid();

