import { Client, Databases, Query, ID } from "node-appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite endpoint
  .setProject("6788eda1003430b7cae6")           // Your Appwrite project ID
  .setKey("standard_1691566e87753eae87341d72353d8c61d9c920d1c0fd2320f857df032433bbc3dbaa1600f8e63c29f97282cb23c925c71d9358ebbe80763a766ea33cbd92fa569d30c8f4659777cf060acb1b1d1ce65808fb0a19332a994d4017cc1611b217e02d38c030c32db46dac57a497a0e9cda4c9d28e68925ca4c9ca5dd6a3a9de0245"); // Your Appwrite API key

const db = new Databases(client);

// ===========================
// Collection IDs
// ===========================
const DATABASE_ID = "6788f3a6000ec891cc6a";
const NOTIFICATION_COLLECTION_ID = "67b6340a001d9b4911f9";

export const sendEmailNotification = async (sendTo: EmailSendProps) => {
    try {
      await db.createDocument(
        DATABASE_ID,
        NOTIFICATION_COLLECTION_ID,
        ID.unique(),
        {
          email: sendTo.email,
          subject: sendTo.subject,
          html: sendTo.html,
          status: "pending", // Notification status initially set to pending
          response: ""       // Initialize with an empty response
        }
      );
      //console.log(`Notification logged for ${user.email} - ${subject}`);
    } catch (error) {
      console.error("Error logging notification:", error);
    }
  };