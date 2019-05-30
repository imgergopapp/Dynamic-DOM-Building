function createAlbumsList(albums) {
    const ulEl = document.createElement('ul');

    for (let i = 0; i < albums.length; i++) {
        const album = albums[i];

        const linkEl = document.createElement('a');

        linkEl.textContent = album.title;
        linkEl.href = "javascript:void(0);";
        linkEl.onclick = function () {onAlbumClicked(album.id)};

        nestedUlEl = document.createElement('ul');
        nestedUlEl.id = ('id', 'nestedAlbumUl' +  album.id);
        nestedUlEl.classList.add('nestedAlbumUl');

        const pEl = document.createElement('p');
        pEl.appendChild(document.createTextNode('albums id: ' + album.id));

        const liEl = document.createElement('li');
        liEl.appendChild(linkEl);
        liEl.appendChild(pEl);
        liEl.appendChild(nestedUlEl);

        ulEl.appendChild(liEl);
    }

    return ulEl;
}

function onAlbumClicked(albumId) {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onPhotosReceived);
    xhr.open('GET', BASE_URL + '/photos?albumId=' + albumId);
    xhr.send();
}

function onPhotosReceived() {
    const text = this.responseText;
    const photos = JSON.parse(text);
    showNestedUl(photos[0].albumId, 'nestedAlbumUl');

    const divEl = document.getElementById('nestedAlbumUl' + photos[0].albumId);

    while (divEl.firstChild) {
        divEl.removeChild(divEl.firstChild);
    }
    for (let i = 0; i < photos.length; i++) {
        let photo = photos[i];
        const liEl = document.createElement('li');
        const img = document.createElement('img');
        img.src = photo.thumbnailUrl;
        img.alt = 'picture\'s id: ' + photo.albumId;
        img.width = 50;
        img.length = 50;
        liEl.appendChild(img);
        divEl.appendChild(liEl);
    }
}

function onLoadAlbums() {
    const el = this;
    const userId = el.getAttribute('data-user-id');

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onAlbumsReceived);
    xhr.open('GET', BASE_URL + '/albums?userId=' + userId);
    xhr.send();
}


function onAlbumsReceived() {
    const text = this.responseText;
    const albums = JSON.parse(text);

    const divEl = document.getElementById('albums-content');
    while (divEl.firstChild) {
        divEl.removeChild(divEl.firstChild);
    }
    divEl.appendChild(createAlbumsList(albums));
}
