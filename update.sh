cp -r public ../
sudo git pull
sudo npm install
cp -r ../public .
sudo rm -rf ../public
sudo pm2 restart index.js
sudo pm2 save