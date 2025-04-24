verify endpoint not working,
success is not defined

ReferenceError: C:\Users\malay\OneDrive\Documents\CODES\Flamecoders\backend\views\pages\verify-email.ejs:46
    44|         <h1>Email Verification</h1>

    45| 

 >> 46|         <% if (success) { %>

    47|         <p class="success">✅ Your email has been successfully verified.</p>

    48|         <p><a href="/login">Click here to log in</a></p>

    49|         <% } else if (error) { %>


success is not defined
    at eval ("C:\\Users\\malay\\OneDrive\\Documents\\CODES\\Flamecoders\\backend\\views\\pages\\verify-email.ejs":12:8)
    at verify-email (C:\Users\malay\OneDrive\Documents\CODES\Flamecoders\backend\node_modules\ejs\lib\ejs.js:703:17)
    at tryHandleCache (C:\Users\malay\OneDrive\Documents\CODES\Flamecoders\backend\node_modules\ejs\lib\ejs.js:274:36)
    at exports.renderFile [as engine] (C:\Users\malay\OneDrive\Documents\CODES\Flamecoders\backend\node_modules\ejs\lib\ejs.js:491:10)
    at View.render (C:\Users\malay\OneDrive\Documents\CODES\Flamecoders\backend\node_modules\express\lib\view.js:135:8)
    at tryRender (C:\Users\malay\OneDrive\Documents\CODES\Flamecoders\backend\node_modules\express\lib\application.js:657:10)
    at Function.render (C:\Users\malay\OneDrive\Documents\CODES\Flamecoders\backend\node_modules\express\lib\application.js:609:3)
    at ServerResponse.render (C:\Users\malay\OneDrive\Documents\CODES\Flamecoders\backend\node_modules\express\lib\response.js:1049:7)
    at verifyMagicLink (C:\Users\malay\OneDrive\Documents\CODES\Flamecoders\backend\controllers\magic\auth.controller.js:11:36)
    at Layer.handle [as handle_request] (C:\Users\malay\OneDrive\Documents\CODES\Flamecoders\backend\node_modules\express\lib\router\layer.js:95:5)