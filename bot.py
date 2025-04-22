from telegram import Update, WebAppInfo, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes, CallbackContext
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Telegram Bot Token
TELEGRAM_BOT_TOKEN = "7886092766:AAGMZU9RLz3Nvvx67o9R_zauxk2oFbJmgeE"

async def start(update: Update, context: CallbackContext):
    # Create inline keyboard with Web App button
    keyboard = [[
        InlineKeyboardButton(
            "Открыть Web App",
            web_app=WebAppInfo(url="https://telegram-webapp-datkatrans.onrender.com")
        )
    ]]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        "Жми кнопку!",
        reply_markup=reply_markup
    )

async def echo(update: Update, context: CallbackContext):
    await update.message.reply_text(update.message.text)

async def main():
    # Create the Application
    application = Application.builder().token(TELEGRAM_BOT_TOKEN).build()
    
    # Add handlers
    application.add_handler(CommandHandler("start", start))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, echo))
    
    # Start the bot
    await application.initialize()
    await application.start()
    await application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == "__main__":
    import asyncio
    asyncio.run(main()) 