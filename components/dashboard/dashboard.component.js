import { ViewComponent } from '../view.component.js';
import env from '../../util/env.js';
import state from '../../util/state.js';
import router from '../../app.js';

DashboardComponent.prototype = new ViewComponent('dashboard');
function DashboardComponent() {

    let batchlistElement;
	let enrollButton;
	let withdrawButton;
	let batches = [];
	
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
                if (status === 401) {
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
                if (status === 401) {
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
				if (status === 401) {
					updateErrorMessage(payload.message);
				} else {
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
        if (!state.authUser) {
            router.navigate('/login');
            return;
        }
		if (state.authUser.userPrivileges === "1"){
			router.navigate('/admindashboard');
		}
        DashboardComponent.prototype.injectTemplate(() => {
            batchlistElement = document.getElementById('batchlist');
			enrollButton = document.getElementById('enrollButton');
			withdrawButton = document.getElementById('withdrawButton');	
			enrollButton.addEventListener('click', enroll);
			withdrawButton.addEventListener('click', withdraw);
            window.history.pushState('dashboard', 'Dashboard', '/dashboard');
			
			getBatches();	
        });
		DashboardComponent.prototype.injectStylesheet();
    }

}

export default new DashboardComponent();
