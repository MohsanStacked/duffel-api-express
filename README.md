# Duffel Flight Searcher

Brief implementation of the Duffel API to search for for single and return flight offers.

How this works:

1. We target the `https://api.duffel.com/air/offer_requests`
2. We take in the values from the front-end and parse into our internal API
3. Depending on the type of search, the body paramters for the request is adjusted to respect the slice objects for DUFFELs API.
4. We then send the request to Duffel and wait for a response
5. We then parse the response and send it back to the front-end

For more info on Duffel API: https://duffel.com/docs

## Here is a quick demo of this working!

## How to run

1. Clone the repository
2. Run `npm install`
3. touch .env and enter your desired PORT={PORT} and DUFFEL_API_KEY={DUFFEL_API_KEY...}.
4. Run `npm run start`
5. Open your browser and navigate to `http://localhost:{{PORT}}/pages/index.html`
