import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ImgModel} from "../models/img.model";
import {BreedModel} from "../models/breed.model";


const API_BASE: string = 'https://api.thecatapi.com/v1';
const API_KEY: string = 'live_al1tRQ2Kn57Up4Y4lzoTDHXGJ9Y0swzRGwb1rR6G5TZRU4mSieABEYUadQorRdpK';

@Injectable({
  providedIn: 'root',
})
export class CatApiService {

  constructor(private http: HttpClient) {
  }

  public getBreeds(): Observable<BreedModel[]> {
    return this.http.get<BreedModel[]>(`${API_BASE}/breeds`);
  }

  public getImages(imgNumber: number, selectedBreeds: BreedModel[]): Observable<ImgModel[]> {
    let breedFilters: string = (selectedBreeds.length > 0) ? '&breed_ids=' : '';

    if (selectedBreeds.length > 0) {
      for (let breed of selectedBreeds) {
        breedFilters += `${breed.id},`;
      }
      breedFilters = breedFilters.slice(0, -1);
    }

    return this.http.get<ImgModel[]>(`${API_BASE}/images/search?limit=${imgNumber}${breedFilters}`, {headers: {'x-api-key': API_KEY}});
  }
}
