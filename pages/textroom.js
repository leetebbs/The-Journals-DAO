import styles from '../styles/all.module.scss'


import {
  HuddleClientProvider,
  getHuddleClient,
} from "@huddle01/huddle01-client";

import { useHuddleStore } from "@huddle01/huddle01-client/store";
import PeerVideoAudioElem from "../components/PeerVideoAudioElem";
import MeVideoElem from "../components/MeVideoElem";

const Textroom = () => {
  const huddleClient = getHuddleClient("dedb4a37e56b492effabc00442e470df4af70a7a08b0d8a23448a936e4942438");
  const peersKeys = useHuddleStore((state) => Object.keys(state.peers));
  const lobbyPeers = useHuddleStore((state) => state.lobbyPeers);
  const roomState = useHuddleStore((state) => state.roomState);
  const recordingState = useHuddleStore((state) => state.recordingState);
  const recordings = useHuddleStore((state) => state.recordings);
  console.log(roomState)

  const handleJoin = async () => {
    try {
      await huddleClient.join("test", {
        address: "",
        wallet: "",
        ens: "tebbo.eth",
      });

      console.log("joined");
    } catch (error) {
      console.log({ error });
    }
  };

  async function connect(){
    huddleClient.enableWebcam();
    handleJoin();
  }

  return (
    <HuddleClientProvider value={huddleClient}>
    <div >
      <div>
        <h2 className={`text-${!roomState.joined ? "red" : "green"}`}>
          Room Joined:&nbsp;{roomState.joined.toString()}
        </h2>

        {/* <h2>Instructions</h2>
        <ol className="w-fit mx-auto text-left">
          <li>
            Click on <b>Enable Stream</b>
          </li>
          <li>
            Then Click on <b>Join room</b>, <i>"Room Joined"</i> should be
            changed to true
          </li>
          <li>
            Open the app in a <b>new tab</b> and repeat <b>steps 1 & 2</b>
          </li>
          <li>Return to 1st tab, now you'll see peers in the peer list,</li>
          <li>
            Click on <b>allowAllLobbyPeersToJoinRoom</b> to accept peers into
            the room.
          </li>
        </ol> */}
      </div>

      <div>
        <div className="card">
          {/* <button onClick={handleJoin}>Join Room</button> */}
          {/* <MeVideoElem /> */}
          <button onClick={() => connect()}>
            Join Conference
          </button>
          <button onClick={() => huddleClient.disableWebcam()}>
            Disable Webcam
          </button>
          <button onClick={() => huddleClient.enableWebcam()}>
            Enable Webcam
          </button>
          <button onClick={() => huddleClient.allowAllLobbyPeersToJoinRoom()}>
            allowAllLobbyPeersToJoinRoom()
          </button>
          {/* <button
            onClick={() =>
              // will not work in localhost
              huddleClient.startRecording({
                sourceUrl: window.location.href,
              })
            }
          >
            startRecording()
          </button>
          <button onClick={() => huddleClient.stopRecording({ ipfs: true })}>
            stopRecording()
          </button> */}
        </div>

        <MeVideoElem/>

        {lobbyPeers[0] && <h2>Lobby Peers</h2>}
        <div>
          {lobbyPeers.map((peer) => (
            <div>{peer.peerId}</div>
          ))}
        </div>

        {peersKeys[0] && <h2>Peers</h2>}

        <div className="peers-grid">
          {peersKeys.map((key) => (
            <PeerVideoAudioElem key={`peerId-${key}`} peerIdAtIndex={key} />
          ))}
        </div>
        {/* <div className="text-blue">
          <h2>Recording State</h2>
          <h3>inProgress: {recordingState.inProgress.toString()}</h3>
          <h3>processing: {recordingState.processing.toString()}</h3>
          <h3>started: {recordingState.started.toString()}</h3>
          <h3>recordings: {JSON.stringify(recordings)}</h3>
        </div> */}
      </div>
    </div>
  </HuddleClientProvider>
  )
}

export default Textroom