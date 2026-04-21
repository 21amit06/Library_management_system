const cron = require("node-cron");
const Borrow = require("../models/Borrow");

// Run every day at midnight
cron.schedule("0 0 * * *", async () => {
  console.log(" fine update...");
  try {
    const borrows = await Borrow.find({ status: "borrowed" });
    for (let b of borrows) {
      const today = new Date();
      const lateDays = Math.floor(
        (today - b.dueDate) / (1000 * 60 * 60 * 24)
      );
      if (lateDays > 0) {
        b.fine = lateDays * 5;
        await b.save();
      }
    }
  } catch (error) {

    console.log("Fine calculation error:", error);

  }

});