import { Observable, PartialObserver, ConnectableObservable, Subscription } from 'rxjs';
import { publish } from 'rxjs/operators';

class BingoNumberProducer {
  private callbacks = [];

  public addCallback(callback) {
    this.callbacks.push(callback);
  }

  public generateNextNumber() {
    const nextBingoNr: number = Math.ceil(Math.random() * 1000) % 75 + 1;
    console.log(`[Generator] ${nextBingoNr}`)
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

let playerASubscriptions: Subscription[] = [];
let playerBSubscriptions: Subscription[] = [];

document.getElementById('subscribePlayerABtn').addEventListener('click', () =>  playerASubscriptions.push(bingoObservable$.subscribe(playerAObserver)));

document.getElementById('unsubscribePlayerABtn').addEventListener('click', () => (playerASubscriptions.pop() || { unsubscribe: () => ({}) }).unsubscribe());

document.getElementById('subscribePlayerBBtn').addEventListener('click', () =>  playerBSubscriptions.push(bingoObservable$.subscribe(playerBObserver)));

document.getElementById('unsubscribePlayerBBtn').addEventListener('click', () => (playerBSubscriptions.pop() || { unsubscribe: () => ({}) }).unsubscribe());