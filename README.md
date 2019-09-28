# To start run in the terminal.

1.  docker-compose up -d
2.  npm run start

# Implementation guide, how we did.

1.  docker-compose up -d to run the container with CoachDB (See docker-compe.yml file for details).
2.  Go to http://localhost:5984/_utils/ to access CoachDB dashboard.
3.  To enable CORS goto http://localhost:5984/_utils/#_config and click on CORS tab.
4.  To create a database go to http://localhost:5984/_utils/#/_all_dbs and click on "Create Database"(We created experiments_list data base).
5.  We built a simple React APP using Parcel. To install Parcel: npm install parcel-bundler react react-dom pouchdb
6.  Built a simple React App.
7.  Configure PouchDB to be live with our instance of CouchDB, and reconnect everytime we recover the connection.
8.  To implement Map-Reduce in couchDB follow the next steps:
    * Create a design document with the views and its map and the reduce function if apply.
    * Upload the design document to the database.
    * Query the view and use the resultset.


