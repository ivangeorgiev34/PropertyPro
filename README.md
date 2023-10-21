# PropertyPro
PropertyPro is responsive property rental app accessable to landlords who post their properties for rental, and tenants who can book and review properties. The application was built with ASP.NET Core Web API and React.js. It also has a tested front-end and back-end.
## Table of contents
- [Users and roles](#users-and-roles)
- [RESTful API](#restful-api)
- [Technologies and Libraries](#technologies-and-libraries)
- [Database Diagram](#database-diagram)
- [Screenshots](#screenshots)
## <a id="users-and-roles" name="users-and-roles"></a>Users and roles
In the application there are 2 roles:
- Landlord
- Tenant
<!-- end of the list -->
Both roles have a individual user profile which they can edit.
### Landlord
They can post their properties and edit information about it or delete it, however they cannot edit or delete reviews that are left under his property. The tenants in the system can only view the property, book it, or leave a review under it.
### Tenant
They can book properties that exist in the system, only if the start and end dates interval is not busy already for the given property. Also they can leave reviews for the property, which is rated throough a star scale. They cannot create properties, nor edit or delete a property.
## <a id="restful-api" name="restful-api"></a>RESTful API
The following endpoints are supported:
### Account
- `POST /api/acccount/login` - log into the system with existing account
- `POST /api/account/register/landlord` - register a landlord
- `POST /api/account/register/tenant` - register a tenant
- `POST /api/account/edit/{userId}` - edit account information
### Booking
- `GET /api/booking/bookings` - get all user's bookings
- `GET /api/booking/bookings/{bookingId}` - get a user's booking
- `GET /api/booking/bookings/search` - get all user bookings by search
- `POST /api/booking/create/{propertyId}` - create a booking in a property
- `PUT /api/booking/edit/{bookingId}` - edit a booking
- `DELETE /api/booking/delete/{bookingId}` - delete a booking
### Property
- `GET api/property/{propertyId}` - get landlord's property
- `GET api/property/{propertyId}/reviews` - get landlord's property reviews
- `GET /api/property/properties` - get all properties in the system
- `GET /api/property/properties/{userId}` - get all user's properties
- `GET /api/property/properties/{userId}/{propertyId}/bookings` - get landlord's property bookings
- `GET /api/property/properties/search` - get all landlord's properties by search
- `GET /api/property/properties/all/search` - get all properties in the system by search
- `POST /api/property/create` - create a property
- `PUT /api/property/edit/{propertyId}` - edit a property
- `DELETE /api/property/delete/{propertyId}` - delete a property
### Review
- `GET /api/review/{reviewId}` - get review
- `POST /api/review/create/{propertyId}` - create a review in a property
- `PUT /api/review/edit/{reviewId}` - edit a review
- `DELETE /api/review/delete/{reviewId}` - delete a review
## <a id="technologies-and-libraries" name="technologies-and-libraries"></a>⚒Technologies and Libraries
- C#
- TypeScript
- SASS
- ASP.NET Core Web API
- React.js
- Entity Framework Core
- Redux
- React Router DOM
- React Intersection Observer
- React Testing Library
- Jest
- NUnit
- Moq
- MockQueryable.Moq
## <a id="database-diagram" name="database-diagram"></a>Database Diagram
![propertypro-database-diagram](https://github.com/ivangeorgiev34/PropertyPro/assets/114490562/7802d04a-ef6e-4686-8a2b-15f454f0a303)
## <a id="screenshots" name="screenshots"></a>Screenshots
![home page screenshot](https://github.com/ivangeorgiev34/PropertyPro/assets/114490562/5b451013-6567-412c-b7dd-40722e4d0146)
![full my properties page screenshot](https://github.com/ivangeorgiev34/PropertyPro/assets/114490562/6b56867d-de44-48fa-9993-9f1acb4669d6)
![my properties screenshot](https://github.com/ivangeorgiev34/PropertyPro/assets/114490562/d45b92ec-192c-42e8-9a63-2dcfd1b0a24c)
![my bookings screenshot](https://github.com/ivangeorgiev34/PropertyPro/assets/114490562/73ab0605-feb4-4d7a-9f14-09c991a537d2)
![property reviews screenshot](https://github.com/ivangeorgiev34/PropertyPro/assets/114490562/5ec939bc-cd29-451b-be1a-7005f62302b1)
![create review screenshot](https://github.com/ivangeorgiev34/PropertyPro/assets/114490562/209a0b15-1e39-4b1d-ad7f-e8a8b2c2d918)
![login page screenshot](https://github.com/ivangeorgiev34/PropertyPro/assets/114490562/329f5189-38c6-4f28-903f-9f3d10bf5193)
![profile information screenshot](https://github.com/ivangeorgiev34/PropertyPro/assets/114490562/6e289782-f82f-4910-b741-369caafd1a5f)
