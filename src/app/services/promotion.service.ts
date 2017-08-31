import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/delay';
import { Promotion } from '../shared/promotion';
import { PROMOTIONS } from '../shared/promotions';

@Injectable()
export class PromotionService {

  constructor() { }

  getPromotions(): Observable<Promotion[]> {
    return Observable.of(PROMOTIONS).delay(2000);      
  }

  getPromotion(id: number): Observable<Promotion> {   
    return Observable.of(PROMOTIONS.filter((promo) => (promo.id === id))[0]).delay(2000);          
  }

  getFeaturedPromotion(): Observable<Promotion> {
    return Observable.of(PROMOTIONS.filter((promo) => (promo.featured))[0]).delay(2000);              
  }
}