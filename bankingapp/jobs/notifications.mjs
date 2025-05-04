// const mysql = require('mysql2/promise');
// const nodemailer = require('nodemailer');
// const cron = require('node-cron');

import mysql from 'mysql2/promise';
import nodemailer from 'nodemailer';
import cron from 'node-cron';

// Database connection
const pool = mysql.createPool({
    host: '193.203.168.101',
    user: 'u665528618_vmasoke2',
    password: 'LazzyPassword@2030',
    database: 'u665528618_core_banking',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Email transporter
const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
        user: "info@neocube.site",
        pass: "LazzyPassword@2030"
    }
});

// Function to send pending emails
async function sendPendingEmails() {
    let conn;
    try {
        conn = await pool.getConnection();

        // Start transaction
        await conn.beginTransaction();

        try {
            // Get pending notifications (limit 10 at a time)
            const [notifications] = await conn.query(
                `SELECT * FROM notifications
                 WHERE status = 'pending' AND attempts < 3
                 ORDER BY created_at ASC
                 LIMIT 10 FOR UPDATE SKIP LOCKED`
            );

            if (notifications.length === 0) {
                console.log('No pending notifications to send');
                return;
            }

            for (const notification of notifications) {
                try {
                    const mailOptions = {
                        from: 'Bezell Bank <info@neocube.site>',
                        to: notification.email,
                        subject: notification.subject,
                        html: notification.content
                    };

                    await transporter.sendMail(mailOptions);

                    // Update notification as sent
                    await conn.query(
                        `UPDATE notifications
                         SET status = 'sent',
                             attempts = attempts + 1,
                             last_attempt = NOW(),
                             error_message = NULL
                         WHERE notification_id = ?`,
                        [notification.notification_id]
                    );

                    console.log(`Email sent to ${notification.email}`);
                } catch (error) {
                    console.error(`Failed to send email to ${notification.email}:`, error.message);

                    // Update notification with error
                    await conn.query(
                        `UPDATE notifications
                         SET attempts = attempts + 1,
                             last_attempt = NOW(),
                             error_message = ?,
                             status = attempts >= 2 ? 'failed' : 'pending'
                         WHERE notification_id = ?`,
                        [error.message.substring(0, 255), notification.notification_id]
                    );
                }
            }

            await conn.commit();
        } catch (error) {
            await conn.rollback();
            throw error;
        }
    } catch (error) {
        console.error('Error in sendPendingEmails:', error);
    } finally {
        if (conn) conn.release();
    }
}

// Schedule job to run every 2 minutes
cron.schedule('*/2 * * * *', () => {
    console.log('Running email sending job...');
    sendPendingEmails();
});

console.log('Email notification service started');
