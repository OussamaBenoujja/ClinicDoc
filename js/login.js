

const login = document.createElement("div");
const newPassword = document.createElement("input");
const confirmPassword = document.createElement("input");
const submit = document.createElement("button");

newPassword.type = "password";
newPassword.placeholder = "New Password";
confirmPassword.type = "password";
confirmPassword.placeholder = "Confirm Password";
submit.textContent = "Submit";

login.appendChild(newPassword);
login.appendChild(confirmPassword);
login.appendChild(submit);

document.body.appendChild(login); 




submit.addEventListener("click",()=>{

    if((newPassword.value === confirmPassword.value) && (confirmPassword.value.length>8)){
        alert("passwords Match");
    }else{
        alert("passwords do not Match");
    }
})




