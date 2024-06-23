# Contribute

## If you unsure
If you unsure how to contribute after read this file, just open a new issue with your questions. 

### Servers
If you want to submit your own server on a pull request, also submit:
- new folder with the name of the vulnerability under servers folder
- exploit.txt  
The exploit.txt file has to include vulnerability description, exploit code and exploit url if there is one.
- server.js file
- install the node modules your server uses in local with npm install modulename (this way package.json will be updated with the new module)
- add the server to servers\_list.txt
- add the server, server-exploit and server-code to the package.json file as follows
```json
"nameofvuln": "node ./servers/nameofvuln/server.js",
  "nameofvuln-exploit": "cat ./servers/nameofvuln/exploit.txt",
  "nameofvuln-code": "cat ./servers/nameofvuln/server.js",
```

##### Considerations
- Big files will not be acepted.
- Vulnerability should be coded in node. (if you write it in another language open an issue instead requesting a port to node.js or bash, once you have it submit a pull request.)
- Vulnerability should be coded in English. 
- You can add all the files you want under your servers/yourvuln/ folder. (Try to limit the files you add to another folder outside of servers folder.)


### CLI
Contributions on the cli scripts will be accepted. But don't make use of not preinstaled tools like pup, w3m, lynx, etc.  
