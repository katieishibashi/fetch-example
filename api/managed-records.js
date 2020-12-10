import URI from 'urijs';
import fetch from '../util/fetch-fill';

// /records endpoint
window.path = 'http://localhost:3000/records';

// Your retrieve function plus any additional functions go here ...
// ^^ Here they are!
// No particular instructions from me - all tests pass, all my code is in this file.

// The most records we should pull at one time
const limitNum = 10;

// Determine if we're dealing with a primary color
const isPrimaryColor = {
  red: true,
  brown: false,
  blue: true,
  yellow: true,
  green: false,
};

function generateUri(page, colors) {
// Set the number of results we want at any one time
  // Calculate the appropriate offset
  const offset = page === 1 ? 0 : (page - 1) * limitNum;
  // Generate the URI we want.
  // We're actually pulling limitNum + 1 so that if there is no limitNum + 1, we'll know we hit the last record.
  const uriWithParams = URI(window.path).search({ limit: limitNum + 1, offset, 'color[]': colors });
  // We actually want to pass the param "color[]" and URI generates a browser-safe option by default, so let's decode this
  return URI.decode(uriWithParams);
}

function parseData(data, page) {
  const ids = [];
  const open = [];
  let closedPrimaryCount = 0;
  // The previous page is the current page -1 , unless the current page is 0
  const previousPage = page === 1 ? null : page - 1;
  // If data isn't an empty object, and this doesn't contain the final records, we should have
  // limitNum +1 items. Otherwise, nextPage is null
  let nextPage = null;
  if (data.length === limitNum + 1) {
    // Get rid of the extra record we don't need
    data.pop();
    // nextPage must exist
    nextPage = page + 1;
  }

  // Loop through the entries to populate our response.
  data.forEach((item) => {
    // Add the id to our Ids array
    ids.push(item.id);
    // If it's open, add it to the open array and give it the isPrimary key
    if (item.disposition === 'open') {
      const updatedItem = item;
      updatedItem.isPrimary = isPrimaryColor[updatedItem.color];
      open.push(updatedItem);
    }
    // Increment closedPrimaryCount if it's closed and contains a primary color
    else if (isPrimaryColor[item.color]) {
      closedPrimaryCount += 1;
    }
  });
  return {
    previousPage, nextPage, ids, open, closedPrimaryCount,
  };
}

function retrieve({ page = 1, colors = ['red', 'brown', 'blue', 'yellow', 'green'] } = {}) {
  const searchUri = generateUri(page, colors);
  const results = fetch(searchUri)
    .then((resp) => {
      if (!resp.ok) {
        // Throw an error if there's a problem
        throw Error(resp.statusText);
      } else {
        // Otherwise, give us the data as json
        return resp.json();
      }
    })
    .then((data) => {
      const parsedData = parseData(data, page);
      return parsedData;
    })
    .catch((error) => {
      console.log("There's an error", error);
    });
  return results;
}

export default retrieve;
