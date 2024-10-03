import {Component, OnInit} from '@angular/core';
import {Store} from "@ngxs/store";
import {BreedHttpActions, ImgHttpActions} from "./store/app.actions";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'cat-search';
  activetab = 1;

  constructor(private readonly store: Store) {
  }

  public ngOnInit(): void {
    this.store.dispatch(new ImgHttpActions.LoadImages());
    this.store.dispatch(new BreedHttpActions.LoadBreeds());
  }
}
