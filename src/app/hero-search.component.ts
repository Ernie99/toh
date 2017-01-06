
import {Http} from "@angular/http";
import {Observable, Subject} from "rxjs";
import {Hero} from "./hero";
import {Component, OnInit} from "@angular/core";
import {HeroSearchService} from "./hero-search.service";
import {Router} from "@angular/router";

// Observable class extensions
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

@Component(
  {
    selector: 'app-hero-search',
    styles: [`
.search-result{
  border-bottom: 1px solid gray;
  border-left: 1px solid gray;
  border-right: 1px solid gray;
  width:195px;
  height: 20px;
  padding: 5px;
  background-color: white;
  cursor: pointer;
}
#search-box{
  width: 200px;
  height: 20px;
}


`],
    template: `
<div id="search-component">
  <h4>Hero Search</h4>
  <input #searchBox id="search-box" (keyup)="search(searchBox.value)" />
  <div>
    <div *ngFor="let hero of heroes | async" (click)="gotoDetail(hero)" class="search-result">
      {{hero.name}}
    </div>
  </div>
</div>

`,
    providers: [HeroSearchService]
  },
)

export class HeroSearchComponent implements OnInit {
  heroes: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor( private heroSearchService: HeroSearchService, private router: Router) {}

  //push a search term into the observable stream.
  search(term: string): void{
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.heroes = this.searchTerms
      .debounceTime(300)        // wait for 300ms pause in events
      .distinctUntilChanged()   // ignore if next search term is same as previous
      .switchMap(term => term   // switch to new observable each time
        // return the http search observable
        ? this.heroSearchService.search(term)
        // or the observable of empty heroes if no search term
        : Observable.of<Hero[]>([]))
      .catch(error => {
        // TODO: real error handling
        console.log(error);
        return Observable.of<Hero[]>([]);
      });
  }





}
