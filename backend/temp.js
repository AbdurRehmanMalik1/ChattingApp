const sender_id = "677e47f547c47ba7a39b9a30"; 
const chat_id = "677ea89d167f4bcf2a423e4b";
const socket = io('http://localhost:8080', {
auth: {
    token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzdlNDdlYjQ3YzQ3YmE3YTM5YjlhMmUiLCJuYW1lIjoiQWJkdXIgUmVobWFuIiwiZW1haWwiOiJhYmR1cnJlaG1hbjQ0MTVAZ21haWwuY29tIiwiaWF0IjoxNzM2NTM5OTU2LCJleHAiOjE3MzY1NDcxNTZ9.M-YoGQyhlzdB5bgb9EAzwKKrJ2UCP8T4FCQai5TdtmY'
}
});
socket.on('connect' , function() {
    console.log('Connected');
    socket.emit('sendAdditionalInfo', { sender_id,chat_id});
    socket.emit('identity', 0, response =>
        console.log('Identity:', response),
    );
});
socket.on('unauthorized' ,(data)=>{
    console.log(data);
})  
socket.on('events', function(data) {
   console.log('event', data);
});
socket.on('exception', function(data) {
    console.log('exception: ', data);
});
socket.on('disconnect', function() {
    console.log('Disconnected');
});
socket.on('newMessage', (data)=>{
    document.getElementById('message-area').innerHTML += `<div class="other-message">
    SentBy:${data.sender_id} ${data.message.content}
    </div>`;
});
const sendOffer = (offer) => {
    socket.emit('offer', { offer, sender_id, chat_id });
}

socket.on('offer', (data) => {
    console.log('Received offer:', data.offer);
    const answer = createAnswer(data.offer);
    socket.emit('answer', { answer, sender_id, chat_id });
});
const sendIceCandidate = (candidate) => {
    socket.emit('ice', { candidate, sender_id, chat_id });
}
socket.on('ice', (data) => {
    console.log('Received ICE candidate:', data.candidate);
    addIceCandidateToPeerConnection(data.candidate);
});


const sendMessageButton = document.getElementById("send-message-button");

sendMessageButton.addEventListener('click',()=>sendMessage())

function sendMessage(){
    const messageBox = document.getElementById("message-box");
    const receiverBox = document.getElementById("receiver-id-box");
    const content = messageBox.value;
    //const receiver_id = receiverBox.value;

    // 677e47eb47c47ba7a39b9a2e
    const receiver_id = "677e47eb47c47ba7a39b9a2e"; // Azwa
    const messagePayLoad = {
        message: {
            sender_id,
            content,
            receiver_id
        },
        chat_id,
    }
    socket.emit('send-message', messagePayLoad,(data)=>{
        console.log("Getting echo back");
        console.log(data);
        
        document.getElementById('message-area').innerHTML += `<div class="my-message">${content}</div>`;
    });
}


const videoElement = document.getElementById('localVideo');
// document.getElementById('open-video-button').addEventListener('click',()=>{
//     openVideo();
// })
// document.getElementById('close-video-button').addEventListener('click',()=>{
//     closeVideo();
// })
function closeVideo(){
    const stream = videoElement.srcObject;
    stream.getTracks().forEach(track => track.stop());
    
}
function openVideo(){
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        // Handle the media stream
        videoElement.srcObject = stream;
    })
    .catch(error => {
        if (error.name === 'NotAllowedError') {
        alert("Permissions are required to access your camera and microphone.");
        } else if (error.name === 'NotFoundError') {
        alert("No media devices found.");
        } else {
        console.error("Error accessing media devices:", error);
        }
    });
}


const localVideo = document.getElementById("localVideo");
const closeLocalVideo = document.getElementById("close-video-button");
const remoteVideo = document.getElementById("remoteVideo");
const startCameraBtn = document.getElementById("open-video-button");
const callBtn = document.getElementById("call");
const hangUpBtn = document.getElementById("hangUp");


let localStream;
let peerConnection;

const configuration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
};

closeLocalVideo.addEventListener('click',()=>{
    const stream = localVideo.srcObject;
    stream.getTracks().forEach(track => track.stop());
    callBtn.disabled=true
});
startCameraBtn.addEventListener("click", async () => {
    try {
      // Access the user's camera and microphone
      localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      
      // Play the local stream in the video element
      localVideo.srcObject = localStream;
      
      // Enable the "Start Call" button
      callBtn.disabled = false;
    } catch (error) {
      console.error("Error accessing media devices:", error);
      alert("Could not access camera or microphone.");
    }
});

callBtn.addEventListener("click", async () => {
    // Create a new RTCPeerConnection
    peerConnection = new RTCPeerConnection(configuration);
  
    // Add local stream tracks to the peer connection
    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });
  
    // Handle remote stream when it is received
    peerConnection.ontrack = (event) => {
      remoteVideo.srcObject = event.streams[0];
    };
  
    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("New ICE candidate:", event.candidate);
        // Send the ICE candidate to the remote peer (via signaling server)
      }
    };
  
    // Create an offer to initiate the connection
    const offer = await peerConnection.createOffer();
    console.log("Offer created:", offer);

    await peerConnection.setLocalDescription(offer);
  
    // Send the offer to the remote peer (via signaling server)
    
});
  


hangUpBtn.addEventListener("click", () => {
    if (peerConnection) {
      peerConnection.close();
      peerConnection = null;
      console.log("Call ended");
    }
  
    remoteVideo.srcObject = null;
    hangUpBtn.disabled = true;
    callBtn.disabled = false;
});
  

const setAnswerBtn = document.getElementById("setAnswer");
const answerBox = document.getElementById("answerBox");

setAnswerBtn.addEventListener("click", async () => {
    const answer = JSON.parse(answerBox.value);
    await peerConnection.setRemoteDescription(
        new RTCSessionDescription(answer)
    );
    console.log("Answer set:", answer);
});