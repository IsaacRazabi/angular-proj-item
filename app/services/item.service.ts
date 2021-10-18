import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, from } from 'rxjs';
import { Item } from '../models/item';
import { LoadingItems } from '../store/actions/item.actions';
import { ItemState } from '../store/reducers/item.reducer';

import { storageService } from './async-storage.service';

const ENTITY = 'item';
@Injectable({
  providedIn: 'root',
})
export class ItemService {
  constructor(private store: Store<ItemState>, private http: HttpClient) {
    // If empty - load test data to storage
    const items = JSON.parse(localStorage.getItem(ENTITY) || 'null');
    if (!items || items.length === 0) {
      console.log('Empty');
      localStorage.setItem(ENTITY, JSON.stringify(this.createItems()));
    }
  }
  query(filterBy = ''): Observable<Item[]> {
    this.store.dispatch(new LoadingItems());
    // casting : the promise entity [] to item as define on module. form can change promise to Observable
    //only if we first cast it as promise of item

    return from(storageService.query(ENTITY) as Promise<Item[]>);
  }
  realQuery(): Observable<Item[]> {
    let realItem = this.http.get(
      'http://www.filltext.com/?rows=10&id={index}&name={username}&pretty=true'
    );
    realItem.subscribe(res=>{
      if(res===undefined) localStorage.setItem('item','')
      else{localStorage.setItem('item',JSON.stringify(res))}
      //a bad way to keep data to edit data fro server. edit should check if to 
      //edit from store array !
    })
    return realItem as Observable<Item[]>;
  }

  getById(itemId: string , id:string): Observable<Item> {
    id = itemId;
    return from(storageService.get(ENTITY, id) as Promise<Item>);
  }
  remove(itemId: string, id:string): Observable<boolean> {
    id = itemId;
    return from(storageService.remove(ENTITY, id));
  }

  save(item: Item): Observable<Item> {
    const method = item.id ? 'put' : 'post';
    const prmSavedItem = storageService[method](ENTITY, item);

    return from(prmSavedItem) as Observable<Item>;
  }

  private createItems(): Item[] {
    return ['Vue', 'Angular', 'React', 'Redux', 'NGRX', 'Vuex'].map((name) => ({
      id: storageService.makeId(),
      name,
    }));
  }
  get emptyItem(): Item {
    return {
      id: '',
      name: '',
    };
  }
}
