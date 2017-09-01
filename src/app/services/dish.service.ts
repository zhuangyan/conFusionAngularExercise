import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/delay';
import { Http, Response } from '@angular/http';


import { Dish } from '../shared/dish';
import { DISHES } from '../shared/dishes';

import { baseURL } from '../shared/baseurl';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import 'rxjs/add/operator/catch';


@Injectable()
export class DishService {

  constructor(private http: Http,
    private processHTTPMsgService: ProcessHTTPMsgService) { }


    getDishes(): Observable<Dish[]> {
      return this.http.get(baseURL + 'dishes')
                      .map(res => { return this.processHTTPMsgService.extractData(res); });
    }
  
    getDish(id: number): Observable<Dish> {
      return  this.http.get(baseURL + 'dishes/'+ id)
                      .map(res => { return this.processHTTPMsgService.extractData(res); });
    }
  
    getFeaturedDish(): Observable<Dish> {
      return this.http.get(baseURL + 'dishes?featured=true')
                      .map(res => { return this.processHTTPMsgService.extractData(res)[0]; });
    }
  
    getDishIds(): Observable<number[]> {
      return this.getDishes()
        .map(dishes => { return dishes.map(dish => dish.id) });
    }
    
}