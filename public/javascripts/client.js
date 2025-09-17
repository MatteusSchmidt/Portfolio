document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('email-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let mail = new FormData(form);
        sendMail(mail);
    });

    const sendMail = (mail) => {
        document.querySelectorAll('#email-form input, #email-form textarea, #email-form button').forEach(el => el.disabled = true);
        document.getElementById('email-form').classList.add('submitting');

        fetch("/send", {
            method: "POST",
            body: mail,
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                form.reset();
                alert(data.message || "Form submitted successfully!");
            })
            .catch((error) => {
                console.error('Error:', error);
                alert("An error occurred while submitting the form. Please try again.");
            })
            .finally(() => {
                document.querySelectorAll('#email-form input, #email-form textarea, #email-form button').forEach(el => el.disabled = false);
                document.getElementById('email-form').classList.remove('submitting');
            });
    };
});