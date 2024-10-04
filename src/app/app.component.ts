import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngxs/store";
import {BreedHttpActions, FilterInputActions, ImgHttpActions, TabActions} from "./store/app.actions";
import {AppState} from "./store/app.state";
import {Observable, Subject, takeUntil} from "rxjs";
import {BreedModel} from "./models/breed.model";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ImgModel} from "./models/img.model";
import {FilterFormFieldsEnum, isValidNumberValidator} from "./shared/utils";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject();
  public activeTab$!: Observable<number>;
  public filtersForm!: FormGroup;
  public loading$!: Observable<boolean>;
  public error$!: Observable<boolean>;
  public images$!: Observable<ImgModel[]>;
  public imgNumber!: number;
  public breeds!: BreedModel[];
  public FilterFormFieldsEnum = FilterFormFieldsEnum;

  constructor(private readonly store: Store, private formBuilder: FormBuilder) {
  }

  public ngOnInit(): void {
    this.error$ = this.store.select(AppState.selectError);
    this.loading$ = this.store.select(AppState.selectLoading);
    this.images$ = this.store.select(AppState.selectImages);
    this.activeTab$ = this.store.select(AppState.selectActiveTab);

    this.store.select(AppState.selectImageNumber).pipe(
      takeUntil(this.destroy$),
    ).subscribe(num => this.imgNumber = num);

    this.store.select(AppState.selectBreeds).pipe(
      takeUntil(this.destroy$),
    ).subscribe(breeds => this.breeds = breeds);

    this.store.dispatch(new ImgHttpActions.LoadImages());
    this.store.dispatch(new BreedHttpActions.LoadBreeds());

    this.filtersForm = this.formBuilder.group({
      [FilterFormFieldsEnum.IMAGE_NUMBER]: new FormControl(this.imgNumber, [Validators.required, isValidNumberValidator()]),
      [FilterFormFieldsEnum.SELECT_ALL]: new FormControl(false),
      [FilterFormFieldsEnum.BREEDS]: new FormArray(this.breeds.map(breed => new FormControl(false)))
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

  public selectBreed(checked: boolean): void {
    (this.breedsControls.controls.every(breed => breed.value)) ?
      this.filtersForm.controls[FilterFormFieldsEnum.SELECT_ALL].setValue(true)
      :
      this.filtersForm.controls[FilterFormFieldsEnum.SELECT_ALL].setValue(false);
  }

  public applyFilters(): void {
    this.store.dispatch(new FilterInputActions.ApplyFilters({
      imageNumber: this.filtersForm.get(FilterFormFieldsEnum.IMAGE_NUMBER)?.value,
      selectedBreeds: this.filterBreeds(),
    }));
    this.store.dispatch(new TabActions.NavigateTab({index: 0}))
  }

  public get breedsControls() {
    return this.filtersForm.get(FilterFormFieldsEnum.BREEDS) as FormArray
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

  public onTabChange(index: number): void {
    this.store.dispatch(new TabActions.NavigateTab({ index }));
  }
}
