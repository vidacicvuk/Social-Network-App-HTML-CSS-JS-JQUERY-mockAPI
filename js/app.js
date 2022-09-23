let session = new Session();
session = session.getSession();

if (session!=""){
    window.location.href = "hexa.html"
}

$("#register").click((e)=>{
    $(".custom-modal").css("display","block")
})

$("#closeModal").click((e)=>{
    $(".custom-modal").css("display","none")
})

$(document).keydown((e)=>{
    if(e.key==="Escape"){
        $(".custom-modal").css("display","none")
    }
})

let config = {
    "username":{
        required: true,
        minlength: 5,
        maxlength: 50
    },
    "register_email":{
        required: true,
        email: true,
        minlength: 5,
        maxlength: 50
    },
    "register_password":{
        required: true,
        minlength: 7,
        maxlength: 25,
        matching:"repeat_password" 
    },
    "repeat_password":{
        required: true,
        minlength: 7,
        maxlength: 25,
        matching:"register_password" 
    }
}

let validator = new Validator(config,"#registrationForm")

$("#registrationForm").submit((e)=>{
    console.log("Tu sam")
    e.preventDefault();
    if(validator.validationPassed()){
        let user = new User();
        user.username = $("#username").val();
        user.email = $("#email").val();
        user.password = $("#register_password").val();
        if(user.username =="" || user.email=="" || user.password==""){
            alert("All fields must be fulfilled properly!")
        }else{
            user.create();
        }
        
    }else{
        alert("The fields are not fulfilled properly!")
    }
})

$("#loginForm").submit((e)=>{
    e.preventDefault();
    let user = new User();
    user.email = $("#login_email").val();
    user.password = $("#login_password").val();
    user.login();
})