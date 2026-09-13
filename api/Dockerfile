FROM node:lts
# Needed to compile native modules like sqlite3
RUN apt-get update && apt-get install -y python3 make g++

WORKDIR /app
COPY package*.json ./

# Force native build instead of downloading prebuilt binaries
RUN npm install --build-from-source

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]