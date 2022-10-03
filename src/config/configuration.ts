export default () => ({
  config: {
    realData: process.env.USE_REAL_DATA,
  },
  doc: {
    id: process.env.GOOGLE_SHEET_ID || '',
    privateKey:
      process.env.GOOGLE_SHEET_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
    clientEmail: process.env.GOOGLE_SHEET_CLIENT_EMAIL || '',
    sheetName: process.env.GOOGLE_SHEET_NAME || '',
  },
  welcomeMessage:
    'Welcome to the freedom way. We, are trying to remove the obstacles of this way together. ',
  bot: {
    token: process.env.BOT_TOKEN || '',
  },
});
