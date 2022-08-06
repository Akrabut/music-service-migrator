# Migrate tracks from local folder to Tidal collection

## Prerequisites

* Node installation
* Tidal account, logged in in the web version (listen.tidal.com)
* Your auth token

## Data origins

(Manual scraping of web version)[listen.tidal.com]

### How to get your token

Open devtools when logged in to listen.tidal.com, initiate any outbound request (ex a search), and copy the `authorization` header from the request headers (a Bearer token)
