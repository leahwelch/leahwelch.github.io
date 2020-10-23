var nodes = [
    {
      "id": "Consumers' Risk of Obesity",
      "category": "Consumer Impacts"
    },
    {
      "id": "Nutritional Value of Food",
      "category": "Consumer Impacts"
    },
    {
      "id": "Convenient Availability of Fresh Food",
      "category": "Consumer Impacts"
    },
    {
      "id": "Taste of Food",
      "category": "Consumer Impacts"
    },
    {
      "id": "Cost of Fresh Food",
      "category": "Consumer Impacts"
    },
    {
      "id": "Convenient Availability of Processed Food",
      "category": "Consumer Impacts"
    },
    {
      "id": "Cost of Processed Food",
      "category": "Consumer Impacts"
    },
    {
      "id": "Percentage of Population Facing Food Insecurity",
      "category": "Consumer Impacts"
    },
    {
      "id": "Likelihood of Developing a Preference for Processed Food",
      "category": "Consumer Impacts"
    },
    {
      "id": "Knowledge of Efficient Water Use",
      "category": "Environmental Impacts"
    },
    {
      "id": "Resource Competition",
      "category": "Environmental Impacts"
    },
    {
      "id": "Demand for Biofuel",
      "category": "Environmental Impacts"
    },
    {
      "id": "Amount of Pollutants in the Air",
      "category": "Environmental Impacts"
    },
    {
      "id": "Soil Quality",
      "category": "Environmental Impacts"
    },
    {
      "id": "Use of Synthetic Fertilizers",
      "category": "Environmental Impacts"
    },
    {
      "id": "Ground Water Levels",
      "category": "Environmental Impacts"
    },
    {
      "id": "Soil Dependence on Fertilizers",
      "category": "Environmental Impacts"
    },
    {
      "id": "Available Land",
      "category": "Environmental Impacts"
    },
    {
      "id": "Rural Water Scarcity",
      "category": "Environmental Impacts"
    },
    {
      "id": "Degree of Desertification",
      "category": "Environmental Impacts"
    },
    {
      "id": "Displacement & Climate Migration",
      "category": "Environmental Impacts"
    },
    {
      "id": "Vulnerability to Climate Shock",
      "category": "Environmental Impacts"
    },
    {
      "id": "Percentage of Earth Covered in Forests",
      "category": "Environmental Impacts"
    },
    {
      "id": "Fossil Fuel Consumption",
      "category": "Environmental Impacts"
    },
    {
      "id": "Degree of Acidification",
      "category": "Environmental Impacts"
    },
    {
      "id": "Length of Supply Chain",
      "category": "Food Industry"
    },
    {
      "id": "Quantity of Buyers",
      "category": "Food Industry"
    },
    {
      "id": "Demand for Efficient Land Use",
      "category": "Food Industry"
    },
    {
      "id": "Degree of Produce Standardization",
      "category": "Food Industry"
    },
    {
      "id": "Length of Shelf Life",
      "category": "Food Industry"
    },
    {
      "id": "Amount of Data About Production Levels",
      "category": "Food Industry"
    },
    {
      "id": "Size of Crop Yields",
      "category": "Food Industry"
    },
    {
      "id": "Speed of Crop Turnover",
      "category": "Food Industry"
    },
    {
      "id": "Amount of Data About Market Demands",
      "category": "Food Industry"
    },
    {
      "id": "Investment in the Development of Grocery Stores in Low-Income Communities",
      "category": "Policy Examples"
    },
    {
      "id": "Investment in Blockchain Monitoring",
      "category": "Policy Examples"
    },
    {
      "id": "Investment in Cold Chain Infrastructure",
      "category": "Policy Examples"
    },
    {
      "id": "Land Acquisition Policies",
      "category": "Policy Examples"
    },
    {
      "id": "Investment in Ugly Produce Initiatives",
      "category": "Policy Examples"
    },
    {
      "id": "Federal Agricultural Subsidies",
      "category": "Policy Examples"
    },
    {
      "id": "Ability of Smallholders' Production to Meet Industry Standards",
      "category": "Smallholder Impacts"
    },
    {
      "id": "Amount of Capital Needed to Implement Measures",
      "category": "Smallholder Impacts"
    },
    {
      "id": "Smallholder Farmers' Risk of Poverty",
      "category": "Smallholder Impacts"
    },
    {
      "id": "Overproduction",
      "category": "Smallholder Impacts"
    },
    {
      "id": "Degree of Connection Between Producer & Consumer",
      "category": "Smallholder Impacts"
    },
    {
      "id": "Postharvest Losses",
      "category": "Smallholder Impacts"
    },
    {
      "id": "Crop Variety",
      "category": "Smallholder Impacts"
    },
    {
      "id": "Disparity Between Peak Ripeness & Actual Harvest Time",
      "category": "Smallholder Impacts"
    }
   ];

