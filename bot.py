from telegram import Update, WebAppInfo, KeyboardButton, ReplyKeyboardMarkup, WebAppInfo
from telegram.ext import Application, CommandHandler, MessageHandler, filters, CallbackContext
import asyncio
import logging

# Enable logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

# Telegram Bot Token
TELEGRAM_BOT_TOKEN = "7886092766:AAGMZU9RLz3Nvvx67o9R_zauxk2oFbJmgeE"
WEBAPP_URL = "https://datkatranstgapp.onrender.com"  # Updated URL

async def start(update: Update, context: CallbackContext):
    """Send a message with a button that opens the web app."""
    keyboard = [[KeyboardButton(
        text="Открыть портал",
        web_app=WebAppInfo(url=WEBAPP_URL)
    )]]
    
    reply_markup = ReplyKeyboardMarkup(
        keyboard,
        resize_keyboard=True,
        is_persistent=True
    )
    
    await update.message.reply_text(
        "Привет! Нажмите кнопку 'Открыть портал' для доступа к веб-приложению:",
        reply_markup=reply_markup
    )

async def echo(update: Update, context: CallbackContext):
    """Echo the user message."""
    await update.message.reply_text(update.message.text)

async def main():
    """Start the bot."""
    try:
        # Create the Application
        application = Application.builder().token(TELEGRAM_BOT_TOKEN).build()
        
        # Add handlers
        application.add_handler(CommandHandler("start", start))
        application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, echo))
        
        # Start the bot
        logging.info("Starting bot...")
        await application.initialize()
        await application.start()
        print(f"Bot started! Web App URL: {WEBAPP_URL}")
        await application.run_polling(allowed_updates=Update.ALL_TYPES)
    except Exception as e:
        logging.error(f"Error in main: {e}")
        raise

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except Exception as e:
        logging.error(f"Fatal error: {e}")
        raise 