exports.sendNotification = (type, message) => {
  if (type === "email") {
    console.log("Email:", message);
  } else {
    console.log("SMS:", message);
  }
};