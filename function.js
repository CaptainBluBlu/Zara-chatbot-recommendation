
let rp = require('request-promise')


function main(params) {
  const { section, colour, bag, clothing, footwear, product } = params;

  // set the value for params section

 
  let query = "";

  if (colour) {
    query = query + colour + " ";
  }

  if (bag) {
    query = query + bag + " ";
  }

  if (clothing) {
    query = query + clothing + " ";
  }

  if (footwear) {
    query = query + footwear + " ";
  }

  if (product) {
    query = query + product + " ";
  }
  

  const options = {
    uri: `https://api.empathy.co/search/v1/query/zara/search?query=${query}&lang=en_GB&start=0&rows=10&section=${section}&store=11755&scope=default&contextualizeEnabled=true&filter=searchSection:${section}&hideOptionalProducts=false&catalogue=31060&warehouse=27052&session=2c09aaf3-22ca-476f-bea2-97a5bd5b31bc&ajax=true`,
    json: true,
  };

  return rp(options).then((res) => {
    let arraySize = res.catalog.content.length
    let recommended = [] //recommended will be the final recommendation list
    let empty = false

    if (arraySize > 3) {
      var randomNums = [
        Math.floor(Math.random() * (arraySize - 1)),
        Math.floor(Math.random() * (arraySize - 1)),
        Math.floor(Math.random() * (arraySize - 1)),
      ];

      //push into recommended
      recommended.push(res.catalog.content[randomNums[0]])
      recommended.push(res.catalog.content[randomNums[1]])
      recommended.push(res.catalog.content[randomNums[2]])
    } else if (arraySize == 0) {
      empty = true;
    } else {
      for (let i = 0; i < arraySize; i++) {
        recommended.push(res.catalog.content[i])
      }
    }

    // Defining the objects here
    let objects = []; //objects will be the final recommendation list with all the necessary info

    recommended.forEach(function (item) {
      let temp = new Object()

      temp.name = item.name
      temp.imgurl = item.imagePreviewUrl
      temp.type = item.kind
      temp.colour = item.color.name
      temp.price = parseInt(item.prices.current.value) / 100;
      temp.url =
        "www.zara.com/my/en/" +
        item.seo.keyword +
        "-p" +
        item.seo.seoProductId +
        ".html";
        

      objects.push(temp)
    });

    let numFound = objects.length

    let searchQuery = `www.zara.com/my/en/search?searchTerm=${query}&section=${section}`

    return { recommendations: { objects, params, numFound, empty, searchQuery } }
  });
}
