FROM python/3.11-slim

WORKDIR /app

COPY pyproject.toml .
COPY src/ src/

RUN pip install pdm && \
    pdm install --prod

EXPOSE 8000

CMD ["pdm", "run", "uvicorn", "src.chat_with_jfk_files.chat:app", "--host", "0.0.0.0", "--port", "8000"]