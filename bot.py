from telegram import Update, WebAppInfo, InlineKeyboardButton, InlineKeyboardMarkup
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
WEBAPP_URL = "https://datkatranstgapp.onrender.com"

async def start(update: Update, context: CallbackContext):
    """Send a message with a button that opens the web app."""
    keyboard = [
        [
            InlineKeyboardButton(
                text="Открыть приложение",
                web_app=WebAppInfo(url=WEBAPP_URL)
            )
        ]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        "Привет! Нажми на кнопку ниже, чтобы открыть приложение:",
        reply_markup=reply_markup
    )

async def echo(update: Update, context: CallbackContext):
    """Echo the user message."""
    await update.message.reply_text(update.message.text)

async def main():
    """Start the bot."""
    # Create the Application
    application = Application.builder().token(TELEGRAM_BOT_TOKEN).build()
    
    # Add handlers
    application.add_handler(CommandHandler("start", start))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, echo))
    
    # Start the bot
    logging.info("Starting bot...")
    await application.initialize()
    await application.start()
    print("Bot started!")
    await application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except Exception as e:
        logging.error(f"Error running bot: {e}") 