# COKI Open Access Web
COKI Open Access Web is the [Next.js](https://nextjs.org/) based front end for the Curtin Open Knowledge Initiative's
Open Access Dashboard: [open.coki.ac](https://open.coki.ac/)

## OS pre-requisites
* Linux, Windows or MacOS.
* NodeJS: https://nodejs.org/en/
* yarn: https://classic.yarnpkg.com/lang/en/docs/install
* Prettier code formatter: https://prettier.io/

## Preparing Data Files
The data for the COKI OA Website is generated by the [oa_web_workflow](https://github.com/The-Academic-Observatory/academic-observatory-workflows/blob/develop/academic_observatory_workflows/workflows/oa_web_workflow.py).
Apache Airflow workflow. This workflow needs to be run first to produce the data files that will be visualised by the 
website. Normally the following steps are performed automatically by the workflow when the website is built and 
deployed, however, during development this needs to be done manually.

Create a .env file in the root of the project, customising the path to point to the data folder output by the 
Airflow oa_web_workflow:
```bash
DATA_PATH=C:\path\to\oa_web_workflow_2022_02_01\build\data
```

Copy the following files and folders into the `public` directory:
* `oa_web_workflow_2022_02_01\build\data\logos` -> `coki-oa-web\public\logos`
* `oa_web_workflow_2022_02_01\build\data\autocomplete.json` -> `coki-oa-web\public\data\autocomplete.json`
* `oa_web_workflow_2022_02_01\build\data\country.json` -> `coki-oa-web\public\data\country.json`
* `oa_web_workflow_2022_02_01\build\data\institution.json` -> `coki-oa-web\public\data\institution.json`

## Running Development Server
Run the development server:
```bash
yarn dev
```

Then, open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Build & Deploy
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

[env.dev]
workers_dev = true

[env.staging]
workers_dev = true

[env.prod]
route = "my-production-domain/*"
```

Deploy to develop:
```bash
wrangler publish -e dev
```

Deploy to staging:
```bash
wrangler publish -e staging
```

Deploy to production:
```bash
wrangler publish -e production
```
