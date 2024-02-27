cd ./frontend
export NODE_OPTIONS=--openssl-legacy-provider 
npm start
cd ..
cd ./backend
python app.py