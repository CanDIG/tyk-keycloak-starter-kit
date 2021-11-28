# tyk-keycloak-starter-kit

This is a starter kit for full-stack web application authentication with Tyk and Keycloak (in progress).

## The background of our solution

Our solution is unique, as in that all of the front-end and back-end applications are registered as Tyk APIs. Tyk offers built-in mechanism to work with OpenID-compliant providers, in our case, is Keycloak. Once they're registered as Tyk APIs, your applications are essentially ready for deployment.

For your front-end applications, we recommend the use of the `auth/sessionInfo` virtual endpoint to retrieve user info, such as name, email, etc, and `auth/logout` as the link for your logout button.

## Tyk Middleware

There are a number of middlewares under `/tyk/middleware` folder. Their roles are explained below.

- `backendAuth.js`: This middleware decodes the `Authorization` header of API requests made by browser applications.
- `frontendAuth.js`: This middleware makes sure that Tyk correctly redirects requests to Keycloak if there isn't a valid session, or redirects requests to the applications if there is one.

The following middlewares utilize the Tyk Virtual Endpoints functionalities.
- `virtualLogin.js`: Available as `auth/login`, it redirects unauthenticated requests to front-end applications to the Keycloak Log-in page.
- `virtualLogout.js`: Available as `auth/logout`, it clears the session, redirects users to the Keycloak log-in page.
- `virtualSession.js`: Available as `auth/Sessioninfo`, it returns basic information about the session and the users. This is mostly used by front-end applications to render user-specific data.
- `virtualToken.js`: Availabler as `auth/token`, it provides an API endpoint for users to retreive a valid token. This is optional if you only want users to make requests indirectly via the browser apps.



## FAQ

### Q: Does this solution work with other OpenID-compliant providers, such as Auth0?
A: No. However, it is possible to modify the middleware, in particular, the `virtualLogin.js` and `virtualLogout.js` for this purpose, this is because `Auth0`, or other OpenID providers have slightly different parameters when redirected for log in.

