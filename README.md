# Deployment Link: https://client-gtwaucpaj-tianyu-fangs-projects.vercel.app
# Assignment-03
**Warning:** this is a long assignments and it will take you at least 2 weeks of full time dedication to complete. Please allocate the necesary time in order to complete this on time.

You can in groups of up to 2 students for this project or you can do this on your own.

The goal is to develop a "Software as a Service" web application performing CRUD operations based on React, NodeJs, Auth0 and Prisma (Some examples include an online store, food ordering, personal journal, learning management system, social network, ...).

Your project must support some functionality for anonymous users and only force users to log in if a user identity is required to fulfill a service. For instance, in an online store, anonymous users should be able to search for products, view product details, read product reviews, etc. If a user would like to bookmark a product, comment on a product, or add a product to a shopping cart, then, and only then, would the website ask the user to identify themselves or register.

## API requirements
- Must have /ping endpoint
- Must have at least one endpoint that requires the auth0 token (provided in the Authorization header)

## Database requirements
- Your application should include at least 3 tables in the database.
- must use Prisma

## Page Requirements
Your application must have at least the following pages but depending on the theme of your application you can have more pages:

### Homepage
- The landing page of your web application. It is the first page users should see when they visit your website.
- Must display generic content for anonymous users. The content must be dynamic based on the latest data. For instance, you might display snippets and links to the most recent post, review, or member who recently joined
- Must display specific content for the logged-in user. The content must be dynamic based on the most recent data entered by the logged-in user. For instance, you might display snippets and links to the most recent post or review created by the logged-in user
- Must be clear to what the Web site is about and must look polished and finished
Log in/Register page (use auth0 for this)
The login and register page allows users to register (create a new account) with the website and then log in later on  (use auth0 for this)
Must force login only when identity is required. For instance, an anonymous user might search for movies and visit the details page for a particular movie without needing to log in. But if they attempt to like the movie, rate it, comment on it, write a review, or follow someone, the application must request the user to log in. Most of the Web applications must be available without a login

### Profile page
- Users can see all the information about themselves. It could have several sections for personal information and links to related content associated with the user. For instance, display a list of links to all the favorite movies, a list of links of users they are following, etc.
- Must allow users to change their personal information (don't change data related to auth0, only change your own user's database table)

### Details page
- The details page allows users to view a detailed view for each item. They can see more information when they click on the item. The details page must fulfill the following requirements.
- Must include a unique identifier in the URL. For example: /product/123 or /book/321

## Login and Security
- Must use Auth0 integration based on https://docs.google.com/document/d/1lYmaGZAS51aeCxfPzCwZHIk6C5mmOJJ7yHBNPJuGimU/edit?usp=sharing
- Must have an Auth Debugger page that shows the authentication token
- Must generate a token and send the it in the Authorization header when needed

## Responsive design requirements
- Web application must be usable on a desktop, tablet, or phone
- Web pages must be responsive at any width of the browser

## External Web API requirements
- Create an interface to an external Web API such as Google maps, IMDB, YouTube, Yelp, Yahoo, Weather Channel, Yummly, Bestbuy, Amazon, ... You need to only use the Web API to do read-only operations, e.g. get weather data based on location, get recipe based on the country name,... A good place to start is at https://rapidapi.com/hub
- Please don't pay any money for API resources, using only use the free tiers is 100% fine.

## Accessibility requirements
- Include Lighthouse accessibility reports from 3 pages using https://developers.google.com/web/tools/lighthouse 
- must include the reports (as image, pdf or any readable format) within the `accessibility_reports` folder

## Testing requirements
- Your application should have at least 3 unit tests.

## Deployment
- follow the deployment instructions here https://docs.google.com/document/d/1EAXheb9Q7at094xKAhRikD5uQE15q7G_OWaC5KmuARc/edit#heading=h.njhk7lekv5qz
- must deploy the database
- must deploy the API server
- must deploy the client side
- must provide deployment link in this readme

## [Optional] Search/Search Results page
- Search and results can be on the same page or in separate pages. (e.g. the search bar can be on the home page and the results on a separate page. Or both in a separate search page).
- Users must be able to see a summary of the search results and navigate to a detail page that shows a detailed view of the result.
- Must be mapped to /search when no search has been executed and no results exist
- Must be mapped to /search/{search criteria} or /search?criteria={search criteria} when a search has been executed

## Grading Criteria
- CSS/UI (25%)
  - use CSS on all pages and applies some basic styling
  - all pages are responsive for mobile, tablet and desktop"	
- Javascript/HTML (25%)
  - have all the HTMLs for all the pages (using React)
  - calls the API for all endpoints
  - all operations work from the client
  - forms validate data"	
- API endpoints (20%)
  - have all endpoints working
  - all endpoints work and save data to the database
  - endpoints validate data
  - have secure endpoints
- Security (10%)
  - client is integrated with auth0 (login, secure routes, auth token, etc)
  - API have at least 2 secure routes validating the auth0 token
- Testing (5%)
  - include at least 3 unit tests on the client side using Ract Testing Library
- Web Accessibility (5%)
  - include LighHouse Accessibility report for at least 3 pages (score 80 min)
- Deployment (5%)
  - client is deployed
  - API is deployed
  - database is deployed"	5%
- Code quality and attention to details (5%)
  - is code easy to read and understandable?
  - does variable names make sense?
  - do you see any errors in the console?"
