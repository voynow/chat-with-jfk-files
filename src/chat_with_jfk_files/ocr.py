from dotenv import load_dotenv
from openai import OpenAI
from pdf2image import convert_from_path
from pytesseract import image_to_string

load_dotenv()
client = OpenAI()


def extract_text_from_pdf(path: str) -> str:
    """Extract text from a single PDF file."""
    images = convert_from_path(path)
    text = "".join(image_to_string(img) for img in images)
    return text
