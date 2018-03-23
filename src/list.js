import "../style/style.scss";

const myURL = "http://localhost:3000/products";
const productList = document.querySelector('.productsList');
const modifyField = document.querySelector('.modifyBackground');
const modifyWindow = document.querySelector('.modifyWindow');
const modifyDone = document.querySelector('#modificationDone');
var modifyID = 0; //zmienna przechowująca nr ID modyfikowanego elementu
var modifyValues = ""; //zmienna przechowująca aktualne wartości modyfikowanego elementu
var modifyImg = ""; //zmienna przechowująca ikonę modyfikowanego elementu
const addProductBtn = document.querySelector('#addProductBtn');
const categoryFilter = document.querySelector('#categoryFilter');
const nameFilter = document.querySelector("#nameFilter");
const exactNameFilter = document.querySelector("#exactNameFilter");

// elementy potrzebne do dopisywania modyfikowanych wartosci
const name = document.querySelector('#name');
const price = document.querySelector('#price');
const category = document.querySelector('#category');
const desc = document.querySelector('#description');
const icon = document.querySelector('#icons');
const iconRadio = icon.querySelectorAll('input');

modifyField.addEventListener("click", (e) => {
    if(!modifyWindow.contains(e.target)){
        modifyField.style.display = 'none';
        modifyID = 0;
    } 
})

modifyDone.addEventListener('click', (e) => {
    e.preventDefault
    modifyObject(modifyID);
})

categoryFilter.addEventListener('keyup', (e) => {
    const products = document.querySelectorAll('.productsList>div');
    products.forEach(el => {
        (el.querySelectorAll('.info p')[1].innerText.slice(10).indexOf(categoryFilter.value) !== -1) ? el.style.display = "block" : el.style.display = "none";
        console.log(categoryFilter.value);
    });
})

nameFilter.addEventListener('keyup', (e) => {
    const products = document.querySelectorAll('.productsList>div');
    products.forEach(el => {
        (el.querySelectorAll('.info p')[0].innerText.slice(6).indexOf(nameFilter.value) !== -1) ? el.style.display = "block" : el.style.display = "none";
        console.log(nameFilter.value);
    });
})

exactNameFilter.addEventListener('keyup', (e) => {
    const products = document.querySelectorAll('.productsList>div');
    products.forEach(el => {
        if(exactNameFilter.value){
            (el.querySelectorAll('.info p')[0].innerText.slice(6) === exactNameFilter.value) ? el.style.display = "block" : el.style.display = "none";
        } else {
            el.style.display = "block"
        }
    });
})

function insertProducts(products) {

    productList.innerHTML = '';

    products.forEach(el => {
        const wrapper = document.createElement('div');
        const icon = document.createElement('img');
        icon.src = "./../images/" + el.icon;
        const info = document.createElement('div');
        info.classList.add('info');
        const name = document.createElement('p');
        name.innerText = "Name: " + el.name;
        const category = document.createElement('p');
        category.innerText = "Category: " + el.category;
        const price = document.createElement('p');
        price.innerText = "Price: " + el.price + "$";
        const description = document.createElement('p');
        description.innerText = "Description: " + el.description;
        const buttonsPanel = document.createElement('div');
        buttonsPanel.id = el.id;
        buttonsPanel.innerHTML = `<input type="button" name="modify" value="Modify"><input type="button" name="delete" value="Delete"><input type="button" name="comment" value="Add a comment">`
        buttonsPanel.classList.add('buttonsPanel');
        
        wrapper.appendChild(icon);
        info.appendChild(name);
        info.appendChild(category);
        info.appendChild(price);
        info.appendChild(description);
        
        if(el.comment){
            const comment  = document.createElement('p');
            comment.classList.add('comment');
            comment.innerText = "Comment: " + el.comment;
            info.appendChild(comment);
        }

        wrapper.appendChild(info);
        wrapper.appendChild(buttonsPanel);
        productList.appendChild(wrapper)
    });

    const deleteBtns = document.querySelectorAll('input[name="delete"]');
    deleteBtns.forEach((el, i) => {
        el.addEventListener('click', e => {
            e.preventDefault;
            deleteProduct(e.target.parentElement.id);
        })
    })
    const commentBtns = document.querySelectorAll('input[name="comment"]');
    commentBtns.forEach((el, i) => {
        el.addEventListener('click', e => {
            e.preventDefault;
            const userComment = window.prompt("Write you comment...");
            addComment(userComment, e.target.parentElement.id);
        })
    })
    const modifyBtns = document.querySelectorAll('input[name="modify"]');
    modifyBtns.forEach((el, i) => {
        el.addEventListener('click', e => {
            e.preventDefault;
            modifyField.style.display = 'block';

            // wpisanie aktualnych wartosci do modyfikowalnych inputów
            modifyID = e.target.parentElement.id;
            modifyValues = e.target.parentElement.previousSibling.children;
            modifyImg = e.target.parentElement.previousSibling.previousSibling.src;
            name.value = modifyValues[0].innerText.slice(6);
            category.value = modifyValues[1].innerText.slice(10);
            price.value = modifyValues[2].innerText.slice(7, -1);
            desc.value = modifyValues[3].innerText.slice(13);
            
            iconRadio.forEach(el => {
                (modifyImg.indexOf(el.value) !== -1) && (el.checked = true)
            });
        })
    })
}

const loadProducts = () => {
    $.ajax({
        url: myURL,
    }).done(function (resp) {
        insertProducts(resp);
    }).fail(function (err) {
        console.log('failed to load database');
    });
}

const deleteProduct = (el) => {
    $.ajax({
        url: myURL + "/" + el,
        dataType: 'json',
        method: 'DELETE'
    }).done(function (resp) {
        loadProducts();
    }).fail(function (err) {
        console.log('failed to load database');
    });
}

const addComment = (comm, el) => {

    var currentObj = {};

    // pobranie bieżącego obiektu i dodanie komentarza
    $.ajax({
        url: myURL + "/" + el,
    }).done(function (resp) {
        currentObj = resp;
        currentObj.comment = comm;

        // podmiana obiektu
        $.ajax({
            url: myURL + "/" + el,
            contentType: "application/json",
            dataType: "json",
            method: 'PUT',
            data: JSON.stringify(currentObj)
        }).done(function (resp) {
            loadProducts();
        }).fail(function (err) {
            console.log('failed to load database');
        });

    }).fail(function (err) {
        console.log('failed to load database');
    });
}

const modifyObject = (id) => {

    // tworzenie nowego obiektu
    var newProduct = {
        name: name.value,
        category: category.value,
        price: price.value,
        description: desc.value,
        icon: icon.querySelector('input:checked').value
    }

    // podmiana obiektu
    $.ajax({
        url: myURL + "/" + id,
        contentType: "application/json",
        dataType: "json",
        method: 'PUT',
        data: JSON.stringify(newProduct)
    }).done(function (resp) {
        modifyField.style.display = 'none';
        loadProducts();
    }).fail(function (err) {
        console.log('failed to load database');
    });
}

loadProducts();