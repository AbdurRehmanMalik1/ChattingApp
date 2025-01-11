let peerConnection;
let localStream;

// STUN server configuration
const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
};

const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
const startCameraBtn = document.getElementById("startCamera");
const callButton = document.getElementById("call");

const sender_id = "677e47eb47c47ba7a39b9a2e";
const chat_id = "677ea89d167f4bcf2a423e4b";

const socket = io('http://localhost:8080', {
    auth: {
        token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzdlNDdlYjQ3YzQ3YmE3YTM5YjlhMmUiLCJuYW1lIjoiQWJkdXIgUmVobWFuIiwiZW1haWwiOiJhYmR1cnJlaG1hbjQ0MTVAZ21haWwuY29tIiwiaWF0IjoxNzM2NjEwNjE3LCJleHAiOjE3MzY2MTc4MTd9.kbw4eNH12G8epfMBMOkzOxb8nDEd6Wbn3GGqtjmtclY'
    }
});

socket.on('connect', function () {
    console.log('Connected');
    socket.emit('sendAdditionalInfo', { sender_id, chat_id });
    socket.emit('identity', 0, response => console.log('Identity:', response));
});

const handleICECandidate = (event) => {
    if (event.candidate) {
      console.log("Generated ICE candidate:", event.candidate);
      socket.emit('sendIceCandidate', {
        iceCandidate: event.candidate,
        chat_id: chat_id, // Include the chat room ID
        sender_id: sender_id // Include the sender ID
      });
    }
};


socket.on('offer', async (data) => {
    console.log("Received offer SDP:", data.offerSdp);
  
    // Enable the accept call button
    document.getElementById("accept-call").disabled = false;
  
    peerConnection = new RTCPeerConnection(configuration);
  
    // Add media tracks if needed (optional, for example audio/video tracks)
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
    localVideo.srcObject = localStream;
  
    peerConnection.ontrack = (event) => {
        console.log("Received remote stream:", event.streams[0]);
        remoteVideo.srcObject = event.streams[0];  // Set the remote stream to the remoteVideo element
    };

    // Set the received offer as the remote description
    try {
        await peerConnection.setRemoteDescription(new RTCSessionDescription({
            type: 'offer',
            sdp: data.offerSdp // The offer received from the sender
        }));

        // Create an answer and set it as the local description
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        // Send the answer back to the caller
        socket.emit('answerOffer', {
            answerSdp: answer.sdp,  // The actual SDP answer string
            chat_id: data.chat_id,  // The chat room ID
            sender_id: data.receiver_id // The receiver's ID (the user receiving the offer)
        });

        console.log('Sent answer:', answer);
    } catch (error) {
        console.error('Error handling offer:', error);
    }
    peerConnection.onicecandidate = handleICECandidate;
});

socket.on('answerOffer', async (data) => {
    console.log("Received answer SDP:", data.answerSdp);
    try {
        if (peerConnection) {
            // Set the received answer SDP as the remote description
            await peerConnection.setRemoteDescription(new RTCSessionDescription({
                type: 'answer',
                sdp: data.answerSdp
            }));

            console.log("Successfully set remote description with answer");
        }
    } catch (error) {
        console.error('Error handling answer:', error);
    }
});

socket.on('receiveIceCandidate', (data) => {
    console.log("Received ICE candidate:", data.iceCandidate);

    // Set the received ICE candidate as part of the peer connection
    const candidate = new RTCIceCandidate(data.iceCandidate);
    peerConnection.addIceCandidate(candidate).catch(error => {
        console.error("Error adding ICE candidate:", error);
    });
});

const sendMessageButton = document.getElementById("send-message-button");

sendMessageButton.addEventListener('click', () => sendMessage());

function sendMessage() {
    const messageBox = document.getElementById("message-box");
    const content = messageBox.value;
    const receiver_id = "677e47f547c47ba7a39b9a30"; // Azwa

    const messagePayLoad = {
        message: {
            sender_id,
            content,
            receiver_id
        },
        chat_id,
    };
    socket.emit('send-message', messagePayLoad, (data) => {
        console.log("Getting echo back");
        document.getElementById('message-area').innerHTML += `<div class="my-message">${content}</div>`;
    });
}

// Start the camera
startCameraBtn.addEventListener("click", async () => {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = localStream;
    callButton.disabled = false;
});

callButton.addEventListener('click', async () => {
    try {
        // Create the WebRTC offer
        peerConnection = new RTCPeerConnection(configuration);
        
        // Add media tracks (for example, audio or video)
        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

        peerConnection.ontrack = (event) => {
            console.log("Received remote stream:", event.streams[0]);
            remoteVideo.srcObject = event.streams[0];  // Set the remote stream to the remoteVideo element
        };

        // Create an offer and set local description
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        // Send the offer through WebSocket to the server
        socket.emit('offer', {
            offerSdp: offer.sdp,  // The actual SDP offer string
            chat_id: chat_id,  // The chat room ID
            sender_id: sender_id // The sender's ID
        });
        console.log('Offer sent:', offer);
    } catch (error) {
        console.error('Error creating offer:', error);
    }
});


// const sender_id = "677e47eb47c47ba7a39b9a2e";
// const chat_id = "677ea89d167f4bcf2a423e4b";

