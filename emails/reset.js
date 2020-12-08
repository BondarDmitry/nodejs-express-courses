const keys = require("../keys");

module.exports = function (email, token) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: "Востановление доступа",
        html: `
            <h1>Вы забыли пароль</h1>
            <p>Если нет, то проигнорируйте это письмо.</p>
            <p>Иначе нажмите на ссылку.</p>
            <a href="${keys.BASE_URL}/auth/password/${token}">Востановить доступ</a>
            <hr>
            <a href="${keys.BASE_URL}">Магазин Курсов</a>
        `,
    };
};
