const mongoose = require("mongoose");
require("dotenv/config");

const async = require("async");
const Category = require("./models/Category");
const Item = require("./models/Item");

//set connection
mongoose.connect(process.env.DB_Connection, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB COnnection error"));

const categories = [];
const items = [];

const categoryCreate = (
  categoryName,
  categoryDescription,
  categoryImage,
  item,
  cb
) => {
  categorydetail = {
    categoryName: categoryName,
    categoryDescription: categoryDescription,
    item: item,
  };

  if (categoryImage != false) categorydetail.categoryImage = categoryImage;

  const category = new Category(categorydetail);
  category.save((err) => {
    if (err) {
      cb(err, null);
      return;
    } else {
      console.log("New Category: " + category);
      categories.push(category);
      cb(null, category);
    }
  });
};

const itemCreate = (
  itemName,
  itemDescription,
  itemPrice,
  itemStock,
  itemImage,
  cb
) => {
  itemdetail = {
    itemName: itemName,
    itemDescription: itemDescription,
    itemPrice: itemPrice,
    itemStock: itemStock,
  };

  if (itemImage != false) itemdetail.itemImage = itemImage;

  const item = new Item(itemdetail);
  item.save((err) => {
    if (err) {
      cb(err, null);
    } else {
      console.log("New Category:" + item);
      items.push(item);
      cb(null, item);
    }
  });
};

const createItems = (cb) => {
  async.series(
    [
      (callback) => {
        itemCreate(
          "Nissan Versa",
          "With a price that's affordable for almost everyone shopping for a new car, and an unrivaled number of active-safety features, the 2021 Nissan Versa is a competent and appealing subcompact sedan. It also boasts comfortable seats and a tranquil ride that help make daily commutes a pleasant experience. While the little Nissan isn't exactly entertaining to drive or zippy, it is very fuel efficient—especially on the highway. The base model costs less than $16,000 with the manual transmission, but you'll have to step up to one of the two higher trims to get popular features such as Apple CarPlay and Android Auto as well as desirable options such as adaptive cruise control and heated front seats. Still, the 2021 Versa has the attractiveness and refinement to deserve consideration alongside classmates such as the Hyundai Accent.",
          "1000000",
          "50",
          false,
          callback
        );
      },
      (callback) => {
        itemCreate(
          "Honda Accord",
          "In the shrinking segment of family sedans there are still some great cars to choose from, but one stands above the rest for its impeccable driving dynamics, practical interior, and value: the 2021 Honda Accord. So impressed are we with the Accord that it's become a nearly permanent fixture on our annual 10Best list and it finds itself there again for 2021. Buyers can choose from two turbocharged four-cylinder powertrains; there's also a fuel-sipping hybrid model available. No matter what engine powers the Accord, its handling is effortlessly balanced, which makes navigating twisty roads a joy and long highway journeys a pleasure. The Accord boasts a spacious trunk that will make grocery runs a snap and a back seat is commodious enough for two adults for long road trips. The roomy interior also easily accommodates multiple child seats for growing families.",
          "200000",
          "40",
          false,
          callback
        );
      },
      (callback) => {
        itemCreate(
          "Ford Mustang",
          "The Ford Mustang family has a legendary history and is populated by models with diverse personalities. This year, that history is recalled by the revival of the Mach 1 moniker, first seen on the 1969 'Stang. The 2021 Mustang will still come as a coupe or a convertible, and its stable of high-performance offerings will be as full as ever. Whether it’s the turbocharged four-cylinder EcoBoost or the V-8-powered GT, every version of the original pony car can be armed with track weaponry to challenge its Chevy Camaro or Dodge Challenger counterparts. The Ford's beautiful bodywork, vast personalization options, and practical interior also make it desirable to folks who care less about lap times and more about sporty everyday transportation. And that's why the Mustang continues to be an icon: it offers something for everyone.",
          "300000",
          "10",
          false,
          callback
        );
      },
      (callback) => {
        itemCreate(
          "BMW X6",
          "The 2021 BMW X6 is built for shoppers who want a mid-size luxury crossover with a sportier aesthetic. Although traditionalists might mock its fastback styling and decry its decreased practicality, they should remember that the more conventional BMW X5 still exists. Plus, BMW spearheaded the SUV-coupe movement with the original X6, so now it must defend its market share against spin-offs such as the Porsche Cayenne Coupe and Mercedes-AMG GLE-class. Not only does the X6 have an appropriately luxurious cabin and entertaining driving manners, it also boasts a set of quick and refined powertrains. The 523-hp twin-turbo V-8 is a lot more expensive than the standard six-cylinder engine, but it's still a better value than the six-figure price that the 600-plus-hp X6 M commands. No matter its performance level, the 2021 X6 is a machine for people who like to be seen.",
          "150000",
          "5",
          false,
          callback
        );
      },
    ],
    //*optional callback
    cb
  );
};
const createCategories = (cb) => {
  async.parallel(
    [
      (callback) => {
        categoryCreate(
          "Sedan",
          "A sedan has four doors and a traditional trunk. Like vehicles in many categories, they're available in a range of sizes from small (subcompact vehicles like Nissan Versa and Kia Rio) to compacts (Honda Civic, Toyota Corolla) to mid-size (Honda Accord, Nissan Altima), and full-size (Toyota Avalon, Dodge Charger). Luxury brands like Mercedes-Benz and Lexus have sedans in similar sizes as well.",
          false,
          [items[0], items[1]],
          callback
        );
      },
      (callback) => {
        categoryCreate(
          "Coupe",
          "A coupe has historically been considered a two-door car with a trunk and a solid roof. This would include cars like a Ford Mustang or Audi A5—or even two-seat sports cars like the Chevrolet Corvette and Porsche Boxster. Recently, however, car companies have started to apply the word coupe to four-door cars or crossovers with low, sleek rooflines that they deem coupe-like. This includes vehicles as disparate as a Mercedes-Benz CLS sedan and BMW X6 SUV. At Car and Driver, we still consider a coupe to be a two-door car.",
          false,
          [items[2], items[3]],
          callback
        );
      },
    ],
    //*optional callback
    cb
  );
};

async.series(
  [createItems, createCategories],
  //*optional callback
  (err, results) => {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
      console.log("items:" + items);
    }
  }
  //all done, disconnect from database
);
