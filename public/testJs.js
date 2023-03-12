'use strict';

async function doAjax(url, params = {}, method = 'POST') {
    return $.ajax({
        url: url,
        type: method,
        dataType: 'json',
        data: params
    }).fail(function (res) {
        console.log(res.responseJSON);
    });

}


window.onload = async function () {


}

async function logIn() {
    let params = {
        "password": "1234",
        "email": "moshe@gmail.com"
    };
    let logIn = await doAjax(`/users/logIn`, params, `POST`)
    console.log(logIn);
    $('#results').html(JSON.stringify(logIn, null, '\t'));

}
async function createProject() {

    let params = {
        "p_name": $('#project_name').val(),
        "info": "adfgjkvhwdbwbg",
        "users_id":["12334"],
        "user_manager_id" :"1234"
      
    };
    let projects = await doAjax(`/projects`, params, `POST`)
    console.log(projects);
    $('#results').html(JSON.stringify(projects, null, '\t'));
}

async function costumerProjects() {

    let projects = await doAjax(`/projects/costumerProjects`, null, `GET`)
    console.log(projects);
    $('#results').html(JSON.stringify(projects, null, '\t'));
}