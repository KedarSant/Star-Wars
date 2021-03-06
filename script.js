
$(function () {
    $('[data-toggle="popover"]').popover()
})


function createCard(title, body) {

    let id_card = Math.floor(Math.random() * 10000);
    let col = document.createElement('div');
    col.className = 'col-lg-4 col-md-4 col-sm-12 mb-3';
    col.innerHTML = `<div class="card bg-warning" id="${title.replace(/\s/g, '').toLowerCase()}">
                        <div class="card-body">
                            <img class="card-img-top mb-5" src="image.jpg" alt="Card image cap">
                            <div class="mb-2 card-header">
                                <h3 class="card-title">${title}</h3>
                                <a class="btn btn-dark" data-toggle="collapse"
                                    data-target="#_${id_card}" 
                                    aria-expanded="true" aria-controls="collapseOne">
                                    Expand
                                </a>
                            </div>
                            <p class="collapse card-text" id="_${id_card}">${body}</p>
                        </div>
                    </div>`;
    return col;
}

function createNavbarItem(category) {
    let li = document.createElement('li');
    li.className = 'nav-item';
    li.innerHTML = `<a class="nav-link" href="#${category}">${category.toUpperCase()}</a>`;
    return li;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function createGrid(category) {
    let h2 = document.createElement('h2');
    h2.className = 'mb-3 text-center';
    h2.id = `${category}`;
    h2.innerHTML = `<hr color='white'> ${capitalizeFirstLetter(category)} <hr color='white'>`;
    let div = document.createElement('div');
    div.className = 'row mb-5';
    div.id = `row${category}`;
    return [h2, div];
}

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}

axios('https://blooming-thicket-64006.herokuapp.com/https://swapi.dev/api')
    .then(res => {
        for (let category in res.data) {
            document.getElementById('topNav').appendChild(createNavbarItem(category));
            let [h2, div] = createGrid(category);
            let container = document.getElementById('GridContainer');
            container.appendChild(h2);
            container.appendChild(div);
            axios(res.data[category])
                .then(res => {
                    res.data.results.forEach(categoryObject => {
                        let title = categoryObject.title ? categoryObject.title : categoryObject.name;
                        let body = '';
                        for (let key in categoryObject) {
                            if (!Array.isArray(categoryObject[key])) {
                                if (validURL(categoryObject[key])) {
                                    body = body + `${capitalizeFirstLetter(key)} : 
                                    <a href='${categoryObject[key]}'>${categoryObject[key]}</a><br>`;
                                }
                                else if (key !== 'created' && key !== 'edited') {
                                    body = body + `${capitalizeFirstLetter(key)} : ${categoryObject[key]}<br>`;
                                }
                            }
                        }
                        document.getElementById(`row${category}`).appendChild(createCard(title,body));
                    })
                })
        }
    })

document.getElementById('search').addEventListener('mouseenter', function () {

    let query = document.getElementById('searchText').value;
    query = query.replace(/\s/g, '').toLowerCase();

    if (document.getElementById(query) == null) {
        this.setAttribute('data-content', 'Not found');
    }
    else {
        this.setAttribute('data-content',' ');
    }
})

document.getElementById('search').addEventListener('click', function () {
    
    let query = document.getElementById('searchText').value;
    query = query.replace(/\s/g, '').toLowerCase();
    
    if (document.getElementById(query) == null) {
        this.setAttribute('href','#')
    }
    else {
        this.setAttribute('href', `#${query}`);
    }
})
