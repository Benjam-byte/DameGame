window.onload=function()   { 

    // elements animés
    const switchDiv = document.getElementsByClassName("switch-side");
    const buttonGoToSignUp = document.getElementsByClassName("goToSignUp");
    const buttonGoToSignIn = document.getElementsByClassName("goToSignIn");
    const forms = document.getElementsByTagName("form");
    const spans = document.querySelectorAll(".switch-bar>span")

    // animations gauche
    goToSignUp = () => {
        forms[0].style.opacity = 0;
        forms[1].style.opacity = 1;
        switchDiv[0].style.transform = "translate(-54%)";
        switchDiv[0].style.backgroundPositionX = "left";
        buttonGoToSignUp[0].style.display = "none";
        buttonGoToSignIn[0].style.display = "initial";
    }

    // animations droite
    goToSignIn = () => {
        forms[0].style.opacity = 1;
        forms[1].style.opacity = 0;
        switchDiv[0].style.transform = "translate(50%)";
        switchDiv[0].style.backgroundPositionX = "right";
        buttonGoToSignIn[0].style.display = "none";
        buttonGoToSignUp[0].style.display = "initial";
    }

    toggleIn = () => {
        forms[0].style.display = "flex";
        forms[1].style.display = "none";
        spans[0].style.textDecoration = "underline";
        spans[1].style.textDecoration = "none";
    }

    toggleUp = () => {
        forms[0].style.display = "none";
        forms[1].style.display = "flex";
        spans[0].style.textDecoration = "none";
        spans[1].style.textDecoration = "underline";
    }

    signIn = () => {
        let origin = window.location.origin;
        let newPath = origin + '/www/home.html';
        document.location.href = newPath; 
    }
}
