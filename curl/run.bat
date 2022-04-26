curl --insecure -v -X POST -H @header.txt --data @data.txt --compressed -o result.json https://sscops.pertamina.com/smartit/rest/v2/person/workitems/get
mongoimport --db ssc --collection ticket_tmp --drop --file result.json --jsonArray
mongo < run.js