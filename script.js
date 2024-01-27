const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startCallButton = document.getElementById('startCallButton');
const endCallButton = document.getElementById('endCallButton');

let localStream;
let peerConnection;

async function startCall() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;

        peerConnection = new RTCPeerConnection();
        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

        peerConnection.ontrack = event => {
            remoteVideo.srcObject = event.streams[0];
        };

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        // Send offer to the other participant (signaling)

        endCallButton.disabled = false;
    } catch (error) {
        console.error('Error starting call:', error);
    }
}

function endCall() {
    peerConnection.close();
    localStream.getTracks().forEach(track => track.stop());
    localVideo.srcObject = null;
    remoteVideo.srcObject = null;
    endCallButton.disabled = true;
}

startCallButton.addEventListener('click', startCall);
endCallButton.addEventListener('click', endCall);

