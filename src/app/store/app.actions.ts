import {BreedModel} from "../models/breed.model";
import {ImgModel} from "../models/img.model";

// BREEDS HTTP
export namespace BreedHttpActions {
  export class LoadBreeds {
    static readonly type: string = '[App] Load Breeds';

    constructor() {}
  }

  export class LoadBreedsSuccess {
    static readonly type: string = '[App] Load Breeds Success';

    constructor(public payload: { response: BreedModel[]}) {}
  }

  export class LoadBreedsFailure {
    static readonly type: string = '[App] Load Breeds Failure';

    constructor(public payload: { error: unknown }) {}
  }
}


// IMG HTTP
export namespace ImgHttpActions {
  export class LoadImages {
    static readonly type: string = '[App] Load Images';

    constructor() {}
  }

  export class LoadImagesSuccess {
    static readonly type: string = '[App] Load Images Success';

    constructor(public payload: { response: ImgModel[] }) {}
  }

  export class LoadImagesFailure {
    static readonly type: string = '[App] Load Images Failure';

    constructor(public payload: { error: unknown }) {}
  }
}


// FILTER INPUT
export namespace FilterInputActions {
  export class ApplyFilters {
    static readonly type: string = '[App] Apply Filters';

    constructor(public payload: { imageNumber: number, selectedBreeds: BreedModel[] }) {}
  }
}
