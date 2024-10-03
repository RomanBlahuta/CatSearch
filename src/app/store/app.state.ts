import {Action, Selector, State, StateContext} from "@ngxs/store";
import {ImgModel} from "../models/img.model";
import {BreedModel} from "../models/breed.model";
import {Injectable} from "@angular/core";
import {BreedHttpActions, ImgHttpActions} from "./app.actions";
import {Observable, tap} from "rxjs";
import {CatApiService} from "../services/cat-api.service";
import {MatSnackBar} from "@angular/material/snack-bar";

export interface AppStateModel {
  error: boolean;
  loading: boolean;
  images: ImgModel[];
  imgNumber: number;
  selectedBreeds: BreedModel[];
  breeds: BreedModel[];
}

const initialState: AppStateModel = {
  error: false,
  loading: false,
  images: [],
  imgNumber: 10,
  selectedBreeds: [],
  breeds: [],
}

@State<AppStateModel>({
  name: 'appState',
  defaults: initialState,
})
@Injectable()
export class AppState {

  constructor(private apiService: CatApiService, private snackBar: MatSnackBar) {
  }

  // SELECTORS
  @Selector()
  static getImages(state: AppStateModel): ImgModel[] {
    return state.images;
  }

  @Selector()
  static getImageNumber(state: AppStateModel): number {
    return state.imgNumber;
  }

  @Selector()
  static getSelectedBreeds(state: AppStateModel): BreedModel[] {
    return state.selectedBreeds;
  }

  @Selector()
  static getBreeds(state: AppStateModel): BreedModel[] {
    return state.breeds;
  }

  @Selector()
  static getLoading(state: AppStateModel): boolean {
    return state.loading;
  }

  @Selector()
  static getError(state: AppStateModel): boolean {
    return state.error;
  }



  // REDUCERS
  @Action(BreedHttpActions.LoadBreeds)
  loadBreeds(ctx: StateContext<AppStateModel>): Observable<BreedModel[]> {
    ctx.patchState({loading: true});

    return this.apiService.getBreeds().pipe(
      tap({
        next: (response: BreedModel[]) => {
          ctx.dispatch(new BreedHttpActions.LoadBreedsSuccess({response}))
        },
        error: (error: unknown) => {
          ctx.dispatch(new BreedHttpActions.LoadBreedsFailure({error}))
        },
      }),
    );
  }

  @Action(BreedHttpActions.LoadBreedsSuccess)
  loadBreedsSuccess(ctx: StateContext<AppStateModel>, action: BreedHttpActions.LoadBreedsSuccess): void {
    ctx.patchState({breeds: action.payload.response, loading: false});
  }

  @Action(BreedHttpActions.LoadBreedsFailure)
  loadBreedsFailure(ctx: StateContext<AppStateModel>, action: BreedHttpActions.LoadBreedsFailure): void {
    ctx.patchState({loading: false, error: true});
    this.snackBar.open(JSON.stringify(action.payload.error), 'OK');
  }

  @Action(ImgHttpActions.LoadImages)
  loadImages(ctx: StateContext<AppStateModel>): Observable<ImgModel[]> {
    ctx.patchState({loading: true});

    return this.apiService.getImages(ctx.getState().imgNumber, ctx.getState().selectedBreeds).pipe(
      tap({
        next: (response: ImgModel[]) => {
          ctx.dispatch(new ImgHttpActions.LoadImagesSuccess({response}))
        },
        error: (error: unknown) => {
          ctx.dispatch(new ImgHttpActions.LoadImagesFailure({error}))
        },
      }),
    );
  }

  @Action(ImgHttpActions.LoadImagesSuccess)
  loadImagesSuccess(ctx: StateContext<AppStateModel>, action: ImgHttpActions.LoadImagesSuccess): void {
    ctx.patchState({images: action.payload.response, loading: false});
  }

  @Action(ImgHttpActions.LoadImagesFailure)
  loadImagesFailure(ctx: StateContext<AppStateModel>, action: ImgHttpActions.LoadImagesFailure): void {
    ctx.patchState({loading: false, error: true});
    this.snackBar.open(JSON.stringify(action.payload.error), 'OK');
  }
}
