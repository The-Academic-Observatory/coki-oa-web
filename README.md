# COKI Open Access Website
COKI Open Access Website is the [Next.js](https://nextjs.org/) based front end and Cloudflare Workers backend for the Curtin 
Open Knowledge Initiative's Open Access Dashboard: [open.coki.ac](https://open.coki.ac/)

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Next JS](https://img.shields.io/badge/Next-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?logo=Cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![e2e Tests](https://github.com/The-Academic-Observatory/coki-oa-web/actions/workflows/e2e-tests.yml/badge.svg)](https://github.com/The-Academic-Observatory/coki-oa-web/actions/workflows/e2e-tests.yml)
[![Workers API Unit Tests](https://github.com/The-Academic-Observatory/coki-oa-web/actions/workflows/workers-api-unit-tests.yml/badge.svg)](https://github.com/The-Academic-Observatory/coki-oa-web/actions/workflows/workers-api-unit-tests.yml)
[![DOI](https://zenodo.org/badge/430557646.svg)](https://zenodo.org/badge/latestdoi/430557646)

1. [Requirements](#1-requirements)
2. [Web App Development](#2-web-app-development)
3. [REST API Development](#3-rest-api-development)
4. [Configuring Github Actions](#4-configuring-github-actions)
5. [REST API Endpoints](#5-rest-api-endpoints)
6. [Contributors](#6-contributors)
7. [License](#7-license)

## 1. Requirements
### OS Requirements
* Linux, Windows or MacOS.
* NodeJS 16: https://nodejs.org/en/
* yarn: https://classic.yarnpkg.com/lang/en/docs/install
* Prettier code formatter: https://prettier.io/
* Wrangler 2: 

### Preparing Data Files
The data for the COKI OA Website is generated by the [oa_web_workflow](https://github.com/The-Academic-Observatory/academic-observatory-workflows/blob/develop/academic_observatory_workflows/workflows/oa_web_workflow.py).
Apache Airflow workflow. This workflow needs to be run first to produce the data files that will be visualised by the 
website. Normally the following steps are performed automatically by the workflow when the website is built and 
deployed, however, during development this needs to be done manually.

From the Google Cloud Storage bucket, download the `v2/latest.zip` file, saving it in the root of the project.

Run the `data.sh` script, which will extract the data files and copy them to the right places 
(this will also run on Windows).

## 2. Web App Development
See below for instructions specific to running the web application.

### Install Wrangler 2
```bash
npm install -g wrangler
```

Check that version 2 is installed:
```bash
wrangler --version
```

### Install dependencies
```bash
yarn install
```

### Running Development Server
Run the development server:
```bash
yarn dev
```

Then, open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Running tests
Runs playwright end-to-end tests:
```bash
yarn test:e2e
```

### Build & Deploy
Export environment variables, customising the host name:
```bash
export DATA_PATH=./latest/data
export NEXT_PUBLIC_HOST=https://develop.open.coki.ac
export NEXT_PUBLIC_API_HOST=https://develop.open.coki.ac
```

Build site:
```bash
yarn build
```

Export site:
```bash
yarn export
```

Customise your wrangler.toml file: see wrangler.example.toml.

Deploy to develop:
```bash
wrangler publish -e develop
```

Deploy to staging:
```bash
wrangler publish -e staging
```

Deploy to production:
```bash
wrangler publish -e production
```

## 3. REST API Development
See below for instructions specific to running the workers-api REST API.

### Install dependencies
Make sure to enter the workers-api folder and install dependencies:
```bash
cd workers-api
yarn install
```

### Running Development Server
Run the development server. This uses [Miniflare](https://miniflare.dev/) to simulate Cloudflare Workers functionality.
```bash
yarn dev
```

Then, open [http://127.0.0.1:8787/api/search/curtin](http://127.0.0.1:8787/api/search/curtin) with your browser or CURL
to see the result of an API call.

### Running tests
Runs [Jest](https://jestjs.io/) unit tests:
```bash
yarn test:e2e
```

### Build & Deploy
Customise your wrangler.toml file: see workers-api/wrangler.example.toml.

Build & deploy to develop:
```bash
wrangler publish -e develop
```

Build & deploy to staging:
```bash
wrangler publish -e staging
```

Build & deploy to production:
```bash
wrangler publish -e production
```

### Rendering Twitter Cards
This will be removed when card generation is performed by the workflow.

To render the cards:
```bash
cd ./twitter-cards
PUPPETEER_PRODUCT=firefox yarn install
yarn render
```

The Twitter cards are saved in `public/twitter`.
* Make a zip file of the twitter folder.
* Upload it to the `coki-oa-web-data` Google Cloud Storage Bucket. The cards will then be
built into the latest.zip file by the Airflow workflow.

To manually view the Twitter cards, start the local webserver and navigate to the following routes:
* /twitter-country/[COUNTRY ID]
* /twitter-institution/[ROR ID]

## 4. Configuring Github Actions
The following Github Secrets need to be created:

* GCP_CREDENTIALS: credentials for gsutil.
* BUCKET_NAME: the name of the Google Cloud Storage bucket that contains the data files.
* WRANGLER_CONFIG: the Cloudflare Wrangler configuration file.
* WRANGLER_CONFIG_API: the Cloudflare Wrangler configuration file for the workers-api Cloudflare Worker.
* CF_API_TOKEN: the Cloudflare API Token.

See below for instructions on how to set these up.

### wrangler.toml
Two wrangler.toml files need to be created, one for the Web App Cloudflare Worker and one for the API Cloudflare Worker.

For the web app, see the wrangler.example.toml file for an example of how to create the wrangler.toml file. Add the file 
to the WRANGLER_CONFIG Github Secret.

For the API, see workers-api/wrangler.example.toml file for an example of how to create the wrangler.toml file. Add the
file to the WRANGLER_CONFIG_API Github Secret.

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
The COKI Open Access Web REST API can be used to search and filter countries and institutions.

### Search
Search for countries and institutions by name.

``GET /api/search/:text``

| Parameter | Description                                                                     |
|:----------|---------------------------------------------------------------------------------|
| `:text`   | The url encoded name or partial name of a country or institution to search for. |

#### Sample Request
```bash
curl https://open.coki.ac/api/search/curtin%20university
```

#### Sample Response
```json
[
  {
    "id": "02n415q13",
    "name": "Curtin University",
    "logo_s": "/logos/institution/s/02n415q13.jpg",
    "category": "institution",
    "country_code": "AUS",
    "country_name": "Australia",
    "subregion": "Australia and New Zealand",
    "region": "Oceania",
    "institution_types": [
      "Education"
    ],
    "n_outputs": 42938,
    "n_outputs_open": 18388,
    "p_outputs_open": 42.824537705528904,
    "p_outputs_publisher_open_only": 8,
    "p_outputs_both": 16,
    "p_outputs_other_platform_open_only": 19,
    "p_outputs_closed": 57
  }
]
```

### Country
Return a paginated list of countries and optionally filter them.

`GET /api/country`

The country endpoint uses optional query parameters rather than path parameters.

| Query Parameter           | Description                                                                                                                                                                  |
|:--------------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `page[number]`            | The page number starting at 0. Default value of 0.                                                                                                                           |
| `limit[number]`           | The number of items per page. Default value of 18.                                                                                                                           |
| `orderBy[string]`         | What field to order the results by. Default value of `p_outputs_open`.                                                                                                       |
| `orderDir[string]`        | What direction to sort results, either ascending `asc` or descending `dsc`. Default value of `dsc`.                                                                          |
| `ids[string]`             | A list of 3 letter ISO country codes to return specific countries, separated by commas, e.g. `?ids=AUS,NZL`. This parameter overrides all other parameters.                  |
| `regions[string]`         | A list of regions to filter by. These must be URL encoded region names separated by commas, e.g. `?regions=Oceania,Americas`.                                                |
| `subregions[string]`      | A list of subregions to filter by. These must be URL encoded subregion names separated by commas, e.g. `?subregions=Southern%20Asia,Latin%20America%20and%20the%20Caribbean` |
| `minNOutputs[number]`     | The minimum inclusive number of outputs a country must have to be returned. Default value of 1000.                                                                           |
| `maxNOutputs[number]`     | The maximum inclusive number of outputs a country must have to be returned. Default value of Number.MAX_VALUE.                                                               |
| `minPOutputsOpen[number]` | The minimum inclusive open access percentage a country must have to be returned. Default value of 0.                                                                         |
| `maxPOutputsOpen[number]` | The maximum inclusive open access percentage a country must have to be returned. Default value of 100.                                                                       |

Query Parameter enumerations:

| Query Parameter | Enumerations                                                                                                                                                                                                                                                                                        |
|:----------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `orderDir`      | asc, dsc.                                                                                                                                                                                                                                                                                           |
| `ids`           | TODO                                                                                                                                                                                                                                                                                                |
| `regions`       | Africa, Americas, Asia, Europe and Oceania.                                                                                                                                                                                                                                                         |
| `subregions`    | Australia and New Zealand, Central Asia, Eastern Asia, Eastern Europe, Latin America and the Caribbean, Melanesia, Micronesia, Northern Africa, Northern America, Northern Europe, Polynesia, South-eastern Asia, Southern Asia, Southern Europe, Sub-Saharan Africa, Western Asia, Western Europe. |

#### Sample Request
```bash
curl "https://open.coki.ac/api/country?page=0&regions=Oceania"
```

#### Sample Response
```json
{
  "items": [
    {
      "id": "PNG",
      "name": "Papua New Guinea",
      "logo_s": "/logos/country/s/PNG.svg",
      "category": "country",
      "subregion": "Melanesia",
      "region": "Oceania",
      "n_outputs": 1964,
      "n_outputs_open": 1022,
      "p_outputs_open": 52.0366598778004,
      "p_outputs_publisher_open_only": 12,
      "p_outputs_both": 29,
      "p_outputs_other_platform_open_only": 11,
      "p_outputs_closed": 48
    },
    {
      "id": "AUS",
      "name": "Australia",
      "logo_s": "/logos/country/s/AUS.svg",
      "category": "country",
      "subregion": "Australia and New Zealand",
      "region": "Oceania",
      "n_outputs": 1397124,
      "n_outputs_open": 556603,
      "p_outputs_open": 39.839198238667436,
      "p_outputs_publisher_open_only": 10,
      "p_outputs_both": 17,
      "p_outputs_other_platform_open_only": 13,
      "p_outputs_closed": 60
    },
    {
      "id": "NZL",
      "name": "New Zealand",
      "logo_s": "/logos/country/s/NZL.svg",
      "category": "country",
      "subregion": "Australia and New Zealand",
      "region": "Oceania",
      "n_outputs": 214072,
      "n_outputs_open": 75871,
      "p_outputs_open": 35.44181396913188,
      "p_outputs_publisher_open_only": 11,
      "p_outputs_both": 15,
      "p_outputs_other_platform_open_only": 10,
      "p_outputs_closed": 64
    },
    ...
  ],
  "nItems": 4,
  "page": 0,
  "limit": 18,
  "orderBy": "p_outputs_open",
  "orderDir": "dsc"
}
```

### Institution
Return a paginated list of institutions and optionally filter them.

`GET /api/institution`

The institution endpoint uses optional query parameters rather than path parameters.

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
| `countries[string]`        | A list of 3 letter ISO codes to filter by institutions by country, separated by commas, e.g. `?countries=AUS,NZL`                                                                                           |
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
| `countries`        |                                                                                                                                                                                                                                                                                                     |

#### Sample Request
```bash
curl "https://open.coki.ac/api/institution?page=0&regions=Oceania&institutionTypes=Facility"
```

#### Sample Response
```json
{
  "items": [
    {
      "id": "030cszc07",
      "name": "Australian Astronomical Observatory",
      "logo_s": "/logos/institution/s/030cszc07.jpg",
      "category": "institution",
      "country_code": "AUS",
      "country_name": "Australia",
      "subregion": "Australia and New Zealand",
      "region": "Oceania",
      "institution_types": [
        "Facility"
      ],
      "n_outputs": 1243,
      "n_outputs_open": 1113,
      "p_outputs_open": 89.54143201930812,
      "p_outputs_publisher_open_only": 3,
      "p_outputs_both": 48,
      "p_outputs_other_platform_open_only": 39,
      "p_outputs_closed": 10
    },
    {
      "id": "05qajvd42",
      "name": "Australia Telescope National Facility",
      "logo_s": "/logos/institution/s/05qajvd42.jpg",
      "category": "institution",
      "country_code": "AUS",
      "country_name": "Australia",
      "subregion": "Australia and New Zealand",
      "region": "Oceania",
      "institution_types": [
        "Facility"
      ],
      "n_outputs": 1742,
      "n_outputs_open": 1493,
      "p_outputs_open": 85.7060849598163,
      "p_outputs_publisher_open_only": 9,
      "p_outputs_both": 42,
      "p_outputs_other_platform_open_only": 35,
      "p_outputs_closed": 14
    },
    {
      "id": "03dsbfb14",
      "name": "Australian Institute of Tropical Health and Medicine",
      "logo_s": "/logos/institution/s/03dsbfb14.jpg",
      "category": "institution",
      "country_code": "AUS",
      "country_name": "Australia",
      "subregion": "Australia and New Zealand",
      "region": "Oceania",
      "institution_types": [
        "Facility"
      ],
      "n_outputs": 1011,
      "n_outputs_open": 741,
      "p_outputs_open": 73.29376854599407,
      "p_outputs_publisher_open_only": 7,
      "p_outputs_both": 55,
      "p_outputs_other_platform_open_only": 11,
      "p_outputs_closed": 27
    },
    ...
  ],
  "nItems": 21,
  "page": 0,
  "limit": 18,
  "orderBy": "p_outputs_open",
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