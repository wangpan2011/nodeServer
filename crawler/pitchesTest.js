/**
 * Created by wangpan on 09/09/2018.
 */

const Sequelize = require('sequelize');
const DATABASE = require('./databases/database');
const Models = require('./databases/models.js');

crawler();
function test() {
    sequelize.authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
}
function crawler() {

    // var Pet = DATABASE.defineModel('pets', {
    //     name: Sequelize.DataTypes.STRING(100)
    // });
    // Pet.sync().then(() => {
    //     console.log("create pets table success");
    //     Pet.create({name: "Odie"})
    //         .then(pet => {
    //             console.log("开始更新+++++")
    //             pet.name = "Hello";
    //             pet.save()
    //                 .then(pet => console.log("保存成功：" + pet));
    //         });
    // });

    let Pet = Models.Pet;
    Pet.sync().then(() => {
        console.log("create pets table success");
        Pet.create({name: "Odie"})
            .then(pet => {
                console.log("开始更新+++++")
                pet.name = "Hello";
                pet.save()
                    .then(pet => console.log("保存成功：" + pet));
            });
    });
}

