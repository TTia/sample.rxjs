import { Observable } from 'rxjs/observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { from } from 'rxjs/observable/from';
import { of } from 'rxjs/observable/of';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { pipe } from 'rxjs';
import { map, concatAll, mergeMap, catchError, delay } from 'rxjs/operators';

export class testObservable {
    constructor() {
        console.log(Observable, "is listening");

        let ids = [1,2,3,4];
        let superPraticaRequest = (id:number) => 
            this.superPratica(id)
                .pipe(catchError(e => of({id: -1}))
            );

        from(ids)
            .pipe(
                mergeMap(superPraticaRequest),
                mergeMap((r, i) => this.acquisto(r, i)),
                mergeMap((r, i) => this.annulla(r, i)),
                catchError(e => e)
            )
            .subscribe(r => console.log('Result:', r), console.error);
        
        //this.superPratica(0).subscribe(console.log);
        //this.acquisto(0).subscribe(console.log);
    }

    superPratica(id: number) : Observable<Response> {
        console.log("Pre-superPratica", id);
        if(id === 1){
            return fromPromise(new Promise(() => { throw Error('Error superPratica ' + id) }))
        }
        return fromPromise(fetch('/assets/superpratica.json').then(r => r.json())).pipe(delay(100*id));
    }

    acquisto(r: any, index: number) : Observable<Response> {
        console.log("Pre-acquisto", r, index);
        if(r.id !== -1)
            return fromPromise(fetch('/assets/acquisto.json').then(r => r.json()));
        return of(r);
    }

    annulla(r: any, index: number) : Observable<Response> {
        console.log("Pre-annulla", r, index);
        if(r.id !== -1)
            return fromPromise(fetch('/assets/annulla.json').then(r => r.json()));
        return of(r);
    }
}