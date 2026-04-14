import os
import asyncio
import aiohttp
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
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher(storage=MemoryStorage())


async def get_xai_analysis(summary: str) -> str:
    """Запрашивает ИИ-анализ у GPT-4o на основе результата теста."""
    if not OPENAI_API_KEY:
        return ""
    prompt = (
        f"Пользователь прошёл диагностику биологического возраста Re-Form Scan.\n"
        f"Результат: {summary}\n\n"
        f"Напиши персональный анализ (5-7 предложений) на русском языке:\n"
        f"1. Что означает этот результат\n"
        f"2. Главные зоны риска\n"
        f"3. Конкретные рекомендации по восстановлению\n"
        f"Пиши тепло, как эксперт-психолог. Без списков — сплошным текстом."
    )
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                "https://api.openai.com/v1/chat/completions",
                headers={"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"},
                json={"model": "gpt-4o", "messages": [{"role": "user", "content": prompt}], "max_tokens": 500}
            ) as resp:
                data = await resp.json()
                return data["choices"][0]["message"]["content"].strip()
    except Exception:
        return ""


def main_keyboard() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="🧠 Записаться на консультацию", callback_data="consult")],
        [InlineKeyboardButton(text="🧬 Узнать об Agenyz", callback_data="agenyz")],
    ])


@dp.message(CommandStart())
async def cmd_start(message: Message, command: CommandStart = None):
    args = message.text.split(maxsplit=1)[1] if len(message.text.split()) > 1 else ""

    # Уведомляем Марию
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

    # Отправляем ИИ-анализ если есть результат теста
    if args and OPENAI_API_KEY:
        await message.answer("🤖 Генерирую персональный ИИ-анализ...")
        analysis = await get_xai_analysis(args)
        if analysis:
            await message.answer(
                f"🧬 <b>Персональный анализ от ИИ-коуча Re-Form:</b>\n\n{analysis}",
                parse_mode="HTML"
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
