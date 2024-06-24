import Game from "./components/Game";
import WebsocketComponent from "./components/Websocket";

function App() {
    return (
        <>
            <WebsocketComponent />
            <Game />
        </>
    );
}

export default App;
