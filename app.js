console.log("connected");

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
	const sections = document.querySelectorAll('.section-desc');
	sections.forEach((el, idx) => {
		const textPosition = el.getBoundingClientRect().top;
		if (textPosition < screenPosition) {
			console.log(`text ${textPosition} -- screen ${screenPosition}`);
			const animationClass = idx%2 === 0 ? 'text-animation-right' : 'text-animation-left';
			el.classList.add(animationClass);
			el.classList.add('fadeAnimation');
		}
	})
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
// const company = document.querySelector("#company");
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

form.addEventListener('submit', evt => {
	// evt.preventDefault();
	// let userFeedback = [];
	if (!nameField.value) {
		// userFeedback.push('Name is required');
		// nameError.innerHTML = 'Name is required';
		nameField.classList.add('is-invalid');
		nameError.classList.add('show-error');
		isFormValid.name = false;
		evt.preventDefault();
	}
	if (!email.value || !isValidEmail(email.value)) {
		// email.classList.add('is-invalid');
		// userFeedback.push('Please enter a valid email');
		// emailError.innerHTML = 'Please enter a valid email';
		email.classList.add('is-invalid');
		emailError.classList.add('show-error');
		isFormValid.email = false;
		evt.preventDefault();
	}
	if (!(msg.value.trim())) {
		// msgError.innerHTML = 'Please enter a message';
		msg.classList.add('is-invalid');
		msgError.classList.add('show-error');
		isFormValid.msg = false;
		evt.preventDefault();
	}
	//TODO: nodeMailer
	const formValid = Object.values(isFormValid).every(val => !!val);
	if (formValid) {
		// TODO: add submission to backend here
		hideFormElements();
		showSuccessMsg();
		console.log('Valid form: ', {name: nameField.value, email: email.value, msg: msg.value});
	}
});

function hideFormElements() {
	const formGroups = document.getElementsByClassName('form-group');
	const textArea = document.getElementsByTagName('textarea');
	[...formGroups, ...textArea, submitBtn].forEach(element => element.classList.add('hidden'));
	submitBtn.disabled = true;
}

function showSuccessMsg() {
	successMsg.classList.remove('hidden');
	successMsg.classList.add('fadeAnimation');
}

form.addEventListener('input', evt => {
	// do not remove validation while form is still invalid
	// form invalidity is only registered if attempt was made to submit
	if (!isFormValid.email && email.value && isValidEmail(email.value)) {
		email.classList.remove('is-invalid');
		// email.classList.add('is-valid');
		emailError.classList.remove('show-error');
		isFormValid.email = true;
	}
	if (!isFormValid.name && nameField.value) {
		nameField.classList.remove('is-invalid');
		// nameField.classList.add('is-valid');
		nameError.classList.remove('show-error');
		isFormValid.name = true;
	}
	if (!isFormValid.msg && msg.value.trim()) {
		msg.classList.remove('is-invalid');
		// msg.classList.add('is-valid');
		msgError.classList.remove('show-error');
		isFormValid.msg = true;
	}
});

// submitBtn.addEventListener("click", (e) => {
// 	e.preventDefault();
// 	console.log("submitted");
// 	console.dir(email);
// 	console.dir(msg);	
// 	console.log("email: ", email.value);
// 	console.log("name: ", nameField.value);
// 	// if (!nameField.value) {
// 	// 	nameField.classList.add('is-invalid');
// 	// }
// 	// if (!email.value || !isValidEmail(email.value)) {
// 	// 	email.classList.add('is-invalid');
// 	// }
// 	console.log("text: ", msg.value);
// 	const emailProps = Object.getOwnPropertyNames(email.validity);
// 	console.log('emailProps: ', emailProps);
// 	[ nameField, email, msg ].forEach((field) => {
// 		formInfo[field.name] = field.value.trim();
// 	});
// 	console.log("form: ", formInfo);
// 	// error handling if field is left blank

// 	// success msg
// });

// https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
function isValidEmail(email) {
    // const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	// https://www.regular-expressions.info/email.html
	const pattern = /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/;
	return pattern.test(String(email).toLowerCase());
}

// Node calls to NodeMailer
// fetch('${emailURL}', formInfo)
