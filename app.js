
/**
 * Scroll animation
 */
function scrollAppear() {
	const screenPosition = window.innerHeight;
	const scrollAnimateElements = document.querySelectorAll('.scroll-elements');
	scrollAnimateElements.forEach(el => {
		const imgPosition = el.getBoundingClientRect().top;
		if (imgPosition < screenPosition) {
			el.classList.add('scroll-appear');
		}
	});
}

// https://www.freecodecamp.org/news/javascript-debounce-example/
function debounce(func, timeout = 100) {
	let timer;
	return (...args) => {
		// if (!timer) {
		// 	func.apply(this, args);
		// }
		clearTimeout(timer);
		timer = setTimeout(() => {func.apply(this, args); }, timeout);
	}
}

window.addEventListener('scroll', debounce(scrollAppear));


// capture form submission, send via node to email
const form = document.querySelector('form');
const nameError = document.querySelector('.invalid-name');
const nameField = document.querySelector("#name");
const email = document.querySelector("#email");
const emailError = document.querySelector('.invalid-email');
const msg = document.querySelector("#message");
const msgError = document.querySelector('.invalid-msg');
const submitBtn = document.querySelector("#submit-btn");
const formInfo = {};
const isTouched = false;
let isFormValid = {
	name: false,
	email: false,
	msg: false
}
const successMsg = document.querySelector('.success-msg');
const errorMsg = document.querySelector('.error-msg');

form.addEventListener('submit', evt => {
	if (!nameField.value) {
		nameField.classList.add('is-invalid');
		nameError.classList.add('show-error');
		isFormValid.name = false;
		evt.preventDefault();
	}
	if (!email.value || !isValidEmail(email.value)) {
		email.classList.add('is-invalid');
		emailError.classList.add('show-error');
		isFormValid.email = false;
		evt.preventDefault();
	}
	if (!(msg.value.trim())) {
		msg.classList.add('is-invalid');
		msgError.classList.add('show-error');
		isFormValid.msg = false;
		evt.preventDefault();
	}
	const formValid = Object.values(isFormValid).every(val => !!val);
	if (formValid) {
		evt.preventDefault();
		const formData = {name: nameField.value, email: email.value, msg: msg.value};
		submitForm(formData);
	}
});

function submitForm(formData) {
	const {name, email, msg} = formData;
	fetch("https://formsubmit.co/ajax/e786f99ce0cb24956c2fb13244a20252", {
    method: "POST",
    headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    body: JSON.stringify({name, email, msg})
})
    .then(response => response.json())
    .then(data => {
		if (data) {
			hideFormElements();
			showAlert('success');
		}
	})
    .catch(error => {
		hideFormElements();
		showAlert('error');
	});
}

function hideFormElements() {
	const formGroups = document.getElementsByClassName('form-group');
	const textArea = document.getElementsByTagName('textarea');
	[...formGroups, ...textArea, submitBtn].forEach(element => element.classList.add('hidden'));
	submitBtn.disabled = true;
}

function showAlert(alertType) {
	if (alertType === 'success') {
		successMsg.classList.remove('hidden');
		successMsg.classList.add('fadeAnimation');
	} else if (alertType === 'error') {
		errorMsg.classList.remove('hidden');
		errorMsg.classList.add('fadeAnimation');
	}
}

form.addEventListener('input', evt => {
	// do not remove validation while form is still invalid
	// form invalidity is only registered if attempt was made to submit
	if (!isFormValid.email && email.value && isValidEmail(email.value)) {
		email.classList.remove('is-invalid');
		emailError.classList.remove('show-error');
		isFormValid.email = true;
	}
	if (!isFormValid.name && nameField.value) {
		nameField.classList.remove('is-invalid');
		nameError.classList.remove('show-error');
		isFormValid.name = true;
	}
	if (!isFormValid.msg && msg.value.trim()) {
		msg.classList.remove('is-invalid');
		msgError.classList.remove('show-error');
		isFormValid.msg = true;
	}
});

// https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
function isValidEmail(email) {
	// https://www.regular-expressions.info/email.html
	const pattern = /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/;
	return pattern.test(String(email).toLowerCase());
}

