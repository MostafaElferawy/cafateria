import { AuthService } from "./../auth/auth.service";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { Post } from "./product.model";

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();
  private userId: string;
  constructor(
    private http: HttpClient,
    private router: Router,
    private AuthService: AuthService
  ) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.userId = this.AuthService.getUserId();
    console.log(this.userId);
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        "http://localhost:3000/api/posts" + queryParams
      )
      .pipe(
        map((postData) => {
          console.log(postData.posts);
          const postsFiltered = [];
          postData.posts.forEach((post) => {
            console.log(post.creator, this.userId);
            if (post.creator === this.userId) {
              postsFiltered.push(post);
            }
          });
          console.log(postsFiltered);
          return {
            posts: postsFiltered.map((post) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator,
                price: post.price,
              };
            }),
            maxPosts: postData.maxPosts,
          };
        })
      )
      .subscribe((transformedPostData) => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts,
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      price: number;
    }>("http://localhost:3000/api/posts/" + id);
  }

  addPost(title: string, content: string, image: File, price: string) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    postData.append("price", price);
    this.http
      .post<{ message: string; post: Post }>(
        "http://localhost:3000/api/posts",
        postData
      )
      .subscribe((responseData) => {
        this.router.navigate(["/products"]);
      });
  }

  updatePost(
    id: string,
    title: string,
    content: string,
    image: File | string,
    price: string
  ) {
    let postData: Post | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image);
      postData.append("price", price);
    } else {
      postData = {
        id: id,
        title: title,
        imagePath: image,
        content: content,
        price: +price,
      };
    }
    this.http
      .put("http://localhost:3000/api/posts/" + id, postData)
      .subscribe(response => {
        this.router.navigate(["/products"]);

      });
  }

  deletePost(postId: string) {
    return this.http.delete("http://localhost:3000/api/posts/" + postId);
  }
}
