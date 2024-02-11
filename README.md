# COKI Open Access Website
COKI Open Access Website is the [Next.js](https://nextjs.org/) based front end and Cloudflare Workers backend for the Curtin 
Open Knowledge Initiative's Open Access Dashboard: [open.coki.ac](https://open.coki.ac/)

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Next JS](https://img.shields.io/badge/Next-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?logo=Cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![e2e Tests](https://github.com/The-Academic-Observatory/coki-oa-web/actions/workflows/e2e-tests.yml/badge.svg)](https://github.com/The-Academic-Observatory/coki-oa-web/actions/workflows/e2e-tests.yml)
[![Workers API Unit Tests](https://github.com/The-Academic-Observatory/coki-oa-web/actions/workflows/workers-api-unit-tests.yml/badge.svg)](https://github.com/The-Academic-Observatory/coki-oa-web/actions/workflows/workers-api-unit-tests.yml)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![DOI](https://zenodo.org/badge/430557646.svg)](https://zenodo.org/badge/latestdoi/430557646)

1. [Requirements](#1-requirements)
2. [Web App Development](#2-web-app-development)
3. [REST API Development](#3-rest-api-development)
4. [Configuring GitHub Actions](#4-configuring-github-actions)
5. [REST API Endpoints](#5-rest-api-endpoints)
6. [Contributors](#6-contributors)
7. [License](#7-license)

## 1. Requirements
### OS Requirements
* Linux, Windows or MacOS.
* NodeJS 20: https://nodejs.org/en/
* yarn 4: https://yarnpkg.com/getting-started/install
* Install system dependencies: `sudo apt-get -y install libc++1 unzip` (libc++1 may be required for Wrangler 3)
* Vercel CLI: `npm install --global vercel`

### Preparing Data Files
The data for the COKI OA Website is generated by the [oa_web_workflow](https://github.com/The-Academic-Observatory/academic-observatory-workflows/blob/develop/academic_observatory_workflows/workflows/oa_web_workflow.py).
Apache Airflow workflow. This workflow needs to be run first to produce the data files that will be visualised by the 
website. Normally the following steps are performed automatically by the workflow when the website is built and 
deployed, however, during development this needs to be done manually.

From the Google Cloud Storage bucket, download the `v10/data.zip` file, saving it in the `./data` folder of the project.

Run the `./bin/data.sh .` script, which will extract the data files and copy them to the right places 
(this will also run on Windows).

## 2. Web App Development
See below for instructions specific to running the web application.

### Install dependencies
Install dependencies:
```bash
yarn install
```

### Running Development Server
To load the local database:
```bash
cd workers-api
yarn build # Creates ../data/data/db.sql
wrangler d1 execute DB --file ../data/data/db.sql --local --config wrangler.local.toml
```

Run the development server:
```bash
cd ../dashboard
yarn dev
```

Then, open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Running tests
Run Jest unit tests:
```bash
yarn test:jest
```

Install playwright for end-to-end tests:
```bash
npx playwright install-deps
npx playwright install
npx playwright install msedge
```

Runs playwright end-to-end tests:
```bash
yarn test:e2e
```

### Build & Deploy
Export environment variables:
```bash
export COKI_ENVIRONMENT=develop
export COKI_SITE_URL=https://develop.open.coki.ac
export COKI_API_URL=https://develop.api.coki.ac
```

Make sure that `COKI_API_URL` is pointing to a running version of the API, as it will be used during the build process.

#### Deploy Preview
Make sure that you are in the `dashboard` directory.

Pull preview project config:
```bash
vercel pull --environment=preview
```

Build project:
```bash
vercel build
```

Deploy preview:
```bash
vercel deploy --prebuilt
```

#### Deploy Production
Pull production project config:
```bash
vercel pull --environment=production
```

Build production project:
```bash
vercel build --prod
```

Deploy to production:
```bash
vercel deploy --prebuilt  --prod
```

## 3. REST API Development
See below for instructions specific to running the workers-api REST API.

Enter the workers-api folder:
```bash
cd ./workers-api
```

### Running Development Server
Run the development server. This uses [Miniflare](https://miniflare.dev/) to simulate Cloudflare Workers functionality.
```bash
yarn dev
```

Then, open [http://127.0.0.1:8787/search/curtin](http://127.0.0.1:8787/search/curtin) with your browser or CURL
to see the result of an API call.

### Running tests
Runs [Jest](https://jestjs.io/) unit tests:
```bash
yarn test:e2e
```

### Build & Deploy
Customise your wrangler.toml file, see wrangler.example.toml:
```toml
name = "coki-oa-web-api"
account_id = "my-cloudflare-account-id"
compatibility_date = "2022-02-03"

[build]
command = "yarn run build"

[site]
bucket = "./public"

[env.develop]
route = "my-develop-domain/*"

[env.staging]
route = "my-staging-domain/*"

[env.production]
route = "my-production-domain/*"
```

Make sure you are in the workers-api directory.

Build & deploy to develop:
```bash
yarn run wrangler deploy -e develop
```

Build & deploy to staging:
```bash
yarn run wrangler deploy -e staging
```

Build & deploy to production:
```bash
yarn run wrangler deploy -e production
```

### Rendering Social Cards
This will be removed when card generation is performed by the workflow or the API.

To render the cards:
```bash
sudo apt-get install libgtk-3-dev libasound2
cd ./social-cards
npx puppeteer browsers install firefox
PUPPETEER_PRODUCT=firefox
yarn render
```

The social cards are saved in `workers-images/public/social-cards`.
* Make a zip file of the social-cards folder.
* Upload it to the `coki-oa-web-data` Google Cloud Storage Bucket. The cards will then be
built into the latest.zip file by the Airflow workflow.

To manually view the social cards, start the local webserver and navigate to the following routes:
* /cards/country/[COUNTRY ID]
* /cards/institution/[ROR ID]

### Making Icons
Download the Adobe Illustrator icons-final.ai file.
* Add your icon as a new artboard, it should be 64x64px in size.
* File > Export for Screens > Format SVG, Export Artboard.
* Open the IcoMoon App: https://icomoon.io/app/#/select.
* Click "Import Icons" and choose components/common/selection.json.
* Update or add your new icon.
* Select the icons you want to export.
* Click the "Generate Font" tab.
* Click Download.
* Get the selections.json file out of the downloaded file and replace the old selections.json file.

## 4. Configuring GitHub Actions
The following GitHub Secrets need to be created:

* GCP_CREDENTIALS: credentials for gsutil.
* BUCKET_NAME: the name of the Google Cloud Storage bucket that contains the data files.
* WRANGLER_CONFIG: the Cloudflare Wrangler configuration file.
* WRANGLER_CONFIG_API: the Cloudflare Wrangler configuration file for the workers-api Cloudflare Worker.
* CLOUDFLARE_API_TOKEN: the Cloudflare API Token.

See below for instructions on how to set these up.

### wrangler.toml
Two wrangler.toml files need to be created, one for the Web App Cloudflare Worker and one for the API Cloudflare Worker.

For the web app, see the wrangler.example.toml file for an example of how to create the wrangler.toml file. Add the file 
to the WRANGLER_CONFIG GitHub Secret.

For the API, see workers-api/wrangler.example.toml file for an example of how to create the wrangler.toml file. Add the
file to the WRANGLER_CONFIG_API GitHub Secret.

### Cloudflare API Token
This connection contains Cloudflare API token that enables Wrangler to publish the Open Access Website to Cloudflare.
See [Cloudflare Creating API tokens](https://developers.cloudflare.com/api/tokens/create) for instructions on how to
create a Cloudflare API token. The Cloudflare API token is already URL encoded. The required settings for the token are
listed below.

Permissions:
* Account, Workers KV Storage:Edit
* Account, Workers Scripts:Edit
* Account, Account Settings:Read
* User, User Details:Read
* Zone, Workers Routes: Edit

Account Resources:
* Include, <select your account>

Zone Resources:
* Include, Specific zone: <select the domain you will deploy to>

```yaml
cloudflare_api_token: http://:<cloudflare_api_token>@
```

#### External references
* [Cloudflare Creating API tokens](https://developers.cloudflare.com/api/tokens/create)

## 5. REST API Endpoints
The COKI Open Access REST API offers a full text search endpoint for identifying countries and institutions based 
on their names. Additionally, the API provides filtering capabilities that allow users to find a range of countries and 
institutions that match specified parameters such as region, subregion, open access percentage, and number of outputs. 
Detailed information about individual countries and institutions can be retrieved using dedicated endpoints.

The data available through the REST API is copyrighted by Curtin University and licensed under the 
[Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/), 
except the data in the `description.text` fields. These are licensed under the 
[Creative Commons Attribution-ShareAlike 3.0 Unported License](https://en.wikipedia.org/wiki/Wikipedia:Text_of_Creative_Commons_Attribution-ShareAlike_3.0_Unported_License), as they are derived from Wikipedia.

### Search
Search for countries and institutions by name.

``GET /search/:text``

| Parameter       | Description                                                                     |
|:----------------|---------------------------------------------------------------------------------|
| `:text`         | The url encoded name or partial name of a country or institution to search for. |

| Query Parameter  | Description                                        |
|:-----------------|----------------------------------------------------|
| `page[number]`   | The page number starting at 0. Default value of 0. |
| `limit[number]`  | The number of items per page.                      |

#### Sample Request
```bash
curl https://api.coki.ac/search/curtin%20university
```

#### Sample Response
```json
{
  "items": [
    {
      "id": "02n415q13",
      "name": "Curtin University",
      "logo_sm": "logos/institution/sm/02n415q13.jpg",
      "entity_type": "institution",
      "country_name": "Australia",
      "country_code": "AUS",
      "subregion": "Australia and New Zealand",
      "region": "Oceania",
      "institution_type": "Education",
      "stats": {
        "n_outputs": 42938,
        "n_outputs_open": 18388,
        "p_outputs_open": 42.824537705528904,
        "p_outputs_publisher_open_only": 8,
        "p_outputs_both": 16,
        "p_outputs_other_platform_open_only": 19,
        "p_outputs_closed": 57
      }
    }
  ],
  "nItems": 1,
  "page": 0,
  "limit": 18
}
```

### Country
Get the full details for a country.

``GET /country/:id``

| Parameter | Description                      |
|:----------|----------------------------------|
| `:id`     | A three letter country ISO code. |

#### Sample Request
```bash
curl https://api.coki.ac/country/NZL
```

#### Sample Response
```json
{
  "id": "NZL",
  "name": "New Zealand",
  "description": {
    "text": "New Zealand is an island country in the southwestern Pacific Ocean. It consists of two main landmasses\u2014the North Island and the South Island\u2014and over 700 smaller islands. It is the sixth-largest island country by area, covering 268,021 square kilometres.",
    "license": "https://en.wikipedia.org/wiki/Wikipedia:Text_of_Creative_Commons_Attribution-ShareAlike_3.0_Unported_License",
    "url": "https://en.wikipedia.org/wiki/New_Zealand"
  },
  "entity_type": "country",
  "logo_sm": "logos/country/sm/NZL.svg",
  "logo_md": "logos/country/md/NZL.svg",
  "logo_lg": "logos/country/md/NZL.svg",
  "wikipedia_url": "https://en.wikipedia.org/wiki/New_Zealand",
  "region": "Oceania",
  "subregion": "Australia and New Zealand",
  "start_year": 2000,
  "end_year": 2021,
  "stats": {
    "n_citations": 5634926,
    "n_outputs": 214124,
    "n_outputs_open": 75448,
    ...
  },
  "years": [
    {
      "year": 2000,
      "date": "2000-12-31",
      "stats": {
        "n_citations": 176810,
        "n_outputs": 3463,
        "n_outputs_open": 668,
        ...
      }
    },
    ...
  ],
  "repositories": [
    {
      "id": "PubMed Central",
      "total_outputs": 24570,
      "category": "Domain",
      "home_repo": false
    },
    {
      "id": "Europe PMC",
      "total_outputs": 19203,
      "category": "Domain",
      "home_repo": false
    },
    {
      "id": "Semantic Scholar",
      "total_outputs": 5851,
      "category": "Public",
      "home_repo": false
    },
    ...
  ]
}
```

### Institution
Get the full details for an institution.

``GET /institution/:id``

| Parameter | Description                    |
|:----------|--------------------------------|
| `:id`     | The ROR ID of the institution. |

#### Sample Request
```bash
curl https://api.coki.ac/institution/030cszc07
```

#### Sample Response
```json
{
  "id": "030cszc07",
  "name": "Australian Astronomical Observatory",
  "description": {
    "text": "The Australian Astronomical Observatory, formerly the Anglo-Australian Observatory, was an optical and near-infrared astronomy observatory with its headquarters in North Ryde in suburban Sydney, Australia.",
    "license": "https://en.wikipedia.org/wiki/Wikipedia:Text_of_Creative_Commons_Attribution-ShareAlike_3.0_Unported_License",
    "url": "https://en.wikipedia.org/wiki/Australian_Astronomical_Observatory"
  },
  "entity_type": "institution",
  "logo_sm": "logos/institution/sm/030cszc07.jpg",
  "logo_md": "logos/institution/md/030cszc07.jpg",
  "logo_lg": "logos/institution/lg/030cszc07.png",
  "url": "http://www.aao.gov.au/",
  "wikipedia_url": "https://en.wikipedia.org/wiki/Australian_Astronomical_Observatory",
  "region": "Oceania",
  "subregion": "Australia and New Zealand",
  "country_name": "Australia",
  "country_code": "AUS",
  "institution_type": "Facility",
  "start_year": 2000,
  "end_year": 2021,
  "stats": {
    "n_citations": 72555,
    "n_outputs": 1243,
    "n_outputs_open": 1115,
    ...
  },
  "years": [
    {
      "year": 2000,
      "date": "2000-12-31",
      "stats": {
        "n_citations": 171,
        "n_outputs": 3,
        "n_outputs_open": 2,
        ...
      }
    },
    ...
  ],
  "acronyms": [
    "AAO"
  ],
  "repositories": [
    {
      "id": "arXiv",
      "total_outputs": 1101,
      "category": "Preprint",
      "home_repo": false
    },
    {
      "id": "Australian National University - ANU Open Research",
      "total_outputs": 247,
      "category": "Institution",
      "home_repo": false
    },
    {
      "id": "University College London - UCL Discovery",
      "total_outputs": 194,
      "category": "Institution",
      "home_repo": false
    },
    ...
  ]
}
```

### Countries
Return a paginated list of countries and optionally filter them.

`GET /countries`

The countries endpoint uses optional query parameters rather than path parameters.

| Query Parameter           | Description                                                                                                                                                                   |
|:--------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `page[number]`            | The page number starting at 0. Default value of 0.                                                                                                                            |
| `limit[number]`           | The number of items per page. Default value of 18.                                                                                                                            |
| `orderBy[string]`         | What field to order the results by, nested fields are supported. Default value of `stats.p_outputs_open`.                                                                     |
| `orderDir[string]`        | What direction to sort results, either ascending `asc` or descending `dsc`. Default value of `dsc`.                                                                           |
| `ids[string]`             | A list of 3 letter ISO country codes to return specific countries, separated by commas, e.g. `?ids=AUS,NZL`. This parameter overrides all other parameters.                   |
| `regions[string]`         | A list of regions to filter by. These must be URL encoded region names separated by commas, e.g. `?regions=Oceania,Americas`.                                                 |
| `subregions[string]`      | A list of subregions to filter by. These must be URL encoded subregion names separated by commas, e.g. `?subregions=Southern%20Asia,Latin%20America%20and%20the%20Caribbean`  |
| `minNOutputs[number]`     | The minimum inclusive number of outputs a country must have to be returned. Default value of 1000.                                                                            |
| `maxNOutputs[number]`     | The maximum inclusive number of outputs a country must have to be returned. Default value of Number.MAX_VALUE.                                                                |
| `minPOutputsOpen[number]` | The minimum inclusive open access percentage a country must have to be returned. Default value of 0.                                                                          |
| `maxPOutputsOpen[number]` | The maximum inclusive open access percentage a country must have to be returned. Default value of 100.                                                                        |

Query Parameter enumerations:

| Query Parameter | Enumerations                                                                                                                                                                                                                                                                                        |
|:----------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `orderDir`      | asc, dsc.                                                                                                                                                                                                                                                                                           |
| `ids`           | 3 letter ISO country codes.                                                                                                                                                                                                                                                                         |
| `regions`       | Africa, Americas, Asia, Europe and Oceania.                                                                                                                                                                                                                                                         |
| `subregions`    | Australia and New Zealand, Central Asia, Eastern Asia, Eastern Europe, Latin America and the Caribbean, Melanesia, Micronesia, Northern Africa, Northern America, Northern Europe, Polynesia, South-eastern Asia, Southern Asia, Southern Europe, Sub-Saharan Africa, Western Asia, Western Europe. |

#### Sample Request
```bash
curl "https://api.coki.ac/countries?page=0&regions=Oceania"
```

#### Sample Response
```json
{
  "items": [
    {
      "id": "PNG",
      "name": "Papua New Guinea",
      "logo_sm": "logos/country/sm/PNG.svg",
      "entity_type": "country",
      "subregion": "Melanesia",
      "region": "Oceania",
      "stats": {
        "n_outputs": 1964,
        "n_outputs_open": 1022,
        "p_outputs_open": 52.0366598778004,
        "p_outputs_publisher_open_only": 12,
        "p_outputs_both": 29,
        "p_outputs_other_platform_open_only": 11,
        "p_outputs_closed": 48
      }
    },
    {
      "id": "AUS",
      "name": "Australia",
      "logo_sm": "logos/country/sm/AUS.svg",
      "entity_type": "country",
      "subregion": "Australia and New Zealand",
      "region": "Oceania",
      "stats": {
        "n_outputs": 1397124,
        "n_outputs_open": 556603,
        "p_outputs_open": 39.839198238667436,
        "p_outputs_publisher_open_only": 10,
        "p_outputs_both": 17,
        "p_outputs_other_platform_open_only": 13,
        "p_outputs_closed": 60
      }
    },
    {
      "id": "NZL",
      "name": "New Zealand",
      "logo_sm": "logos/country/sm/NZL.svg",
      "entity_type": "country",
      "subregion": "Australia and New Zealand",
      "region": "Oceania",
      "stats": {
        "n_outputs": 214072,
        "n_outputs_open": 75871,
        "p_outputs_open": 35.44181396913188,
        "p_outputs_publisher_open_only": 11,
        "p_outputs_both": 15,
        "p_outputs_other_platform_open_only": 10,
        "p_outputs_closed": 64
      }
    },
    ...
  ],
  "nItems": 4,
  "page": 0,
  "limit": 18,
  "orderBy": "stats.p_outputs_open",
  "orderDir": "dsc"
}
```

### Institutions
Return a paginated list of institutions and optionally filter them.

`GET /institutions`

The institutions endpoint uses optional query parameters rather than path parameters.

| Query Parameter            | Description                                                                                                                                                                                                 | 
|:---------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `page[number]`             | The page number starting at 0. Default value of 0.                                                                                                                                                          |
| `limit[number]`            | The number of items per page. Default value of 18.                                                                                                                                                          |
| `orderBy[string]`          | What field to order the results by, nested fields are supported. Default value of `stats.p_outputs_open`.                                                                                                   |
| `orderDir[string]`         | What direction to sort results, either ascending `asc` or descending `dsc`. Default value of `dsc`.                                                                                                         |
| `ids[string]`              | A list of ROR IDs to return specific institutions, separated by commas, e.g. `?ids=02n415q13,03b94tp07`. ROR IDs should have the  https://ror.org/ stripped. This parameter overrides all other parameters. |
| `regions[string]`          | A list of regions to filter by. These must be URL encoded region names separated by commas, e.g. `?regions=Oceania,Americas`.                                                                               |
| `subregions[string]`       | A list of subregions to filter by. These must be URL encoded subregion names separated by commas, e.g. `?subregions=Southern%20Asia,Latin%20America%20and%20the%20Caribbean`                                |
| `institutionTypes[string]` | A list of institution types to filter by. These must be institution types separated by commas, e.g. `?institutionTypes=Education,Facility`                                                                  |
| `countries[string]`        | A list of countries that institutions must belong to. These must 3 letter ISO country codes separated by commas, e.g. `?countries=NZL,AUS`                                                                  |
| `minNOutputs[number]`      | The minimum inclusive number of outputs an institution must have to be returned. Default value of 1000.                                                                                                     |
| `maxNOutputs[number]`      | The maximum inclusive number of outputs an institution must have to be returned. Default value of Number.MAX_VALUE.                                                                                         |
| `minPOutputsOpen[number]`  | The minimum inclusive open access percentage an institution must have to be returned. Default value of 0.                                                                                                   |
| `maxPOutputsOpen[number]`  | The maximum inclusive open access percentage an institution must have to be returned. Default value of 100.                                                                                                 |

Query Parameter enumerations:

| Query Parameter    | Enumerations                                                                                                                                                                                                                                                                                        |
|:-------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `orderDir`         | asc, dsc.                                                                                                                                                                                                                                                                                           |
| `ids`              | Any ROR id from: https://ror.org/ with "https://ror.org/" removed from the ID.                                                                                                                                                                                                                      |
| `institutionTypes` | Education, Healthcare, Company, Archive, Nonprofit, Government, Facility, Other.                                                                                                                                                                                                                    |
| `regions`          | Africa, Americas, Asia, Europe and Oceania.                                                                                                                                                                                                                                                         |
| `subregions`       | Australia and New Zealand, Central Asia, Eastern Asia, Eastern Europe, Latin America and the Caribbean, Melanesia, Micronesia, Northern Africa, Northern America, Northern Europe, Polynesia, South-eastern Asia, Southern Asia, Southern Europe, Sub-Saharan Africa, Western Asia, Western Europe. |
| `countries`        | 3 letter ISO country codes.                                                                                                                                                                                                                                                                         |
#### Sample Request
```bash
curl "https://api.coki.ac/institutions?page=0&regions=Oceania&institutionTypes=Facility"
```

#### Sample Response
```json
{
  "items": [
    {
      "id": "030cszc07",
      "name": "Australian Astronomical Observatory",
      "logo_sm": "logos/institution/sm/030cszc07.jpg",
      "entity_type": "institution",
      "country_name": "Australia",
      "country_code": "AUS",
      "subregion": "Australia and New Zealand",
      "region": "Oceania",
      "institution_type": "Facility",
      "stats": {
        "n_outputs": 1243,
        "n_outputs_open": 1113,
        "p_outputs_open": 89.54143201930812,
        "p_outputs_publisher_open_only": 3,
        "p_outputs_both": 48,
        "p_outputs_other_platform_open_only": 39,
        "p_outputs_closed": 10
      }
    },
    {
      "id": "05qajvd42",
      "name": "Australia Telescope National Facility",
      "logo_sm": "logos/institution/sm/05qajvd42.jpg",
      "entity_type": "institution",
      "country_name": "Australia",
      "country_code": "AUS",
      "subregion": "Australia and New Zealand",
      "region": "Oceania",
      "institution_type": "Facility",
      "stats": {
        "n_outputs": 1742,
        "n_outputs_open": 1493,
        "p_outputs_open": 85.7060849598163,
        "p_outputs_publisher_open_only": 9,
        "p_outputs_both": 42,
        "p_outputs_other_platform_open_only": 35,
        "p_outputs_closed": 14
      }
    },
    {
      "id": "03dsbfb14",
      "name": "Australian Institute of Tropical Health and Medicine",
      "logo_sm": "logos/institution/sm/03dsbfb14.jpg",
      "entity_type": "institution",
      "country_name": "Australia",
      "country_code": "AUS",
      "subregion": "Australia and New Zealand",
      "region": "Oceania",
      "institution_type": "Facility",
      "stats": {
        "n_outputs": 1011,
        "n_outputs_open": 741,
        "p_outputs_open": 73.29376854599407,
        "p_outputs_publisher_open_only": 7,
        "p_outputs_both": 55,
        "p_outputs_other_platform_open_only": 11,
        "p_outputs_closed": 27
      }
    },
    ...
  ],
  "nItems": 21,
  "page": 0,
  "limit": 18,
  "orderBy": "stats.p_outputs_open",
  "orderDir": "dsc"
}
```

## 6. Contributors
**Conceptualization:** James P. Diprose, Lucy Montgomery, Cameron Neylon, and Richard Hosking.<br />
**Graphic design:** Richard Rigoni.<br />
**Data curation:** James P. Diprose and Richard Hosking.<br />
**Formal analysis:** James P. Diprose, Cameron Neylon, and Richard Hosking.<br />
**Funding acquisition:** Lucy Montgomery and Cameron Neylon.<br />
**Investigation:** James P. Diprose.<br />
**Methodology:** James P. Diprose.<br />
**Project administration:** Lucy Montgomery, Cameron Neylon, and Kathryn R. Napier.<br />
**Resources:** James P. Diprose.<br />
**Software:** James P. Diprose and Aniek Roelofs.<br />
**Supervision:** James P. Diprose, Lucy Montgomery, Cameron Neylon, and Kathryn R. Napier.<br />
**Visualization:** James P. Diprose, Cameron Neylon and Richard Regoni.<br />
**Writing - original draft:** James P. Diprose, Lucy Montgomery, Cameron Neylon, and Richard Hosking.<br />
**Writing - review & editing:** Cameron Neylon, Kathryn R. Napier, Richard Hosking, Katie S. Wilson, and Tuan-Yow Chien.<br />

## 7. License
[Apache 2.0 License](https://github.com/The-Academic-Observatory/coki-oa-web/blob/develop/LICENSE)