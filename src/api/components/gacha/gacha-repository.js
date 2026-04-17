const { GachaHistories } = require('../../../models');

async function countGachaToday(userId, startOfDay, endOfDay) {
  return GachaHistories.countDocuments({
    userId,
    date: { $gte: startOfDay, $lte: endOfDay },
  });
}

// Fungsi baru: ngitung udah berapa kali hadiah tertentu dimenangkan
async function countWonPrize(prizeName) {
  return GachaHistories.countDocuments({ prizeName, isWin: true });
}

async function recordHistory(userId, userName, isWin, prizeName) {
  return GachaHistories.create({ userId, userName, isWin, prizeName });
}

async function getHistoryByUserId(userId) {
  return GachaHistories.find({ userId }).sort({ date: -1 });
}

async function getWinners() {
  return GachaHistories.find({ isWin: true }).sort({ date: -1 });
}

module.exports = {
  countGachaToday,
  countWonPrize,
  recordHistory,
  getHistoryByUserId,
  getWinners,
};
