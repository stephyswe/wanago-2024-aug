import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import Post from './post.interface';
import PostEntity from './post.entity';
import UpdatePostDto from './dto/updatePost.dto';
import CreatePostDto from './dto/createPost.dto';

@Injectable()
export default class PostsService {
  private lastPostId = 0;
  private posts: Post[] = [];

  constructor(
    @InjectRepository(PostEntity)
    private postsRepository: Repository<PostEntity>,
  ) {
  }

  getAllPosts() {
    return this.postsRepository.find();
  }

  async getPostById(id: number) {
    return this.postsRepository.findOneByOrFail({ id });
  }

    async createPost(post: CreatePostDto) {
      const newPost = await this.postsRepository.create(post);
      await this.postsRepository.save(newPost);
      return newPost;
    }

  async updatePost(id: number, post: UpdatePostDto) {
    const foundPost = await this.postsRepository.findOneBy({ id });
    if (!foundPost) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    await this.postsRepository.update(id, post);
    return this.postsRepository.findOneByOrFail({ id });
  }
  
  async deletePost(id: number) {
    const deleteResponse = await this.postsRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
  }
}