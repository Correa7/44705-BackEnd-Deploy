console.log('Hola soy el cliente')
 
const socket = io()

socket.on('wellcome', (data)=>{
    console.log(data)
})
socket.on('newData', (data)=>{
    render(data)
})

function render(data) {
    const html = data.map(prod=>{
        return (`

        <div class="card" >
        <img src="${prod.thumbnail}" class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">${prod.title}</h5>
         
            <p class="card-text">Price: $<strong>${prod.price}</strong> || Stock: ${prod.stock}</p>
            <br>
            <p>ID:</p>
            <p>${prod._id}</p>
        </div>
        <div class="card-body">
        <button id="${prod.id}" class="btn btn-primary">Add to Cart</button>
        </div>
    </div>
        `)
    }).join(' ') 
    document.getElementById('z-cards').innerHTML = html

    setTimeout(() => {
        location.reload();
      }, "1000");
}
 
function addProduct(){
    const newProduct={
            title: document.getElementById('title').value,
            description:document.getElementById('description').value,
            price: document.getElementById('price').value,
            thumbnail: document.getElementById('thumbnail').value,
            code:document.getElementById('code').value,
            stock:document.getElementById('stock').value,
            category:document.getElementById('category').value,
            owner:document.getElementById('owner').value,
            status:true,
                
    }
    cleanForm()
    socket.emit('addProduct', newProduct)   
return false
}
function delProduct(){
    let pId= {
        id:document.getElementById('id').value
    }
    document.getElementById('id').value = ''

    socket.emit('delProduct', pId)
    return false
}

function cleanForm(){
    document.getElementById('title').value = ''
    document.getElementById('description').value = ''
    document.getElementById('price').value = ''
    document.getElementById('thumbnail').value = ''
    document.getElementById('code').value = ''
    document.getElementById('stock').value = ''
    document.getElementById('category').value = ''
}