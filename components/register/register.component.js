import { ViewComponent } from '../view.component.js';
import env from '../../util/env.js';
import state from '../../util/state.js';
import router from '../../app.js';

RegisterComponent.prototype = new ViewComponent('register');

function RegisterComponent() {
	
    let firstnameFieldElement;
    let lastnameFieldElement;
	let emailFieldElement;
	let usernameFieldElement;
    let passwordFieldElement;

    let registerButtonElement;
    let errorMessageElement;


    let firstName = '';
    let lastName = '';
    let email = '';
    let username = '';
    let password = '';

    function updateFirstName(e) {
        firstName = e.target.value;
        console.log(firstName);
    }

    function updateLastName(e) {
        lastName = e.target.value;
        console.log(lastName);
    }
	
	function updateEmail(e) {
        email = e.target.value;
        console.log(email);
    }
	
	function updateUsername(e) {
        username = e.target.value;
        console.log(username);
    }
	
	function updatePassword(e) {
        password = e.target.value;
        console.log(password);
    }

    function updateErrorMessage(errorMessage) {
        if (errorMessage) {
            errorMessageElement.removeAttribute('hidden');
            errorMessageElement.innerText = errorMessage;
        } else {
            errorMessageElement.setAttribute('hidden', 'true');
            errorMessageElement.innerText = '';
        }
    }

    function register() {

        if (!username || !password || !email || !firstName || !lastName) {
            updateErrorMessage('You need to provide a username and a password!');
            return;
        } else {
            updateErrorMessage('');
        }

        let credentials = {
			firstName: firstName,
			lastName: lastName,
			email: email,
            username: username,
            password: password
        };

        let status = 0;

        fetch(`${env.apiUrl}/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials)
        })
            .then(resp => {
                status = resp.status;
                return resp.json();
            })
            .then(payload => {
                if (status === 401) {
                    updateErrorMessage(payload.message);
                } else {
                    state.authUser = payload;
                    router.navigate('/dashboard');
                }
            })
            //.catch(err => console.error(err));
			
	}

    this.render = function() {

        RegisterComponent.prototype.injectTemplate(() => {
            firstnameFieldElement = document.getElementById('register-form-firstname');
			lastnameFieldElement = document.getElementById('register-form-lastname');
			emailFieldElement = document.getElementById('register-form-email');
            usernameFieldElement = document.getElementById('register-form-username');
            passwordFieldElement = document.getElementById('register-form-password');;
            registerButtonElement = document.getElementById('register-form-button');;
            errorMessageElement = document.getElementById('error-msg');


            firstnameFieldElement.addEventListener('keyup', updateFirstName);
			lastnameFieldElement.addEventListener('keyup', updateLastName);
			emailFieldElement.addEventListener('keyup', updateEmail);
            usernameFieldElement.addEventListener('keyup', updateUsername);
            passwordFieldElement.addEventListener('keyup', updatePassword);
            registerButtonElement.addEventListener('click', register);

            window.history.pushState('register', 'Register', '/register');
        });
		RegisterComponent.prototype.injectStylesheet();
    }

}

export default new RegisterComponent();