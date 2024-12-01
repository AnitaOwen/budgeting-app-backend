const { sendVerificationEmail } = require("../utils/email");

// Test the function
sendVerificationEmail("aveniia@gmail.com", "test-token")
  .then(() => console.log("Email sent successfully!"))
  .catch((error) => console.error("Error sending email:", error));