import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/delay';
import { Http, Response } from '@angular/http';


import { Dish } from '../shared/dish';
import { DISHES } from '../shared/dishes';

import { baseURL } from '../shared/baseurl';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import 'rxjs/add/operator/catch';
import { RestangularModule, Restangular } from 'ngx-restangular';



@Injectable()
export class DishService {


    constructor(private restangular: Restangular,
      private processHTTPMsg: ProcessHTTPMsgService) { }


      getDishes(): Observable<Dish[]> {
        return this.restangular.all('dishes').getList();
      }
    
      getDish(id: number): Observable<Dish> {
        return  this.restangular.one('dishes',id).get();
      }
    
      getFeaturedDish(): Observable<Dish> {
        return this.restangular.all('dishes').getList({featured: true})
          .map(dishes => dishes[0]);
      }

    getDishIds(): Observable<number[]> {
      return this.getDishes()
        .map(dishes => { return dishes.map(dish => dish.id) });
    }
    
}