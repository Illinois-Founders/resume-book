resume-book
===========

This is the respository for the Founders Resume Book. 

If you're a company that would like to gain access to the students listed in the book, please email team@founders.illinois.edu

## Running Locally
```sh
$ npm install
$ cp config.js.example config.js
# Add API tokens to config.js
# Set up AWS tokens according to: 
# http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html

$ mongod

# In a separate process
$ npm start
```
