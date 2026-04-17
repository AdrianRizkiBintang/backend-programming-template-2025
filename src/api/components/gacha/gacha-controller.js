const gachaService = require('./gacha-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

async function play(request, response, next) {
  try {
    const { userId, userName } = request.body;

    if (!userId || !userName) {
      throw errorResponder(
        errorTypes.VALIDATION_ERROR,
        'userId dan userName tidak boleh kosong'
      );
    }

    const result = await gachaService.playGacha(userId, userName);

    // Cek apakah balikan dari service adalah error limit
    if (result.error === 'LIMIT_REACHED') {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY, // Pake tipe error dari core lu
        'Gagal: Limit gacha harian tercapai (maks 5 kali/hari).'
      );
    }

    if (result.isWin) {
      return response.status(200).json({
        message: `Selamat! Anda memenangkan ${result.wonPrize}`,
      });
    }
    return response.status(200).json({
      message: 'Maaf, Anda belum beruntung. Coba lagi besok!',
    });
  } catch (error) {
    return next(error);
  }
}

async function history(request, response, next) {
  try {
    const { userId } = request.params;
    const historyList = await gachaService.getUserHistory(userId);
    return response.status(200).json(historyList);
  } catch (error) {
    return next(error);
  }
}

async function prizes(request, response, next) {
  try {
    const remainingPrizes = await gachaService.getRemainingPrizes();
    return response.status(200).json(remainingPrizes);
  } catch (error) {
    return next(error);
  }
}

async function winners(request, response, next) {
  try {
    const winnersList = await gachaService.getWinnersList();
    return response.status(200).json(winnersList);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  play,
  history,
  prizes,
  winners,
};
