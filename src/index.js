import "../style/style.scss";

const myURL = "http://localhost:3000/products";
const addProductBtn = document.querySelector('#addProductBtn');
const name = document.querySelector('#name');
const price = document.querySelector('#price');
const category = document.querySelector('#category');
const desc = document.querySelector('#description');
const icon = document.querySelector('#icons');
const popup = document.querySelector('#popup');

function addProduct(product){
    $.ajax({
        url: myURL,
        dataType: 'json',
        method: 'POST',
        data: product
    }).done(function(resp) {
        
    }).fail(function(err) {
        console.log('error');
    })
}

addProductBtn.addEventListener('click', e => {

    e.preventDefault();

    if(!name.value) {
        alert("Insert Name!");
        return 0;
    }
    if(!category.value) {
        alert("Insert Category!");
        return 0;
    }
    if(!price.value) {
        alert("Insert Price!");
        return 0;
    }
    if(!desc.value) {
        alert("Insert Description!");
        return 0;
    }
    if(!icon.querySelector('input:checked')) {
        alert("Choose Icon!");
        return 0;
    }

    var newProduct = {
        name: name.value,
        category: category.value,
        price: price.value,
        description: desc.value,
        icon: icon.querySelector('input:checked').value
    }

    icon.querySelector('input:checked').checked = false;
    name.value = '';
    category.value = '';
    price.value = '';
    desc.value = '';

    popup.classList.remove('popup--hide');
    setTimeout(()=>{popup.classList.add('popup--hide')}, 2000);

    addProduct(newProduct);
});
