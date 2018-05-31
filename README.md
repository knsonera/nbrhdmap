# Seattle's Coffee Map

The app is available here: http://map.uzhvieva.com/

This single-page app is a map of my favorite coffee shops in Seattle area.
Choose any coffee shop on the map or sidebar to see information about the spot.
This information includes:
- title, description, milk options and coordinates (from local json object)
- rating, review count, pricing and image (from Yelp servers via Yelp Fusion)

Map representation implemented via Google Maps API.

## Main feature
For all the non-dairy milk lovers there is an awesome feature -
you can filter coffee shops by your favorite non-dairy milk option!
Use "filter" button to see the list of options and choose any milk you like.
Now you should see only coffee shops with you favorite milk available -
both on the map and in the sidebar.

## List of APIs
- Google Maps API
- Yelp API

## List of frameworks and libraries
- Knockout.js
- Bootstrap
- jQuery
- Flask

## How to run the application locally
1. Connect to vagrant machine (vagrant ssh)
2. Change directory to /vagrant (cd /vagrant)
3. Clone the project code (git clone https://github.com/knsonera/nbrhdmap.git nmap)
4. Change directory to nmap (cd nmap)
5. Run server (python __init__.py)

Now the app should be available here: http://localhost:5000/
