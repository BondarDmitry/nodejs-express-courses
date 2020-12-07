const toCurrency = (price) => {
    return new Intl.NumberFormat("ru-RU", {
        currency: "rub",
        style: "currency",
    }).format(price);
};

const toDate = (date) => {
    return new Intl.DateTimeFormat("ru-RU", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    }).format(new Date(date));
};

document.querySelectorAll(".date").forEach((node) => {
    node.textContent = toDate(node.textContent);
});

document.querySelectorAll(".price").forEach((node) => {
    node.textContent = toCurrency(node.textContent);
});

const $card = document.querySelector("#card");
if ($card) {
    $card.addEventListener("click", (event) => {
        if (event.target.classList.contains("js-remove")) {
            const csrf = event.target.dataset.csrf;
            const id = event.target.dataset.id;
            fetch("/card/remove/" + id, {
                method: "delete",
                headers: {
                    "X-XSRF-TOKEN": csrf,
                },
            })
                .then((response) => response.json())
                .then((card) => {
                    console.log(card);
                    if (card.courses.length) {
                        const html = card.courses
                            .map((c) => {
                                return `       
                            <tr>
                                <td>${c.title}</td>
                                <td>${c.count}</td>
                                <td>
                                    <button class="btn btn-small red js-remove" data-id=${c.id}>Удалить</button>
                                </td>
                            </tr>`;
                            })
                            .join("");
                        $card.querySelector("tbody").innerHTML = html;
                        $card.querySelector(".price").textContent = toCurrency(
                            card.price
                        );
                    } else {
                        $card.innerHTML = "<p>Корзина пуста</p>";
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    });
}

M.Tabs.init(document.querySelectorAll(".tabs"));
