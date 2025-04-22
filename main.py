from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from telegram import Update, WebAppInfo, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes, CallbackContext
import os
import asyncio
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()

# Telegram Bot Token
TELEGRAM_BOT_TOKEN = "7886092766:AAGMZU9RLz3Nvvx67o9R_zauxk2oFbJmgeE"

# Mount static files and setup templates
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Initialize Telegram bot
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

# Initialize bot
async def init_bot():
    application = Application.builder().token(TELEGRAM_BOT_TOKEN).build()
    
    # Add handlers
    application.add_handler(CommandHandler("start", start))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, echo))
    
    # Start the bot
    await application.initialize()
    await application.start()
    await application.run_polling(allowed_updates=Update.ALL_TYPES)

# Background task for running the bot
@app.on_event("startup")
async def startup_event():
    # Create a task for the bot
    asyncio.create_task(init_bot())

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 