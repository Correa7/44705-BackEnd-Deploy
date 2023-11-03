// Index del cliente!!!!
console.log('Hola soy el cliente')
 
const socket= io()
// le indicamos el evento que queremos que escuche, esto viene del socket.emit del back
socket.on('wellcome', (data)=> {
    console.log(data) // data seria el msj que pasamos como segudo argumento en el socket.emit del back
})
// socket para escuchar messages-all
socket.on('messages-all', (data)=>{
    render(data) 

})
// creamos una funcion para renderizar los msjs
function render(data) {
    const html = data.map(element=>{
        return (`
        <div>
            <h5><strong>${element.user}: ${element.message}</strong></h5>
        </div>
        `)
    }).join(' ') // Se le agrega el join para que quite las comas del mapeo
    document.getElementById('caja').innerHTML = html 
}

//en esta funcin vamos a crear un objeto con lo que envie el formulario, el username y el message
function addMessage(){
    const mensaje={
        user:document.getElementById('username').value,
        message:document.getElementById('message').value 
    }
    chatForm()
    // console.log(mensaje)// para corroborar
    socket.emit('new-message', mensaje) // creamos el evento new-message, y pasamos el msj, y vamos a configurar el evento en el socket del servidor
    return false // esto es para eliminar el comportamiento del submit de refrescar la pagina al dar click
}

function chatForm(){
    user=document.getElementById('username').value,
    document.getElementById('message').value = '' 
}