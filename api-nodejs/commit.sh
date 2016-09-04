#!/bin/bash

echo "Comentarios do commit: "
read MSG

git add bin/. models/. routes/. app.js package.json commit.sh
git commit -m "$MSG"
git push -u origin master