#/bin/sh

for i in index.html style.css main.js lib/; do
	rsync -r -a -v -e "ssh" $i joeba.in:/var/www/joeba.in/node/public/subs/sock/$i
done
