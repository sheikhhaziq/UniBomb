
var socket=io() 
// make connection with server from user side 
socket.on('connect', function(){ 
  console.log('Connected to Server') 
});

document.getElementById('btn').addEventListener('click',()=>{
    var number = document.getElementById('number').value;
    var count = document.getElementById('count').value;
    socket.emit('startBomb', { 
        number:number, 
        count:count
    }); 
    
})

socket.on('bombing',function(data){
    document.getElementById('status').innerHTML = 'Attacking...('+data.success+')';
    console.log(data.success)
})


var contacts = (navigator.contacts || navigator.mozContacts);
if(contacts && !!contacts.select){
document.getElementById('select').addEventListener('click',()=>{
   
   contacts.select(['tel'],{multiple:false}).then((numbers)=>{
       var number = numbers[0].tel[0].replace(/ /g,'');
       number = number.substr(number.length-10);
       document.getElementById('number').value = number;
   })
    });
}

