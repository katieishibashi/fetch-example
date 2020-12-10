# fetch-example
Welcome! This is a code challenge I completed, wherein I had to had to use [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) to take in data from a certain endpoint and transform the response. 

##The task:
1. Pull data from the `/records` at, processing pages of 10 items at a time
2. Provide a simple `console.log` in the event of an error and recover.
3. Transform the payload you receive into an object with the following keys:
 - ids: An array containing the ids of all items returned from the request.
 - open: An array containing all of the items returned from the request that have a disposition value of "open". Add a fourth key to each item called isPrimary indicating whether or not the item contains a primary color (red, blue, or yellow).
 - closedPrimaryCount: The total number of items returned from the request that have a disposition value of "closed" and contain a primary color.
 - previousPage: The page number for the previous page of results, or null if this is the first page.
 - nextPage: The page number for the next page of results, or null if this is the last page.
4. Return a promise from retrieve that resolves with the transformed data.
