var client;
const autoReconnectDelay = 5000;

async function setUpSocket() {
    client = new WebSocket("ws://localhost:8080", "echo-protocol");
    client.onopen = () => {
        fetchMaps();

        client.connected = true;
        console.log("Connection Established");
    }

    client.onclose = (e) => {
        console.log("echo-protocol Client closed");
        console.log(e.reason);

        setTimeout(() => {
            setUpSocket();
        }, autoReconnectDelay);
    }

    client.onmessage = async (message) => {
        try {
            var jsonData = JSON.parse(message.data);
            var header = jsonData.header;
        } catch (e) {
            console.log("Message data was not sent in JSON format");
            console.error(e);
            return;
        } finally {

        }

        switch (header) {
            case 'Error':
                let content = jsonData.content;
                console.error(content);
                break;
            case 'Response':
                let response = jsonData.data;

                setUpPreviews(response);
                break;
        }
    }
}

async function fetchMaps() {
    let message = {header: "Fetch", target: "all"};
    let messageJSON = JSON.stringify(message);

    client.send(messageJSON);
}

setUpSocket();