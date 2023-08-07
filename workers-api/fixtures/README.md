To make the test data, from the root of the project run:
```bash
sudo apt-get install jq
cat ./data/country.json > ./workers-api/fixtures/country.json
jq '.[0:200]' ./data/institution.json > ./workers-api/fixtures/institution.json
```