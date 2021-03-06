// ---- Frontend Authentication middleware -----

var frontendAuthMiddleware = new TykJS.TykMiddleware.NewMiddleware({});

function getCookie(request, cookie_name) {
    if (!("Cookie" in request.Headers)) {
	return undefined;
    }
    var splitCookie = request.Headers["Cookie"][0].split("; ");
    var valueCookie = _.find(splitCookie, function(cookie) {
        if (cookie.indexOf(cookie_name+"=") > -1) {
            return cookie
        }
    });

    return valueCookie
}

function isTokenExpired(idToken) {
    tokenPayload = idToken.split(".")[1]
    padding = tokenPayload.length % 4

    if (padding != 0) {
        _.times(4-padding, function() {
            tokenPayload += "="
        })
    }

    decodedPayload = JSON.parse(b64dec(tokenPayload))
    tokenExpires = decodedPayload["exp"]
    sysTime = (new Date).getTime()/1000 | 0;

    return sysTime>tokenExpires
}

frontendAuthMiddleware.NewProcessRequest(function(request, session, spec) {
    // log("Running Authorization JSVM middleware")

    if (request.Headers["Authorization"] === undefined) {
        try {
            var tokenCookie = getCookie(request, "session_id")
        } catch(err) {
            log(err)
            var tokenCookie = undefined
        }

        if (tokenCookie != undefined) {
            var idToken = tokenCookie.split("=")[1];

            if (isTokenExpired(idToken)) {
                request.ReturnOverrides.ResponseCode = 302;
                request.ReturnOverrides.ResponseHeaders = {
                    "Location": spec.config_data.TYK_SERVER + "/auth/login?app_url=" + request.URL
                };
            } else {
                request.SetHeaders["Authorization"] = "Bearer " + idToken;
            }

        } else {
            request.ReturnOverrides.ResponseCode = 302
            request.ReturnOverrides.ResponseHeaders = {
                "Location": spec.config_data.TYK_SERVER + "/auth/login?app_url=" + request.URL
            }
        }
    }
    
    return frontendAuthMiddleware.ReturnData(request, session.meta_data);
});
    
log("Authorization middleware initialised");
