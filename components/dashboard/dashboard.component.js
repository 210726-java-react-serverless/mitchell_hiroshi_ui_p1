import { ViewComponent } from '../view.component.js';
import env from '../../util/env.js';
import state from '../../util/state.js';
import router from '../../app.js';

DashboardComponent.prototype = new ViewComponent('dashboard');
function DashboardComponent() {

    let errorMessageElement;
    let batchlistElement;
	let enrollButton;
	let withdrawButton;
	let batches = [];
	
	function updateErrorMessage(errorMessage) {
        if (errorMessage) {
            errorMessageElement.removeAttribute('hidden');
            errorMessageElement.innerText = errorMessage;
        } else {
            errorMessageElement.setAttribute('hidden', 'true');
            errorMessageElement.innerText = '';
        }
    }
	
	function enroll() {
		let name = document.getElementById('enrollShortName').value;
		
		let status = 0;
		
		let raw = `{\"shortName\": \"${name}\"}`;
        fetch(`${env.apiUrl}/student`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
				'Authorization': `${state.authHeader}`
            },
            body: raw
        })
            .then(resp => {
                status = resp.status;
                return resp.json();
            })
            .then(payload => {
                if (status > 299) {
                    updateErrorMessage(payload.message);
                } else {
                    router.navigate('/dashboard');
                }
            })
            .catch(err => console.error(err));
	}
	
	function withdraw() {
		let name = document.getElementById('withdrawShortName').value;
		
		let status = 0;
		
		let raw = `{\"shortName\": \"${name}\"}`;
        fetch(`${env.apiUrl}/student`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
				'Authorization': `${state.authHeader}`
            },
            body: raw
        })
            .then(resp => {
                status = resp.status;
                return resp.json();
            })
            .then(payload => {
                if (status > 299) {
                    updateErrorMessage(payload.message);
                } else {
                    router.navigate('/dashboard');
                }
            })
            .catch(err => console.error(err));
		
	}
	
	function getBatches() {
		let status = 0;

		fetch(`${env.apiUrl}/batch`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			}
		})
			.then(resp => {
				status = resp.status;
				return resp.json();
			})
			.then(payload => {
                if (status > 299) {
					updateErrorMessage(payload.message);
				} else {
					addBatchesToTable(payload);
				}
			})
			.catch(err => console.error(err));
	}
	
	function addBatchesToTable(batches){
		let table = document.getElementById('batch-table-body');
		batches.forEach(function (value, i) {
			var row = table.insertRow(i);
			var cell1 = row.insertCell(0);
			var cell2 = row.insertCell(1);
			var cell3 = row.insertCell(2);
			var cell4 = row.insertCell(3);
			var cell5 = row.insertCell(4);
			cell1.innerHTML = value.id
			cell2.innerHTML = value.shortName
			cell3.innerHTML = value.name
			cell4.innerHTML = value.description
			if (value.usersRegistered.includes(state.authUser.username))
			{
				cell5.innerHTML = "Enrolled";
			}
			else
			{
				cell5.innerHTML = "Available";
			}
			
		});
	}
	

    this.render = function() {
		if (!state.authUser || state.authUser === null) {
			if (localStorage.getItem('state') === null) {		
				router.navigate('/login');
				return;
			}
			else
			{
				let cachedUser = JSON.parse(localStorage.getItem('state'));
				state.authUser = cachedUser?.authUser;
				state.authHeader = cachedUser?.authHeader;
			}
        }
		if (state?.authUser?.userPrivileges === "1"){
			router.navigate('/admindashboard');
			return;
		}
        DashboardComponent.prototype.injectTemplate(() => {
            batchlistElement = document.getElementById('batchlist');
			enrollButton = document.getElementById('enrollButton');
			withdrawButton = document.getElementById('withdrawButton');	
			errorMessageElement = document.getElementById('error-msg');
			
			enrollButton.addEventListener('click', enroll);
			withdrawButton.addEventListener('click', withdraw);
			

			
            window.history.pushState('dashboard', 'Dashboard', '/dashboard');
			

			
			getBatches();	
        });
		DashboardComponent.prototype.injectStylesheet();
    }

}

export default new DashboardComponent();
