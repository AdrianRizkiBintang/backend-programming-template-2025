const gachaRepository = require('./gacha-repository');

const PRIZES = [
  { name: 'Emas 10 gram', maxQuota: 1 },
  { name: 'Smartphone X', maxQuota: 5 },
  { name: 'Smartwatch Y', maxQuota: 10 },
  { name: 'Voucher Rp100.000', maxQuota: 100 },
  { name: 'Pulsa Rp50.000', maxQuota: 500 },
];

function obfuscateName(name) {
  return name
    .split('')
    .map((char) => {
      if (char === ' ') return ' ';

      return Math.random() > 0.5 ? '*' : char;
    })
    .join('');
}

async function playGacha(userId, userName) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const todayCount = await gachaRepository.countGachaToday(
    userId,
    startOfDay,
    endOfDay
  );
  if (todayCount >= 5) {
    return { error: 'LIMIT_REACHED' };
  }

  const wonCounts = await Promise.all(
    PRIZES.map((prize) => gachaRepository.countWonPrize(prize.name))
  );

  const availablePrizes = PRIZES.filter(
    (prize, index) => wonCounts[index] < prize.maxQuota
  );

  let isWin = false;
  let wonPrize = null;

  if (availablePrizes.length > 0 && Math.random() < 0.3) {
    const randomIndex = Math.floor(Math.random() * availablePrizes.length);
    const selectedPrize = availablePrizes[randomIndex];

    isWin = true;
    wonPrize = selectedPrize.name;
  }

  await gachaRepository.recordHistory(userId, userName, isWin, wonPrize);

  return { error: null, isWin, wonPrize };
}

async function getUserHistory(userId) {
  return gachaRepository.getHistoryByUserId(userId);
}

async function getRemainingPrizes() {
  const wonCounts = await Promise.all(
    PRIZES.map((prize) => gachaRepository.countWonPrize(prize.name))
  );

  const remainingPrizes = PRIZES.map((prize, index) => ({
    hadiah: prize.name,
    kuotaTersisa: prize.maxQuota - wonCounts[index],
  }));

  return remainingPrizes;
}

async function getWinnersList() {
  const winners = await gachaRepository.getWinners();
  const winnersByPrize = {};

  winners.forEach((w) => {
    if (!winnersByPrize[w.prizeName]) {
      winnersByPrize[w.prizeName] = [];
    }
    winnersByPrize[w.prizeName].push(obfuscateName(w.userName));
  });

  return winnersByPrize;
}

module.exports = {
  playGacha,
  getUserHistory,
  getRemainingPrizes,
  getWinnersList,
};