var links = [
    {source: "Length of Supply Chain", target: "Degree of Produce Standardization"},
    {source: "Length of Supply Chain", target: "Length of Shelf Life"},
    {source: "Investment in Cold Chain Infrastructure", target: "Length of Supply Chain"},
    {source: "Degree of Connection Between Producer & Consumer", target: "Length of Supply Chain"},
    {source: "Degree of Produce Standardization", target: "Amount of Capital Needed to Implement Measures"},
    {source: "Degree of Produce Standardization", target: "Crop Variety"},
    {source: "Degree of Produce Standardization", target: "Ability of Smallholders' Production to Meet Industry Standards"},
    {source: "Length of Shelf Life", target: "Taste of Food"},
    {source: "Length of Shelf Life", target: "Nutritional Value of Food"},
    {source: "Disparity Between Peak Ripeness & Actual Harvest Time", target: "Length of Shelf Life"},
    {source: "Investment in Cold Chain Infrastructure", target: "Postharvest Losses"},
    {source: "Degree of Connection Between Producer & Consumer", target: "Crop Variety"},
    {source: "Degree of Connection Between Producer & Consumer", target: "Quantity of Buyers"},
    {source: "Investment in Blockchain Monitoring", target: "Degree of Connection Between Producer & Consumer"},
    {source: "Amount of Capital Needed to Implement Measures", target: "Ability of Smallholders' Production to Meet Industry Standards"},
    {source: "Crop Variety", target: "Vulnerability to Climate Shock"},
    {source: "Crop Variety", target: "Soil Quality"},
    {source: "Crop Variety", target: "Smallholder Farmers' Risk of Poverty"},
    {source: "Ability of Smallholders' Production to Meet Industry Standards", target: "Postharvest Losses"},
    {source: "Disparity Between Peak Ripeness & Actual Harvest Time", target: "Taste of Food"},
    {source: "Disparity Between Peak Ripeness & Actual Harvest Time", target: "Nutritional Value of Food"},
    {source: "Speed of Crop Turnover", target: "Disparity Between Peak Ripeness & Actual Harvest Time"},
    {source: "Overproduction", target: "Postharvest Losses"},
    {source: "Investment in Ugly Produce Initiatives", target: "Postharvest Losses"},
    {source: "Postharvest Losses", target: "Smallholder Farmers' Risk of Poverty"},
    {source: "Quantity of Buyers", target: "Smallholder Farmers' Risk of Poverty"},
    {source: "Investment in Blockchain Monitoring", target: "Amount of Data About Market Demands"},
    {source: "Investment in Blockchain Monitoring", target: "Amount of Data About Production Levels"},
    {source: "Degree of Desertification", target: "Vulnerability to Climate Shock"},
    {source: "Vulnerability to Climate Shock", target: "Smallholder Farmers' Risk of Poverty"},
    {source: "Degree of Acidification", target: "Soil Quality"},
    {source: "Soil Quality", target: "Degree of Desertification"},
    {source: "Soil Dependence on Fertilizers", target: "Soil Quality"},
    {source: "Soil Quality", target: "Use of Synthetic Fertilizers"},
    {source: "Displacement & Climate Migration", target: "Smallholder Farmers' Risk of Poverty"},
    {source: "Rural Water Scarcity", target: "Smallholder Farmers' Risk of Poverty"},
    {source: "Size of Crop Yields", target: "Speed of Crop Turnover"},
    {source: "Demand for Efficient Land Use", target: "Speed of Crop Turnover"},
    {source: "Amount of Data About Market Demands", target: "Overproduction"},
    {source: "Amount of Data About Production Levels", target: "Overproduction"},
    {source: "Degree of Desertification", target: "Resource Competition"},
    {source: "Degree of Desertification", target: "Available Land"},
    {source: "Degree of Desertification", target: "Rural Water Scarcity"},
    {source: "Percentage of Earth Covered in Forests", target: "Degree of Desertification"},
    {source: "Ground Water Levels", target: "Degree of Desertification"},
    {source: "Amount of Pollutants in the Air", target: "Degree of Acidification"},
    {source: "Soil Dependence on Fertilizers", target: "Use of Synthetic Fertilizers"},
    {source: "Size of Crop Yields", target: "Use of Synthetic Fertilizers"},
    {source: "Use of Synthetic Fertilizers", target: "Fossil Fuel Consumption"},
    {source: "Displacement & Climate Migration", target: "Available Land"},
    {source: "Resource Competition", target: "Displacement & Climate Migration"},
    {source: "Rural Water Scarcity", target: "Resource Competition"},
    {source: "Knowledge of Efficient Water Use", target: "Rural Water Scarcity"},
    {source: "Land Acquisition Policies", target: "Size of Crop Yields"},
    {source: "Available Land", target: "Demand for Efficient Land Use"},
    {source: "Land Acquisition Policies", target: "Available Land"},
    {source: "Percentage of Earth Covered in Forests", target: "Amount of Pollutants in the Air"},
    {source: "Knowledge of Efficient Water Use", target: "Ground Water Levels"},
    {source: "Fossil Fuel Consumption", target: "Amount of Pollutants in the Air"},
    {source: "Amount of Pollutants in the Air", target: "Demand for Biofuel"},
    {source: "Demand for Biofuel", target: "Land Acquisition Policies"},
    {source: "Nutritional Value of Food", target: "Consumers' Risk of Obesity"},
    {source: "Likelihood of Developing a Preference for Processed Food", target: "Consumers' Risk of Obesity"},
    {source: "Convenient Availability of Fresh Food", target: "Consumers' Risk of Obesity"},
    {source: "Convenient Availability of Processed Food", target: "Consumers' Risk of Obesity"},
    {source: "Convenient Availability of Fresh Food", target: "Likelihood of Developing a Preference for Processed Food"},
    {source: "Convenient Availability of Processed Food", target: "Likelihood of Developing a Preference for Processed Food"},
    {source: "Cost of Fresh Food", target: "Likelihood of Developing a Preference for Processed Food"},
    {source: "Cost of Processed Food", target: "Likelihood of Developing a Preference for Processed Food"},
    {source: "Convenient Availability of Fresh Food", target: "Percentage of Population Facing Food Insecurity"},
    {source: "Investment in the Development of Grocery Stores in Low-Income Communities", target: "Convenient Availability of Fresh Food"},
    {source: "Convenient Availability of Processed Food", target: "Percentage of Population Facing Food Insecurity"},
    {source: "Investment in the Development of Grocery Stores in Low-Income Communities", target: "Convenient Availability of Processed Food"},
    {source: "Federal Agricultural Subsidies", target: "Convenient Availability of Processed Food"},
    {source: "Cost of Fresh Food", target: "Percentage of Population Facing Food Insecurity"},
    {source: "Cost of Processed Food", target: "Percentage of Population Facing Food Insecurity"},
    {source: "Federal Agricultural Subsidies", target: "Cost of Processed Food"},
    
   
];