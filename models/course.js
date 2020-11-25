const { v4: uuid } = require("uuid");
const fs = require("fs");
const path = require("path");

class Course {
    constructor(title, price, image) {
        this.title = title;
        this.price = price;
        this.image = image;
        this.id = uuid();
    }

    toJSON() {
        return {
            title: this.title,
            price: this.price,
            image: this.image,
            id: this.id,
        };
    }

    async save() {
        const courses = await Course.getAll();
        courses.push(this.toJSON());

        return new Promise((res, rej) => {
            fs.writeFile(
                path.join(__dirname, "..", "data", "courses.json"),
                JSON.stringify(courses),
                (error) => {
                    if (error) {
                        rej(error);
                    } else {
                        res();
                    }
                }
            );
        });
    }

    static getAll() {
        return new Promise((res, rej) => {
            fs.readFile(
                path.join(__dirname, "..", "data", "courses.json"),
                "utf-8",
                (error, content) => {
                    if (error) {
                        rej(error);
                    } else {
                        res(JSON.parse(content));
                    }
                }
            );
        });
    }

    static async getById(id) {
        const courses = await Course.getAll();
        return courses.find((c) => c.id === id);
    }
}

module.exports = Course;
