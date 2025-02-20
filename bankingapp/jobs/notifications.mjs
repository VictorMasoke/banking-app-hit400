import { Client, Databases, Query, ID } from "node-appwrite";
import cron from "node-cron";
import nodemailer from "nodemailer";

// ===========================
// Appwrite Client Configuration
// ===========================
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite endpoint
  .setProject("6788eda1003430b7cae6")           // Your Appwrite project ID
  .setKey("standard_1691566e87753eae87341d72353d8c61d9c920d1c0fd2320f857df032433bbc3dbaa1600f8e63c29f97282cb23c925c71d9358ebbe80763a766ea33cbd92fa569d30c8f4659777cf060acb1b1d1ce65808fb0a19332a994d4017cc1611b217e02d38c030c32db46dac57a497a0e9cda4c9d28e68925ca4c9ca5dd6a3a9de0245"); // Your Appwrite API key

const db = new Databases(client);

// ===========================
// Collection IDs
// ===========================
const DATABASE_ID = "6788f3a6000ec891cc6a";
const USERS_COLLECTION_ID = "6788f3e4001bb59b4e12";
const TRANSACTION_COLLECTION_ID = "6788f41b00102083fb44";
const NOTIFICATION_COLLECTION_ID = "67b6340a001d9b4911f9";

// ===========================
// Nodemailer Transporter Configuration
// ===========================
const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true, // true for port 465, false for others
  auth: {
    user: "info@neocube.site",   // your email address
    pass: "LazzyPassword@2030"    // your email password
  }
});

// ===========================
// Function: Log Notification in Appwrite
// ===========================
const logEmailNotification = async (user, subject, html) => {
  try {
    await db.createDocument(
      DATABASE_ID,
      NOTIFICATION_COLLECTION_ID,
      ID.unique(),
      {
        email: user.email,
        subject,
        html,
        status: "pending", // Notification status initially set to pending
        response: ""       // Initialize with an empty response
      }
    );
    console.log(`Notification logged for ${user.email} - ${subject}`);
  } catch (error) {
    console.error("Error logging notification:", error);
  }
};


// ===========================
// Function: Send Notification (Log & Queue for Sending)
// ===========================
const sendNotification = async (user, subject, html) => {
  // Log notification in Appwrite Notifications collection.
  await logEmailNotification(user, subject, html);
};

