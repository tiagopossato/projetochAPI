#!/bin/bash

echo "Comentarios do commit: "
read MSG

git add api-nodejs/bin/. api-nodejs/models/. api-nodejs/routes/. api-nodejs/app.js api-nodejs/package.json commit.sh README.md
git commit -m "$MSG"
git push -u origin master
