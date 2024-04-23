var client;
const autoReconnectDelay = 5000;

async function setUpSocket() {
    client = new WebSocket("wss://asc-trash-trackers-map-db.onrender.com/ws/", "echo-protocol");
    client.onopen = () => {
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

    client.onmessage = (message) => {
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
                break;
        }
    }
}

function updateMarkers() {
    let markerData = markerDataToJSON();

    let id = localStorage.getItem("currentId");
    if (id == undefined) id = 1;
    console.log(id);
    console.log(markerData);

    let message = {header: "Update", target: id, data: markerData};
    let messageJSON = JSON.stringify(message);

    console.log(messageJSON);
    console.log(JSON.parse(messageJSON));

    client.send(messageJSON);
    console.log("sent");
}

setUpSocket();