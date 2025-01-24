FROM python:3.11-slim

WORKDIR /app

# Install PDM with pip and configure it
RUN pip install --no-cache-dir pdm && \
    pdm config python.use_venv false

COPY pyproject.toml .
COPY src/ src/

# Install dependencies
RUN pdm install --prod --no-lock --no-editable

EXPOSE 8000

# Add this line to specify the process type
ENV PROCESS_TYPE=web

CMD ["pdm", "run", "uvicorn", "src.chat_with_jfk_files.chat:app", "--host", "0.0.0.0", "--port", "8000"]