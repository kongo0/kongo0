const session =
JSON.parse(localStorage.getItem("session"));

if(!session){

    window.location.href = "/login.html";
}

else{

    const tokenData =
    TOKENS[session.token];

    if(!tokenData){

        localStorage.removeItem("session");

        window.location.href = "/login.html";
    }

    if(tokenData.expires){

        const now = new Date();
        const exp = new Date(tokenData.expires);

        if(now > exp){

            localStorage.removeItem("session");

            window.location.href = "/login.html";
        }
    }
}

function logout(){

    localStorage.removeItem("session");

    window.location.href = "/login.html";
}
