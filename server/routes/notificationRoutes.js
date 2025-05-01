import express from 'express';
import twilio from 'twilio';

const router = express.Router();
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// SMS Verification Endpoint
router.get('/verify-twilio', async (req, res) => {
  try {
    const account = await client.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
    res.json({
      status: 'Twilio connected',
      accountStatus: account.status,
      balance: account.balance,
      number: process.env.TWILIO_PHONE_NUMBER
    });
  } catch (error) {
    res.status(500).json({
      error: 'Twilio connection failed',
      details: error.message
    });
  }
});

// SMS Sending Endpoint
router.post('/sms', async (req, res) => {
  const { phoneNumber, message } = req.body;

  // Validation
  if (!phoneNumber || !message) {
    return res.status(400).json({ error: 'Phone and message required' });
  }

  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });

    res.json({
      success: true,
      sid: result.sid,
      status: result.status,
      dateCreated: result.dateCreated
    });
  } catch (error) {
    console.error('Twilio error:', error);
    res.status(500).json({
      error: 'Failed to send SMS',
      code: error.code,
      message: error.message,
      moreInfo: error.moreInfo
    });
  }
});

export default router;