document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const form = e.target;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  if (!name || !email || !message) {
    displayResponse('Please fill in all required fields.', 'error');
    return;
  }

  if (!validateEmail(email)) {
    displayResponse('Please enter a valid email address.', 'error');
    return;
  }

  // Simulate form submission (replace with actual integration)
  displayResponse('Sending your message...', 'info');

  setTimeout(() => {
    displayResponse('Thank you! Your message has been sent.', 'success');
    form.reset();
  }, 1500);
});

function displayResponse(msg, type) {
  const response = document.getElementById('formResponse');
  response.textContent = msg;
  response.style.color = type === 'error' ? 'red' : type === 'success' ? 'lightgreen' : 'white';
}

function validateEmail(email) {
  // Basic email validation regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
