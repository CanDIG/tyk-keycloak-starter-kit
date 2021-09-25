// Virtual authentication logout endpoint for API Gateway

logoutHelper = {
    setCookie: function(app) {
        var cookie = "session_id=;"
        cookie += "Path=/;" 
        cookie += "Max-Age=0;"
        cookie += "HttpOnly;"
        cookie += ",username=;Path=/;"

        if (app) {
            cookie += "tyk_app=" + app + ";Path=/;"
        }
        return cookie
    },

    logoutUrl: function(spec) {
        var url = spec.config_data.KC_SERVER
        url += '/auth/realms/' + spec.config_data.KC_REALM
        url += '/protocol/openid-connect/logout?redirect_uri=' + spec.config_data.TYK_SERVER + '/auth/login'
        return url
    }
}

function logoutHandler(request, session, spec) {
    log("Logging out")
    var app = request.Params["app_url"]

    var referer = request.Headers.Referer[0]

    if (referer !== undefined && referer.indexOf(spec.config_data.TYK_SERVER) > -1) {
        app = referer.replace(spec.config_data.TYK_SERVER, "");
    }
    
    responseObject = {
        Body: "{}",
        Headers: {
            "Location": logoutHelper.logoutUrl(spec),
            "Set-Cookie": logoutHelper.setCookie(app)
        },
        Code: 302
    }

    return TykJsResponse(responseObject, session.meta_data)
}
log("Virtual logout endpoint initialised")