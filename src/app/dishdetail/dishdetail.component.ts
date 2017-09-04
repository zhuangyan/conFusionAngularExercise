import { Component, OnInit, Input,Inject } from '@angular/core';

import { Dish } from '../shared/dish';

import { DishService } from '../services/dish.service';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Comment } from '../shared/comment';

import 'rxjs/add/operator/switchMap';
import { visibility,expand } from '../animations/app.animation';



@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [
    visibility(),
    expand()
  ]
})
export class DishdetailComponent implements OnInit {

  dish: Dish;
  dishcopy = null; 
  dishIds: number[];
  prev: number;
  next: number;

  commentForm: FormGroup;
  newComment: Comment;
  errMess: string;
  visibility = 'shown';
  
  

  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private cm: FormBuilder,
    @Inject('BaseURL') private BaseURL) 
    {
      this.createForm();
     }

  ngOnInit() {
      this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds,
        errmess => this.errMess = <any>errmess);
        this.route.params
        .switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishservice.getDish(+params['id']); })
        .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
            errmess => { this.dish = null; this.errMess = <any>errmess; });
  }

   setPrevNext(dishId: number) {
    let index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1)%this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1)%this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  formErrors = {
    'author': '',
    'comment': ''
  };

  validationMessages = {
    'author': {
      'required':      'Name is required.',
      'minlength':     'Name must be at least 2 characters long.',
      'maxlength':     'Name cannot be more than 25 characters long.'
    },
    'comment': {
      'required':      'Comment is required.',
      'minlength':     'Comment must be a word.',
      'maxlength':     'Comment cannot be more than 250 characters long.'
    }
  };

  createForm(): void {
    this.commentForm = this.cm.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      comment: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(250)] ],
      rating: [5,[]]
    });
    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now

  }

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }
  onSubmit() {
    this.newComment = this.commentForm.value;
// Upon submission of the comment, it gets included in the regular comments and shown on the screen
    var d = new Date();
    this.newComment.date = d.toISOString();
    this.dish.comments.push(this.newComment);
//end of insertion logic
    console.log(this.newComment);
    this.dishcopy.comments.push(this.newComment);
    this.dishcopy.save()
      .subscribe(dish => { this.dish = dish; console.log(this.dish); });
    this.commentForm.reset({
      author: '',
      comment: '',
      rating : "5"
    });
  }
}
