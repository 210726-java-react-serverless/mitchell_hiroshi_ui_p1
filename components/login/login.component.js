import { ViewComponent } from '../view.component.js';
import env from '../../util/env.js';
import state from '../../util/state.js';
import router from '../../app.js';

LoginComponent.prototype = new ViewComponent('login');
function LoginComponent() {

    let usernameFieldElement;
    let passwordFieldElement;
    let loginButtonElement;
    let errorMessageElement;

    let username = '';
    let password = '';

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

    function login() {

        if (!username || !password) {
            updateErrorMessage('You need to provide a username and a password!');
            return;
        } else {
            updateErrorMessage('');
        }

        let credentials = {
            username: username,
            password: password
        };

        let status = 0;

        fetch(`${env.apiUrl}/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials)
        })
            .then(resp => {
                status = resp.status;
				state.authHeader = resp.headers?.get('authorization');
                return resp.json();
            })
            .then(payload => {
                if (status === 401) {
                    updateErrorMessage(payload.message);
                } else {
                    state.authUser = payload;
					localStorage.setItem('state', JSON.stringify({'authHeader': state.authHeader, 'authUser': state.authUser}));
					if (state.authUser.userPrivileges === "0")
						router.navigate('/dashboard');
					if (state.authUser.userPrivileges === "1")
						router.navigate('/admindashboard');
                }
            })
            .catch(err => console.error(err));

    }


    this.render = function() {
		if (!state.authUser) {
			if (localStorage.getItem('state') === null) {		
			}
			else
			{
				let cachedUser = JSON.parse(localStorage.getItem('state'));
				state.authUser = cachedUser.authUser;
				state.authHeader = cachedUser.authHeader;
				router.navigate('/dashboard');
				return;
			}
		}
		else{
			router.navigate('/dashboard'); 
			return;
		}
        LoginComponent.prototype.injectTemplate(() => {
            usernameFieldElement = document.getElementById('login-form-username');
            passwordFieldElement = document.getElementById('login-form-password');;
            loginButtonElement = document.getElementById('login-form-button');;
            errorMessageElement = document.getElementById('error-msg');

            usernameFieldElement.addEventListener('keyup', updateUsername);
            passwordFieldElement.addEventListener('keyup', updatePassword);
            loginButtonElement.addEventListener('click', login);

            window.history.pushState('login', 'Login', '/login');
        });
        LoginComponent.prototype.injectStylesheet();				

    }

}

export default new LoginComponent();