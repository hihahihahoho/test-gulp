const { join } = require("lodash");
const { argv } = require("yargs");

// reduce practice
var total = (t) => t.reduce((x, y) => x + y, 0)
// console.log(total([1,2,3])); 

var stringConcat = (t) => t.reduce((x, y) => x.toString() + y.toString(), '')
// console.log(stringConcat([1,2,3]))

// var totalVotes = (t) => t.reduce((x,y) => x = y.voted ? x + 1 : x, 0)
var totalVotes = (t) => t.filter(x => x.voted).length
var voters = [
  { name: 'Bob', age: 30, voted: true },
  { name: 'Jake', age: 32, voted: true },
  { name: 'Kate', age: 25, voted: false },
  { name: 'Sam', age: 20, voted: false },
  { name: 'Phil', age: 21, voted: true },
  { name: 'Ed', age: 55, voted: true },
  { name: 'Tami', age: 54, voted: true },
  { name: 'Mary', age: 31, voted: false },
  { name: 'Becky', age: 43, voted: false },
  { name: 'Joey', age: 41, voted: true },
  { name: 'Jeff', age: 30, voted: true },
  { name: 'Zack', age: 19, voted: false }
];

// console.log(totalVotes(voters));

var wishlist = [
  { title: "Tesla Model S", price: 90000 },
  { title: "4 carat diamond ring", price: 45000 },
  { title: "Fancy hacky Sack", price: 5 },
  { title: "Gold fidgit spinner", price: 2000 },
  { title: "A second Tesla Model S", price: 90000 }
];

var shoppingSpree = (t) => t.reduce((x, y) => x += y.price, 0)

// console.log(shoppingSpree(wishlist));

var voters = [
  { name: 'Bob', age: 30, voted: true },
  { name: 'Jake', age: 32, voted: true },
  { name: 'Kate', age: 25, voted: false },
  { name: 'Sam', age: 20, voted: false },
  { name: 'Phil', age: 21, voted: true },
  { name: 'Ed', age: 55, voted: true },
  { name: 'Tami', age: 54, voted: true },
  { name: 'Mary', age: 31, voted: false },
  { name: 'Becky', age: 43, voted: false },
  { name: 'Joey', age: 41, voted: true },
  { name: 'Jeff', age: 30, voted: true },
  { name: 'Zack', age: 19, voted: false }
];

// Include how many of the potential voters were in the ages 18-25, how many from 26-35, how many from 36-55, and how many of each of those age ranges actually voted. The resulting object containing this data should have 6 properties. See the example output at the bottom.

var voterData = {
  numYoungVotes: 0,
  numYoungPeople: 0,
  numMidVotesPeople: 0,
  numMidsPeople: 0,
  numOldVotesPeople: 0,
  numOldsPeople: 0
}

var checkVoter = (t, condition) => {
  return t = condition ? t + 1 : t
}

voterResults = (t) => t.reduce((x, y) => {
  x.numYoungVotes = checkVoter(x.numYoungVotes, y.voted && y.age <= 25 && y.age >= 18)
  x.numYoungPeople = checkVoter(x.numYoungPeople, y.age <= 25 && y.age > 18)
  x.numMidVotesPeople = checkVoter(x.numMidVotesPeople, y.voted && y.age <= 35 && y.age >= 26)
  x.numMidsPeople = checkVoter(x.numMidsPeople, y.age <= 35 && y.age > 26)
  x.numOldVotesPeople = checkVoter(x.numOldVotesPeople, y.voted && y.age <= 55 && y.age >= 36)
  x.numOldsPeople = checkVoter(x.numOldsPeople, y.age <= 55 && y.age > 36)
  return x
}, voterData)

console.log(voterResults(voters)); // Returned value shown below: