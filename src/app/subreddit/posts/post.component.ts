import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

export class Subreddit {
  constructor(private subreddit: string) {}
}

export class Post {
  constructor(private title: string, private id: string, private subreddit: Subreddit) { }
}
@Component({
  selector: 'posts-post',
  templateUrl: './post.component.html'
})
export class PostComponent implements OnInit {

  @Input() post: Post;
  
  private selectedId: number;
  

  isSelected(post: Post) {

  }

  onSelect(post: Post) {

  }
  ngOnInit() { 
    console.log('post');
    console.log(this.post);
  }
}
