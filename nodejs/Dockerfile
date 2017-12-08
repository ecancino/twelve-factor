FROM mhart/alpine-node
WORKDIR /srv
COPY . .
RUN mkdir uploads
RUN yarn
EXPOSE 8000
CMD node index.js
