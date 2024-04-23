## Instructions


Backend, We are using-
main.py flask as the server with two endpoints and one reset endpoint
model.py for topic modelling 
parser for parsing web links
databases are-
faiss - for storing vectors  (this is stored in the file system under the name "index")
mongo - for storing everything else

To setup run,
docker-compose up --build
this will setup mongo, mongo-express (to view), flask

flask in docker is not setup proprly, so run flask only locally and keep the rest in docker as it is
`cd ai-server && python main.py`

Now, you have flask running locally, mongo and mongo-express running on docker

to login to mongo express, jump to localhost:8081 and type admin/pass for credentials, you will be able to view documents 

Flask contains two documents in the database bert in mongo
- Links - to store all link related metadata
- counter - to correleate between faiss (the vector database) index and mongo index since faiss stores only vectors to do similarity checks

once its all setup, you can - 

- to save a bookmark
```
curl --location 'http://127.0.0.1:5000/save_bookmark' \
--header 'Content-Type: application/json' \
--data '{"link":"https://en.wikipedia.org/wiki/Chicago"}'
```

- to query a bookmark
```
curl --location 'http://127.0.0.1:5000/query?q=Buildings%20are%20very%20prominent%20in%20this%20city'
```

- to reset to default state
```
curl --location 'http://127.0.0.1:5000/reset'
```