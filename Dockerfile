FROM node:23

WORKDIR /app

COPY package*.json ./

RUN npm install -g pnpm
RUN pnpm i @nestjs/cli
RUN pnpm install

COPY . .

RUN pnpm run build 

CMD [ "pnpm", "run", "start" ]