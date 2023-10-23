// Con este socket vamos a establecer la comunicacion con nuestro servidor
const socket = io();

// Swal.fire({
//     title: 'Saludos',
//     text:'Mensaje inicial',
//     icon:'success'
// })

let user;
const chatBox = document.getElementById('chatBox')
const messagesLogs = document.getElementById('messageLogs')

// Vamos a desarrollar el modal de autenticacion
// alerta de sweet alert y emito(con socket.emit) el nombre de usuario que recibi en el inpuValidator
Swal.fire({
    title: 'Identificate',
    input: 'text',
    text: 'Ingresa el usuario para identificarte en el chat',
    inputValidator: (value) => {
        return !value && 'Necesitas escribir un nombre de usuario para comenzar a chatear'
    },
    allowOutsideClick: false,
    allowEscapeKey: false,
}).then(result => {
    user = result.value;
    socket.emit('authenticated', user);
});

chatBox.addEventListener('keyup', e => {
    if (e.key === 'Enter') {
        if (chatBox.value.trim().length > 0) {
            console.log('Funciona');
            // enviamos todos los mensajes almacenados hasta el momento solo al cliente que se acaba de conectar(entro tarde al grupo y veo los mensajes antiguos)
            socket.emit('message', { user, message: chatBox.value });
            chatBox.value = ''
        }
    }
})

socket.on('messageLogs', data => {
    let messages = '';
    data.forEach(element => {
        messages += `${element.user} dice: ${element.message} <br>`
    });
    messagesLogs.innerHTML = messages;
})

socket.on('newUserConnected', data => {
    Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmationButton: false,
        timer: 3000,
        title: `${data} se ha unido al chat`,
        icon: 'succes'
    })
})