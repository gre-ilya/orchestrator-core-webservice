FROM node:18.16-slim
WORKDIR /app-dir
RUN apt-get update && \
    apt-get install -y make && \
    rm -rf /var/lib/apt/lists/* \
