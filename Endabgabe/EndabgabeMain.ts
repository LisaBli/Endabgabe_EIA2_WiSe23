/*
Aufgabe: Endabgabe
Name: Lisa Blindenhöfer
Matrikel Nr.: 271450
Datum: 12.02.2023
Quellen: In Zusammenarbeit mit Bastian Aberle und Amin Lakhal
*/

namespace Endabgabe {

    //Onload Listener für HandleLoad
    window.addEventListener("load", handleLoad);

    //Globale Variablen
    export let size: number = 0;
    export let crc2: CanvasRenderingContext2D;
    export let canvas: HTMLCanvasElement;

    //Interface für die Server Kommunikation: Zuordnungsnamen für die Server- Client Kommunikation
    interface Item {
        Name: string;
        Density: string;
        Picker: string;
        Speed: string;
    }

    //Interface für die FormDataJSON 
    interface FormDataJSON {
        [key: string]: FormDataEntryValue | FormDataEntryValue[];
    }

    //Interface zum Empfangen der Server Inhalte
    interface Entrys {
        [category: string]: Item[];
    }

    //Deklarationen/ Event-Listener von verschiedenen Buttons, Canvas + Server Variablen
    export async function handleLoad(): Promise<void> {
        let canvas: HTMLCanvasElement | null = document.querySelector("canvas");
        if (!canvas)
            return;
        crc2 = <CanvasRenderingContext2D>canvas.getContext("2d");

        let button: HTMLButtonElement = <HTMLButtonElement>document.querySelector("button[id=but1]");
        button.addEventListener("click", sendData);
        document.querySelector("canvas").addEventListener("click", getInput);

        //holt Daten vom Server und gibt sie an den Funktionsaufruf loadData weiter
        let response: Response = await fetch("https://webuser.hs-furtwangen.de/~blindenh/Database/index.php/?command=find&collection=data");
        let entry: string = await response.text();
        let data: Entrys = JSON.parse(entry);
        loadData(data);
        drawBackground();
    }

    //Funktion speichert die Dinge aus den Input-Feldern (timecode, color und die Endgröße des Feuerwerks) 
    //in Variablen ab und gibt sie in einem Interval an generateRocket weiter
    function getInput(_event: MouseEvent): void {
        let formData: FormData = new FormData(document.forms[0]);
        let timecode: number = Number(formData.get("Speed").toString());
        let color: string = formData.get("Picker").toString();
        let endSize: number = Number(formData.get("Size"));
        let x: number = _event.x - 58;
        let y: number = _event.y - 75;
        let interval: number = setInterval(function (): void { generateRocket(x, y, endSize, color, interval); }, timecode);
    }

    //Funktion erzeugt Objekte der Vector und Firework Klasse und führt deren Methoden aus
    function generateRocket(_x: number, _y: number, _endSize: number, _color: string, _interval: number): void {
        //wenn die gezeichnete Größe < als die festgelegte End Größe 
        if (size < _endSize) {
            let vector: Vector = new Vector(_x, _y);
            let firework: Firework = new Firework(vector, _endSize, _color);
            firework.update();
            firework.draw();
            //wenn die gezeichnete Größe >= der festgelegten Endgröße ist
        } else {
            //ende Interval & gezeichnete Größen Variable wird auf 0 zurückgesetzt
            clearInterval(_interval);
            size = 0;
            drawBackground();
        }
    }

    //Zeichnet den Hintergrund des Canvas in einem Gradienten
    export function drawBackground(): void {
        let golden: number = 0.62;
        let gradient: CanvasGradient = crc2.createLinearGradient(0, 0, 0, crc2.canvas.height);
        gradient.addColorStop(0, "#00000d");
        gradient.addColorStop(golden, "#00001a");
        gradient.addColorStop(1, "#000026");
        crc2.fillStyle = gradient;

        crc2.fillRect(0, 0, crc2.canvas.width, crc2.canvas.height);
    }

    // sendet die Daten aller Form Elemente an den Server
    async function sendData(): Promise<void> {

        //Soll Seite neu laden da es sonst zu Problemen mit der Server Kommunikation kommen kann, wenn direkt ein neuer Eintrag
        //gespeichert wird
        window.open("./Endabgabe.html", "_self");
        let formData: FormData = new FormData(document.forms[0]);
        let json: FormDataJSON = {};
        //Umwandlung FormData in Json FormData
        for (let key of formData.keys())
            if (!json[key]) {
                let values: FormDataEntryValue[] = formData.getAll(key);
                json[key] = values.length > 1 ? values : values[0];
            }
        let query: URLSearchParams = new URLSearchParams();
        let newJSON: string = JSON.stringify(json);
        query.set("command", "insert");
        query.set("collection", "data");
        query.set("data", newJSON);
        await fetch("https://webuser.hs-furtwangen.de/~blindenh/Database/index.php?" + query.toString());
    }

    // lädt Daten aus dem Server und speichert sie in Variablen ab , Funktionsaufruf loadEntry mit Übergabeparametern der Daten
    function loadData(_data: Entrys): void {
        //Der Liste werden die Daten vom Server hinzugefügt
        let list: string[] = [];
        for (let num in _data.data) {
            list.push(num);
        }
        //jeweils für jeden Eintrag der Liste werden Variablen deklariert und werden an loadEntry weitergegeben
        for (let index of list) {
            let name: string = _data.data[index].Name;
            let size: number = _data.data[index].Size;
            let picker: string = _data.data[index].Picker;
            let speed: string = _data.data[index].Speed;
            loadEntry(name, size, picker, speed, index);
        }
    }

    // Lädt die gespeicherten Einträge unten auf der Seite in dem neue Div Elemente erzeugt werden
    function loadEntry(_name: string, _density: number, _picker: string, _speed: string, _index: string): void {
        let newDiv: HTMLDivElement = document.createElement("div");
        let parent: Element = document.querySelector("#savedRockets");
        newDiv.innerHTML = _name;
        newDiv.id = "entry";

        //Event Listener für jedes geklickte Element werden erzeugt und rufen editItem und deleteItem auf, newDiv wird auch als 
        //Parameter mitgegeben, damit die jeweilige Funktion das richtige Div Element löscht oder editiert
        newDiv.addEventListener("click", function (): void {
            editItem(newDiv, _name, _density, _picker, _speed);
            deleteItem(newDiv, _index);
        });
        parent.appendChild(newDiv);
    }

    // Fügt die Values von den gespeicherten Einträgen vom Server in die Input Felder 
    function editItem(newDiv: HTMLDivElement, _name: string, _density: number, _picker: string, _speed: string): void {
        let name: HTMLInputElement = document.querySelector("input#name");
        name.value = _name;
        let density: HTMLInputElement = document.querySelector("#slider1");
        density.value = _density.toString();
        let picker: HTMLInputElement = document.querySelector("#input2");
        picker.value = _picker;
        let speed: HTMLInputElement = document.querySelector("#slider2");
        speed.value = _speed;
    }

    //Löscht den Eintrag aus dem Server raus und löscht die zugehörige Div vom Screen
    async function deleteItem(_newDiv: HTMLDivElement, _index: string): Promise<void> {
        _newDiv.parentElement.removeChild(_newDiv);
        let query: URLSearchParams = new URLSearchParams();
        query.set("command", "delete");
        query.set("collection", "data");
        query.set("id", _index.toString());
        await fetch("https://webuser.hs-furtwangen.de/~blindenh/Database/index.php?" + query.toString());
        console.log("deletet");
    }
}