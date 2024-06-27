class PeerService{
    constructor() {
        this.peer = null;  // Initialize to null

        if (!this.peer) {
            this.peer = new RTCPeerConnection({
                iceServers: [
                    {
                        // if you get error to add a TURN server then try other two stun server and comment existing one
                        // TRUN server error may cause because of inavailability of your existing stun server

                        urls: [
                            // "stun:stun.l.google.com:19302",
                            // "stun:global.stun.twilio.com:3478",
                            "stun:stun.l.google.com:19302",
                            "stun:stun1.l.google.com:19302",
                            // "stun:stun2.l.google.com:19302",
                            // "stun:stun3.l.google.com:19302",
                            // "stun:stun4.l.google.com:19302",
                            // "stun:stun.ekiga.net",
                            // "stun:stun.ideasip.com",
                            // "stun:stun.rixtelecom.se",
                            // "stun:stun.schlund.de",
                            // "stun:stun.stunprotocol.org:3478",
                            // "stun:stun.voiparound.com",
                            // "stun:stun.voipbuster.com",
                            // "stun:stun.voipstunt.com",
                            // "stun:stun.voxgratia.org"
                        ],
                    },
                ],
            });
        }
    }

    async getOffer(){
        if(this.peer){
            const offer = await this.peer.createOffer()
            await this.peer.setLocalDescription(new RTCSessionDescription(offer))
            return offer;
        }
    }

    async getAnswer(offer) {
        if (this.peer) {
            try {
                // Set the remote description first
                // await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
                await this.peer.setRemoteDescription(offer);

                // Create the answer
                const ans = await this.peer.createAnswer();

                // Set the local description using the created answer
                await this.peer.setLocalDescription(new RTCSessionDescription(ans));

                // Return the answer
                return ans;
            } catch (error) {
                console.error('Error in getAnswer:', error);
                throw error; // You may choose to handle the error in a different way
            }
        }
    }
    

    async setLocalDescription(ans){
        if(this.peer){
            await this.peer.setRemoteDescription(new RTCSessionDescription(ans))
        }
    }
}

export default new PeerService();