// const socket = io('http://localhost:8080', {
//     auth: {
//         token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzdlNDdlYjQ3YzQ3YmE3YTM5YjlhMmUiLCJuYW1lIjoiQWJkdXIgUmVobWFuIiwiZW1haWwiOiJhYmR1cnJlaG1hbjQ0MTVAZ21haWwuY29tIiwiaWF0IjoxNzM2NjEwNjE3LCJleHAiOjE3MzY2MTc4MTd9.kbw4eNH12G8epfMBMOkzOxb8nDEd6Wbn3GGqtjmtclY'
//     }
// });
// socket.on('connect' , function() {
//     console.log('Connected');
//     socket.emit('sendAdditionalInfo', { sender_id,chat_id});
//     socket.emit('identity', 0, response =>
//         console.log('Identity:', response),
//     );
// });
// socket.on('unauthorized' ,(data)=>{
//     console.log(data);
// })  
// socket.on('events', function(data) {
//     console.log('event', data);
// });
// socket.on('exception', function(data) {
//     console.log('exception: ', data);
// });
// socket.on('disconnect', function() {
//     console.log('Disconnected');
// });
// socket.on('newMessage', (data)=>{
//     document.getElementById('message-area').innerHTML += `<div class="other-message">
//     SentBy:${data.sender_id} ${data.message.content}
//     </div>`;
// });


// //PEER CONNECTION
// let peerConnection;


// socket.on('offer', async (data) => {
//     console.log("Received offer SDP:", data.offerSdp);
  
//     // Enable the accept call button
//     document.getElementById("accept-call").disabled = false;
  
//     peerConnection = new RTCPeerConnection();
    
//     // Add media tracks if needed (optional, for example audio/video tracks)
//     const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//     stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
  
//     // Set the received offer as the remote description
//     try {
//         await peerConnection.setRemoteDescription(new RTCSessionDescription({
//             type: 'offer',
//             sdp: data.offerSdp // The offer received from the sender
//         }));
  
//         // Create an answer and set it as the local description
//         const answer = await peerConnection.createAnswer();
//         await peerConnection.setLocalDescription(answer);
  
//         // Send the answer back to the caller
//         socket.emit('answerOffer', {
//             answerSdp: answer.sdp,  // The actual SDP answer string
//             chat_id: data.chat_id,  // The chat room ID
//             sender_id: data.receiver_id // The receiver's ID (the user receiving the offer)
//         });
  
//         console.log('Sent answer:', answer);
//     } catch (error) {
//         console.error('Error handling offer:', error);
//     }
// });
// socket.on('answerOffer', async (data) => {
//     console.log("Received answer SDP:", data.answerSdp);
//     try {
//         await peerConnection.setRemoteDescription(new RTCSessionDescription({
//             type: 'answer',
//             sdp: data.answerSdp
//         }));

//         console.log("Successfully set remote description with answer");
//     } catch (error) {
//         console.error('Error handling answer:', error);
//     }
// });
// socket.on('receiveIceCandidate', (data) => {
//     console.log("Received ICE candidate:", data.iceCandidate);

//     // Set the received ICE candidate as part of the peer connection
//     const candidate = new RTCIceCandidate(data.iceCandidate);
//     peerConnection.addIceCandidate(candidate).catch(error => {
//         console.error("Error adding ICE candidate:", error);
//     });
// });



// const sendMessageButton = document.getElementById("send-message-button");

// sendMessageButton.addEventListener('click',()=>sendMessage())
// function sendMessage(){
//     const messageBox = document.getElementById("message-box");
//     const content = messageBox.value;
//     //const receiver_id = receiverBox.value;

//     // 677e47eb47c47ba7a39b9a2e
//     const receiver_id = "677e47f547c47ba7a39b9a30"; // Azwa
//     const messagePayLoad = {
//         message: {
//             sender_id,
//             content,
//             receiver_id
//         },
//         chat_id,
//     }
//     socket.emit('send-message', messagePayLoad,(data)=>{
//         console.log("Getting echo back");
//         document.getElementById('message-area').innerHTML += `<div class="my-message">${content}</div>`;
//     });
// }


// const localVideo = document.getElementById("localVideo");
// const remoteVideo = document.getElementById("remoteVideo");
// const startCameraBtn = document.getElementById("startCamera");
// const callButton = document.getElementById("call");

// let localStream;

// // STUN server configuration
// const configuration = {
//   iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
// };

// // Start the camera
// startCameraBtn.addEventListener("click", async () => {
//   localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//   localVideo.srcObject = localStream;
//   callButton.disabled = false;
// });

// callButton.addEventListener('click', async () => {
//     try {
//         // Create the WebRTC offer
//         peerConnection = new RTCPeerConnection();
        
//         // Add media tracks (for example, audio or video)
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//         stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

//         // Create an offer and set local description
//         const offer = await peerConnection.createOffer();
//         await peerConnection.setLocalDescription(offer);
        
//         // Send the offer through WebSocket to the server
//         socket.emit('offer', {
//             offerSdp: offer.sdp,  // The actual SDP offer string
//             chat_id: chat_id,  // The chat room ID
//             sender_id: sender_id // The sender's ID
//         });
//         console.log('Offer sent:', offer);
//     } catch (error) {
//         console.error('Error creating offer:', error);
//     }
// });

