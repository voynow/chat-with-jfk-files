FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
COPY src/ src/

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

CMD ["python", "-m", "uvicorn", "src.chat_with_jfk_files.chat:app", "--host", "0.0.0.0", "--port", "8000"]