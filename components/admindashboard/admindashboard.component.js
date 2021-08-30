import { ViewComponent } from '../view.component.js';
import env from '../../util/env.js';
import state from '../../util/state.js';
import router from '../../app.js';

AdminDashboardComponent.prototype = new ViewComponent('admindashboard');
function AdminDashboardComponent() {

    let errorMessageElement;
    let batchlistElement;
	let addButton;
	let modifyButton;
	let deleteButton;
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
	
	function addBatch() {
		let shortName 			= document.getElementById('addShortName').value;
		let name 				= document.getElementById('addName').value;			
		let description			= document.getElementById('addDescription').value; 
		let batchstatus 		= document.getElementById('addStatus').value;		
		let registrationStart 	= document.getElementById('addRegStart').value;	
		let registrationEnd 	= document.getElementById('addRegEnd').value;	
		
		let status = 0;
		
		let raw = `{\"shortName\": \"${shortName}\","name\": \"${name}\",\"description\": \"${description}\",\"status\": \"${batchstatus}\",\"registrationStart\": \"${registrationStart}\",\"registrationEnd\": \"${registrationEnd}\"}`;
        fetch(`${env.apiUrl}/batch`, {
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
                    router.navigate('/admindashboard');
                }
            })
            .catch(err => console.error(err));
	}
	
	function modifyBatch() {
		let original;
		let shortName 			= document.getElementById('modifyShortName').value;
		if (!shortName) router.navigate('/admindashboard'); else { original = batches.find(x => x.shortName == shortName);}
		let name 				= document.getElementById('modifyName').value; 			if (!name) name = original.name;
		let description			= document.getElementById('modifyDescription').value; 	if (!description) description = original.description;
		let batchstatus 		= document.getElementById('modifyStatus').value; 		if (!batchstatus) batchstatus = original.status;
		let registrationStart 	= document.getElementById('modifyRegStart').value; 		if (!registrationStart) registrationStart = original.registrationStart;
		let registrationEnd 	= document.getElementById('modifyRegEnd').value; 		if (!registrationEnd) registrationEnd = original.registrationEnd;
		
		let status = 0;
		
		let raw = `{\"shortName\": \"${shortName}\","name\": \"${name}\",\"description\": \"${description}\",\"status\": \"${batchstatus}\",\"registrationStart\": \"${registrationStart}\",\"registrationEnd\": \"${registrationEnd}\"}`;
        fetch(`${env.apiUrl}/batch`, {
            method: 'PUT',
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
                    router.navigate('/admindashboard');
                }
            })
            .catch(err => console.error(err));
		
	}
	
	function deleteBatch() {
		let name = document.getElementById('deleteShortName').value;
		
		let status = 0;
		
		let raw = `{\"shortName\": \"${name}\"}`;
        fetch(`${env.apiUrl}/batch`, {
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
                    router.navigate('/admindashboard');
                }
            })
            .catch(err => console.error(err));
		
	}
	
	function getBatches() {
		let status = 0;

		fetch(`${env.apiUrl}/batch/all`, {
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
					batches = payload;
					addBatchesToTable(payload);
				}
			})
			.catch(err => console.error(err));
	}
	
	function addBatchesToTable(batches){
	//[
    // {
        // "id": "6113dada3c35917ead302064",
        // "shortName": "042013",
        // "name": "CIT 9999",
        // "status": "Enabled",
        // "description": "CIT FUNDAMENTALS",
        // "registrationStart": 1625097600,
        // "registrationEnd": 1630454400,
        // "usersRegistered": []
    // },
    // {
        // "id": "6114253c748d29131d633ffa",
        // "shortName": "111110",
        // "name": "TEST",
        // "status": "Enabled",
        // "description": "whatev",
        // "registrationStart": 1625097600,
        // "registrationEnd": 1630454400,
        // "usersRegistered": []
    // },
    // {
        // "id": "612aa3921461fa7522f38b7f",
        // "shortName": "shortName",
        // "name": "name",
        // "status": "Enabled",
        // "description": "description",
        // "registrationStart": 1464457184.937,
        // "registrationEnd": 1653759584.937,
        // "usersRegistered": []
    // },
    // {
        // "id": "612aa6f6d10d8d37cbf146e7",
        // "shortName": "testBatch",
        // "name": "name",
        // "status": "Enabled",
        // "description": "description",
        // "registrationStart": 1464457184.937,
        // "registrationEnd": 1653759584.937,
        // "usersRegistered": []
    // }
	//]
		let table = document.getElementById('batch-table-body');
		batches.forEach(function (value, i) {
			var row = table.insertRow(i);
			var cell1 = row.insertCell(0);
			var cell2 = row.insertCell(1);
			var cell3 = row.insertCell(2);
			var cell4 = row.insertCell(3);
			var cell5 = row.insertCell(4);
			var cell6 = row.insertCell(5);
			var cell7 = row.insertCell(6);
			var cell8 = row.insertCell(7);
			
			cell1.innerHTML = value.id
			cell2.innerHTML = value.shortName
			cell3.innerHTML = value.name
			cell4.innerHTML = value.description
			cell5.innerHTML = value.registrationStart
			cell6.innerHTML = value.registrationEnd
			cell7.innerHTML = value.status
			cell8.innerHTML = value.usersRegistered.toString()
		});
	}
	

    this.render = function() {
		if (!state.authUser) {
			if (localStorage.getItem('state') === null) {		
				router.navigate('/login');
				return;
			}
			else
			{
				let cachedUser = JSON.parse(localStorage.getItem('state'));
				state.authUser = cachedUser.authUser;
				state.authHeader = cachedUser.authHeader;
			}
        }
		if (state.authUser.userPrivileges === "0"){
			router.navigate('/dashboard');
			return;
		}
        AdminDashboardComponent.prototype.injectTemplate(() => {
            batchlistElement = document.getElementById('batchlist');
		
			addButton = document.getElementById('addButton');
			modifyButton = document.getElementById('modifyButton');	
			deleteButton = document.getElementById('deleteButton');	
			errorMessageElement = document.getElementById('error-msg');
			
			addButton.addEventListener('click', addBatch);
			modifyButton.addEventListener('click', modifyBatch);
			deleteButton.addEventListener('click', deleteBatch);
			

			
            window.history.pushState('admindashboard', 'Admindashboard', '/admindashboard');
			
			getBatches();	
        });
		AdminDashboardComponent.prototype.injectStylesheet();
    }

}

export default new AdminDashboardComponent();
