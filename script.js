```
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.subject-card button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            alert('Redirecting to notes...');
            // Here you can add functionality to redirect to the notes page
        });
    });
});
```