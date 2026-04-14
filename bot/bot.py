import os
import asyncio
from aiogram import Bot, Dispatcher, F
from aiogram.types import Message, CallbackQuery, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.filters import CommandStart
from aiogram.fsm.storage.memory import MemoryStorage
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN")
ADMIN_ID = int(os.getenv("ADMIN_ID"))
FORMS_LINK = os.getenv("FORMS_LINK")
AGENYZ_LINK = os.getenv("AGENYZ_LINK")

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher(storage=MemoryStorage())


def main_keyboard() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="🧠 Записаться на консультацию", callback_data="consult")],
        [InlineKeyboardButton(text="🧬 Узнать об Agenyz", callback_data="agenyz")],
    ])


@dp.message(CommandStart())
async def cmd_start(message: Message, command: CommandStart = None):
    # Разбираем параметр ?start=... из приложения
    args = message.text.split(maxsplit=1)[1] if len(message.text.split()) > 1 else ""

    # Уведомляем Марию о новом лиде
    user = message.from_user
    user_info = f"👤 Новый пользователь: {user.full_name}"
    if user.username:
        user_info += f" (@{user.username})"
    user_info += f"\nID: {user.id}"
    if args:
        user_info += f"\n\n📊 Результат теста:\n{args}"

    try:
        await bot.send_message(ADMIN_ID, user_info)
    except Exception:
        pass

    # Приветствие пользователю
    if args:
        welcome = (
            f"👋 Привет! Я бот психолога Марии.\n\n"
            f"📊 Твой результат сканирования:\n<b>{args}</b>\n\n"
            f"Выбери, что тебя интересует:"
        )
    else:
        welcome = (
            "👋 Привет! Я бот психолога Марии.\n\n"
            "Здесь ты можешь записаться на диагностическую консультацию "
            "или узнать о клеточном питании Agenyz.\n\n"
            "Выбери, что тебя интересует:"
        )

    await message.answer(welcome, reply_markup=main_keyboard(), parse_mode="HTML")


@dp.callback_query(F.data == "consult")
async def on_consult(callback: CallbackQuery):
    text = (
        "🧠 <b>Диагностическая консультация с Марией</b>\n\n"
        "Для записи необходимо заполнить анкету. "
        "Это поможет провести сессию с максимальной пользой.\n\n"
        "📝 После заполнения анкеты Мария свяжется с вами в течение 24 часов.\n\n"
        f"👉 <a href='{FORMS_LINK}'>Заполнить анкету</a>"
    )
    await callback.message.answer(text, parse_mode="HTML", disable_web_page_preview=True)
    await callback.answer()

    # Уведомляем Марию
    user = callback.from_user
    note = f"📋 {user.full_name}"
    if user.username:
        note += f" (@{user.username})"
    note += " нажал(а) «Записаться на консультацию»"
    try:
        await bot.send_message(ADMIN_ID, note)
    except Exception:
        pass


@dp.callback_query(F.data == "agenyz")
async def on_agenyz(callback: CallbackQuery):
    text = (
        "🧬 <b>Клеточное питание Agenyz</b>\n\n"
        "Agenyz — профессиональная клеточная поддержка, "
        "которая помогает замедлить биологическое старение "
        "и восстановить ресурс организма.\n\n"
        "✅ Зарегистрируйтесь по ссылке ниже.\n"
        "⚠️ <b>Важно:</b> после регистрации обязательно напишите Марии для персональной поддержки: "
        "<a href='https://t.me/MariaPsyRes'>@MariaPsyRes</a>\n\n"
        f"👉 <a href='{AGENYZ_LINK}'>Зарегистрироваться в Agenyz</a>"
    )
    await callback.message.answer(text, parse_mode="HTML", disable_web_page_preview=True)
    await callback.answer()

    # Уведомляем Марию
    user = callback.from_user
    note = f"🧬 {user.full_name}"
    if user.username:
        note += f" (@{user.username})"
    note += " нажал(а) «Узнать об Agenyz»"
    try:
        await bot.send_message(ADMIN_ID, note)
    except Exception:
        pass


async def main():
    print("Бот @ReFormPsy_bot запущен...")
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
