FROM node:18-alpine
WORKDIR /arcane-frontend
COPY package.json ./
RUN yarn install
COPY . .
CMD ["yarn", "dev"]