import { Observable, PartialObserver, ConnectableObservable } from 'rxjs';
import { publish } from 'rxjs/operators';

class BingoNumberProducer {
  private callbacks = [];

  public addCallback(callback) {
    this.callbacks.push(callback);
  }

  public generateNextNumber() {
    const nextBingoNr: number = Math.ceil(Math.random() * 1000) % 75 + 1;
    this.callbacks.forEach(callback => callback(nextBingoNr));
  }
}

const producer: BingoNumberProducer = new BingoNumberProducer();

document.getElementById('nextNumberBtn').addEventListener('click', () => producer.generateNextNumber());

const bingoObservable$ = new Observable<number>(subscriber => {
  producer.addCallback(value => subscriber.next(value));
});

const playerAObserver: PartialObserver<number> = {
  next(bingoNr: number) { console.log(`[Player A] ${bingoNr}`) },
  complete() { /* noop */ }
};

const playerBObserver: PartialObserver<number> = {
  next(bingoNr: number) { console.log(`[Player B] ${bingoNr}`) },
  complete() { /* noop */ }
};

bingoObservable$.subscribe(playerAObserver);
bingoObservable$.subscribe(playerBObserver);