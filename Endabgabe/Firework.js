var Endabgabe;
(function (Endabgabe) {
    class Firework {
        position;
        size;
        endSize;
        color;
        constructor(_position, _endSize, _color) {
            this.position = _position;
            this.size = Endabgabe.size;
            this.endSize = _endSize;
            this.color = _color;
        }
        //Zeichnet das Feuerwerk
        draw() {
            //wenn die aktuelle Größe des Feuerwerks kleiner ist als die festgelegte End Größe -> zeichne erneut
            if (this.size < this.endSize) {
                Endabgabe.crc2.save();
                Endabgabe.crc2.beginPath();
                Endabgabe.crc2.globalAlpha = 0.1;
                Endabgabe.crc2.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2);
                Endabgabe.crc2.fillStyle = this.color;
                Endabgabe.crc2.fill();
                Endabgabe.crc2.closePath();
                Endabgabe.crc2.restore();
            }
        }
        //Aktualisiert die zu zeichnende Größe 
        update() {
            Endabgabe.size = this.size + 10;
        }
    }
    Endabgabe.Firework = Firework;
})(Endabgabe || (Endabgabe = {}));
//# sourceMappingURL=Firework.js.map