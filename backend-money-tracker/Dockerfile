
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# ARG name
# ENV MONGO_URL=${name}

EXPOSE 3000

CMD ["npm", "run", "dev"]