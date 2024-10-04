import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngxs/store";
import {BreedHttpActions, FilterInputActions, ImgHttpActions} from "./store/app.actions";
import {AppState} from "./store/app.state";
import {Observable, Subject, takeUntil} from "rxjs";
import {BreedModel} from "./models/breed.model";
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ImgModel} from "./models/img.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject();

  public title = 'cat-search';
  public activetab = 0;
  public filtersForm!: FormGroup;

  public loading$!: Observable<boolean>;
  public error$!: Observable<boolean>;
  public images$!: Observable<ImgModel[]>;
  public imgNumber!: number;
  public breeds!: BreedModel[];

  constructor(private readonly store: Store, private formBuilder: FormBuilder) {
  }

  public ngOnInit(): void {
    this.error$ = this.store.select(AppState.selectError);
    this.loading$ = this.store.select(AppState.selectLoading);
    this.images$ = this.store.select(AppState.selectImages);

    this.store.select(AppState.selectImageNumber).pipe(
      takeUntil(this.destroy$),
    ).subscribe(num => this.imgNumber = num);


    this.store.select(AppState.selectBreeds).pipe(
      takeUntil(this.destroy$),
    ).subscribe(breeds => this.breeds = breeds);

    this.store.dispatch(new ImgHttpActions.LoadImages());
    this.store.dispatch(new BreedHttpActions.LoadBreeds());

    this.filtersForm = this.formBuilder.group({
      imageNumber: new FormControl(this.imgNumber),
      selectAll: new FormControl(false),
      breeds: new FormArray(this.breeds.map(breed => new FormControl(false)))
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next(1);
    this.destroy$.complete();
  }

  public selectAll(checked: boolean): void {
    if (checked) {
      this.breedsControls.controls.forEach(breed => breed.setValue(true));
    }
    else if (!checked) {
      this.breedsControls.controls.forEach(breed => breed.setValue(false));
    }
  }

  public applyFilters(): void {
    console.log(this.filtersForm.controls);
    this.store.dispatch(new FilterInputActions.ApplyFilters({
      imageNumber: this.filtersForm.get('imageNumber')?.value,
      selectedBreeds: this.filterBreeds(),
    }));
    this.activetab = 0;
  }

  public get breedsControls() {
    return this.filtersForm.get('breeds') as FormArray
  }

  public get indeterminate() {
    return this.breedsControls.controls.some(breed => breed.value)
      && !this.breedsControls.controls.every(breed => breed.value);
  }

  private filterBreeds(): BreedModel[] {
    let result: BreedModel[] = [];
    for (let i = 0; i < this.breeds.length; i++) {
      this.breedsControls.controls[i].value ? result.push(this.breeds[i]) : null;
    }

    return result;
  }
}
