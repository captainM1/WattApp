# ENERGY SOLVIX

EnergySolvix is a company that provides solutions to track energy consumption and production in households and as a Distribution System Operator (DSO). EnergySolvix offers a user-friendly mobile application that can be used by households to track their energy consumption and production in real-time. This app allows households to monitor their energy usage and make more informed decisions on how to save energy and reduce costs.

In addition to providing solutions for households, EnergySolvix also offers software solutions for DSOs. These solutions provide real-time monitoring of energy usage and production across the grid, helping DSOs to optimize energy distribution and reduce power losses. EnergySolvix's software solutions provide advanced analytics and reporting capabilities that help DSOs to make more informed decisions on managing energy distribution.

With EnergySolvix's solutions, households and DSOs can monitor their energy usage and production in a more efficient and cost-effective manner. This leads to a reduction in energy consumption, costs, and carbon footprint. EnergySolvix's solutions provide an easy-to-use platform that helps households and DSOs to make more informed decisions on energy usage, leading to a more sustainable future.

## Instructions on how to get the project on a local machine.

1. git clone http://gitlab.pmf.kg.ac.rs/wattapp/energysolvix.git
2. Navigate to folder /src/appProsumer/prosumerAppUI and run npm install
   Navigate to folder /src/appDSO/dsoAppUI and run npm install
   Navigate to folder /src/appProsumer/prosumerAppBack and run:
     dotnet tool install --global dotnet-ef
     dotnet ef database update
     dotnet restore
3. Download MongoDB from https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows-unattended/
4. Install it and also install MongoDBCompass
5. Open Compass and connect to mongodb://localhost:27017
6. Add new database named 'data'
7. Add new collection inside database called 'powerusage'
8. Select ADD DATA and from root of project insert both power_usage_data and power_production_data

## Deployment
1. To run DSO app navigate to /src/appDSO/dsoAppUI and run ng server --o (this will open new page in browser with app)
2. To run Prosumer app navigate to /src/appProsumer/prosumerAppUI and run ng server --o (this will open new page in browser with app, if you have one or other already running it will ask you if you want to change port select yes by typin y and enter)


## Built With

    Angular
    .NET

## Authors

    Milovan
    Emilija
    Olja
    Darko
    Katarina
    Anastasija