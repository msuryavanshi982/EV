
const { test } = require('../../HelperData/locationsData');

const fs = require('fs');
var temp_var = fs.readFileSync('location.json')
var locationData = JSON.parse(temp_var);

async function commercialSchema(OBJECT) {
  var prefix1 = "";
  const obj1 = {
    "real:property": {
      "@": {
        id: OBJECT.id,
        displayId: OBJECT.web_ref,
        "xmlns:real": "http://engelvoelkers.com/web-innovation/RealEstateData",
      },
      "real:businessDivision": OBJECT.model,
      "real:offerCategory": OBJECT.listing_type,
      "real:propertyType": OBJECT.property_type,
      "real:shop": {
        "real:userid": "UAE-S-001",
        "real:name": "Engel & Völkers Dubai MMC",
        "real:additionalName": "EV Real Estate Brokerage LLC",
        "real:address": {
          "real:street":
            "Golden Mile Galleria 2, Office 21, Mezzanine Floor, Palm Jumeirah",
          "real:zipcode": 17722,
          "real:city": "Dubai",
          "real:country": {
            "loc:value": {
              "@": {
                "xmlns:loc":
                  "http://engelvoelkers.com/web-innovation/Localization",
                locale: "en",
                origin: "acquisition",
              },
              "#": "United Arab Emirates",
            },
          },
        },
        "real:phone": "+971 4 4223500",
        "real:email": "dubai@engelvoelkers.com",
        "real:www": "www.engelvoelkers.com/dubai",
        "real:dataSecurityUrl":
          "https://www.engelvoelkers.com/en-ae/dubai/privacypolicy/",
      },
      "real:location": {
        "real:address": {
          "real:street": OBJECT.street_name + " " + OBJECT.street_number,
          "real:zipcode": OBJECT.meta.location.postal_code,
          "real:city": "", // * map area api's province
          "real:country": {
            "loc:value": {
              "@": {
                "xmlns:loc":
                  "http://engelvoelkers.com/web-innovation/Localization",
                locale: "en",
                origin: "acquisition",
              },
              "#": "",
            },
          }, // * map area api's country
        },
        "real:region": {
          "loc:value": {
            "@": {
              locale: "en",
              origin: "acquisition",
              "xmlns:loc":
                "http://engelvoelkers.com/web-innovation/Localization",
            },
            "#": "",
          },
        },
        "real:district": {
          "loc:value": {
            "@": {
              locale: "en",
              origin: "acquisition",
              "xmlns:loc":
                "http://engelvoelkers.com/web-innovation/Localization",
            },
            "#": "",
          },
        },
        "real:licenceArea": {
          "loc:value": {
            "@": {
              locale: "en",
              origin: "acquisition",
              "xmlns:loc":
                "http://engelvoelkers.com/web-innovation/Localization",
            },
            "#": "",
          },
        },
        "real:community": "", // * map area api's area
        "real:subCommunity": "",
        "real:geolocation": {
          "@": {
            longitude: OBJECT.map_y_position,
            latitude: OBJECT.map_x_position,
          },
        },
      },
      "real:agent": {
        "real:userid": OBJECT.meta.agent.id,
        "real:name": OBJECT.meta.agent.full_name,
        "real:phone": OBJECT.meta.agent.cell_number,
        "real:email": OBJECT.meta.agent.email,
        "real:www": OBJECT.meta.agent.website_url,
        "real:permitNumber": OBJECT.property_permit,
      },
      "real:profile": {
        "@": {
          language: "en",
          id: OBJECT.id,
          displayId: OBJECT.web_ref,
        },
        "real:title": OBJECT.marketing_heading,
        "real:description": OBJECT.description,
        "real:shop": {
          "real:userid": "UAE-S-001",
          "real:name": "Engel & Völkers",
          "real:additionalName": "",
          "real:address": {
            "real:street":
              "Golden Mile Galleria 2, Office 21, Mezzanine Floor, Palm Jumeirah",
            "real:zipcode": 17722,
            "real:city": "Dubai",
            "real:country": {
              "loc:value": {
                "@": {
                  "xmlns:loc":
                    "http://engelvoelkers.com/web-innovation/Localization",
                  locale: "en",
                  origin: "acquisition",
                },
                "#": "United Arab Emirates",
              },
            },
          },
          "real:phone": "+971 4 4223500",
          "real:email": "dubai@engelvoelkers.com",
          "real:www": "www.engelvoelkers.com/dubai",
          "real:dataSecurityUrl":
            "https://www.engelvoelkers.com/en-ae/dubai/privacypolicy/",
        },
        "real:location": {
          "real:address": {
            "real:street": OBJECT.street_name + " " + OBJECT.street_number,
            "real:zipcode": OBJECT.meta.location.postal_code,
            "real:city": "", // * map area api's province
            "real:country": {
              "loc:value": {
                "@": {
                  "xmlns:loc":
                    "http://engelvoelkers.com/web-innovation/Localization",
                  locale: "en",
                  origin: "acquisition",
                },
                "#": "",
              },
            }, // * map area api's country
          },
          "real:region": {
            "loc:value": {
              "@": {
                locale: "en",
                origin: "acquisition",
                "xmlns:loc":
                  "http://engelvoelkers.com/web-innovation/Localization",
              },
              "#": "",
            },
          },
          "real:district": {
            "loc:value": {
              "@": {
                locale: "en",
                origin: "acquisition",
                "xmlns:loc":
                  "http://engelvoelkers.com/web-innovation/Localization",
              },
              "#": "",
            },
          },
          "real:licenceArea": {
            "loc:value": {
              "@": {
                locale: "en",
                origin: "acquisition",
                "xmlns:loc":
                  "http://engelvoelkers.com/web-innovation/Localization",
              },
              "#": "",
            },
          },
          "real:community": "", // * map area api's area
          "real:subCommunity": "",
          "real:geolocation": {
            "@": {
              longitude: OBJECT.map_y_position,
              latitude: OBJECT.map_x_position,
            },
          },
        },
        "real:media": [],
        "real:virtualTour": {
          "real:uri": OBJECT.virtual_tour,
          "real:embed": "",
        },
        "real:pricing": {
          "real:price": {
            "real:onRequest": false,
            "real:baseValue": {
              "@": { currency: "AED", amount: OBJECT.price },
            },
          },
        },
        "real:areas": {
          // area , suburb
        },
        "real:yearOfConstruction": OBJECT.build_year,
        "real:rooms": {
          "real:bedrooms": OBJECT.bedrooms,
          "real:bathrooms": OBJECT.bathrooms,
        },
        "real:created": OBJECT.created,
        //'real:URL': OBJECT.meta.url
      },
      "real:pricing": {
        "real:price": {
          "real:onRequest": false,
          "real:baseValue": {
            "@": { currency: "AED", amount: OBJECT.price },
          },
        },
      },
      "real:areas": {},
      "real:availableFrom": OBJECT.available_from,
      "real:yearOfConstruction": OBJECT.build_year,
      "real:rooms": {
        "real:bedrooms": OBJECT.bedrooms,
        "real:bathrooms": OBJECT.bathrooms,
      },
      "real:name": OBJECT.meta.heading,
    },
  };
  if (
    obj1["real:property"]["real:offerCategory"].toLowerCase().search("sale") !==
    -1
  ) {
    obj1["real:property"]["real:offerCategory"] = "buy";
  }
  if (
    obj1["real:property"]["real:offerCategory"].toLowerCase().search("let") !==
    -1
  ) {
    obj1["real:property"]["real:offerCategory"] = "rent";
  }

  if(obj1["real:property"]["real:offerCategory"] === "rent"){

    obj1["real:property"]["real:pricing"] = {
      "real:monthlyRent": {
        "real:baseValue": {
          "@": { amount: OBJECT.price, currency: "AED" }
        }
      },
      "real:monthlyNetBareRent": {
        "real:baseValue": {
          "@": { amount: OBJECT.price, currency: "AED" }
        }
      },
      "real:onRequest": false
    }

    obj1["real:property"]["real:profile"]["real:pricing"] = {
      "real:monthlyRent": {
        "real:baseValue": {
          "@": { amount: OBJECT.price, currency: "AED" }
        }
      },
      "real:monthlyNetBareRent": {
        "real:baseValue": {
          "@": { amount: OBJECT.price, currency: "AED" }
        }
      },
      "real:onRequest": false
    }
  }



  // TODO: hit areas endpoint and search for the location id and map those properties with this object...
  // var locationData = await getAllLocations();

  //console.log(locationData.length);
  //const locationData = await dataFetch();
  //console.log(locationData);
  const foundLocation = await locationData.find((d) => d.id === OBJECT.location);
  if (foundLocation) {
    obj1["real:property"]["real:location"]["real:address"]["real:city"] =
      foundLocation?.province;
    obj1["real:property"]["real:location"]["real:address"]["real:country"]["loc:value"]["#"] =
      foundLocation?.country;
    obj1["real:property"]["real:location"]["real:address"]["real:zipcode"] =
      foundLocation?.postal_code;
    obj1["real:property"]["real:location"]["real:region"]["loc:value"]["#"] =
      foundLocation?.province;
    obj1["real:property"]["real:location"]["real:district"]["loc:value"]["#"] =
      foundLocation?.area;
    obj1["real:property"]["real:location"]["real:licenceArea"]["loc:value"][
      "#"
    ] = foundLocation?.suburb;
    obj1["real:property"]["real:location"]["real:community"] =
      foundLocation?.area;
    obj1["real:property"]["real:location"]["real:subCommunity"] =
      foundLocation?.suburb;

    obj1["real:property"]["real:profile"]["real:location"]["real:address"][
      "real:city"
    ] = foundLocation?.province;
    obj1["real:property"]["real:profile"]["real:location"]["real:address"][
      "real:city"
    ] = foundLocation?.province;
    obj1["real:property"]["real:profile"]["real:location"]["real:address"][
      "real:country"
    ]["loc:value"]["#"] = foundLocation?.country;
    obj1["real:property"]["real:profile"]["real:location"]["real:address"][
      "real:zipcode"
    ] = foundLocation?.postal_code;
    obj1["real:property"]["real:profile"]["real:location"]["real:region"][
      "loc:value"
    ]["#"] = foundLocation?.province;
    obj1["real:property"]["real:profile"]["real:location"]["real:district"][
      "loc:value"
    ]["#"] = foundLocation?.area;
    obj1["real:property"]["real:profile"]["real:location"]["real:licenceArea"][
      "loc:value"
    ]["#"] = foundLocation?.suburb;
    obj1["real:property"]["real:profile"]["real:location"]["real:community"] =
      foundLocation?.area;
    obj1["real:property"]["real:profile"]["real:location"][
      "real:subCommunity"
    ] = foundLocation?.suburb;
  }

  for (var image of OBJECT.meta.listing_images) {
    obj1["real:property"]["real:profile"]["real:media"].push({
      "real:location": image.file,
      "real:category": "view",
      "real:mimeType": image.content_type,
    });
  }
  return obj1;
}

module.exports = { commercialSchema }