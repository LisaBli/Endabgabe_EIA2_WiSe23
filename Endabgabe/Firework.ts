namespace Endabgabe {

    export class Firework {
        
        position: Vector;
        size: number;
        endSize: number;
        color: string;

        constructor(_position: Vector, _endSize: number, _color: string) {
            this.position = _position;
            this.size = size;
            this.endSize = _endSize;
            this.color = _color;
        }
        //Zeichnet das Feuerwerk
        draw(): void {
            //wenn die aktuelle Größe des Feuerwerks kleiner ist als die festgelegte End Größe -> zeichne erneut
            if (this.size < this.endSize) {
                crc2.save();
                crc2.beginPath();
                crc2.globalAlpha = 0.1;
                crc2.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2);
                crc2.fillStyle = this.color;
                crc2.fill();
                crc2.closePath();
                crc2.restore();
            }
        }
        //Aktualisiert die zu zeichnende Größe 
        update(): void {
            size = this.size + 10;
        }
    }
}