module.exports = (db) =>
  db.model(
    'GachaHistories',
    db.Schema({
      userId: String,
      userName: String,
      isWin: Boolean,
      prizeName: { type: String, default: null },
      date: { type: Date, default: Date.now },
    })
  );
