FROM node
WORKDIR /app
COPY  package.json .
RUN npm install
COPY . ./
ENV PORT=5173
EXPOSE ${PORT}
CMD [ "npm", "run", "dev", "--", "--host", "0.0.0.0"]