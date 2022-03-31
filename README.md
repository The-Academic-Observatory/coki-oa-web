# COKI Open Access Web
COKI Open Access Web is the [Next.js](https://nextjs.org/) based front end and Cloudflare Workers backend for the Curtin 
Open Knowledge Initiative's Open Access Dashboard: [open.coki.ac](https://open.coki.ac/)

[![DOI](https://zenodo.org/badge/430557646.svg)](https://zenodo.org/badge/latestdoi/430557646)

## OS pre-requisites
* Linux, Windows or MacOS.
* NodeJS 16: https://nodejs.org/en/
* yarn: https://classic.yarnpkg.com/lang/en/docs/install
* Prettier code formatter: https://prettier.io/

## Preparing Data Files
The data for the COKI OA Website is generated by the [oa_web_workflow](https://github.com/The-Academic-Observatory/academic-observatory-workflows/blob/develop/academic_observatory_workflows/workflows/oa_web_workflow.py).
Apache Airflow workflow. This workflow needs to be run first to produce the data files that will be visualised by the 
website. Normally the following steps are performed automatically by the workflow when the website is built and 
deployed, however, during development this needs to be done manually.

Create a .env file in the root of the project:
```bash
DATA_PATH=./latest/data
```

From the Google Cloud Storage bucket, download the `v2/latest.zip` file, saving it in the root of the project.

Run the `data.sh` script, which will extract the data files and copy them to the right places 
(this will also run on Windows).

## Web App Development
See below for instructions specific to running the web application.

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
Runs playwright end to end tests:
```bash
yarn test:e2e
```

### Build & Deploy
Build site:
```bash
yarn build
```

Export site:
```bash
next export
```

Customise your wrangler.toml file, see wrangler.toml.example:
```toml
name = "coki-oa-web"
type = "webpack"
account_id = "my-cloudflare-account-id"
zone_id = "my-cloudflare-zone-id"
compatibility_date = "2022-02-03"

[site]
bucket = "out"
entry-point = "workers-site"

[env.develop]
route = "my-develop-domain/*"
vars = { ANALYTICS_ENABLED = false }

[env.staging]
route = "my-staging-domain/*"
vars = { ANALYTICS_ENABLED = false }

[env.production]
route = "my-production-domain/*"
vars = { ANALYTICS_ENABLED = true }
```

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

## REST API Development
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
Customise your wrangler.toml file, see wrangler.toml.example:
```toml
name = "coki-oa-web-api"
type = "javascript"
account_id = "my-cloudflare-account-id"
zone_id = "my-cloudflare-zone-id"
compatibility_date = "2022-02-03"

[build]
command = "yarn run build"

[build.upload]
format = "modules"
dir = "dist"
main = "./index.mjs"

[[build.upload.rules]]
type = "ESModule"
globs = ["**/*.mjs"]

[env.develop]
route = "my-develop-domain/api*"

[env.staging]
route = "my-staging-domain/api*"

[env.production]
route = "my-production-domain/api*"

[miniflare]
durable_objects_persist = true
```

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

## Configuring Github Actions
The following Github Secrets need to be created:

* GCP_CREDENTIALS: credentials for gsutil.
* BUCKET_NAME: the name of the Google Cloud Storage bucket that contains the data files.
* WRANGLER_CONFIG: the Cloudflare Wrangler configuration file.
* WRANGLER_CONFIG_API: the Cloudflare Wrangler configuration file for the workers-api Cloudflare Worker.
* CF_API_TOKEN: the Cloudflare API Token.

See below for instructions on how to set these up.

### wrangler.toml
Two wrangler.toml files need to be created, one for the Web App Cloudflare Worker and one for the API Cloudflare Worker.

For the web app, see the wrangler.toml.example file for an example of how to create the wrangler.toml file. Add the file 
to the WRANGLER_CONFIG Github Secret.

For the API, see workers-api/wrangler.toml.example file for an example of how to create the wrangler.toml file. Add the
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

# REST API Endpoints
The COKI Open Access Web REST API can be used to search and filter countries and institutions.

## Search
Search for countries and institutions by name.

``GET /api/search/:text``

| Parameter | Description                                                                     |
|:----------|---------------------------------------------------------------------------------|
| `:text`   | The url encoded name or partial name of a country or institution to search for. |

### Sample Request
```bash
curl https://open.coki.ac/api/search/curtin%20university
```

### Sample Response
```json
[
  {
    "id": "02n415q13",
    "name": "Curtin University",
    "logo_s": "/logos/institution/s/02n415q13.jpg",
    "category": "institution",
    "country": "Australia",
    "subregion": "Australia and New Zealand",
    "region": "Oceania",
    "institution_types": [
      "Education"
    ],
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
]
```

## Countries
Return a paginated list of countries and optionally filter them.

`GET /api/countries`

The countries endpoint uses optional query parameters rather than path parameters.

| Query Parameter           | Description                                                                                                                                                                   |
|:--------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `page[number]`            | The page number starting at 0. Default value of 0.                                                                                                                            |
| `limit[number]`           | The number of items per page. Default value of 18.                                                                                                                            |
| `orderBy[string]`         | What field to order the results by, nested fields are supported. Default value of `stats.p_outputs_open`.                                                                     |
| `orderDir[string]`        | What direction to sort results, either ascending `asc` or descending `dsc`. Default value of `dsc`.                                                                           |
| `regions[string]`         | A list of regions to filter by. These must be URL encoded region names separated by commas, e.g. `?regions=Oceania,Americas`.                                                 |
| `subregions[string]`      | A list of subregions to filter by. These must be URL encoded subregion names separated by commas, e.g. `?subregions=Southern%20Asia,Latin%20America%20and%20the%20Caribbean`  |
| `minNOutputs[number]`     | The minimum inclusive number of outputs a country must have to be returned. Default value of 1000.                                                                            |
| `maxNOutputs[number]`     | The maximum inclusive number of outputs a country must have to be returned. Default value of Number.MAX_VALUE.                                                                |
| `minPOutputsOpen[number]` | The minimum inclusive open access percentage a country must have to be returned. Default value of 0.                                                                          |
| `maxPOutputsOpen[number]` | The maximum inclusive open access percentage a country must have to be returned. Default value of 100.                                                                        |

Query Parameter enumerations:

| Query Parameter  | Enumerations                                                                                                                                                                                                                                                                                        |
|:-----------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `orderDir`       | asc, dsc.                                                                                                                                                                                                                                                                                           |
| `regions`        | Africa, Americas, Asia, Europe and Oceania.                                                                                                                                                                                                                                                         |
| `subregions`     | Australia and New Zealand, Central Asia, Eastern Asia, Eastern Europe, Latin America and the Caribbean, Melanesia, Micronesia, Northern Africa, Northern America, Northern Europe, Polynesia, South-eastern Asia, Southern Asia, Southern Europe, Sub-Saharan Africa, Western Asia, Western Europe. |

### Sample Request
```bash
curl https://open.coki.ac/api/countries?page=0&regions=Oceania
```

### Sample Response
```json
[
  {
    "id": "PNG",
    "name": "Papua New Guinea",
    "logo_s": "/logos/country/s/PNG.svg",
    "category": "country",
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
    "logo_s": "/logos/country/s/AUS.svg",
    "category": "country",
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
    "logo_s": "/logos/country/s/NZL.svg",
    "category": "country",
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
]
```

## Institutions
Return a paginated list of institutions and optionally filter them.

`GET /api/institutions`

The institutions endpoint uses optional query parameters rather than path parameters.

| Query Parameter            | Description                                                                                                                                                                   | 
|:---------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `page[number]`             | The page number starting at 0. Default value of 0.                                                                                                                            |
| `limit[number]`            | The number of items per page. Default value of 18.                                                                                                                            |
| `orderBy[string]`          | What field to order the results by, nested fields are supported. Default value of `stats.p_outputs_open`.                                                                     |
| `orderDir[string]`         | What direction to sort results, either ascending `asc` or descending `dsc`. Default value of `dsc`.                                                                           |
| `regions[string]`          | A list of regions to filter by. These must be URL encoded region names separated by commas, e.g. `?regions=Oceania,Americas`.                                                 |
| `subregions[string]`       | A list of subregions to filter by. These must be URL encoded subregion names separated by commas, e.g. `?subregions=Southern%20Asia,Latin%20America%20and%20the%20Caribbean`  |
| `institutionTypes[string]` | A list of institution types to filter by. These must be institution types separated by commas, e.g. `?institutionTypes=Education,Facility`                                    |
| `countries[string]`        | A list of countries that institutions must belong to. These must be URL encoded country names separated by commas, e.g. `?countries=New%20Zealand,Australia`                  |
| `minNOutputs[number]`      | The minimum inclusive number of outputs an institution must have to be returned. Default value of 1000.                                                                       |
| `maxNOutputs[number]`      | The maximum inclusive number of outputs an institution must have to be returned. Default value of Number.MAX_VALUE.                                                           |
| `minPOutputsOpen[number]`  | The minimum inclusive open access percentage an institution must have to be returned. Default value of 0.                                                                     |
| `maxPOutputsOpen[number]`  | The maximum inclusive open access percentage an institution must have to be returned. Default value of 100.                                                                   |

Query Parameter enumerations:

| Query Parameter    | Enumerations                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
|:-------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `orderDir`         | asc, dsc.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `institutionTypes` | Education, Healthcare, Company, Archive, Nonprofit, Government, Facility, Other.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `regions`          | Africa, Americas, Asia, Europe and Oceania.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `subregions`       | Australia and New Zealand, Central Asia, Eastern Asia, Eastern Europe, Latin America and the Caribbean, Melanesia, Micronesia, Northern Africa, Northern America, Northern Europe, Polynesia, South-eastern Asia, Southern Asia, Southern Europe, Sub-Saharan Africa, Western Asia, Western Europe.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `countries`        | Afghanistan, Albania, Algeria, American Samoa, Andorra, Angola, Anguilla, Antarctica, Antigua and Barbuda, Argentina, Armenia, Aruba, Australia, Austria, Azerbaijan, Bahrain, Bangladesh, Barbados, Belarus, Belgium, Belize, Benin, Bermuda, Bhutan, Bolivia, Bonaire, Bosnia and Herzegovina, Botswana, Bouvet Island, Brazil, British Indian Ocean Territory, Brunei, Bulgaria, Burkina Faso, Burundi, Cabo Verde, Cambodia, Cameroon, Canada, Cayman Islands, Central African Republic, Chad, Chile, China, Christmas Island, Cocos (Keeling) Islands, Colombia, Comoros, Cook Islands, Costa Rica, Croatia, Cuba, Curaçao, Cyprus, Czech Republic, Democratic Republic of the Congo, Denmark, Djibouti, Dominica, Dominican Republic, East Timor, Ecuador, Egypt, El Salvador, Equatorial Guinea, Eritrea, Estonia, Eswatini, Ethiopia, Falkland Islands, Faroe Islands, Fiji, Finland, France, French Guiana, French Polynesia, French Southern and Antarctic Lands, Gabon, Georgia, Germany, Ghana, Gibraltar, Greece, Greenland, Grenada, Guadeloupe, Guam, Guatemala, Guernsey, Guinea, Guinea-Bissau, Guyana, Haiti, Heard Island and McDonald Islands, Holy See, Honduras, Hong Kong, Hungary, Iceland, India, Indonesia, Iran, Iraq, Ireland, Isle of Man, Israel, Italy, Ivory Coast, Jamaica, Japan, Jersey, Jordan, Kazakhstan, Kenya, Kiribati, Kuwait, Kyrgyzstan, Laos, Latvia, Lebanon, Lesotho, Liberia, Libya, Liechtenstein, Lithuania, Luxembourg, Macau, Madagascar, Malawi, Malaysia, Maldives, Mali, Malta, Marshall Islands, Martinique, Mauritania, Mauritius, Mayotte, Mexico, Micronesia, Moldova, Monaco, Mongolia, Montenegro, Montserrat, Morocco, Mozambique, Myanmar, Namibia, Nauru, Nepal, Netherlands, New Caledonia, New Zealand, Nicaragua, Niger, Nigeria, Niue, Norfolk Island, North Korea, North Macedonia, Northern Mariana Islands, Norway, Oman, Pakistan, Palau, Palestine, Panama, Papua New Guinea, Paraguay, Peru, Philippines, Pitcairn Islands, Poland, Portugal, Puerto Rico, Qatar, Republic of the Congo, Romania, Russia, Rwanda, Réunion, Saint Barthélemy, Saint Helena, Saint Kitts and Nevis, Saint Lucia, Saint Martin (island), Saint Pierre and Miquelon, Saint Vincent and the Grenadines, Samoa, San Marino, Saudi Arabia, Senegal, Serbia, Seychelles, Sierra Leone, Singapore, Sint Maarten, Slovakia, Slovenia, Solomon Islands, Somalia, South Africa, South Georgia and the South Sandwich Islands, South Korea, South Sudan, Spain, Sri Lanka, Sudan, Suriname, Svalbard and Jan Mayen, Sweden, Switzerland, Syria, São Tomé and Príncipe, Taiwan, Tajikistan, Tanzania, Thailand, The Bahamas, The Gambia, Togo, Tokelau, Tonga, Trinidad and Tobago, Tunisia, Turkey, Turkmenistan, Turks and Caicos Islands, Tuvalu, Uganda, Ukraine, United Arab Emirates, United Kingdom, United States, United States Minor Outlying Islands, United States Virgin Islands, Uruguay, Uzbekistan, Vanuatu, Venezuela, Vietnam, Virgin Islands, Wallis and Futuna, Western Sahara, Yemen, Zambia, Zimbabwe, Åland  |

### Sample Request
```bash
curl https://open.coki.ac/api/institutions?page=0&regions=Oceania&institutionTypes=Facility
```

### Sample Response
```json
[
  {
    "id": "030cszc07",
    "name": "Australian Astronomical Observatory",
    "logo_s": "/logos/institution/s/030cszc07.jpg",
    "category": "institution",
    "country": "Australia",
    "subregion": "Australia and New Zealand",
    "region": "Oceania",
    "institution_types": [
      "Facility"
    ],
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
    "logo_s": "/logos/institution/s/05qajvd42.jpg",
    "category": "institution",
    "country": "Australia",
    "subregion": "Australia and New Zealand",
    "region": "Oceania",
    "institution_types": [
      "Facility"
    ],
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
    "logo_s": "/logos/institution/s/03dsbfb14.jpg",
    "category": "institution",
    "country": "Australia",
    "subregion": "Australia and New Zealand",
    "region": "Oceania",
    "institution_types": [
      "Facility"
    ],
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
]
```

# Contributors
Conceptualization: James P. Diprose, Lucy Montgomery, Cameron Neylon, and Richard Hosking.<br />
Graphic design: Richard Regoni.<br />
Data curation: James P. Diprose and Richard Hosking.<br />
Formal analysis: James P. Diprose, Cameron Neylon, and Richard Hosking.<br />
Funding acquisition: Lucy Montgomery and Cameron Neylon.<br />
Investigation: James P. Diprose.<br />
Methodology: James P. Diprose.<br />
Project administration: Lucy Montgomery, Cameron Neylon, and Kathryn R. Napier.<br />
Resources: James P. Diprose.<br />
Software: James P. Diprose and Aniek Roelofs.<br />
Supervision: James P. Diprose, Lucy Montgomery, Cameron Neylon, and Kathryn R. Napier.<br />
Visualization: James P. Diprose, Cameron Neylon and Richard Regoni.<br />
Writing - original draft: James P. Diprose, Lucy Montgomery, Cameron Neylon, and Richard Hosking.<br />
Writing - review & editing: Cameron Neylon, Kathryn R. Napier, Richard Hosking, Katie S. Wilson, and Tuan-Yow Chien.<br />