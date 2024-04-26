var client;
const autoReconnectDelay = 5000;

var currentId = localStorage.getItem("currentId");

async function setUpSocket() {
    client = new WebSocket("wss://asc-trash-trackers-map-db.onrender.com/ws/", "echo-protocol");
    client.onopen = () => {
        saveIconEnable();

        client.connected = true;
        console.log("Connection Established");
    }

    client.onclose = (e) => {
        saveIconDisable();

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
                if (currentId == undefined) {
                    await localStorage.setItem("currentId", response.insertedId);
                }
                console.log(response);

                break;
        }
    }
}

async function updateMarkers() {
    let markerData = markerDataToJSON();

    let data = {};
    data.markerData = markerData;

    let currentDate = new Date();
    data.lastModified = `${currentDate.getMonth()}/${currentDate.getDate()}/${currentDate.getFullYear()}`;

    let message = {header: "Update", target: currentId, data: data};
    let messageJSON = JSON.stringify(message);

    client.send(messageJSON);
}

setUpSocket();