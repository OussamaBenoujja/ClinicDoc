import {clinicApp, isLoggedIn} from "./main.js"
import {createPassword, setIsLoggedIn} from "./main.js"
import {dashboard} from "./dashboard.js"


clinicApp.loadFromLocalStorage();
if(!clinicApp.pw){
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
        if(createPassword(newPassword.value)){
            clinicApp.saveToLocalStorage();
            alert(`password ${clinicApp.pw.password}`);
        };
    }else{
        alert("passwords do not Match");
    }
})
}else{

const login = document.createElement("div");
const enterPassword = document.createElement("input");
const submit = document.createElement("button");

enterPassword.type = "password";
enterPassword.placeholder = "Enter Password";
submit.textContent = "Submit";

login.appendChild(enterPassword);
login.appendChild(submit);

document.body.appendChild(login); 

submit.addEventListener("click",()=>{
        if(enterPassword.value === clinicApp.pw.password){
            //isLoggedIn = true;
            alert(`this is the correct password congrats!!`);
            setIsLoggedIn(true);
            dashboard();  
        }else{
            alert(`this is not the correct passowrd!!!`);
        };

})
}


