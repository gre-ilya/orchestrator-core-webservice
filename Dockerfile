FROM node:18.16-buster

EXPOSE 4444
COPY orchestrator/server.js .
ENTRYPOINT node server.js