// ===========================
// Function: Process a Single User
// ===========================
const processUser = async (user) => {
  try {
    // Query the latest transaction for the user by email.
    const transactionResponse = await db.listDocuments(
      DATABASE_ID,
      TRANSACTION_COLLECTION_ID,
      [
        Query.equal("email", user.email),
        Query.orderDesc("createdAt")
      ],
      1  // Limit to the most recent transaction.
    );

    let subject, html;

    if (transactionResponse.documents.length === 0) {
      // No transactions: send a welcome notification.
      subject = "Welcome to Bezell Bank!";
      html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #0179FE;">Welcome, ${user.firstName}!</h2>
          <p style="color: #333; font-size: 16px;">Thank you for joining Bezell Bank. We're excited to have you on board!</p>
          <p style="color: #555;">Start transacting now to enjoy our full range of banking services.</p>
          <a href="https://yourbank.com/login" style="display: inline-block; padding: 12px 20px; background-color: #0179FE; color: #fff; text-decoration: none; font-size: 16px; border-radius: 5px; margin-top: 10px;">Get Started</a>
          <hr>
          <p style="color: #888; font-size: 12px;">© 2025 Bezell Bank. All Rights Reserved.</p>
      </div>`;
    } else {
      // Has at least one transaction: determine inactivity.
      const latestTransaction = transactionResponse.documents[0];
      const lastTransactionTime = new Date(latestTransaction.createdAt).getTime();
      const now = Date.now();
      const diffDays = Math.floor((now - lastTransactionTime) / (1000 * 60 * 60 * 24));

      if (diffDays >= 90) {
        subject = "🚨 Final Notice: Account Suspension";
        html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #F44336;">⚠️ Urgent: Your Account is Being Suspended!</h2>
            <p style="color: #333; font-size: 16px;">Your account has been inactive for <strong>${diffDays} days</strong> and is scheduled for suspension.</p>
            <p style="color: #555;">To avoid losing access, please make a transaction immediately.</p>
            <a href="https://yourbank.com/login" style="display: inline-block; padding: 12px 20px; background-color: #F44336; color: #fff; text-decoration: none; font-size: 16px; border-radius: 5px; margin-top: 10px;">Prevent Suspension</a>
            <p style="margin-top: 20px; font-size: 14px; color: #888;">Failure to transact may result in account deactivation.</p>
            <hr>
            <p style="color: #888; font-size: 12px;">© 2025 Bezell Bank. All Rights Reserved.</p>
        </div>`;
      } else if (diffDays >= 30) {
        subject = "⚠️ Warning: Your Account is Inactive!";
        html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #FF9800;">Dear ${user.firstName},</h2>
            <p style="color: #333; font-size: 16px;">Your account has been inactive for <strong>${diffDays} days</strong>.</p>
            <p style="color: #555;">To avoid restrictions, we strongly recommend making a transaction as soon as possible.</p>
            <a href="https://yourbank.com/login" style="display: inline-block; padding: 12px 20px; background-color: #FF9800; color: #fff; text-decoration: none; font-size: 16px; border-radius: 5px; margin-top: 10px;">Transact Now</a>
            <p style="margin-top: 20px; font-size: 14px; color: #888;">Your account may be subject to review if inactivity continues.</p>
            <hr>
            <p style="color: #888; font-size: 12px;">© 2025 Bezell Bank. All Rights Reserved.</p>
        </div>`;
      } else if (diffDays >= 10) {
        subject = "⏳ Reminder: Keep Your Account Active!";
        html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #0179FE;">Hello ${user.firstName},</h2>
            <p style="color: #333; font-size: 16px;">We noticed you haven’t made any transactions in the last <strong>${diffDays} days</strong>.</p>
            <p style="color: #555;">Keep your account active by making a transaction today! Don't miss out on seamless banking.</p>
            <a href="https://yourbank.com/login" style="display: inline-block; padding: 12px 20px; background-color: #0179FE; color: #fff; text-decoration: none; font-size: 16px; border-radius: 5px; margin-top: 10px;">Make a Transaction</a>
            <p style="margin-top: 20px; font-size: 14px; color: #888;">If you have already transacted, please ignore this message.</p>
            <hr>
            <p style="color: #888; font-size: 12px;">© 2025 Bezell Bank. All Rights Reserved.</p>
        </div>`;
      } else {
        // If the latest transaction is less than 10 days old, no notification is needed.
        return;
      }
    }

    // Check if a notification with the same subject has already been sent for this user.
    const notificationCheck = await db.listDocuments(
      DATABASE_ID,
      NOTIFICATION_COLLECTION_ID,
      [
        Query.equal("email", user.email),
        Query.equal("subject", subject)
      ]
    );
    if (notificationCheck.documents.length > 0) {
      console.log(`Notification for "${subject}" already sent to ${user.email}.`);
      return;
    }

    // Send the notification (log in Appwrite)
    await sendNotification(user, subject, html);
  } catch (error) {
    console.error(`Error processing user ${user.email}:`, error);
  }
};

// ===========================
// Cron Job 1: Process Users Every 30 Seconds
// ===========================
cron.schedule("*/30 * * * * *", async () => {
  console.log("Checking users for inactivity...");

  try {
    // Fetch all users from the Users collection
    const userResponse = await db.listDocuments(DATABASE_ID, USERS_COLLECTION_ID);
    const users = userResponse.documents;
    for (const user of users) {
      await processUser(user);
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  }

  console.log("User processing complete.");
});

// ===========================
// Cron Job 2: Send Pending Emails Every Minute
// ===========================
const sendPendingNotifications = async () => {
  console.log("Checking for pending notifications...");

  try {
    // Query for notifications with status "pending"
    const notificationsResponse = await db.listDocuments(
      DATABASE_ID,
      NOTIFICATION_COLLECTION_ID,
      [Query.equal("status", "pending")]
    );
    const notifications = notificationsResponse.documents;
    if (notifications.length === 0) {
      console.log("No pending notifications.");
      return;
    }

    for (const notification of notifications) {
      const mailOptions = {
        from: "info@neocube.site",         // sender from your SMTP settings
        to: notification.email,            // recipient email from notification
        subject: notification.subject,
        html: notification.html
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${notification.email}`);

        // Update the notification status to "sent" and clear any error response
        await db.updateDocument(
          DATABASE_ID,
          NOTIFICATION_COLLECTION_ID,
          notification.$id,
          { status: "sent", response: "" }
        );
        console.log(`Notification status updated for ${notification.email}`);
      } catch (sendError) {
        console.error(`Error sending email for notification ${notification.$id}:`, sendError);

        // Update the notification with the error message in the "response" field
        await db.updateDocument(
          DATABASE_ID,
          NOTIFICATION_COLLECTION_ID,
          notification.$id,
          { status: "failed", response: sendError.message }
        );
      }
    }
  } catch (error) {
    console.error("Error fetching pending notifications:", error);
  }
};

cron.schedule("*/1 * * * *", () => {
  sendPendingNotifications();
  console.log("Cron job executed: Checking for pending notifications.");
});


cron.schedule("*/1 * * * *", () => {
  sendPendingNotifications();
  console.log("Cron job executed: Checking for pending notifications.");
});

console.log("Cron jobs scheduled.");
