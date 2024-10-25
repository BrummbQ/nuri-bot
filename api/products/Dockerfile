FROM python:3.12-slim
ENV PYTHONUNBUFFERED True

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all code files
COPY . .

EXPOSE 8080
CMD ["fastapi", "run", "main.py", "--port", "8080"]