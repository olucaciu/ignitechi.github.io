#!/usr/bin/env bash

while getopts d:n:f:l: option
do
 case "${option}"
 in
 d) DATE=${OPTARG};;
 n) NAME=${OPTARG};;
 f) FILE=${OPTARG};;
 l) LINK=${OPTARG};;
 esac
done

if [[ -z ${DATE} ]]
then
    read -r -e -p "Date of event: " DATE
fi

if [[ -z ${FILE} ]]
then
    read -r -e -p "Current file location: " FILE
fi

if [[ -z ${NAME} ]]
then
    read -r -e -p "Person's name: " NAME
fi

if [[ -z ${LINK} ]]
then
    read -r -e -p "Person's link: " LINK
fi

COMMIT_MESSAGE="$DATE: adding $NAME."

FILE=$(readlink -f "$FILE")

# Lowercase
CLEAN_NAME=$(tr "[:upper:]" "[:lower:]" <<< "$NAME")

# Replace space with dashes
CLEAN_NAME=$(sed -e "s/ /-/g" <<< "$CLEAN_NAME")

# Location of the person's image
DIRECTORY="assets/img/speakers/$DATE/$CLEAN_NAME"

git stash
git checkout master
git pull --rebase --autostash
git checkout -b "$DATE/$CLEAN_NAME" origin/master

# Add to speaker.yml
mkdir -p "_data/$DATE/"
touch "_data/$DATE/speakers.yml"
cat << EOF >> "_data/$DATE/speakers.yml"

- name: "$NAME"
  link: "$LINK"
EOF

# Create folder if missing
rm -rf "$DIRECTORY"
mkdir -p "$DIRECTORY"

# Create a 1000x1000 pixel center cropped 72ppi image from the original
convert "$FILE" \
    -resize 1000x1000^ \
    -gravity Center \
    -crop 1000x1000+0+0 \
    +repage \
    -strip \
    -units PixelsPerInch \
    -density 72 \
    "$DIRECTORY/$CLEAN_NAME-large.jpg"

# Create a 200x200 pixel center cropped 72ppi image from the original
convert "$FILE" \
    -resize 200x200^ \
    -gravity Center \
    -crop 200x200+0+0 \
    +repage \
    -strip \
    -units PixelsPerInch \
    -density 72 \
    "$DIRECTORY/$CLEAN_NAME.jpg"

# Compress the images
tinypng "$DIRECTORY"

git add -A
git commit -am "$COMMIT_MESSAGE"
git push -u origin "$DATE/$CLEAN_NAME"
hub pull-request -m "$COMMIT_MESSAGE"
