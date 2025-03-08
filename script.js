'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jibril Maygag',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'kewser Gebeyahu',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Kaleab abay',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Kaleab solomon',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const displaysMovements = function (movements, sort = false) {
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  containerMovements.innerHTML = '';
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
   <div class="movements__row">
     <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__value">${mov}€</div>
   </div>
   `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
let sorted = false;
const sort = function (e) {
  e.preventDefault();
  sorted = !sorted;
  displaysMovements(currentAccount.movements, sorted);
};
btnSort.addEventListener('click', sort);
const incomeCalc = function (movements) {
  const income = movements
    ?.filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income}€`;
};

const outCalc = function (movements) {
  const out = movements
    ?.filter(mov => mov < 0)
    .map(mov => mov * -1)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${out}€`;
};
const interestCalc = function (account) {
  const interest = account.movements
    ?.filter(mov => mov > 0)
    .map(mov => mov * (account.interestRate / 100))
    .filter(int => int >= 1)
    .reduce((acc, mov) => acc + mov);
  labelSumInterest.textContent = `${interest}€`;
};
const calcDisplaySummery = function (account) {
  incomeCalc(account.movements);
  outCalc(account.movements);
  interestCalc(account);
};
let currentAccount;
calcDisplaySummery(account1.movements);
const balanceCalc = function (account) {
  account.balance = account.movements.reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
  labelBalance.textContent = `${account.balance}€`;
};

const logIn = function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    // display UI
    containerApp.style.opacity = 100;
    updateUI(currentAccount);
    //reset
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();
    sorted = false;
  }
};
const updateUI = function (acc) {
  displaysMovements(acc.movements);
  calcDisplaySummery(acc);
  balanceCalc(acc);
};

btnLogin.addEventListener('click', logIn);
const transfer = function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciver = accounts
    .filter(acc => acc !== currentAccount)
    .find(acc => acc.userName === inputTransferTo.value);
  if (amount > 0 && reciver && currentAccount.balance >= amount) {
    currentAccount.movements.push(-amount);
    reciver.movements.push(amount);
    updateUI(currentAccount);
  }
  //reset
  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();
};
btnTransfer?.addEventListener('click', transfer);
const loan = function (e) {
  e.preventDefault();
  const request = Number(inputLoanAmount.value);
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
  if (currentAccount.movements.some(mov => mov > request / 10)) {
    currentAccount.movements.push(request);
    updateUI(currentAccount);
  }
};
btnLoan.addEventListener('click', loan);

const close = function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    accounts.splice(
      accounts.findIndex(acc => acc.userName === currentAccount.userName),
      1
    );
    labelWelcome.textContent = 'Log in to get started';
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
  inputClosePin.blur();
};
btnClose.addEventListener('click', close);

/////////////////////////////////////////////////
// const arr = [1, 2, 3, 4];
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-3, -1));
// const arrCpy = arr.slice();
// console.log(arr);
// console.log(arrCpy);
// console.log(arr);
// console.log(arr.splice(1, 0));
// console.log(arr);
// const arr2 = [5, 6, 7, 8, 9];
// const nums = arr.concat([5, 6, 7, 8, 9]);
// console.log(nums);
// console.log(nums.join(' - '));

///////////////////////////////////////
// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
const juliaData = [9, 16, 6, 8, 3];
const kateData = [10, 5, 6, 1, 4];
const checkDogs = function (juliaData, kateData) {
  const kateDogs = kateData.slice();
  kateDogs.splice(0, 1);
  kateDogs.splice(-2, 2);

  console.log(kateDogs);
  const corrected = [...juliaData, ...kateDogs];
  console.log(corrected);
  corrected.forEach(function (age, i) {
    const d_p =
      age < 3 ? `is still a puppy` : `is an adult, and is ${age} years old `;
    console.log(`Dog number ${i + 1} ${d_p}`);
  });
};
// checkDogs(juliaData, kateData);
const arr = [1, 2, 3, 4, 5];
arr.forEach(function (num, i) {
  num++;
});
// const newArr = arr.map(mov => mov + 1);
// console.log(arr, newArr);
accounts.forEach(function (mov) {
  mov.userName = mov.owner.split(' ');
  mov.userName = mov.userName.map(name => name.toLowerCase().at(0)).join('');
});

const withdrawal = movements.filter(mov => mov < 0);
const deposits = movements.filter(mov => mov > 0);

const max = movements.reduce(
  (max, num) => (max < num ? num : max),
  movements[0]
);

const min = movements.reduce(
  (min, num) => (num < min ? num : min),
  movements[0]
);
// console.log(max, min);
// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
const calcAverageHumanAge = function (dogsAges) {
  const dogAgeInHuman = dogsAges
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter(age => age >= 18);
  const average =
    dogAgeInHuman.reduce((ave, age, i) => ave + age, 0) / dogAgeInHuman.length;
  console.log(average);
  console.log(dogAgeInHuman);
};
// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
//income calc
///////////////////////////////////////
// Coding Challenge #3

/* 
Rewrite the 'calcAverageHumanAge' function from the previous challenge, but this time as an arrow function, and using chaining!

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
// const calcAverageHumanAge = function (ages) {
//   const humanAges = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
//   const adults = humanAges.filter(age => age >= 18);
//   console.log(humanAges);
//   console.log(adults);

//   // const average = adults.reduce((acc, age) => acc + age, 0) / adults.length;

//   const average = adults.reduce(
//     (acc, age, i, arr) => acc + age / arr.length,
//     0
//   );

//   // 2 3. (2+3)/2 = 2.5 === 2/2+3/2 = 2.5

//   return average;
// };
const calcAverageHumanAge2 = ages =>
  ages
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((avg, adult, i, arr) => avg + adult / arr.length, 0);

// const avg1 = calcAverageHumanAge2([5, 2, 4, 1, 15, 8, 3]);
// const avg2 = calcAverageHumanAge2([16, 6, 10, 5, 6, 1, 4]);
// console.log(avg1, avg2);
// let acc;

// acc = accounts.find(function (acc) {
//   return acc.userName === 'js';
// });
// console.log(acc.owner);
// let acc2;
// for (const account of accounts) {
//   account.userName = 'ss' ? (acc2 = account) : 0;
// }
// console.log(acc2.owner);

const accountMovements = accounts.map(acc => acc.movements);
const allMovements = accountMovements.flat().reduce((acc, mov) => acc + mov);
// console.log(allMovements);
const arr2 = ['a', 'c', 'b', 'd'];

// console.log(arr2.sort());
// console.log(movements);
// console.log(
//   movements.sort((a, b) => {
//     if (a > b) return -1;
//     if (b > a) return 1;
//   })
// );
const random = Array.from(
  { length: 100 },
  (_, i) => Math.trunc(Math.random() * 6) + 1
);
// console.log(random);
//array methods practice
//1
const allDeposits = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((acc, mov) => acc + mov, 0);
const allWithdrawals = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov < 0)
  .reduce((acc, mov) => acc + mov, 0);
// console.log(allDeposits, allWithdrawals);
//2
const depositsCount = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov >= 1000);
// console.log(depositsCount);
//3

const sums = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      cur > 0 ? (sums.deposits += cur) : (sums.withdrawal += cur);
      return sums;
    },
    { deposits: 0, withdrawal: 0 }
  );
// console.log(sums);
const sumsArr = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (acc, cur) => {
      cur > 0 ? (acc[0] += cur) : (acc[1] += cur);
      return acc;
    },
    [0, 0]
  );
// console.log(sumsArr);
//4
const convertTitleCase = function (title) {
  const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];
  const corrTitle = title
    .toLowerCase()
    .split(' ')
    .map(word =>
      !exceptions.includes(word)
        ? word.replace(word[0], word[0].toUpperCase())
        : word
    )
    .join(' ');
  return corrTitle;
};
// console.log(convertTitleCase('this iS a nice title'));
///////////////////////////////////////
// Coding Challenge #5

/* 
Julia and Kate are still studying dogs. This time they are want to figure out if the dogs in their are eating too much or too little food.

- Formula for calculating recommended food portion: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
- Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
- Eating an okay amount means the dog's current food portion is within a range 10% above and below the recommended portion (see hint).

YOUR TASKS:
1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion (recFood) and add it to the object as a new property. Do NOT create a new array, simply loop over the array (We never did this before, so think about how you can do this without creating a new array).
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple users, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much (ownersTooMuch) and an array with all owners of dogs who eat too little (ownersTooLittle).
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is ANY dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether ALL of the dogs are eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Group the dogs into the following 3 groups: 'exact', 'too-much' and 'too-little', based on whether they are eating too much, too little or the exact amount of food, based on the recommended food portion.
9. Group the dogs by the number of owners they have
10. Sort the dogs array by recommended food portion in an ascending order. Make sure to NOT mutate the original array!

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John', 'Leo'] },
  { weight: 18, curFood: 244, owners: ['Joe'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

GOOD LUCK 😀
*/
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John', 'Leo'] },
  { weight: 18, curFood: 244, owners: ['Joe'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];
//1
dogs.forEach(dog => {
  dog.recommendedFood = dog.weight ** 0.75 * 28;
  dog.recommendedFood = Math.trunc(dog.recommendedFood);
  return dog.recommendedFood;
});
console.log(dogs);
//2
const saraDogportion = dogs.filter(dog =>
  dog.owners.includes('Sarah') ? dog : ''
);
console.log(
  saraDogportion[0].curFood > saraDogportion[0].recommendedFood
    ? `Sara's dog is eating too much`
    : `Sara's dog is eating too little`
);
//3

let ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recommendedFood)
  .map(dog => dog.owners)
  .flat();
let ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recommendedFood)
  .map(dog => dog.owners)
  .flat();
console.log(ownersEatTooMuch, ownersEatTooLittle);
//4
console.log(
  `${ownersEatTooLittle.join(
    ' and '
  )}'s dogs eat too little! and ${ownersEatTooMuch.join(
    ' and '
  )}'s dogs eat too much!`
);
//5
console.log(dogs.some(dog => dog.recommendedFood === dog.curFood));
//6
// debugger;
console.log(
  dogs.some(
    dog =>
      dog.curFood > dog.recommendedFood * 0.9 &&
      dog.curFood < dog.recommendedFood * 1.1
  )
);
//7
const eatingOkayAmount = dogs.filter(
  dog =>
    dog.curFood > dog.recommendedFood * 0.9 &&
    dog.curFood < dog.recommendedFood * 1.1
);
console.log(eatingOkayAmount);
//8
const cpyDogs = dogs
  .slice()
  .sort((a, b) => a.recommendedFood - b.recommendedFood);
console.log(cpyDogs);
