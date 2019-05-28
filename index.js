const BASE_URL = 'https://jsonplaceholder.typicode.com';

let usersDivEl;
let postsDivEl;
let loadButtonEl;

function createPostsList(posts) {
    const ulEl = document.createElement('ul');

    for (let i = 0; i < posts.length; i++) {
        const post = posts[i];

        const linkEl = document.createElement('a');

        linkEl.textContent =post.title;
        linkEl.href="javascript:void(0);";
        linkEl.onclick = function() {onPostClicked(i+1)};         
        
        nestedUlEl = document.createElement('ul');
        nestedUlEl.id = ('id','nestedUl'+(i+1));
        nestedUlEl.classList.add('nestedUl');

        const pEl = document.createElement('p');
        pEl.appendChild(document.createTextNode(`: ${post.body}`));

        const liEl = document.createElement('li');
        liEl.appendChild(linkEl);
        liEl.appendChild(pEl);
        liEl.appendChild(nestedUlEl);

        ulEl.appendChild(liEl);
    }

    return ulEl;
}

function showNestedUl(id,className){
    const nestedUls = document.getElementsByClassName(className)
    for (let i = 0; i < nestedUls.length; i++){
        nestedUls[i].classList.add('hidden');
    }
    nestedUls[id-1].classList.remove('hidden');
}

function onPostClicked(postId){
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onCommentsReceived);
    xhr.open('GET', BASE_URL + '/comments?postId=' + postId);
    xhr.send();
}

function onCommentsReceived(){
    const text = this.responseText;
    const comments = JSON.parse(text);
    showNestedUl(comments[0].postId, 'nestedUl');

    const divEl = document.getElementById('nestedUl'+ comments[0].postId);

    while (divEl.firstChild) {
        divEl.removeChild(divEl.firstChild);
    }
    for (let i = 0; i < comments.length; i++){
        let comment = comments[i];
        const liEl = document.createElement('li');
        liEl.appendChild(document.createTextNode(`: ${comment.body}`)); 
        divEl.appendChild(liEl);
    }
}

function onPostsReceived() {
    postsDivEl.style.display = 'block';

    const text = this.responseText;
    const posts = JSON.parse(text);

    const divEl = document.getElementById('posts-content');
    while (divEl.firstChild) {
        divEl.removeChild(divEl.firstChild);
    }
    divEl.appendChild(createPostsList(posts));
}

function onLoadUserContent() {
    document.getElementById('albums').classList.remove('hidden');
    const el = this;
    const userId = el.getAttribute('data-user-id');

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onPostsReceived);
    xhr.open('GET', BASE_URL + '/posts?userId=' + userId);
    xhr.send();
}

function createUsersTableHeader() {
    const idTdEl = document.createElement('td');
    idTdEl.textContent = 'Id';

    const nameTdEl = document.createElement('td');
    nameTdEl.textContent = 'Name';

    const trEl = document.createElement('tr');
    trEl.appendChild(idTdEl);
    trEl.appendChild(nameTdEl);

    const theadEl = document.createElement('thead');
    theadEl.appendChild(trEl);
    return theadEl;
}

function createUsersTableBody(users) {
    const tbodyEl = document.createElement('tbody');

    for (let i = 0; i < users.length; i++) {
        const user = users[i];

        // creating id cell
        const idTdEl = document.createElement('td');
        idTdEl.textContent = user.id;

        // creating name cell
        const dataUserIdAttr = document.createAttribute('data-user-id');
        dataUserIdAttr.value = user.id;

        const buttonEl = document.createElement('button');
        buttonEl.textContent = user.name;
        buttonEl.setAttributeNode(dataUserIdAttr);
        buttonEl.addEventListener('click',onLoadUserContent);
        buttonEl.addEventListener('click',onLoadAlbums);

        const nameTdEl = document.createElement('td');
        nameTdEl.appendChild(buttonEl);

        // creating row
        const trEl = document.createElement('tr');
        trEl.appendChild(idTdEl);
        trEl.appendChild(nameTdEl);

        tbodyEl.appendChild(trEl);
    }

    return tbodyEl;
}

function createUsersTable(users) {
    const tableEl = document.createElement('table');
    tableEl.appendChild(createUsersTableHeader());
    tableEl.appendChild(createUsersTableBody(users));
    return tableEl;
}

function onUsersReceived() {
    loadButtonEl.remove();

    const text = this.responseText;
    const users = JSON.parse(text);

    const divEl = document.getElementById('users-content');
    divEl.appendChild(createUsersTable(users));
}

function onLoadUsers() {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onUsersReceived);
    xhr.open('GET', BASE_URL + '/users');
    xhr.send();
}

function showOnlyPosts(){
    const postsContentEl = document.getElementById('posts-content');
    const albumsContentEl = document.getElementById('albums-content')

    postsContentEl.classList.remove('hidden');
    albumsContentEl.classList.add('hidden');
}

function showOnlyAlbums(){
    const postsContentEl = document.getElementById('posts-content');
    const albumsContentEl = document.getElementById('albums-content')

    albumsContentEl.classList.remove('hidden');
    postsContentEl.classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', (event) => {
    usersDivEl = document.getElementById('users');
    postsDivEl = document.getElementById('posts');
    loadButtonEl = document.getElementById('load-users');
    loadButtonEl.addEventListener('click', onLoadUsers);

    let loadAlbumsButtonEl = document.getElementById('load-albums');
    loadAlbumsButtonEl.addEventListener('click', showOnlyAlbums);

    let loadPostsButtonEl = document.getElementById('load-posts');
    loadPostsButtonEl.addEventListener('click', showOnlyPosts);
});